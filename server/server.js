//SERVER START-UP CODE
const Joi = require('@hapi/joi');
Joi.objectId = require('joi-objectid')(Joi);
const winston = require('winston');
require('winston-mongodb');
require('winston-daily-rotate-file');
const config = require('config');
const morgan = require('morgan');
const express = require('express');
require('express-async-errors');
const mongoose = require('mongoose');
const app = express();
require('./startup/routes')(app);

// setup db_host variable
const DB_HOST = config.get('database.host');

// setup winston
winston.add(winston.transports.DailyRotateFile, { filename: './logs/application-%DATE%.log', maxFiles: '14d' });
winston.add(winston.transports.MongoDB, { db: DB_HOST });

process.on('uncaughtException', ex => {
  winston.error(ex.message, ex);
  process.exit(1);
});

process.on('unhandledRejection', ex => {
  throw ex;
});

const connectWithRetry = async () => {
  try {
    await mongoose.connect(DB_HOST, { useNewUrlParser: true, autoReconnect: true, useFindAndModify: false, useCreateIndex: true });
    winston.info('Connected to MongoDB..');
  } catch (err) {
    winston.error(err.message, err);
    setTimeout(connectWithRetry, 5000);
  }
};
connectWithRetry();

//Morgan development API call Logging
if (app.get('env') === 'development') {
  app.use(morgan('tiny'));
  winston.info(`Morgan enabled...`);
}

// Check if jwtPrivateKey env variable is set
if (!config.get('jwtPrivateKey')) {
  winston.error('FATAL ERROR: jwtPrivateKey is not defined.');
  process.exit(1);
}

// configures server port
const SERVER_PORT = config.get('server.port') || 5001;

//Displays environment application is in
winston.info('Application Name: ' + config.get('name'));

// configures server to listen to configured server port above
app.listen(SERVER_PORT, () => winston.info(`Listening on port ${SERVER_PORT}...`));
