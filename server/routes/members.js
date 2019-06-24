const _ = require('lodash');
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

const { Member, validateMember, validateUpdate, validateEmail, validatePassword } = require('../models/Member');

// GET /api/members
router.get('/', auth, async (req, res) => {
  const members = await Member.find().select('-password -__v -updatedAt -admin');
  if (members && members.length === 0) return res.send({ msg: 'There are no members in the database.' });
  res.send(members);
});

// GET /api/members/me
router.get('/me', auth, async (req, res) => {
  const member = await Member.findById(req.member._id).select('-password -__v -updatedAt');
  res.send(member);
});

// GET /api/members/:id
router.get('/:id', auth, async (req, res) => {
  const member = await Member.lookup(req.params.id).select('-__v -password -updatedAt -admin');
  if (!member) return res.status(404).send({ msg: 'Member with the given ID was not found.' });
  res.send(member);
});

// POST /api/members
router.post('/', async (req, res) => {
  const { error } = validateMember(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let member = await Member.findOne({ email: req.body.email });
  if (member) return res.status(400).send({ msg: 'Member already registered.' });

  member = new Member(
    _.pick(req.body, [
      'name',
      'address1',
      'address2',
      'city',
      'state_prov',
      'country',
      'zip_postal',
      'phone',
      'email',
      'password',
      'shipping_same',
      'shipping_name',
      'shipping_address1',
      'shipping_address2',
      'shipping_city',
      'shipping_state_prov',
      'shipping_country',
      'shipping_zip_postal',
      'shipping_phone'
    ])
  );

  const salt = await bcrypt.genSalt(10);
  member.password = await bcrypt.hash(member.password, salt);
  await member.save();

  const token = member.generateAuthToken();
  res.header('x-auth-token', token).send(_.pick(member, ['_id', 'name', 'email']));
});

// PUT /api/members/:id
router.put('/:id', auth, async (req, res) => {
  const { error } = validateUpdate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const member = await Member.findByIdAndUpdate({ _id: req.params.id }, req.body, { new: true });

  if (!member) return res.status(404).send({ msg: 'Member with the given ID was not found.' });

  res.send(_.pick(member, ['_id', 'name', 'email']));
});

// PATCH /api/members/email/:id
router.patch('/email/:id', auth, async (req, res) => {
  const { error } = validateEmail(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let member = await Member.lookup(req.params.id);
  if (!member) return res.status(404).send({ msg: 'Member with the given ID was not found.' });

  if (member.email === req.body.email) {
    return res.status(400).send({ msg: 'Email is identical to what is already set.' });
  }

  const emailCheck = await Member.findOne({
    _id: { $ne: req.params.id },
    email: req.body.email
  });

  if (emailCheck) {
    return res.status(400).send({ msg: 'Member with the given email address already registered' });
  }

  member = await Member.findByIdAndUpdate({ _id: req.params.id }, { email: req.body.email }, { new: true });

  res.send(_.pick(member, ['_id', 'name', 'email']));
});

// PATCH /api/members/password/:id
router.patch('/password/:id', auth, async (req, res) => {
  const { error } = validatePassword(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  if (req.body.newpassword === req.body.oldpassword) return res.status(400).send({ msg: 'Please ensure new password is different.' });

  let member = await Member.lookup(req.params.id);
  if (!member) return res.status(404).send({ msg: 'Member with the given ID was not found.' });

  bcrypt.compare(req.body.oldpassword, member.password, (err, result) => {
    if (!result) return res.status(400).send({ msg: 'Password incorrect.' });

    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(req.body.newpassword, salt, async (err, hash) => {
        member.password = hash;
        await member.save();
        res.send(_.pick(member, ['_id', 'name', 'email']));
      });
    });
  });
});

// DELETE /api/members/:id
router.delete('/:id', [auth, admin], async (req, res) => {
  const member = await Member.findByIdAndRemove(req.params.id);
  if (!member) return res.status(400).send({ msg: 'Member with the given ID was not found.' });
  res.send(_.pick(member, ['_id', 'name', 'email']));
});

module.exports = router;
