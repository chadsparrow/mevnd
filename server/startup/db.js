const winston = require('winston');
const mongoose = require('mongoose');

module.exports = async function(DB_HOST) {
  await mongoose.connect(DB_HOST, { useNewUrlParser: true, autoReconnect: true, useFindAndModify: false, useCreateIndex: true });
  winston.info('Connected to MongoDB..');
};
