const { Member, validateNotification } = require('../models/Member');
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

// GET /api/notifcations/me
router.get('/me', auth, async (req, res) => {
  const member = await Member.lookup(req.member._id);
  res.send(member.notifications);
});

router.post('/', auth, async (req, res) => {
  const { error } = validateNotification(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  for (recipient of req.body.recipients) {
    let member = await Member.lookup(recipient);
    if (!member) return res.status(400).send(`Members with a given ID (${recipient}) was not found. Please try again.`);

    const today = new Date();
    const newNotification = {
      date: today,
      message: req.body.message,
      clickTo: req.body.clickTo
    };

    member.notifications.push(newNotification);
    await member.save();
  }

  res.end();
});

router.delete('/:id', auth, async (req, res) => {
  let member = await Member.lookup(req.member._id);
  if (!member) return res.status(400).send('Member with the given ID was not found.');

  let notifications = member.notifications;

  notifications = notifications.filter(n => {
    return n._id != req.params.id;
  });

  member.notifications = notifications;
  await member.save();

  res.send(member.notifications);
});

router.get('/clear', auth, async (req, res) => {
  let member = await Member.lookup(req.member._id);
  if (!member) return res.status(400).send('Member with the given ID was not found.');

  member.notifications = [];
  await member.save();

  res.send(member.notifications);
});

module.exports = router;
