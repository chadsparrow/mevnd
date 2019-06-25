const { Email, validateEmail } = require('../models/Email');
const { Member } = require('../models/Member');
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const _ = require('lodash');
const mongoose = require('mongoose');

// GET /api/notifcations/me
router.get('/me', auth, async (req, res) => {
  const emails = await Email.find({
    $or: [
      { recipients: { $elemMatch: { member: mongoose.Types.ObjectId(req.member._id) } } },
      { messages: { $elemMatch: { sentBy: mongoose.Types.ObjectId(req.member._id) } } }
    ]
  })
    .populate('sender', 'name email -_id', Member)
    .populate('recipients.member', 'name email -_id', Member)
    .select('-__v -updatedAt');
  res.send(emails);
});

router.post('/', auth, async (req, res) => {
  const { error } = validateEmail(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let recipients = [];

  let sender = await Member.lookup(req.member._id);
  if (!sender) return res.status(400).send(`Sender with a given ID (${req.member._id}) was not found. Please try again.`);

  recipients.push({ member: req.member._id, unread: false });

  for (recipient of req.body.recipients) {
    let member = await Member.lookup(recipient);
    if (!member) return res.status(400).send(`Recipient with a given ID (${recipient}) was not found. Please try again.`);

    recipients.push({ member: recipient });
  }

  const newEmail = new Email({
    sender: req.member._id,
    subject: req.body.subject,
    recipients: recipients
  });

  newEmail.messages.push({ message: req.body.message, date: new Date(), sentBy: req.member._id });

  await newEmail.save();

  res.send({ msg: 'Email Sent!' });
});

router.patch('/toggleread/:id', auth, async (req, res) => {
  let member = await Member.lookup(req.member._id);
  if (!member) return res.status(400).send('Member with the given ID was not found.');

  let email = await Email.findById(req.params.id);
  if (!email) return res.status(400).send(`Email with the given ID was not found.`);

  for (recipient of email.recipients) {
    if (recipient.member == req.member._id) {
      recipient.unread = !recipient.unread;
    }
  }

  email = await email.save();

  res.send(email);
});

router.patch('/archive/:id', auth, async (req, res) => {
  let member = await Member.lookup(req.member._id);
  if (!member) return res.status(400).send('Member with the given ID was not found.');

  let email = await Email.findById(req.params.id);
  if (!email) return res.status(400).send(`Email with the given ID was not found.`);

  for (recipient of email.recipients) {
    if (recipient.member == req.member._id && !recipient.archived) {
      recipient.archived = true;
    } else if (recipient.member == req.member._id && recipient.archived) {
      return res.status(400).send('Email with that ID is already archived.');
    }
  }

  email = await email.save();

  res.send(email);
});

module.exports = router;
