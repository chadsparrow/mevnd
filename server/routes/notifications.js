const { Member, validateNotification } = require('../models/Member');
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

// GET /api/notifcations/me
router.get('/me', auth, async (req, res) => {
  const member = await Member.lookup(req.member._id).select('-password -__v -updatedAt');
  res.send(member.notifications);
});

router.post('/', auth, async (req, res) => {
  const { error } = validateNotification(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  for (recipient of req.body.recipients) {
    let member = await Member.findById(recipient);
    if (!member) return res.status(400).send(`Members with a given ID (${recipient}) was not found. Please try again.`);
    const today = new Date();
    const newNotification = {
      date: today,
      message: req.body.message
    };

    member.notifications.push(newNotification);
    await member.save();
  }

  res.send({ msg: 'Notifications pushed' });
});

module.exports = router;
