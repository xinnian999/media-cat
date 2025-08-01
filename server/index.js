require("dotenv").config();
const express = require("express");
const app = express();
const port = 3000;

const { AppDataSource } = require("./db");

AppDataSource.initialize()
  .then(() => {
    console.log("Data Source has been initialized!");
  })
  .catch((error) => console.error(error));

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
