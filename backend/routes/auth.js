const express = require("express");
const User = require("../models/User");

const router = express.Router();

//  Signup
router.post("/signup", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "User already exists" });

    // store password as plain text (not secure)
    const newUser = new User({ username, email, password });
    await newUser.save();

    res.status(201).json({ message: "Signup successful", user: { username, email, password } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//  Login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found" });

    // compare plain text password
    if (password !== user.password) return res.status(400).json({ message: "Invalid password" });

    res.json({ message: "Login successful", user: { username: user.username, email: user.email, password: user.password } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
