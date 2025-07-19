const express = require("express");
const router = express.Router();
const Blog = require("../models/blog");
const Comment = require("../models/comment");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = path.resolve('./public/uploads/');
    
    // Ensure the directory exists
    fs.mkdirSync(uploadPath, { recursive: true });

    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const fileName = `${Date.now()}-${file.originalname}`;
    cb(null, fileName);
  },
});

const upload = multer({ storage: storage }); // <-- Missing in your code

router.get("/:id", async (req, res) => {
  const blogId = req.params.id;
  try {
    const blog = await Blog.findById(blogId).populate("createdBy");
    // console.log(blog);
    const comments = await Comment.find({ postedOn: blogId }).populate("commentedBy");
    
    if (!blog) {
      return res.status(404).send("Blog not found");
    }
    res.render("blogDetail", {
      
      blog,
      user: req.user,
      comments,
    });
  } catch (error) {
    console.error("Error fetching blog:", error);
    res.status(500).send("Internal Server Error");
  }
});
router.get("/user/add-new", (req, res) => {
    res.render("addBlog", {
        user: req.user,
    })
});
router.post("/add-new",upload.single("coverImage"), async (req, res) => {
    const { title, content } = req.body;
    const coverImage = req.file;
  try {
    const blog = await Blog.create({
      title,
      content,
      coverImageURL: `/uploads/${coverImage.filename}`,
      createdBy: req.user._id,
    });
    return res.redirect("/");
  } catch (error) {
    console.log("❌ Error during Adding Blog", error.message);
    res.status(500).send("Blog Adding failed: " + error.message);
  }

});

router.post("/add-comment", async (req, res) => {
    const { content, blogId } = req.body;

    try {
        const comment = await Comment.create({
            content,
            postedOn: blogId,               // ✅ use the blogId from form
            commentedBy: req.user?._id      // ❓ Make sure `req.user` exists (via auth middleware)
        });

        return res.redirect(`/blog/${blogId}`); // ✅ redirect to the blog detail page
    } catch (error) {
        console.error("❌ Error during Adding Comment", error.message);
        return res.status(500).json({ error: "Internal Server Error" });
    }
});

module.exports = router;