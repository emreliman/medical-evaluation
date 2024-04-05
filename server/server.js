const express = require("express");
require("dotenv").config();
const sonucRoutes = require("./routes/sonucRoutes");
const authRoutes = require("./routes/authRoutes");
const getDataRoutes = require("./routes/getDataRoutes");
const app = express();
const port = 3000;
const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/myapp");

const db = mongoose.connection;
db.on("error", (error) => console.error("Connection error: " + error));
db.once("open", () => console.log("Database connected successfully!"));

app.use(express.json());
app.use("/sonuc", sonucRoutes);
app.use("/auth", authRoutes);
app.use("/get-data", getDataRoutes);

app.get("/", (req, res) => res.send("Merhaba Dünya!"));

app.listen(port, () =>
  console.log(`Application is running on: http://localhost:${port}`),
);
