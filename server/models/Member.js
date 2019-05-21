const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const timestamps = require('mongoose-timestamp');

const MemberSchema = new Schema({
    member_first_name: {
        type: String,
        required: true
    },
    member_last_name: {
        type: String,
        required: true
    },
    member_name: {
        type: String
    },
    member_address1: {
        type: String,
        required: true
    },
    member_address2: {
        type: String
    },
    member_city: {
        type: String,
        required: true
    },
    member_state_prov: {
        type: String,
        required: true
    },
    member_country: {
        type: String,
        required: true
    },
    member_zip_postal: {
        type: String,
        required: true
    },
    member_phone: {
        type: String,
        required: true
    },
    member_email: {
        type: String,
        required: true
    },
    member_ship_name: {
        type: String
    },
    member_ship_address1: {
        type: String
    },
    member_ship_address2: {
        type: String
    },
    member_ship_city: {
        type: String
    },
    member_ship_state_prov: {
        type: String
    },
    member_ship_country: {
        type: String
    },
    member_ship_zip_postal: {
        type: String
    },
    member_ship_phone: {
        type: String
    },
    member_ship_email: {
        type: String
    },
    member_timezone: {
        type: String
    },
    member_avatar_url: {
        type: String,
        default: null
    }
});

MemberSchema.plugin(timestamps);
module.exports = mongoose.model('members', MemberSchema);