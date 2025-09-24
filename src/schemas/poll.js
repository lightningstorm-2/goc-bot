const mongoose = require("mongoose");

const pollSchema = new mongoose.Schema({
  messageId: { type: String, required: true },
  channelId: { type: String, required: true },
  guildId: { type: String, required: true },
  createdAt: { type: Date, default: Date.now, expires: "2h" }, 
});

module.exports = mongoose.model("Poll", pollSchema);
