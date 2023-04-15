const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      minlength: 3,
      maxlength: 50,
      required: true,
    },
    phoneNumber: {
      type: Number,
      length: 10,
      unique: true,
    },
    groups: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Group",
        default: [],
      },
    ],
    joinedUsing: {
      type: String,
      default: "App",
    },
  },
  { timestamps: true }
);

userSchema.methods.generateAuthToken = function (userId) {
  const token = jwt.sign(
    {
      _id: userId,
      fullName: this.fullName,
      phoneNumber: this.phoneNumber,
    },
    process.env.JWT_PRIVATE_KEY
  );
  return token;
};

const User = mongoose.model("User", userSchema);

module.exports.userSchema = userSchema;
module.exports.User = User;
