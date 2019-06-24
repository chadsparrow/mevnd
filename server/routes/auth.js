const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const Joi = require('@hapi/joi');

const { Member } = require('../models/Member');

// POST /api/members
router.post('/', async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const member = await Member.findOne({ email: req.body.email });
  if (!member) return res.status(400).send('Invalid email or password.');

  const validPassword = await bcrypt.compare(req.body.password, member.password);
  if (!validPassword) return res.status(400).send('Invalid email or password');

  const token = member.generateAuthToken();
  res.send(token);
});

function validate(req) {
  const schema = {
    email: Joi.string()
      .email()
      .required({ minDomainSegments: 2 }),
    password: Joi.string()
      .min(8)
      .required()
      .trim(false)
  };

  return Joi.validate(req, schema);
}

module.exports = router;
