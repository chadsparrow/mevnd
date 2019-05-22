const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const router = express.Router();
const Member = require("../../models/Member");

router.get("/", async (req, res) => {
  const members = await Member.find();
  res.send(members);
});

router.get("/:id", async (req, res) => {
  try {
    const foundMember = await Member.findOne({ _id: req.params.id });
    if (foundMember) {
      return res.status(200).send(foundMember);
    }
    res.status(404).send("Member not found!");
  } catch (error) {
    res.status(500).send("Server Error");
  }
  res.send(`GET Members ${req.params.id}`)
});

router.post("/", async (req, res) => {
  const {
    first_name,
    last_name,
    address1,
    city,
    state_prov,
    country,
    zip_postal,
    phone,
    email,
    password
  } = req.body

  try {
    const member = await Member.findOne({ email });
    if (member) {
      return res.status(400).send("Member already on file.")
    } else {
      const newUser = new Member({
        first_name,
        last_name,
        address1,
        city,
        state_prov,
        country,
        zip_postal,
        phone,
        email,
        password
      });

      const savedUser = await newUser.save();
      console.log(savedUser);
      return res.status(201).send(`Member has been added: ${savedUser.email}`)
    }
  } catch (error) {
    console.log(error)
    return res.status(500).send(`Server Error`);
  }
});

router.put("/:id", (req, res) => {
  res.send(`EDIT Member ${req.params.id}`)
})

router.delete("/:id", async (req, res) => {
  try {
    const deletedMember = await Member.findOneAndRemove({ _id: req.params.id });
    if (deletedMember) {
      return res.status(200).send(deletedMember);
    }
    res.status(404).send("Member not Found!");
  } catch (error) {
    console.log (error);
    res.status(500).send("Server Error");
  }
})

module.exports = router;