const express = require('express');
const router = express.Router();
const imageController = require('../controllers/imageController');
const upload = require('../utils/upload');

router.get('/capture', imageController.captureImage);
router.post('/upload', upload.single('image'), imageController.uploadImage);
router.post('/addImageLink', imageController.addImageLink);

module.exports = router;