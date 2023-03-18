const mongoose = require("mongoose");

const quizDataSchema = new mongoose.Schema(
  {
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

const QuizData = mongoose.model("QuizData", quizDataSchema);
module.exports.QuizData = QuizData;
