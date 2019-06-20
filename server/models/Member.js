const mongoose = require('mongoose');
const timestamps = require('mongoose-timestamp');
const Joi = require('@hapi/joi');
const config = require('config');
const jwt = require('jsonwebtoken');

const MemberSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 50,
    uppercase: true,
    trim: true
  },
  address1: {
    type: String,
    required: true,
    minlength: 10,
    uppercase: true,
    trim: true
  },
  address2: {
    type: String,
    uppercase: true,
    trim: true
  },
  city: {
    type: String,
    required: true,
    uppercase: true,
    trim: true
  },
  state_prov: {
    type: String,
    required: true,
    uppercase: true,
    minlength: 2,
    trim: true
  },
  country: {
    type: String,
    required: true,
    uppercase: true,
    trim: true
  },
  zip_postal: {
    type: String,
    required: true,
    uppercase: true,
    minlength: 5,
    trim: true
  },
  phone: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    trim: true,
    unique: true
  },
  password: {
    type: String,
    required: true,
    trim: true
  },
  shipping_same: {
    type: Boolean,
    default: false
  },
  shipping_name: {
    type: String,
    required: function() {
      return this.shipping_same;
    },
    minlength: 5,
    uppercase: true,
    trim: true
  },
  shipping_address1: {
    type: String,
    required: function() {
      return this.shipping_same;
    },
    minlength: 10,
    uppercase: true,
    trim: true
  },
  shipping_address2: {
    type: String,
    uppercase: true,
    trim: true
  },
  shipping_city: {
    type: String,
    uppercase: true,
    required: function() {
      return this.shipping_same;
    },
    trim: true
  },
  shipping_state_prov: {
    type: String,
    uppercase: true,
    required: function() {
      return this.shipping_same;
    },
    minlength: 2,
    trim: true
  },
  shipping_country: {
    type: String,
    uppercase: true,
    required: function() {
      return this.shipping_same;
    },
    trim: true
  },
  shipping_zip_postal: {
    type: String,
    uppercase: true,
    required: function() {
      return this.shipping_same;
    },
    minlength: 5,
    trim: true
  },
  shipping_phone: {
    type: String,
    required: function() {
      return this.shipping_same;
    },
    trim: true
  },
  timezone: {
    type: String,
    trim: true
  },
  avatar_url: {
    type: String,
    default: null,
    trim: true
  },
  admin: {
    type: Boolean,
    default: false
  },
  resetPasswordToken: {
    type: String
  },
  resetPasswordExpires: {
    type: Date
  }
});

MemberSchema.statics.lookup = function(memberId) {
  return this.findOne({ _id: memberId });
};

function validateMember(member) {
  const schema = {
    name: Joi.string()
      .min(5)
      .max(50)
      .required()
      .trim(true),
    address1: Joi.string()
      .min(10)
      .required()
      .trim(true),
    address2: Joi.string()
      .trim(true)
      .allow('', null),
    city: Joi.string()
      .required()
      .trim(true),
    state_prov: Joi.string()
      .min(2)
      .required()
      .trim(true),
    country: Joi.string()
      .required()
      .trim(true),
    zip_postal: Joi.string()
      .required()
      .trim(true),
    phone: Joi.string()
      .required()
      .trim(true),
    email: Joi.string()
      .email()
      .required({ minDomainSegments: 2 }),
    password: Joi.string()
      .min(8)
      .required()
      .trim(false),
    shipping_same: Joi.boolean(),
    shipping_name: Joi.string()
      .min(5)
      .max(50)
      .required()
      .trim(true),
    shipping_address1: Joi.string()
      .min(10)
      .required()
      .trim(true),
    shipping_address2: Joi.string()
      .trim(true)
      .allow('', null),
    shipping_city: Joi.string()
      .required()
      .trim(true),
    shipping_state_prov: Joi.string()
      .min(2)
      .required()
      .trim(true),
    shipping_country: Joi.string()
      .required()
      .trim(true),
    shipping_zip_postal: Joi.string()
      .required()
      .trim(true),
    shipping_phone: Joi.string()
      .required()
      .trim(true)
  };
  return Joi.validate(member, schema);
}

function validateUpdate(member) {
  const schema = {
    name: Joi.string()
      .min(5)
      .max(50)
      .required()
      .trim(true),
    address1: Joi.string()
      .min(10)
      .required()
      .trim(true),
    address2: Joi.string()
      .trim(true)
      .allow('', null),
    city: Joi.string()
      .required()
      .trim(true),
    state_prov: Joi.string()
      .min(2)
      .required()
      .trim(true),
    country: Joi.string()
      .required()
      .trim(true),
    zip_postal: Joi.string()
      .required()
      .trim(true),
    phone: Joi.string()
      .required()
      .trim(true),
    shipping_same: Joi.boolean(),
    shipping_name: Joi.string()
      .min(5)
      .max(50)
      .required()
      .trim(true),
    shipping_address1: Joi.string()
      .min(10)
      .required()
      .trim(true),
    shipping_address2: Joi.string()
      .trim(true)
      .allow('', null),
    shipping_city: Joi.string()
      .required()
      .trim(true),
    shipping_state_prov: Joi.string()
      .min(2)
      .required()
      .trim(true),
    shipping_country: Joi.string()
      .required()
      .trim(true),
    shipping_zip_postal: Joi.string()
      .required()
      .trim(true),
    shipping_phone: Joi.string()
      .required()
      .trim(true)
  };
  return Joi.validate(member, schema);
}

function validateEmail(member) {
  const schema = {
    email: Joi.string()
      .email()
      .required({ minDomainSegments: 2 })
  };

  return Joi.validate(member, schema);
}

function validatePassword(member) {
  const schema = {
    oldpassword: Joi.string()
      .min(8)
      .required()
      .trim(false),
    newpassword: Joi.string()
      .min(8)
      .required()
      .trim(false),
    confirmpassword: Joi.string()
      .valid(Joi.ref('newpassword'))
      .required()
      .options({ language: { any: { allowOnly: 'New Password and Confirm Passwords must match.' } } })
  };

  return Joi.validate(member, schema);
}

MemberSchema.methods.generateAuthToken = function() {
  const token = jwt.sign({ _id: this._id }, config.get('jwtPrivateKey'));
  return token;
};

MemberSchema.plugin(timestamps);
exports.Member = mongoose.model('members', MemberSchema);
exports.validateMember = validateMember;
exports.validateUpdate = validateUpdate;
exports.validateEmail = validateEmail;
exports.validatePassword = validatePassword;
