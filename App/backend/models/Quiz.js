const mongoose = require("mongoose");

const quizSchema = new mongoose.Schema(
  {
    tag: { type: String, required: true },
    category: { type: String, required: true },
    quizDetails: {
      type: Array,
      required: true,
    },
    quizTitle: {
      type: String,
      required: true,
    },
    maxMarks: Number,
  },
  { timestamps: true }
);

const Quiz = mongoose.model("Quiz", quizSchema);
module.exports.Quiz = Quiz;
