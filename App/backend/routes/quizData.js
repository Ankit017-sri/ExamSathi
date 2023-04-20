const express = require("express");

const auth = require("../middleware/auth");
const { QuizData } = require("../models/quizData");
const { SubmittedQuiz } = require("../models/submittedQuiz");
const { webAppQuizData } = require("../models/webAppQuizData");

const router = express.Router();

router.get("/", auth, async (req, res) => {
  const submittedQuizIds = await SubmittedQuiz.find({
    userId: req.user._id,
  }).distinct("quizId");

  const submittedQuizzes = await QuizData.find({
    _id: { $in: submittedQuizIds },
  });

  return res.send(submittedQuizzes);
});

router.get("/latest", auth, async (req, res) => {
  const submittedQuizIds = await SubmittedQuiz.find({
    userId: req.user._id,
  }).distinct("quizId");

  if (req.query?.platform === "web") {
    const latestQuiz = await webAppQuizData
      .find({
        // _id: { $nin: submittedQuizIds },
        // maxMarks: { $eq: 15 },
        // quizTitle: { $regex: /Quiz/ },
      })
      .sort({ _id: -1 })
      .limit(1);

    // console.log(latestQuiz);
    return res.send(latestQuiz);
  }

  const latestQuizzes = await QuizData.find({
    _id: { $nin: submittedQuizIds },
    maxMarks: { $eq: 15 },
    quizTitle: { $regex: /Quiz/ },
  });

  // console.log(latestQuizzes);

  return res.send(latestQuizzes.slice(-1));
});

router.get("/latest/long", auth, async (req, res) => {
  const submittedQuizIds = await SubmittedQuiz.find({
    userId: req.user._id,
  }).distinct("quizId");

  const latestQuizzes = await QuizData.find({
    _id: { $nin: submittedQuizIds },
    maxMarks: { $eq: 100 },
  });

  // console.log(latestQuizzes);

  return res.send(latestQuizzes.slice(-1));
});

router.get("/latest/current-affairs", auth, async (req, res) => {
  const submittedQuizIds = await SubmittedQuiz.find({
    userId: req.user._id,
  }).distinct("quizId");

  const latestQuizzes = await QuizData.find({
    _id: { $nin: submittedQuizIds },
    maxMarks: { $eq: 15 },
    quizTitle: { $regex: /चालू घडामोडी टेस्ट!/ },
  });

  // console.log(latestQuizzes);

  return res.send(latestQuizzes.slice(-1));
});

router.get("/pyq", auth, async (req, res) => {
  const submittedQuizIds = await SubmittedQuiz.find({
    userId: req.user._id,
  }).distinct("quizId");

  const pyq = await QuizData.find({
    _id: { $nin: submittedQuizIds },
    maxMarks: { $eq: 100 },
    quizTitle: { $regex: /PYQ/ },
  });

  // console.log(latestQuizzes);

  return res.send(pyq.slice(-1));
});

router.get("/:quizId", auth, async (req, res) => {
  if (req.query?.platform === "web") {
    const quiz = await webAppQuizData.findOne({ _id: req.params.quizId });

    return res.send(quiz);
  }

  const quiz = await QuizData.findOne({ _id: req.params.quizId });

  // console.log(quiz);

  return res.send(quiz);
});

router.post("/add", async (req, res) => {
  const quiz = new QuizData(req.body);

  await quiz.save();

  return res.send(quiz);
});

module.exports = router;
