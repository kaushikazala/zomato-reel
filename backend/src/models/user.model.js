const mongoose = require("mongoose");
const { eventNames } = require("../app");

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      require: true,
      unique: true,
    },
    password: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);
const userModel = mongoose.model("user", userSchema);
module.exports = userModel;
