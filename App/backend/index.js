require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const authRouter = require("./routes/auth");
const submitQuizRouter = require("./routes/submitQuiz");
const quizDataRouter = require("./routes/quizData");
const analyticRouter = require("./routes/analytic");

if (!process.env.DB) {
  console.error("!!FATAL ERROR!! Database not connected.");
  process.exit(1);
}

const app = express();
const corsOptions = {
  origin: "*",
  credentials: true, //access-control-allow-credentials:true
  optionSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get("/", async (req, res) => {
  return res.send("Welcome to Exam Sathi.");
});
app.use("/auth", authRouter);
app.use("/submitQuiz", submitQuizRouter);
app.use("/quizData", quizDataRouter);
app.use("/analytic", analyticRouter);

mongoose
  .connect(process.env.DB)
  .then(() => console.info("mongo connected.."))
  .catch((err) => console.error(err.message, err));

const port = process.env.PORT || 8000;

app.listen(port, () => console.info(`server started on port ${port}`));
