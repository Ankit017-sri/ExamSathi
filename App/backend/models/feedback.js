const mongoose = require("mongoose");

const feedbackSchema = mongoose.Schema(
  {
    fullName: String,
    phoneNumber: String,
    message: String,
  },
  { timestamps: true }
);

const Feedback = mongoose.model("Feedback", feedbackSchema);
module.exports.Feedback = Feedback;
