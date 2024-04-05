const mongoose = require("mongoose");

const operationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  operationType: {
    type: String,
    required: true,
  },
  data: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Operation", operationSchema);
