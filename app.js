const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const fileUpload = require("express-fileupload");
const path = require("path");
const cors = require("cors");
const session = require("express-session");
const corsOptions = {
  origin: "https://new-organic-shop.netlify.app",
  credentials: true,
  // optionSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use(cookieParser());
app.all("*", function (req, res, next) {
  res.setHeader(
    "Access-Control-Allow-Origin",
    "https://new-organic-shop.netlify.app"
  );
  res.setHeader("Access-Control-Allow-Headers", "X-Requested-With");
  res.setHeader("Access-Control-Allow-Credentials", true);
  next();
});
app.set("trust proxy", 1);
app.use(
  session({
    name: "random_session",
    secret: "yryGGeugidx34otGDuSF5sD9R8g0Gü3r8",
    resave: false,
    saveUninitialized: true,
    cookie: {
      path: "/",
      secure: true,
      httpOnly: true,
    },
  })
);
const errorMiddleware = require("./middleware/error");

app.use(express.json());

app.use(bodyParser.urlencoded({ extended: true }));
app.use(fileUpload());

// Route Imports
const product = require("./routes/productRoute");
const user = require("./routes/userRoute");
const order = require("./routes/orderRoute");
const address = require("./routes/addressRoute");
const blog = require("./routes/blogRoute");
const comment = require("./routes/commentRoute");
const { createCheckoutSession } = require("./controller/stripeController");

app.use(product);
app.use(user);
app.use(order);
app.use(address);
app.use(blog);
app.use(comment);
app.post("create-checkout-session", createCheckoutSession);

app.use(express.static(path.join(__dirname, "../client/build")));

app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "../client/build/index.html"));
});
// app.get("/", (req, res) => {
//   res.send("Hello World!");
// });
// Middleware for Errors
app.use(errorMiddleware);

module.exports = app;
