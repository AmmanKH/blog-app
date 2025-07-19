require('dotenv').config();

const express = require('express');
const Path = require('path');
const  mongoose = require('mongoose');
const authRoutes = require("./routes/authRoutes");
const blogRoutes = require("./routes/blogRoutes");
const cookieParser = require('cookie-parser');
const {checkAuthenticationCookie} = require("./middlewares/authentication");

const app = express();
const PORT = process.env.PORT || 8000;

mongoose.connect(process.env.MONGO_URI)
.then(e=>{console.log("DB Connected");
}).catch(e=>{console.log(`Error${e}`);
})

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));  // for form data
app.use(express.json());   

app.use(cookieParser());
app.use(checkAuthenticationCookie('token'));
// app.use(express.static("public"));
app.use(express.static(Path.resolve("./public"))); // Serve static files from the public directory

app.use((req, res, next) => {
  res.locals.user = req.user || null;  // ✅ So `user` is always available in EJS
  res.locals.error = null;
  next();
});




app.set("views", Path.resolve("./views"));
// Use Routes
app.use("/", authRoutes);
app.use("/blog", blogRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
})










