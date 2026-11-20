const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const { protect } = require('../middleware/auth');
const {
  getMedia,
  uploadMedia,
  deleteMedia
} = require('../controllers/mediaController');

router.get('/', protect, getMedia);
router.post('/upload', protect, upload.any(), uploadMedia);
router.delete('/:id', protect, deleteMedia);

module.exports = router;
