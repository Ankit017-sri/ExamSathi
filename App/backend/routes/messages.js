const express = require("express");

const auth = require("../middleware/auth");

const { Message } = require("../models/message");

const router = express.Router();

router.post("/", auth, async (req, res) => {
  const { text, uri, replyOn } = req.body;
  console.log(req.body);
  if (uri) {
    console.log(uri);
    const message = new Message({
      senderId: req.user._id,
      // senderId: "78787187981",
      name: req.user.fullName,
      uri,
      replyOn,
    });
    const result = await message.save();
    console.log(result);
    return res.json(result);
  } else if (text) {
    const message = new Message({
      senderId: req.user._id,
      // senderId: "78787187981",
      name: req.user.fullName,
      text,
      replyOn,
    });
    const result = await message.save();
    console.log(result);
    return res.json(result);
  } else {
    return res.status(400).send("no text or image sent");
  }
});

router.get("/", auth, async (req, res) => {
  const result = await Message.find();
  res.json(result);
});

router.post("/latest", auth, async (req, res) => {
  const { date } = req.body;
  try {
    const result = await Message.find({ createdAt: { $gt: date } });
    console.log(result);
    res.json(result);
  } catch (error) {
    console.log(error);
    res.status(500).send("something went wrong!");
  }
});

module.exports = router;
