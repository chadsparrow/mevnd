const debug = require('debug')('app:startup');
const config = require('config');
const helmet = require('helmet');
const morgan = require('morgan');
const express = require('express');
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

//HELMET
app.use(helmet());
debug('Helmet running...');

//CONFIGURATION
debug('Application Name: ' + config.get('name'));

//MORGAN
if (app.get('env') === 'development') {
    app.use(morgan('tiny'));
    debug(`Morgan enabled...`);
}

app.get('/', (req, res) => {
    res.send('Hello World');
});

const PORT = config.get('PORT');
app.listen(PORT, () => debug(`Listening on port 5000...`));