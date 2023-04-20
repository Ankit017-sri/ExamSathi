const mongoose = require("mongoose");

const groupMessageSchema = new mongoose.Schema(
  {
    groupId: { type: String, required: true },
    senderId: {
      type: String,
      required: true,
    },
    text: String,
    name: String,
    uri: String,
    replyOn: {},
  },
  { timestamps: true }
);

module.exports = mongoose.model("GroupMessage", groupMessageSchema);
