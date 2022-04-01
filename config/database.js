const mongoose = require("mongoose");

const connectDatabase = () => {
  mongoose
    .connect(
      "mongodb+srv://useruser:useruser@cluster0.oevef.mongodb.net/orchid?retryWrites=true&w=majority"
    )
    .then((data) => {
      console.log(`mongodb connected with server: ${data.connection.host}`);
    });
};
module.exports = connectDatabase;
