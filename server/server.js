const config = require('config');
const helmet = require('helmet');
const morgan = require('morgan');
const express = require('express');
const cors = require('cors');
const app = express();
const mongoose = require('mongoose');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

//HELMET & CORS
app.use(helmet());
app.use(cors());
console.info('Helmet & CORS running...');

//CONFIGURATION
console.info('Application Name: ' + config.get('name'));

//MORGAN
if (app.get('env') === 'development') {
    app.use(morgan('tiny'));
    console.info(`Morgan enabled...`);
}

// MongoDB Connection using config & .env in docker for credentials
const DB_HOST = config.get('database.host');
const connectWithRetry = () => {
    mongoose.connect(DB_HOST, { useNewUrlParser: true, autoReconnect: true, useFindAndModify: false })
        .then(() => console.info("Connected to MongoDB.."))
        .catch(error => {
            console.log(error.message);
            setTimeout(connectWithRetry, 5000);
        })
}
connectWithRetry();

// Load API Routes
app.use("/api/members", require('./routes/members'));
app.use("/api/catalogs", require('./routes/catalogs'));

const SERVER_PORT = config.get('server.port') || 5001;
app.listen(SERVER_PORT, () => console.info(`Listening on port ${SERVER_PORT}...`));