//SERVER START-UP CODE
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
app.use(helmet());
app.use(cors());

// Load API Routes
app.use("/api/members", require('./routes/members'));
app.use("/api/catalogs", require('./routes/catalogs'));
app.use("/api/emails", require('./routes/emails'));

// Enable Proxy Trust
app.enable('trust proxy');

//Configuration
console.log('Application Name: ' + config.get('name'));

//Morgan Logging
if (app.get('env') === 'development') {
    app.use(morgan('tiny'));
    console.log(`Morgan enabled...`);
}

// MongoDB Connection using config & .env in docker for credentials
const DB_HOST = config.get('database.host');
const connectWithRetry = async () => {
    try {
        await mongoose.connect(DB_HOST, { useNewUrlParser: true, autoReconnect: true, useFindAndModify: false });
        console.log("Connected to MongoDB..");
    } catch (error) {
        console.log(error.message);
        setTimeout(connectWithRetry, 5000);
    }
}
connectWithRetry();


const SERVER_PORT = config.get('server.port') || 5001;
app.listen(SERVER_PORT, () => console.log(`Listening on port ${SERVER_PORT}...`));