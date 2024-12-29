const express = require('express');
const {handleGetAnimal} = require('../controllers/animalController')
const router = express.Router();

router.get('/', handleGetAnimal);

module.exports = router;