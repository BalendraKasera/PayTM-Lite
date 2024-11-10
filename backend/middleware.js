const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("./config.js");

const authMiddleware = (req, res, next) => {
  //verify header
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer")) {
    res.status(411).json({
      error: "Unauthorized",
    });
  }

  //check token
  const token = authHeader.split(" ")[1];
  if (!token) {
    res.status(411).json({
      error: "Unauthorized",
    });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    if (decoded.userId) {
      req.userId = decoded.userId;
      next();
    } else {
      res.status(411).json({
        error: "Unauthorized",
      });
    }
  } catch (error) {
    return res.status(403).json({ error: "Unauthorized" });
  }
};
module.exports = authMiddleware;
