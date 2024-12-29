const express = require('express');
const router = express.Router();
const {handleGetAdopt} = require('../controllers/adoptController');

router.get('/:id',handleGetAdopt);

module.exports = router;