import bcrypt from "bcrypt";
import User from "../models/user.js";
import generateToken from "../utils/generateToken.js";

export const registerUser = async (req, res) => {
  const { username, password } = req.body;

  try {
    const existingUsername = await User.findOne({ username });
    if (existingUsername) {
      return res.status(400).json({ error: "Username already exists." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, password: hashedPassword });
    await newUser.save();

    return res
      .status(201)
      .json({ id: newUser._id, username: newUser.username });
  } catch (error) {
    console.error("Error registering user:", error);
    return res.status(500).json({ error: "Internal server error." });
  }
};

export const loginUser = async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res
        .status(404)
        .json({ error: "Username or password is incorrect." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(404)
        .json({ error: "Username or password is incorrect." });
    }

    const token = generateToken(user._id);
    return res
      .status(200)
      .json({ id: user._id, username: user.username, token });
  } catch (error) {
    console.error("Error logging in user:", error);
    return res.status(500).json({ error: "Internal server error." });
  }
};

export const editUsername = async (req, res) => {
  const { newUsername } = req.body;
  try {
    const existingUsername = await User.findOne({ username: newUsername });
    if (existingUsername) {
      return res.status(400).json({ error: "Username already exists." });
    }
    req.user.username = newUsername;
    await req.user.save();
    return res
      .status(200)
      .json({ id: req.user.id, username: req.user.username });
  } catch (error) {
    console.error("Error editing username:", error);
    return res.status(500).json({ error: "Internal server error." });
  }
};

export const editPassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  try {
    const isMatch = await bcrypt.compare(currentPassword, req.user.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Current password is incorrect." });
    }
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    req.user.password = hashedPassword;
    await req.user.save();
    return res
      .status(200)
      .json({ id: req.user.id, username: req.user.username });
  } catch (error) {
    console.error("Error editing password:", error);
    return res.status(500).json({ error: "Internal server error." });
  }
};

export const deleteAccount = async (req, res) => {
  const { password } = req.body;
  try {
    const isMatch = await bcrypt.compare(password, req.user.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Password is incorrect." });
    }
    await User.findByIdAndDelete(req.user.id);
    return res.status(200).json({ message: "Account deleted successfully." });
  } catch (error) {
    console.error("Error deleting account:", error);
    return res.status(500).json({ error: "Internal server error." });
  }
};
