const winston = require('winston');
const morgan = require('morgan');
const config = require('config');

module.exports = function(app) {
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

  //Displays environment application is in
  winston.info('Application Name: ' + config.get('name'));
};
