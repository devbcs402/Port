const Project = require('../models/Project');
const Category = require('../models/Category');
const Contact = require('../models/Contact');
const Media = require('../models/Media');

// @desc    Get dashboard statistics overview
// @route   GET /api/dashboard/stats
// @access  Private
const getOverviewStats = async (req, res, next) => {
  try {
    const [
      totalProjects,
      publishedProjects,
      draftProjects,
      featuredProjects,
      totalCategories,
      totalMedia,
      totalContacts,
      unreadContacts,
      recentProjects,
      recentContacts,
      categories
    ] = await Promise.all([
      Project.countDocuments(),
      Project.countDocuments({ isPublished: true }),
      Project.countDocuments({ isPublished: false }),
      Project.countDocuments({ isFeatured: true }),
      Category.countDocuments(),
      Media.countDocuments(),
      Contact.countDocuments(),
      Contact.countDocuments({ status: 'unread' }),
      Project.find().populate('category', 'name').sort('-createdAt').limit(5),
      Contact.find().sort('-createdAt').limit(5),
      Category.find()
    ]);

    // Aggregate category distribution for charts
    const categoryDistribution = await Promise.all(
      categories.map(async (cat) => {
        const count = await Project.countDocuments({ category: cat._id });
        return {
          name: cat.name,
          slug: cat.slug,
          count
        };
      })
    );

    res.status(200).json({
      success: true,
      stats: {
        totalProjects,
        publishedProjects,
        draftProjects,
        featuredProjects,
        totalCategories,
        totalMedia,
        totalContacts,
        unreadContacts
      },
      categoryDistribution: categoryDistribution.filter((c) => c.count > 0 || categories.length <= 6),
      recentProjects,
      recentContacts
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getOverviewStats
};
