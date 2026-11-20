const WebsiteSettings = require('../models/WebsiteSettings');

// @desc    Get website settings
// @route   GET /api/settings
// @access  Public
const getSettings = async (req, res, next) => {
  try {
    let settings = await WebsiteSettings.findOne();
    if (!settings) {
      settings = await WebsiteSettings.create({
        websiteName: 'Studio Rivera — Graphic Design & Art Direction',
        designerName: 'Alex Rivera',
        email: 'hello@riveradesign.studio',
        phone: '+1 (555) 382-9401',
        whatsapp: '+15553829401',
        address: 'New York, USA & Available Worldwide',
        instagramUrl: 'https://instagram.com',
        behanceUrl: 'https://behance.net',
        dribbbleUrl: 'https://dribbble.com',
        linkedinUrl: 'https://linkedin.com',
        footerText: 'Crafted with precision, passion, and artistic dedication.',
        heroHeadline: 'Creative Designs That Make Brands Stand Out.',
        heroSubheadline: 'Visual identity, editorial posters, packaging, and digital design crafted with intention, timeless aesthetics, and high-impact visual storytelling.'
      });
    }

    res.status(200).json({
      success: true,
      settings
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update website settings
// @route   PUT /api/settings
// @access  Private
const updateSettings = async (req, res, next) => {
  try {
    let settings = await WebsiteSettings.findOne();

    if (!settings) {
      settings = await WebsiteSettings.create(req.body);
    } else {
      settings = await WebsiteSettings.findByIdAndUpdate(settings._id, req.body, {
        new: true,
        runValidators: true
      });
    }

    res.status(200).json({
      success: true,
      message: 'Website settings updated successfully',
      settings
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getSettings,
  updateSettings
};
