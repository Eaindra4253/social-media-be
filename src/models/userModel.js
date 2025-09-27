const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please add a name"],
      maxlength: [255, "Name cannot exceed 255 characters"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Please add an email"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,})+$/,
        "Please add a valid email address",
      ],
    },
    password: {
      type: String,
      required: [true, "Please add a password"],
      minlength: [8, "Password must be at least 8 characters"],
      select: false,
    },
    profile_picture_url: {
      type: String,
      trim: true,
      default: null,
      validate: {
        validator: function (v) {
          if (!v) return true;
          return /^(https?:\/\/.*\.(?:png|jpg|jpeg|gif|webp|svg|bmp|tiff?))$/i.test(
            v
          );
        },
        message: "Please provide a valid image URL (http/https).",
      },
    },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);

const User = mongoose.model("User", userSchema);
module.exports = User;
