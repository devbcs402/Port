const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');
const upload = require('../middleware/upload');
const { protect } = require('../middleware/auth');
const {
  getProjects,
  getFeaturedProjects,
  getProjectBySlug,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
  togglePublish,
  toggleFeatured
} = require('../controllers/projectController');

// Optional auth helper: attaches admin if valid token present, but doesn't block public
const optionalAuth = async (req, res, next) => {
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      const token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'graphic_portfolio_secret');
      const admin = await Admin.findById(decoded.id).select('-password');
      if (admin) {
        req.admin = admin;
      }
    } catch {
      // Ignore token failure for public access
    }
  }
  next();
};

const projectUpload = upload.fields([
  { name: 'cover', maxCount: 1 },
  { name: 'gallery', maxCount: 15 }
]);

router.get('/', optionalAuth, getProjects);
router.get('/featured', getFeaturedProjects);
router.get('/slug/:slug', optionalAuth, getProjectBySlug);
router.get('/:id', protect, getProjectById);

router.post('/', protect, projectUpload, createProject);
router.put('/:id', protect, projectUpload, updateProject);
router.delete('/:id', protect, deleteProject);
router.patch('/:id/toggle-publish', protect, togglePublish);
router.patch('/:id/toggle-featured', protect, toggleFeatured);

module.exports = router;
