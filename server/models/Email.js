const mongoose = require('mongoose');
const timestamps = require('mongoose-timestamp');
const Joi = require('@hapi/joi');

const EmailSchema = new mongoose.Schema({
  recipients: [
    {
      _id: false,
      member: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Member'
      },
      unread: {
        type: Boolean,
        default: true
      },
      archived: {
        type: Boolean,
        default: false
      }
    }
  ],
  subject: {
    type: String,
    required: true,
    trim: true,
    maxlength: 255
  },
  messages: [
    {
      message: {
        type: String,
        required: true
      },
      date: {
        type: Date,
        required: true
      },
      sentBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Member'
      }
    }
  ]
});

function validateEmail(email) {
  const schema = {
    recipients: Joi.array()
      .required()
      .items(Joi.objectId().required()),
    subject: Joi.string().required(),
    message: Joi.string().required()
  };
  return Joi.validate(email, schema);
}

EmailSchema.plugin(timestamps);
exports.Email = mongoose.model('emails', EmailSchema);
exports.validateEmail = validateEmail;
