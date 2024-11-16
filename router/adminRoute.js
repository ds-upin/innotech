const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const { handleAdminPost } = require('../controllers/adminController');

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../Images'); 
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir);
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const fileExtension = path.extname(file.originalname); 
    const filename = Date.now() + fileExtension; 
    cb(null, filename); 
  }
});

const upload = multer({ storage });
const AUTH_CODE = 'qwXll@23sn';
router.post('/', (req, res, next) => {
  console.log(req.body);
  
  upload.single('image')(req, res, next);
}, handleAdminPost)
.get('/', (req, res) => res.render('adminForm'));

module.exports = router;