const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const timestamps = require('mongoose-timestamp');

const MemberSchema = new Schema({
    first_name: {
        type: String,
        required: true
    },
    last_name: {
        type: String,
        required: true
    },
    name: {
        type: String
    },
    address1: {
        type: String,
        required: true
    },
    address2: {
        type: String
    },
    city: {
        type: String,
        required: true
    },
    state_prov: {
        type: String,
        required: true
    },
    country: {
        type: String,
        required: true
    },
    zip_postal: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    ship_name: {
        type: String
    },
    ship_address1: {
        type: String
    },
    ship_address2: {
        type: String
    },
    ship_city: {
        type: String
    },
    ship_state_prov: {
        type: String
    },
    ship_country: {
        type: String
    },
    ship_zip_postal: {
        type: String
    },
    ship_phone: {
        type: String
    },
    ship_email: {
        type: String
    },
    timezone: {
        type: String
    },
    avatar_url: {
        type: String,
        default: null
    }
});

MemberSchema.plugin(timestamps);
module.exports = mongoose.model('members', MemberSchema);