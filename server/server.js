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
console.log('Helmet running...');

//CONFIGURATION
console.log('Application Name: ' + config.get('name'));

//MORGAN
if (app.get('env') === 'development') {
    app.use(morgan('tiny'));
    console.log(`Morgan enabled...`);
}

app.get('/', (req, res) => {
    res.send('Hello World');
});

app.listen(5000, () => console.log(`Listening on port 5000...`));