//SERVER START-UP CODE
const Joi = require("@hapi/joi"); // request validation middleware
Joi.objectId = require("joi-objectid")(Joi); // allows joi to validate mongo Object Id's
const winston = require("winston"); //logging middleware
require("winston-mongodb"); // allows winston to store logs on mongodb under "log" collection
require("winston-daily-rotate-file"); // allows winston to create a file per day
const morgan = require("morgan"); // request logging during development
const config = require("config"); // store app configurations and environments
const express = require("express");
require("express-async-errors"); // automatically catches async errors without try catch blocks
const app = express();
require("./startup/routes")(app); // all req routes used by the app

// setup MongoDB configuration and connect using custom db middleware.
const DB_USER = config.get("database.user");
const DB_PASS = config.get("database.pass");
const DB_DB = config.get("database.db");
const DB_PORT = config.get("database.port");
const DB_HOST = `mongodb://${DB_USER}:${DB_PASS}@mongo:${DB_PORT}/${DB_DB}?authSource=admin`;
require("./startup/db")(DB_HOST);

// setup winston transport to store in individual files per day and delete any older than 2 weeks
winston.add(winston.transports.DailyRotateFile, {
  filename: "./logs/application-%DATE%.log",
  maxFiles: "14d"
});
// setup winston transport to store all logs onto mongodb under "log" collection
winston.add(winston.transports.MongoDB, { db: DB_HOST });

// handles all uncaught expceptions and stops the process - PM2 will be used in production to restart the process
process.on("uncaughtException", ex => {
  winston.error(ex.message, ex);
  process.exit(1);
});

// throw an exception to uncaught exception handler if unhandle promise rejection is found.
process.on("unhandledRejection", ex => {
  throw ex;
});

// API request Logging only during development
if (config.get("server.environment") === "development") {
  app.use(morgan("tiny"));
  winston.info(`Morgan enabled...`);
}

// Check if jwtPrivateKey env variable is set and quit the process if not found.
if (!config.get("jwtPrivateKey")) {
  winston.error("FATAL ERROR: jwtPrivateKey is not defined.");
  process.exit(1);
}

//Displays environment application is in
winston.info("Application Name: " + config.get("name"));

// configures server port
const APP_PORT = config.get("server.port") || 5000;
// configures server to listen to configured server port above
app.listen(APP_PORT, () => winston.info(`Listening on port ${APP_PORT}...`));
