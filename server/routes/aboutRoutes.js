const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { getAbout, updateAbout } = require('../controllers/aboutController');

router.get('/', getAbout);
router.put('/', protect, updateAbout);

module.exports = router;
