const express = require("express");

const { Analytic } = require("../models/analytic");
const router = express.Router();

router.put("/app", async (req, res) => {
  const analytic = await Analytic.find();

  await Analytic.updateOne(
    {},
    {
      appOpenedCount: analytic.appOpenedCount + 1,
    },
    { upsert: true }
  );

  return res.send("Updated");
});

router.put("/website", async (req, res) => {
  const analytic = await Analytic.find();

  await Analytic.updateOne(
    {},
    {
      websiteOpenedCount: analytic.websiteOpenedCount + 1,
    },
    { upsert: true }
  );

  return res.send("Updated");
});

module.exports = router;
