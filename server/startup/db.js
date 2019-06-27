const winston = require('winston');
const mongoose = require('mongoose');

module.exports = function(DB_HOST) {
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
};
