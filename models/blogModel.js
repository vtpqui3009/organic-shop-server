const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  shortDescription: {
    type: String,
    required: true,
  },
  image: {
    public_id: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
  },
  content: {
    type: String,
    required: true,
  },
  author: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
    require: true,
  },
  comment: [
    {
      user: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: true,
      },
      content: {
        type: String,
        required: true,
      },
      createdAt: {
        type: Date,
        default: Date.now,
      },
      parentId: {
        type: mongoose.Schema.ObjectId,
        required: true,
        default: null,
      },
    },
  ],
  numOfComment: {
    type: Number,
    required: true,
    default: 0,
  },
});

module.exports = mongoose.model("Blog", blogSchema);
