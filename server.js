const app = require("./app");
const Comments = require("./models/commentModel");
const dotenv = require("dotenv");
const connectDatabase = require("./config/database");
const cloudinary = require("cloudinary");
dotenv.config({ path: "config/config.env" });

const http = require("http");
const { Server } = require("socket.io");
const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => {
  console.log("server is running port: " + PORT || 3000);
});
//connect database
connectDatabase();
const io = new Server(server, { cors: { origin: "*" } });
//socket io
let users = [];
io.on("connection", (socket) => {
  console.log(socket.id + " connected.");
  socket.on("joinRoom", (id) => {
    const user = { userId: socket.id, room: id };
    const check = users.every((user) => user.userId !== socket.id);

    if (check) {
      users.push(user);
      socket.join(user.room);
    } else {
      users.map((user) => {
        if (user.userId === socket.id) {
          if (user.room !== id) {
            socket.leave(user.room);
            socket.join(id);
            user.room = id;
          }
        }
      });
    }

    // console.log(users);
    // console.log(socket.adapter.rooms);
  });
  socket.on("createComment", async (message) => {
    const { productId, userId, userName, userAvatar, ratings, comment } =
      message;
    const newComment = new Comments({
      userId,
      userName,
      userAvatar,
      comment,
      productId,
      ratings,
    });

    await newComment.save();
    console.log(newComment);
    io.to(newComment.productId).emit("sendCommentToClient", newComment);
  });
  socket.on("replyComment", async (replyMessage) => {
    const {
      prevUser,
      userId,
      userName,
      userAvatar,
      ratings,
      comment,
      parentId,
    } = replyMessage;
    // console.log("Reply messsage : ", replyMessage);
    const hasComment = await Comments.findById({ _id: parentId });
    // console.log("Line 70 : ", hasComment);
    if (hasComment) {
      hasComment.reply.push(replyMessage);
      await hasComment.save();
      io.to(hasComment.productId).emit("sendReplyCommentToClient", hasComment);
    } else {
    }
  });
  socket.on("disconnect", () => {
    console.log(socket.id + " disconnected.");
  });
});

//Handing uncautch exception
process.on("uncaughtException", (err) => {
  console.log(`error: ${err.message}`);
  console.log("shutting down the server");

  process.exit(1);
});

cloudinary.config({
  cloud_name: process.env.CLOUNDINARY_NAME,
  api_key: process.env.CLOUNDINARY_API_KEY,
  api_secret: process.env.CLOUNDINARY_API_SECRET,
});

// Unhanded Promise Rejections
process.on("unhandledRejection", (err) => {
  console.log(`error: ${err.message}`);
  // console.log("shutting down the server");

  // server.close(() => {
  //   process.exit(1);
  // });
});
