const mongoose = require("mongoose");

const conversationSchema = mongoose.Schema(
  {
    creator: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },

    participant: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
    last_updated: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Conversation", conversationSchema);
