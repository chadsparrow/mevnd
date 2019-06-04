const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');

const {
  Member,
  validateMember,
  validateEmail,
  validatePassword
} = require('../models/Member');

// GET /api/member
router.get('/', async (req, res) => {
  try {
    const members = await Member.find().select('-password -__v -updatedAt');
    if (members && members.length === 0)
      return res.send({ msg: 'There are no members in the database.' });
    res.send(members);
  } catch (err) {
    console.log(err);
  }
});

// GET /api/members/:id
router.get('/:id', async (req, res) => {
  try {
    const member = await Member.lookup(req.params.id).select(
      '-pass -__v -updateAt'
    );
    if (!member)
      return res
        .status(404)
        .send({ msg: 'Member with the given ID was not found.' });
    res.send(member);
  } catch (err) {
    console.log(err);
  }
});

// POST /api/members
router.post('/', async (req, res) => {
  const { error } = validateMember(req.body);
  if (error) return res.status(400).send(error);

  try {
    const {
      name,
      address1,
      address2,
      city,
      state_prov,
      country,
      zip_postal,
      phone,
      email,
      password,
      shipping_same,
      shipping_name,
      shipping_address1,
      shipping_address2,
      shipping_city,
      shipping_state_prov,
      shipping_country,
      shipping_zip_postal,
      shipping_phone,
      shipping_email
    } = req.body;

    const member = await Member.findOne({ email });
    if (member)
      return res
        .status(400)
        .send({ msg: 'Member already registered with given email address.' });

    const newMember = new Member({
      name,
      address1,
      address2,
      city,
      state_prov,
      country,
      zip_postal,
      phone,
      email,
      password,
      shipping_same,
      shipping_name,
      shipping_address1,
      shipping_address2,
      shipping_city,
      shipping_state_prov,
      shipping_country,
      shipping_zip_postal,
      shipping_phone,
      shipping_email
    });

    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(newMember.password, salt, async (err, hash) => {
        newMember.password = hash;
        //save new member to the database and send result back
        await newMember.save();
        res.status(201).send({ msg: `${newMember.email} added as a member.` });
      });
    });
  } catch (err) {
    console.log(err);
  }
});

// PUT /api/members/:id
router.put('/:id', async (req, res) => {
  const { error } = validateMember(req.body);
  if (error) return res.status(400).send(error);

  try {
    delete req.body.password;
    delete req.body.email;

    const member = await Member.findByIdAndUpdate(
      { _id: req.params.id },
      req.body,
      { new: true }
    );
    if (!member)
      return res
        .status(404)
        .send({ msg: 'Member with the given ID was not found.' });

    res.send({ msg: `${member.email} has been updated.` });
  } catch (err) {
    console.log(err);
  }
});

// PATCH /api/members/email/:id
router.patch('/email/:id', async (req, res) => {
  const { error } = validateEmail(req.body);
  if (error) return res.status(400).send(error);

  try {
    let member = await Member.lookup(req.params.id);
    if (!member)
      return res
        .status(404)
        .send({ msg: 'Member with the given ID was not found.' });

    if (member.email === req.body.email) {
      return res
        .status(400)
        .send({ msg: 'Password is identical to what is already set.' });
    }

    const emailCheck = await Member.findOne({
      _id: { $ne: req.params.id },
      email: req.body.email
    });
    if (emailCheck)
      return res.status(400).send({
        msg: 'Member with the given email address already registered'
      });

    member = await Member.findByIdAndUpdate(
      { _id: req.params.id },
      { email: req.body.email },
      { new: true }
    );

    res.send({
      msg: `${member.name} email address updated to ${member.email}`
    });
  } catch (err) {
    console.log(err);
  }
});

// PATCH /api/members/password/:id
router.patch('/password/:id', async (req, res) => {
  const { error } = validatePassword(req.body);
  if (error) return res.status(400).send(error);

  try {
    if (req.body.newpassword === req.body.oldpassword)
      return res
        .status(400)
        .send({ msg: 'Old and New Passwords cannot match.' });

    const member = await Member.lookup(req.params.id);
    if (!member)
      return res
        .status(404)
        .send({ msg: 'Member with the given ID was not found.' });

    bcrypt.compare(req.body.oldpassword, member.password, (err, result) => {
      if (!result) return res.status(400).send({ msg: 'Password incorrect.' });

      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(req.body.newpassword, salt, async (err, hash) => {
          member.password = hash;
          await member.save();
          res.send({ msg: `Password has been updated.` });
        });
      });
    });
  } catch (err) {
    console.log(err);
  }
});

// DELETE /api/members/:id
router.delete('/:id', async (req, res) => {
  try {
    const member = await Member.findByIdAndRemove(req.params.id);
    if (!member)
      return res
        .status(400)
        .send({ msg: 'Member with the given ID was not found.' });
    res.send({ msg: `${member.email} was removed.` });
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;
