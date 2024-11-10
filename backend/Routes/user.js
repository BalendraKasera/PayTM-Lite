const express = require("express");
const router = express.Router();
const z = require("zod");
const { User, Account } = require("../db");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config");
import { authMiddleware } from ("../middleware");
import { router } from "./bulk";

//create a signup schema
const signupSchema = z.object({
  username: z.string().email(),
  password: z.string(),
  firstName: z.string(),
  lastName: z.string(),
});

router.post("/signup", async (req, res) => {
  //check signup schema valid
  const { success } = signupSchema.safeParse(req.body);
  if (!success) {
    res.status(411).json({
      message: "Email already taken / Incorrect inputs",
    });
  }

  //check existing user
  const existingUser = await User.findOne({
    username: req.body.username,
  });
  if (existingUser) {
    res.status(411).json({
      message: "Email already taken / Incorrect inputs",
    });
  }
  //create new user
  const newUser = await User.create({
    username: req.body.username,
    password: req.body.password,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
  });

  const userId = newUser._id;

  //create bank-account 
  await Account.create({
    userId,
    balance:1+Math.random()*1000
  })

  const token = jwt.sign(
    {
      userId,
    },
    JWT_SECRET
  );

  res.json({
    message: "User created successfully",
    token: token,
  });
});
//sign-in
const signInSchema = z.object({
  username: z.string().email(),
  password: z.string(),
});

router.post("/signin", async (req, res) => {
  const { success } = signInSchema.safeParse(req.body);
  if (!success) {
    res.status(411).json({
      message: "Email already taken / Incorrect inputs",
    });
  }
  const newUser = await User.findOne({
    username: req.body.username,
    password: req.body.password,
  });

  if (newUser) {
    const token = jwt.sign({ userId: newUser._id }, JWT_SECRET);
    res.json({
      token: token,
    });
    return;
  }

  res.status(411).json({
    message: "Error while logging in",
  });
});
//update user information
const updateSchema = z.object({
  password: z.string.optional(),
  firstName: z.string.optional(),
  lastName: z.string.optional(),
});


//route for update user information
router.put("/", authMiddleware, async (req, res) => {
  const success = updateSchema.safeParse(req.body);
  if (!success) {
    res.status(411).json({
      message: "Error while updating information",
    });
  }
  await User.updateOne(req.body, {
    id: req.userId,
  });
  res.json({
    message: "Updated successfully",
  });
});



router.get("/bulk", async (req, res) => {
  try {
    const filter = req.query.filter || "";

    const users = await User.find({
      $or: [
        { firstName: { $regex: filter, $options: "i" } }, // case-insensitive search
        { lastName: { $regex: filter, $options: "i" } }, // case-insensitive search
      ],
    });

    res.json({
      users: users.map((user) => ({
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        _id: user._id,
      })),
    });
  } catch (error) {
    res.status(500).json({ error: "An error occurred while fetching users" });
  }
});

module.exports = router;
