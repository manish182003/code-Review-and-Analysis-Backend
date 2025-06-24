const mongoose = require("mongoose");

const guestSchema = new mongoose.Schema({
  deviceId: {
    type: String,
    unique: true,
  },
  usageCount: {
    type: Number,
    default: 0,
  },
  lastUsedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Guest", guestSchema);
