const config = require("./config/config");
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
require("express-async-errors");

const usersRouter = require("./controllers/users");
const loginRouter = require("./controllers/login");
const checksRouter = require("./controllers/checks");

const errorHandler = require("./middleware/errorHandler");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

mongoose.set("strictQuery", false);

mongoose
  .connect(config.MONGODB_URI)
  .then(() => {
    console.log("connected to MongoDB");
  })
  .catch((error) => {
    console.log("error connection to MongoDB:", error.message);
  });

app.use("/api/users", usersRouter);
app.use("/api/login", loginRouter);
app.use("/api/checks", checksRouter);

app.use(errorHandler);

module.exports = app;
