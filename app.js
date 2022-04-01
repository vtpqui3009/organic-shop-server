const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const fileUpload = require("express-fileupload");
const path = require("path");
const cors = require("cors");

const corsOptions = {
  origin: "https://new-organic-shop.netlify.app",
  credentials: true,
  //optionSuccessStatus: 200,
};

app.use(cors(corsOptions));

const errorMiddleware = require("./middleware/error");

app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(fileUpload());

// Route Imports
const product = require("./routes/productRoute");
const user = require("./routes/userRoute");
const order = require("./routes/orderRoute");
const address = require("./routes/addressRoute");
const blog = require("./routes/blogRoute");
const comment = require("./routes/commentRoute");
const stripe = require("./routes/stripeRoute");
const createCheckoutSession = require("./controller/stripeController");

app.use("/api/v1", product);
app.use("/api/v1", user);
app.use("/api/v1", order);
app.use("/api/v1", address);
app.use("/api/v1", blog);
app.use("/api/v1", comment);
app.use("/api/v1", stripe);
app.post("/create-checkout-session", createCheckoutSession);

const publicPath = path.join(__dirname, "..", "public");
app.use(express.static(publicPath));
// app.use(express.static(path.join(__dirname, "../frontend/build")));

app.get("*", (req, res) => {
  res.sendFile(path.join(publicPath, "index.html"));
});

// Middleware for Errors
app.use(errorMiddleware);

module.exports = app;
