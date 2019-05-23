const mongoose = require('mongoose');
const timestamps = require('mongoose-timestamp');

const MemberSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 50,
        uppercase: true
    },
    address1: {
        type: String,
        required: true,
        minlength: 10,
        uppercase: true
    },
    address2: {
        type: String,
        uppercase: true
    },
    city: {
        type: String,
        required: true,
        uppercase: true
    },
    state_prov: {
        type: String,
        required: true,
        uppercase: true,
        minlength: 2
    },
    country: {
        type: String,
        required: true,
        uppercase: true
    },
    zip_postal: {
        type: String,
        required: true,
        uppercase: true,
        minlength: 5
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
    shipping_same: {
        type: Boolean,
        default: true
    },
    shipping_name: {
        type: String,
        required: function () { return this.shipping_same; },
        minlength: 5,
        uppercase: true
    },
    shipping_address1: {
        type: String,
        required: function () { return this.shipping_same },
        minlength: 10,
        uppercase: true
    },
    shipping_address2: {
        type: String,
        uppercase: true
    },
    shipping_city: {
        type: String,
        uppercase: true,
        required: function () { return this.shipping_same }
    },
    shipping_state_prov: {
        type: String,
        uppercase: true,
        required: function () { return this.shipping_same },
        minlength: 2
    },
    shipping_country: {
        type: String,
        uppercase: true,
        required: function () { return this.shipping_same }
    },
    shipping_zip_postal: {
        type: String,
        uppercase: true,
        required: function () { return this.shipping_same },
        minlength: 5
    },
    shipping_phone: {
        type: String,
        required: function () { return this.shipping_same }
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