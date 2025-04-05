const { Schema, Model } = require("mongoose");

const statusSchema = new Schema({
  _id: { type: String, default: "statusDoc" },
  onlineMessageId: String,
  shutdownMessageId: String,
  channelId: String,
});

module.exports = model("StatusMessage", statusSchema);
