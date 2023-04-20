const mongoose = require("mongoose");

const webAppQuizDataSchema = new mongoose.Schema(
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

const webAppQuizData = mongoose.model("webAppQuizData", webAppQuizDataSchema);
module.exports.webAppQuizData = webAppQuizData;
