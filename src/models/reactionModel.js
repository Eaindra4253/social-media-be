const mongoose = require("mongoose");

const reactionSchema = mongoose.Schema(
  {
    post: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Post",
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

reactionSchema.index({ post: 1, user: 1 }, { unique: true });

const Reaction = mongoose.model("Reaction", reactionSchema);

module.exports = Reaction;
