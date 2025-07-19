const express = require("express");
const router = express.Router();
const User = require("../models/user");
const Blog = require("../models/blog");
const bcrypt = require("bcryptjs");
const { createTokenForUser } = require("../services/authentications");

router.get("/", async (req, res) => {
  const allBlogs = await Blog.find({})
  res.render("home", {
    blogs: allBlogs,
    user: req.user,
  });
});
router.get("/signup", (req, res) => {
  res.render("signup");
});
router.get("/signin", (req, res) => {
  res.render("signin");
});
router.get("/logout", (req, res) => {
  res.clearCookie('token').redirect('/signin');
})


router.post("/signin", async (req, res) => {
  const { email, password } = req.body;

  // 1. Validate input
  if (!email || !password) {
    return res.status(400).send("Email and password are required");
  }

  try {
    // 2. Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      throw new Error("User not found");
    }

    // 3. Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {

      return res.redirect("/signin");
    }

    const token = await createTokenForUser(user);
    return res.cookie("token", token).redirect("/");

    // 4. Success
    // res.render('home');
  } catch (err) {
    res.locals.error = "Incorrect id or password";
    return res.render("signin");
  }
});
router.post("/signup", async (req, res) => {
  let { firstName, lastName, email, password } = req.body;
  if (!lastName) lastName = ""; // Default to empty string
  try {
    await User.create({ firstName, lastName, email, password });
    res.redirect("/");
  } catch (error) {
    console.log("❌ Error during signup:", error.message);
    res.status(500).send("Signup failed: " + error.message);
  }
});

module.exports = router;