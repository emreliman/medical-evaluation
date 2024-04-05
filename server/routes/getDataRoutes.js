const express = require("express");
const authMiddleware = require("../middleware/authMiddleware.js");
const router = express.Router();
const fs = require("fs");
const { sendToBard } = require("../services/bardApi");
const OperationModel = require("../models/operation_model.js");
const { createWorker } = require('tesseract.js');

// OCR için Tesseract işçisi oluştur


router.get("/", authMiddleware, (req, res) => {
  res.send("it works");
});

router.post("/", authMiddleware, async (req, res) => {
  try {
    // const inputData = req.body.data;
    
    // console.log(base64Pdf);
    const preCommand = "I will share blood analyses can you explain to me this analysis and Are there any bad results in that analysis explain? : "
   
    const imageData = fs.readFileSync('assets/analyses.png');
    // console.log(imageData);
    // Resmi metne dönüştür
    const worker = await createWorker('eng');
    const ret = await worker.recognize(imageData);
    console.log(ret.data.text);
    const bardApiResponse = await sendToBard(preCommand + ret.data.text);

    res.json({ bardApiResponse: bardApiResponse[0].candidates[0].output });
    // OCR sonucunu kullanıcıya gönder
    // res.json({ result: ret.data.text });

    const user = req.user;

    if (user.membershipType === "singleUse") {
      user.membershipType = "free";
      await user.save();
    }

    if (user.membershipType === "annual" || user.membershipType === "monthly") {
      const newOperation = new OperationModel({
        userId: user._id,
        operationType: "processData",
        data: bardApiResponse,
      });

      await newOperation.save();
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// async function processData(inputData) {

//   if (inputData.type === "file" && inputData.content) {

//     return inputData.content;
//   } else if (inputData.type === "text" && inputData.content) {
//     return inputData.content;
//   } else {
//     throw new Error("Geçersiz veri formatı.");
//   }
// }

module.exports = router;
