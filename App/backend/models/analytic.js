const mongoose = require("mongoose");

const analyticSchema = new mongoose.Schema(
  {
    appOpenedCount: {
      type: Number,
      default: 0,
    },
    websiteOpenedCount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

const Analytic = mongoose.model("Analytic", analyticSchema);
module.exports.Analytic = Analytic;
