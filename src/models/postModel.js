const mongoose = require("mongoose");

const postSchema = mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    title: {
      type: String,
      required: [true, "Please add a title"],
    },
    content: {
      type: String,
      required: [true, "Please add content"],
    },
    image: {
      type: String,
      required: false,
    },
    video: {
      type: String,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

const Post = mongoose.model("Post", postSchema);
module.exports = Post;
