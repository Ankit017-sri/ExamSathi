const express = require("express");

const auth = require("../middleware/auth");

const { Message } = require("../models/message");

const router = express.Router();

router.post("/", auth, async (req, res) => {
  const { text } = req.body;
  const message = new Message({
    senderId: req.user._id,
    // senderId: "78787187981",
    name: req.user.fullName,
    text,
  });

  const result = await message.save();
  console.log(result);
  res.json(result);
});

router.get("/", auth, async (req, res) => {
  const result = await Message.find();
  console.log(result);
  res.json(result);
});
// router.delete("/", async (req, res) => {
//   try {
//     const data = await Message.deleteMany();
//     res.json(data);
//   } catch (err) {
//     console.log(err);
//   }
// });

module.exports = router;
