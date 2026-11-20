const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { getOverviewStats } = require('../controllers/dashboardController');

router.get('/stats', protect, getOverviewStats);

module.exports = router;
