const express = require("express");

const { User } = require("../models/user");
const auth = require("../middleware/auth");
const { SubmittedQuiz } = require("../models/submittedQuiz");
const { Analytic } = require("../models/analytic");

const router = express.Router();

router.post("/", async (req, res) => {
  const { phoneNumber, fullName } = req.body;

  if (!phoneNumber || !fullName)
    return res.status(400).send("Please send full details.");

  const user = await User.findOne({ phoneNumber });

  const analytic = await Analytic.find();

  //console.log(analytic);

  await Analytic.updateOne(
    {},
    {
      appOpenedCount: req.body.joinedUsing
        ? analytic[0].appOpenedCount
        : analytic[0].appOpenedCount + 1,
      websiteOpenedCount: req.body.joinedUsing
        ? analytic[0].websiteOpenedCount + 1
        : analytic[0].websiteOpenedCount,
    },
    { upsert: true }
  );

  if (user) {
    const token = user.generateAuthToken(user._id?.toString());

    await User.updateOne(
      { phoneNumber },
      { joinedUsing: req.body.joinedUsing ? req.body.joinedUsing : "App" },
      { upsert: true }
    );

    return res.header("x-auth-token", token).send({ user, token });
  } else {
    const newUser = new User({
      phoneNumber,
      fullName,
      joinedUsing: req.body.joinedUsing ? req.body.joinedUsing : "App",
    });

    await newUser.save();

    const token = newUser.generateAuthToken(newUser._id?.toString());

    return res.header("x-auth-token", token).send({ user: newUser, token });
  }
});

router.get("/user", auth, async (req, res) => {
  try {
    return res.send(req.user);
  } catch (err) {
    console.log(err);
    res.status(400).send({ message: "Please login" });
  }
});
router.get("/users/count", auth, async (req, res) => {
  try {
    const count = await User.aggregate([
      { $group: { _id: "$phoneNumber", count: { $sum: 1 } } },
      { $match: { count: 1 } },
    ]).count("count");
    //console.log(count);
    res.send(count);
  } catch (error) {
    res.status(500).send({ error: "Error getting count of users" });
  }
});

router.delete("/delete", auth, async (req, res) => {
  const user = await User.deleteOne({ _id: req.user._id });
  await SubmittedQuiz.deleteMany({ userId: req.user._id });

  console.log("Deleted User: ", user);

  return res.send({ message: "USER_DELETED" });
});

router.put("/app/share", auth, async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.user._id });
    const { screen } = req.body;
    // const analytic = await Analytic.find();
    let data;
    if (screen == 1) {
      data = await User.updateOne(
        { _id: req.user._id },
        { appShareCount1: user.appShareCount1 + 1 },
        { upsert: true }
      );
    } else if (screen == 2) {
      data = await User.updateOne(
        { _id: req.user._id },
        { appShareCount2: user.appShareCount2 + 1 },
        { upsert: true }
      );
    }
    return res.send(data);
  } catch (error) {
    console.log(error);
    res.send("somthing went wrong !");
  }
});

router.put("/app/openCount", auth, async (req, res) => {
  try {
    const user = await User.findById({ _id: req.user._id });
    await User.updateOne(
      { _id: req.user._id },
      { appOpenCount: user.appOpenCount + 1 },
      { upsert: true }
    );
    return res.send("updated");
  } catch (error) {
    console.log(error);
    res.send("somthing went wrong !");
  }
});
module.exports = router;
