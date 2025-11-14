const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const logger = require("./config/logger");
const app = express();
const routes = require("./routes");

app.use(cors());

app.use(morgan("dev", { stream: logger.stream }));
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use("/api", routes);

module.exports = app;

