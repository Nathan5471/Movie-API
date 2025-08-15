import jwt from "jsonwebtoken";
import User from "../models/user.js";
import dotenv from "dotenv";

const authenticate = async (req, res, next) => {
  dotenv.config();
  const { token } = req.body;
  if (!token) {
    return res.status(401).json({ error: "No token provided." });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }
    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ error: "Invalid token." });
  }
};

export default authenticate;
