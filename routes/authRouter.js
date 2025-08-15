import express from "express";
import {
  registerUser,
  loginUser,
  editUsername,
  editPassword,
  deleteAccount,
} from "../controllers/authController.js";
import authenticate from "../middleware/authenticate.js";

const router = express.Router();

router.post("/register", async (req, res) => {
  const { username, password, confirmPassword } = req.body;
  if (!username || !password || !confirmPassword) {
    return res
      .status(400)
      .json({ error: "Username, password, and confirmPassword are required." });
  }
  if (password.length < 6) {
    return res
      .status(400)
      .json({ error: "Password must be at least 6 characters long." });
  }
  if (password !== confirmPassword) {
    return res.status(400).json({ error: "Passwords do not match." });
  }
  await registerUser(req, res);
});

router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res
      .status(400)
      .json({ error: "Username and password are required." });
  }
  await loginUser(req, res);
});

router.get("/currentUser", authenticate, async (req, res) => {
  res.status(200).json({ id: req.user.id, username: req.user.username });
});

router.put("/editUsername", authenticate, async (req, res) => {
  const { newUsername } = req.body;
  if (!newUsername) {
    return res.status(400).json({ error: "New username is required." });
  }
  await editUsername(req, res);
});

router.put("/editPassword", authenticate, async (req, res) => {
  const { currentPassword, newPassword, confirmNewPassword } = req.body;
  if (!currentPassword || !newPassword || !confirmNewPassword) {
    return res.status(400).json({ error: "All fields are required." });
  }
  if (newPassword.length < 6) {
    return res
      .status(400)
      .json({ error: "Password must be at least 6 characters long." });
  }
  if (newPassword !== confirmNewPassword) {
    return res
      .status(400)
      .json({ error: "New password and confirmation do not match." });
  }
  await editPassword(req, res);
});

router.delete("/deleteAccount", authenticate, async (req, res) => {
  const { password } = req.body;
  if (!password) {
    return res.status(400).json({ error: "Password is required." });
  }
  await deleteAccount(req, res);
});

export default router;
