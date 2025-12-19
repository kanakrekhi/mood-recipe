const express = require("express");
const router = express.Router();
const Review = require("../models/Review");
const User = require("../models/User");

// Add new review
router.post("/", async (req, res) => {
  try {
    const { username, recipeId, comment, rating } = req.body;//extracts the data sent from the frontend 

    //  find user by username
    const user = await User.findOne({ username });
    if (!user) return res.status(400).json({ message: "User not found" });

    // create review linked to user
    const newReview = new Review({
      user: user._id, //links review to the user by their MongoDB ID
      recipeId,
      comment,
      rating,
    });

    await newReview.save(); //save new review to the database

    //  populate user details when sending back
    const savedReview = await newReview.populate("user", "username email");

    res.status(201).json({ message: "Review added successfully", review: savedReview });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//  Get all reviews
router.get("/", async (req, res) => {
  try {
    const reviews = await Review.find().populate("user", "username email").sort({ createdAt: -1 });
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//  Get reviews by recipeId
router.get("/:recipeId", async (req, res) => {
  try {
    const reviews = await Review.find({ recipeId: req.params.recipeId }) //extracts the recipeId from the URL.
      .populate("user", "username email") //  include user details
      .sort({ createdAt: -1 });
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
