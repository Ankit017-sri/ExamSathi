const express = require("express");

const auth = require("../middleware/auth");
const { SubmittedQuiz } = require("../models/submittedQuiz");

const router = express.Router();

router.post("/", auth, async (req, res) => {
  const { submittedQuizDetails, quizId } = req.body;

  const quiz = await SubmittedQuiz.find({
    userId: req.user._id,
    quizId: req.params.quizId,
  });

  if (quiz.length > 0) return res.status(400).send("Quiz already submitted.");

  //console.log(req.body);

  if (!submittedQuizDetails)
    return res.status(400).send("Please select options.");

  const newQuiz = new SubmittedQuiz({
    submittedQuizDetails,
    phoneNumber: req.user.phoneNumber,
    quizId,
    userId: req.user._id,
  });

  await newQuiz.save();

  //console.log(newQuiz);

  return res.send(newQuiz);
});

router.get("/get/:quizId", auth, async (req, res) => {
  const quizzes = await SubmittedQuiz.find({
    userId: req.user._id,
    quizId: req.params.quizId,
  });

  if (!req.user) return res.status(400).send("Please send token.");
  return res.send(quizzes);
});

module.exports = router;
