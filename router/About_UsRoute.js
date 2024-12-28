const express = require('express');
const router = express.Router();
const {handleGetAboutUs} = require('../controllers/about_usController');

router.get('/',handleGetAboutUs);

module.exports = router;