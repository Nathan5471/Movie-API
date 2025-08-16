import jwt from "jsonwebtoken";
import User from "../models/user.js";

const nonRequiredAuthenticate = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return next();
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
    return next();
  }
};

export default nonRequiredAuthenticate;
