const { Schema, model } = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: false,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
   
    password: {
      type: String,
      required: true,
    },
    profileImageURL: {
      type: String,
      default: "/images/default.png",
    },
    role: {
      type: String,
      enum: ["USER", "ADMIN"],
      default: "USER",
    },
  },
  { timestamps: true }
);

userSchema.pre("save", function (next) {
  const user = this;

  // 🛑 Fix: must call next() in the "not modified" case
  if (!user.isModified("password")) return next();

  const salt = bcrypt.genSaltSync(9);
  const hash = bcrypt.hashSync(user.password, salt);

  user.password = hash;
  

  next();
});
const User = model("user", userSchema);
module.exports = User;
