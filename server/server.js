const debug = require('debug')('app:startup');
const config = require('config');
const helmet = require('helmet');
const morgan = require('morgan');
const express = require('express');
const cors = require('cors');
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

//HELMET & CORS
app.use(helmet());
app.use(cors());
debug('Helmet & CORS running...');

//CONFIGURATION
console.log('Application Name: ' + config.get('name'));

//MORGAN
if (app.get('env') === 'development') {
    app.use(morgan('tiny'));
    debug(`Morgan enabled...`);
}

app.get('/', (req, res) => {
    res.send('Hello World');
});

const PORT = config.get('PORT') || 5001;
app.listen(PORT, () => console.log(`Listening on port ${PORT}...`));