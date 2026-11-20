const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');
const { protect } = require('../middleware/auth');
const {
  getServices,
  createService,
  updateService,
  deleteService
} = require('../controllers/serviceController');

const optionalAuth = async (req, res, next) => {
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      const token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'graphic_portfolio_secret');
      const admin = await Admin.findById(decoded.id).select('-password');
      if (admin) req.admin = admin;
    } catch {}
  }
  next();
};

router.get('/', optionalAuth, getServices);
router.post('/', protect, createService);
router.put('/:id', protect, updateService);
router.delete('/:id', protect, deleteService);

module.exports = router;
