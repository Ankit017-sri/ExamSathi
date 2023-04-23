const express = require("express");

const auth = require("../middleware/auth");

const { Message } = require("../models/message");

const router = express.Router();

router.post("/", auth, async (req, res) => {
  const { text, uri, replyOn, pdfName, group } = req.body;
  console.log(req.body);
  if (uri) {
    console.log(uri);
    const message = new Message({
      senderId: req.user._id,
      // senderId: "78787187981",
      name: req.user.fullName,
      uri,
      replyOn,
      pdfName: pdfName ? pdfName : "",
      group,
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
      group,
    });
    const result = await message.save();
    console.log(result);
    return res.json(result);
  } else {
    return res.status(400).send("no text or image sent");
  }
});

router.get("/:group", auth, async (req, res) => {
  try {
    const { group } = req.params;
    if (group == "group0" || !group) {
      const result = await Message.find({
        $or: [{ group: { $exists: false } }, { group: group }],
      });
      console.log("group0 ", result);
      return res.json(result);
    }
    const result = await Message.find({ group: group });
    console.log(group);
    res.json(result);
  } catch (error) {
    res.status(500).send("something went wrong !");
  }
  // res.json(result);
});

// router.delete("/:group", auth, async (req, res) => {
//   try {
//     const { group } = req.params;
//     const data = await Message.deleteMany({ group: group });
//     res.status(200).send(data);
//   } catch (error) {
//     console.log(error);
//     res.status(500).send("something went wrong !");
//   }
// });

router.post("/latest", auth, async (req, res) => {
  const { date, group } = req.body;
  try {
    const result = await Message.find({
      $and: [{ group: group }, { createdAt: { $gt: date } }],
    });
    console.log(result);
    res.json(result);
  } catch (error) {
    console.log(error);
    res.status(500).send("something went wrong!");
  }
});

module.exports = router;
