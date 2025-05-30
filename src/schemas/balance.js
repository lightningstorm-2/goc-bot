const { Schema, model } = require("mongoose");
const balanceSchema = new Schema({
  _id: Schema.Types.ObjectId,
  userId: String,
  guildId: String,
  balance: { type: Number, default: 0, validate: Number.isInteger },
});

module.exports = model("Balance", balanceSchema, "balances");
