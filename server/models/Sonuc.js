const mongoose = require("mongoose");

const sonucSchema = new mongoose.Schema({
  hastaAdi: {
    type: String,
    required: true,
  },
  sonucTuru: {
    type: String,
    required: true,
  },
  sonucVerileri: {
    type: Map,
    of: String,
  },
  yorum: {
    type: String,
  },
  tarih: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Sonuc", sonucSchema);
