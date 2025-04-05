const statusSchema = new mongoose.Schema({
    _id: { type: String, default: "statusDoc" },
    onlineMessageId: String,
    shutdownMessageId: String,
    channelId: String,
  });
  
  module.exports = mongoose.model("StatusMessage", statusSchema);