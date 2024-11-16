const express = require('express');
const { handleImage } = require('../controllers/imageController');
const imageRouter = express.Router();

imageRouter.route('/')
.get(handleImage);
module.exports = imageRouter;