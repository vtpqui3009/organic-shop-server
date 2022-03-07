const mongoose = require("mongoose");

const addressSchema = new mongoose.Schema({
  user: {
    type: String,
    required: true,
  },
  company: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: Number,
    required: true,
  },
});

module.exports = mongoose.model("Address", addressSchema);
