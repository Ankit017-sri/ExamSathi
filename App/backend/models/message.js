const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    senderId: String,
    text: String,
    name: String,
    uri: String,
  },
  { timestamps: true }
);

const Message = mongoose.model("Message", messageSchema);

module.exports.messageSchema = messageSchema;
module.exports.Message = Message;
