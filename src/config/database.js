const mongoose = require("mongoose");

const connectDB = async () => {
  mongoose.connect(
    "mongodb+srv://harshitslayer:va1nF2ITXwU7c022@cluster0.dottiru.mongodb.net/devTinder?retryWrites=true&w=majority"
  );
};

module.exports = connectDB;
