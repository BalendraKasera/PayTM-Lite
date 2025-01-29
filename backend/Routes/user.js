const express = require("express");
const bcrypt=require("bcrypt");
const router = express.Router();
const z = require("zod");
const { User, Account } = require("../db");
const jwt = require("jsonwebtoken");
const { JWT_SECRET }= require("../config");
const { authMiddleware } = require("../middleware");

const signupSchema = z.object({
  username: z.string().email(),
  password: z.string(),
  firstName: z.string(),
  lastName: z.string(),
});

router.post("/signup", async (req, res) => {
  // Check signup schema validity
  const { success } = signupSchema.safeParse(req.body);
  if (!success) {
    return res.status(411).json({
      message: "Try again later",
    });
  }

  // Check if user already exists
  const existingUser = await User.findOne({
    username: req.body.username,
  });
  if (existingUser) {
    return res.status(411).json({
      message: "Email already taken / Incorrect inputs",
    });
  }

  // Create new user
  const user = await User.create({
    username: req.body.username,
    password: req.body.password,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
  });

  const userId = user._id; // Associate ID with user

  // Initialize balance and create new account
  
  await Account.create({
    userId,
    balance: 1+ Math.random()*1000,
  });

  // Generate token
  const token = jwt.sign({ userId }, JWT_SECRET);

  // Respond with success message and token
  res.json({
    message: "User created successfully",

    token: token,
  });
});

//sign-in schema
const signInSchema = z.object({
  username: z.string().email(),
  password: z.string(),
});

router.post("/signin", async (req, res) => {
  //sign-in route
  const { success } = signInSchema.safeParse(req.body);
  if (!success) {
    res.status(411).json({
      message: "Email already taken / Incorrect inputs",
    });
  }
  const user = await User.findOne({
    username: req.body.username,
    password: req.body.password,
  });

  //compare password
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(400).json({ message: "Invalid credentials" });
  }

  if (user) {
    const token = jwt.sign({ userId: user._id }, JWT_SECRET);
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
  password: z.string().optional(),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
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

//get user from backend filterable via fisrtname or lastname;
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
      user: users.map((user) => ({
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
