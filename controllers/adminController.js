const path = require('path');
const fs = require('fs');
const mongoose = require('mongoose');
const animaldb = require('../models/animals');
const handleAdminPost = async (req, res) => {
  const textField = req.body;  // Extract the text data
  const image = req.file;  // Extract the uploaded image data
  if (!textField || !image) {
    return res.status(400).json({ error: 'Both text and image are required.' });
  }
  if(textField.auth!='aktu'){
    return res.status(400).json({ error: 'Both text and image are required.' });
  }
  await animaldb.create({
    name:textField.name,
    species: textField.species,
    age: textField.age,
    img: `${image.filename}`,
    description: textField.description,
    adopted: textField.adopt,
  });
  // Optionally, you can process or store the text and image in a database

  res.json({
    message: 'Form submitted successfully',
    text: textField,
    imageUrl: `/uploads/${image.filename}`  // URL to access the uploaded image
  });
};

module.exports = {
  handleAdminPost
};
