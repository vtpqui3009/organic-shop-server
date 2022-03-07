const express = require("express");
const { stripePayment } = require("../controller/stripeController");

const router = express.Router();

router.route("/create-checkout-session").post(stripePayment);

module.exports = router;
