const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("./config.js");

const authMiddleware = (req, res, next) => {
  //verify header
  const authHeader = req.headers['authorization'];
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({
      error: "Unauthorized"
    });
  }

  //check token
  const token = authHeader.split(" ")[1];
  if (!token) {
    res.status(401).json({
      error: "Unauthorized"
    });
  }
//here we verify the token 
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    if (decoded.userId) {
      req.userId = decoded.userId;
      next();
    } else {
      res.status(401).json({
        error: "Unauthorized"
      });
    }
  } catch (error) {
    console.error("JWT verification error:", error);
    return res.status(403).json({ error: "Unauthorized" });
  }
};
module.exports={
  authMiddleware
};
