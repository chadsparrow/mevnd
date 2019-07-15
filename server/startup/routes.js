const helmet = require("helmet");
const cors = require("cors");
const error = require("../middleware/error");
const express = require("express");

module.exports = function(app) {
  // Set up express, security, cors, and allow proxy
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(express.static("public"));
  app.use(helmet());
  app.use(cors());
  app.enable("trust proxy");

  // Load API Routes
  app.use("/api/members", require("../routes/members"));
  app.use("/api/auth", require("../routes/auth"));
  app.use(error);
};
