const mongoose = require("mongoose");

const connectDb = (mongoUri) => {
  mongoose
    .connect(mongoUri)
    .then(() => {
      console.log("Database is connected Successfully!!");
    })
    .catch((error) => {
      console.log("Failed to connect", error);
      process.exit(1);
    });
};

module.exports = {
  connectDb,
};
