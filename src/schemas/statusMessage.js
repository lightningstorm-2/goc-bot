const mongoose = require("mongoose");

const statusMessageSchema = new mongoose.Schema({
  _id: { type: String, default: "statusDoc" },
  onlineMessageId: { type: String, default: null },
  channelId: { type: String, required: true }
});

module.exports = mongoose.model("StatusMessage", statusMessageSchema);
