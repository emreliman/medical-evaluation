const express = require("express");
const Sonuc = require("../models/Sonuc");
const router = express.Router();

router.post("/", async (req, res) => {
  const sonuc = new Sonuc({
    hastaAdi: req.body.hastaAdi,
    sonucTuru: req.body.sonucTuru,
    sonucVerileri: req.body.sonucVerileri,
    yorum: req.body.yorum,
  });

  const validationError = sonuc.validateSync();
  if (validationError) {
    res.status(400).json({
      error: validationError,
    });
  } else {
    try {
      const savedSonuc = await sonuc.save();
      res.json(savedSonuc);
    } catch (err) {
      res.status(500).json({ message: err });
    }
  }
});

router.get("/:id", (req, res) => {
  res.send(`Sonuc ID: ${req.params.id}`);
});

router.get("/:sonucId", async (req, res) => {
  try {
    const sonuc = await Sonuc.findById(req.params.sonucId);
    res.json(sonuc);
  } catch (err) {
    res.json({ message: err });
  }
});

module.exports = router;
