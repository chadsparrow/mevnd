const mongoose = require('mongoose');
const timestamps = require('mongoose-timestamp');
const Joi = require('@hapi/joi');
Joi.objectId = require('joi-objectid')(Joi);

const EmailSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  message: {
    type: String,
    required: true,
    trim: true
  },
  from: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'members'
  },
  to: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'members'
  }]

});

function validateEmail(email) {
  const schema = {
    title: Joi.string().min(5).max(255).required().trim(true),
    message: Joi.string().min(5).max(1000).required().trim(true),
    from: Joi.objectId().required(),
    to: Joi.array().items(Joi.objectId()),
    read: Joi.boolean()
  }
  return Joi.validate(email, schema);
}

EmailSchema.plugin(timestamps);
exports.Email = mongoose.model('emails', EmailSchema);
exports.validate = validateEmail;