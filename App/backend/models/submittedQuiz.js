const mongoose = require("mongoose");

const submittedQuizSchema = new mongoose.Schema(
  {
    submittedQuizDetails: {
      type: Array,
      required: true,
    },
    phoneNumber: {
      type: Number,
      required: true,
    },
    userId: {
      type: String,
      required: true,
    },
    quizId: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const SubmittedQuiz = mongoose.model("SubmittedQuiz", submittedQuizSchema);
module.exports.SubmittedQuiz = SubmittedQuiz;
