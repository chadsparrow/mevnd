const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const Joi = require('@hapi/joi');

const Member = require("../models/Member");

// GET /api/member
router.get("/", async (req, res) => {
  try {
    const members = await Member.find();
    if (!members) res.status(404).send('No Members were found.')
    res.send(members);
  } catch (error) {
    console.log(error.message);
  }
});

// GET /api/members/:id
router.get("/:id", async (req, res) => {
  try {
    const member = await Member.findOne({ _id: req.params.id });
    if (!member) res.status(404).send("Member with the given ID was not found.");
    res.status(200).send(member);
  } catch (error) {
    console.log(error.message)
  }
});

// POST /api/members
router.post("/", async (req, res) => {
  //Check for validation errors
  const { error } = validateMember(req.body);
  if (error) return res.status(400).send(error.details[0].message);

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
    const result = await Member.findOne({ email });
    if (result) return res.status(400).send('Member already registered with given email address.');

    // Create new member object
    let member = new Member({
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

    //save new member to the database and send result back
    member = await member.save();
    res.status(201).send(`${member.email} added as a member.`);
  } catch (error) {
    console.log(error.message);
  }
});

// PUT /api/members/:id
router.put("/:id", async (req, res) => {
  const { error } = validateMember(req.body);

  delete req.body.password;
  delete req.body.email;

  if (error) return res.status(400).send(error.details[0].message);

  try {
    const member = await Member.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!member) return res.status(404).send('Member with the given ID was not found.');

    res.status(200).send(`${member.email} has been updated.`)
  } catch (error) {
    console.log(error.message);
  }
});

// DELETE /api/members/:id
router.delete("/:id", async (req, res) => {
  try {
    const deletedMember = await Member.findOneAndRemove({ _id: req.params.id });
    if (deletedMember) {
      return res.status(200).send(`${deletedMember}.email was removed.`);
    }
    res.status(404).send("Member with the given ID was not found.");
  } catch (error) {
    console.log(error.message);
  }
});

function validateMember(member) {
  const schema = {
    name: Joi.string().min(5).max(50).required(),
    address1: Joi.string().min(10).required(),
    address2: Joi.string(),
    city: Joi.string().required(),
    state_prov: Joi.string().min(2).required(),
    country: Joi.string().required(),
    zip_postal: Joi.string().required(),
    phone: Joi.string().required(),
    email: Joi.string().email().required({ minDomainSegments: 2 }),
    password: Joi.string().min(8).required(),
    shipping_same: Joi.boolean().required(),
    shipping_name: Joi.string().min(5).max(50).required(),
    shipping_address1: Joi.string().min(10).required(),
    shipping_address2: Joi.string(),
    shipping_city: Joi.string().required(),
    shipping_state_prov: Joi.string().min(2).required(),
    shipping_country: Joi.string().required(),
    shipping_zip_postal: Joi.string().required(),
    shipping_phone: Joi.string().required()
  }
  return Joi.validate(member, schema);
}

module.exports = router;