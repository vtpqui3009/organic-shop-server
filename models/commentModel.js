const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
  productId: {
    type: String,
    required: true,
  },
  userId: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
  },
  userName: {
    type: String,
    required: true,
  },
  userAvatar: {
    type: String,
    required: true,
  },
  ratings: {
    type: Number,
    required: true,
  },
  comment: {
    type: String,
    required: true,
  },

  reply: [
    {
      user: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: true,
      },
      userName: {
        type: String,
        required: true,
      },
      userAvatar: {
        type: String,
        required: true,
      },
      rating: {
        type: Number,
        required: true,
      },
      comment: {
        type: String,
        required: true,
      },
      parentId: {
        type: mongoose.Schema.ObjectId,
        required: true,
        default: null,
      },
      createdAt: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Comments", commentSchema);
