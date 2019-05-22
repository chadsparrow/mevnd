const debug = require('debug')('app:startup');
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
debug('Helmet & CORS running...');

//CONFIGURATION
console.info('Application Name: ' + config.get('name'));

//MORGAN
if (app.get('env') === 'development') {
    app.use(morgan('tiny'));
    debug(`Morgan enabled...`);
}
const DB_HOST = config.get('database.host');

// MongoDB Connection using .env in docker for credentials
const connectWithRetry = async () => {
    try {
        const dbConnection = await mongoose.connect(DB_HOST, { useNewUrlParser: true, autoReconnect: true, useFindAndModify: false })
        console.info("Connected to MongoDB...");
    } catch (error) {
        console.log(error);
        setTimeout(connectWithRetry, 5000);
    }
};

connectWithRetry();


// Load API Routes
app.use("/api/members", require('./routes/api/members'));

const SERVER_PORT = config.get('server.port') || 5001;
app.listen(SERVER_PORT, () => console.info(`Listening on port ${SERVER_PORT}...`));