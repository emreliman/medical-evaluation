const mongoose = require("mongoose");

const UserSchema = mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  membershipType: {
    type: String,
    default: "free",
  },
  subscriptionUsed: {
    type: Boolean,
    default: false,
  },
  googleId: {
    type: String,
  },
  refreshToken: {
    type: String,
    unique: true,
  },
});

const UserModel = mongoose.model("User", UserSchema);

module.exports = UserModel;
