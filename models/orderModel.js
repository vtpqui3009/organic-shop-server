const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  shippingInfo: {
    name: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    phoneNo: {
      type: Number,
      required: true,
    },
    gender: {
      type: String,
      required: true,
    },
  },
  orderItems: [
    {
      name: {
        type: String,
        required: true,
      },
      price: {
        type: Number,
        required: true,
      },
      weight: {
        type: Number,
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
        default: 1,
      },
      discount: {
        type: Number,
        required: true,
        default: 0,
      },
      image: {
        type: String,
        required: true,
      },
      product: {
        type: mongoose.Schema.ObjectId,
        ref: "Product",
        required: true,
      },
    },
  ],
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
  },

  paymentInfo: {
    id: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
    },
  },
  paiAt: {
    type: Date,
    required: true,
  },
  // itemsPrice: {
  //   type: Number,
  //   default: 0,
  //   required: true,
  // },
  shippingPrice: {
    type: String,
    default: 0,
    required: true,
  },
  totalPrice: {
    type: Number,
    default: 0,
    required: true,
  },
  orderStatus: {
    type: String,
    required: true,
    default: "Processing",
  },
  deliverdAt: Date,
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

module.exports = mongoose.model("Order", orderSchema);
