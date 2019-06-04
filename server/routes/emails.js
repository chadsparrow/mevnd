const express = require("express");
const router = express.Router();

const { Email, validate } = require('../models/Email');
const { Member } = require('../models/Member');

router.get('/:id', async (req, res) => {
  try {
    const emails = await Email.find({ $or: [{ to: req.params.id }, { from: req.params.id }] }).populate('to', '_id name email').populate('from', '_id name email').select('-updatedAt -__v');
    if (emails && emails.length === 0) return res.status(404).send('There are no emails in the database.')
    res.send(emails);
  } catch (err) {
    console.log(err.message);
  }
});

router.get('/read/:id', async (req, res) => {
  try {
    let email = await Email.findById(req.params.id).populate('to', "_id name email").populate('from', '_id name email').select('-updatedAt -__v');
    if (!email) return res.status(400).send('There is no email with the given ID');

    res.send(email);
  } catch (err) {
    console.log(err.message);
  }
})

router.post('/', async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error);

  const { title, message, from, to } = req.body;
  const newEmail = new Email({
    title,
    message,
    from,
    to
  });

  try {
    const savedEmail = await newEmail.save();
    for (recipient of savedEmail.to) {
      const user = await Member.findById(recipient);
      user.email.push(savedEmail._id);
      await user.save();
    }

    res.send({ msg: "Email Sent." });
  } catch (err) {
    console.log(err.message);
  }
});

module.exports = router;