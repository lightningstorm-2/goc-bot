const { Schema, model } = require("mongoose");
const balanceSchema = new Schema({
  _id: Schema.Types.ObjectId,
  userId: String,
  guildId: String,
  balance: { type: Bigint, default: 0 },
});

module.exports = model("Balance", balanceSchema, "balances");
