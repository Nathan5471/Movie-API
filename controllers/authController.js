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
    return res.status(500).json({ error: "Internal server error." });
  }
};

export const loginUser = async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.find({ username });
    if (!user) {
      return res
        .status(404)
        .json({ error: "Username or password is incorrect" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(404)
        .json({ error: "Username or password is incorrect" });
    }

    const token = generateToken(user._id);
    return res
      .status(200)
      .json({ id: user._id, username: user.username, token });
  } catch (error) {
    return res.status(500).json({ error: "Internal server error." });
  }
};
