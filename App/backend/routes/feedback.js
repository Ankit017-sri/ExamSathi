const express = require("express");
const auth = require("../middleware/auth");

const { Feedback } = require("../models/feedback");

const router = express.Router();

router.post("/", auth, async (req, res) => {
  if (!req.user) {
    return res.status(400).send("unauthorized");
  }
  const { feedback } = req.body;
  const { phoneNumber, fullName } = req.user;
  // const feedback = await Feedback.findOne({ phone: phoneNumber });
  if (!feedback || !phoneNumber) {
    return res.status(400).send("bad request!");
  }
  try {
    const newFeedback = new Feedback({
      fullName,
      phoneNumber,
      message: feedback,
    });
    const result = await newFeedback.save();
    // console.log(result);
    res.status(201).send(result);
  } catch (error) {
    res.status(500).send("something went wrong on our side!");
  }
});

router.get("/", auth, async (req, res) => {
  try {
    const { phoneNumber } = req.user;
    const feedbacks = await Feedback.find({ phoneNumber });
    res.status(200).send(feedbacks);
  } catch (error) {
    console.log(error);
    res.status(500).send("something went wrong on our side!");
  }
});

module.exports = router;
