const mongoose = require('mongoose');
const timestamps = require('mongoose-timestamp');
const Joi = require('@hapi/joi');

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
        default: false
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
    },
    resetPasswordToken: {
        type: String
    },
    resetPasswordExpires: {
        type: Date
    }
});

MemberSchema.statics.lookup = function (memberId) {
    return this.findOne({
        _id: memberId
    });
}

function validateMember(member) {
    const schema = {
        name: Joi.string().min(5).max(50).required(),
        address1: Joi.string().min(10).required(),
        address2: Joi.string(),
        city: Joi.string().required(),
        state_prov: Joi.string().min(2).required(),
        country: Joi.string().required(),
        zip_postal: Joi.string().required(),
        phone: Joi.string().required(),
        email: Joi.string().email().required({ minDomainSegments: 2 }),
        password: Joi.string().min(8).required(),
        shipping_same: Joi.boolean(),
        shipping_name: Joi.string().min(5).max(50).required(),
        shipping_address1: Joi.string().min(10).required(),
        shipping_address2: Joi.string(),
        shipping_city: Joi.string().required(),
        shipping_state_prov: Joi.string().min(2).required(),
        shipping_country: Joi.string().required(),
        shipping_zip_postal: Joi.string().required(),
        shipping_phone: Joi.string().required()
    }
    return Joi.validate(member, schema);
}

function validateEmail(member) {
    const schema = {
        email: Joi.string().email().required({ minDomainSegments: 2 })
    }

    return Joi.validate(member, schema);
}
function validatePassword(member) {
    const schema = {
        oldpassword: Joi.string().min(8).required(),
        newpassword: Joi.string().min(8).required()
    }

    return Joi.validate(member, schema);
}

MemberSchema.plugin(timestamps);
exports.Member = mongoose.model('members', MemberSchema);
exports.validateMember = validateMember;
exports.validateEmail = validateEmail;
exports.validatePassword = validatePassword;