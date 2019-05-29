const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");

const { Member, validateMember, validateEmail, validatePassword } = require("../models/Member");

// GET /api/member
router.get("/", async (req, res) => {
  try {
    const members = await Member.find();
    if (!members) return res.status(204).send('No Members were found.')
    res.send(members);
  } catch (error) {
    console.log(error.message);
  }
});

// GET /api/members/:id
router.get("/:id", async (req, res) => {
  try {
    const member = await Member.lookup(req.params.id);
    if (!member) return res.status(404).send("Member with the given ID was not found.");
    res.send(member);
  } catch (error) {
    console.log(error.message)
  }
});

// POST /api/members
router.post("/", async (req, res) => {
  //Check for validation errors
  const { error } = validateMember(req.body);
  if (error) return res.status(400).send(error);

  // desctructure the req.body
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
  } = req.body

  // Check if member already exists
  try {
    const member = await Member.findOne({ email });
    if (member) return res.status(400).send('Member already registered with given email address.');

    // Create new member object
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
        res.status(201).send(`${newMember.email} added as a member.`);
      });
    });

  } catch (error) {
    console.log(error.message);
  }
});

// PUT /api/members/:id
router.put("/:id", async (req, res) => {
  const { error } = validateMember(req.body);
  if (error) return res.status(400).send(error);

  delete req.body.password;
  delete req.body.email;

  try {
    const member = await Member.findByIdAndUpdate({ _id: req.params.id }, req.body, { new: true });
    if (!member) return res.status(404).send('Member with the given ID was not found.');

    res.send(`${member.email} has been updated.`)
  } catch (error) {
    console.log(error.message);
  }
});

// PATCH /api/members/email/:id
router.patch("/email/:id", async (req, res) => {
  const { error } = validateEmail(req.body);
  if (error) return res.status(400).send(error);

  try {
    let member = await Member.lookup(req.params.id);
    if (!member) return res.status(404).send('Member with the given ID was not found.');

    if (member.email === req.body.email) {
      return res.status(400).send('Password is identical to what is already set.');
    }

    const emailCheck = await Member.findOne({ _id: { $ne: req.params.id }, email: req.body.email });
    if (emailCheck) return res.status(400).send('Member with the given email address already registered');

    member = await Member.findByIdAndUpdate({ _id: req.params.id }, { email: req.body.email }, { new: true });

    res.send(`${member.name} email address updated to ${member.email}`);

  } catch (error) {
    console.log(error.message);
  }
})

// PATCH /api/members/password/:id
router.patch("/password/:id", async (req, res) => {
  const { error } = validatePassword(req.body);
  if (error) return res.status(400).send(error);

  if (req.body.newpassword === req.body.oldpassword) return res.status(400).send('Old and New Passwords cannot match.')

  try {
    const member = await Member.lookup(req.params.id);
    if (!member) return res.status(404).send('Member with the given ID was not found.');

    bcrypt.compare(req.body.oldpassword, member.password, (err, result) => {
      if (!result) return res.status(400).send('Password incorrect.');

      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(req.body.newpassword, salt, async (err, hash) => {
          member.password = hash;
          await member.save();
          res.send(`Password has been updated.`);
        });
      });
    });
  } catch (error) {
    console.log(error.message);
  }
})

// DELETE /api/members/:id
router.delete("/:id", async (req, res) => {
  try {
    const member = await Member.findByIdAndRemove(req.params.id);
    if (!member) return res.status(400).send('Member with the given ID was not found.')
    res.send(`${member.email} was removed.`);
  } catch (error) {
    console.log(error.message);
  }
});

module.exports = router;