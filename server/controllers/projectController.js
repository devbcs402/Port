const Project = require('../models/Project');
const Category = require('../models/Category');
const slugify = require('slugify');
const { uploadSingleFile, deleteFile } = require('../services/uploadService');

// @desc    Get all projects (public: published only, admin: filtered)
// @route   GET /api/projects
// @access  Public / Private (Admin)
const getProjects = async (req, res, next) => {
  try {
    const {
      category,
      search,
      featured,
      status,
      page = 1,
      limit = 12,
      sort = '-createdAt'
    } = req.query;

    const query = {};

    // For public requests (no req.admin), only show published projects
    if (!req.admin) {
      query.isPublished = true;
    } else if (status) {
      if (status === 'published') query.isPublished = true;
      if (status === 'draft') query.isPublished = false;
    }

    // Filter by featured
    if (featured === 'true' || featured === true) {
      query.isFeatured = true;
    }

    // Filter by category (by slug or ObjectId)
    if (category && category !== 'all') {
      const isObjectId = /^[0-9a-fA-F]{24}$/.test(category);
      if (isObjectId) {
        query.category = category;
      } else {
        const foundCategory = await Category.findOne({ slug: category.toLowerCase() });
        if (foundCategory) {
          query.category = foundCategory._id;
        } else {
          // If category slug does not exist, return empty results
          return res.status(200).json({
            success: true,
            count: 0,
            total: 0,
            totalPages: 0,
            currentPage: Number(page),
            projects: []
          });
        }
      }
    }

    // Search filter
    if (search && search.trim() !== '') {
      const searchRegex = new RegExp(search.trim(), 'i');
      query.$or = [
        { title: searchRegex },
        { shortDescription: searchRegex },
        { clientName: searchRegex },
        { toolsUsed: searchRegex }
      ];
    }

    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 12;
    const skip = (pageNum - 1) * limitNum;

    const total = await Project.countDocuments(query);
    const projects = await Project.find(query)
      .populate('category', 'name slug')
      .sort(sort)
      .skip(skip)
      .limit(limitNum);

    res.status(200).json({
      success: true,
      count: projects.length,
      total,
      totalPages: Math.ceil(total / limitNum) || 1,
      currentPage: pageNum,
      projects
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get featured projects for homepage
// @route   GET /api/projects/featured
// @access  Public
const getFeaturedProjects = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit, 10) || 6;
    const projects = await Project.find({ isPublished: true, isFeatured: true })
      .populate('category', 'name slug')
      .sort('-createdAt')
      .limit(limit);

    res.status(200).json({
      success: true,
      count: projects.length,
      projects
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single project by slug with next/previous & related
// @route   GET /api/projects/slug/:slug
// @access  Public
const getProjectBySlug = async (req, res, next) => {
  try {
    const { slug } = req.params;
    const project = await Project.findOne({ slug: slug.toLowerCase() }).populate(
      'category',
      'name slug'
    );

    if (!project) {
      return res.status(404).json({
        success: false,
        message: `Project with slug '${slug}' not found`
      });
    }

    // Only allow admin to view draft project directly
    if (!project.isPublished && !req.admin) {
      return res.status(404).json({
        success: false,
        message: 'This project is currently private or in draft mode.'
      });
    }

    // Increment view count in background
    Project.updateOne({ _id: project._id }, { $inc: { views: 1 } }).exec();

    // Fetch previous and next projects (based on createdAt)
    const prevProject = await Project.findOne({
      isPublished: true,
      createdAt: { $lt: project.createdAt }
    })
      .select('title slug coverImage')
      .sort('-createdAt');

    const nextProject = await Project.findOne({
      isPublished: true,
      createdAt: { $gt: project.createdAt }
    })
      .select('title slug coverImage')
      .sort('createdAt');

    // Fetch related projects from the same category
    const relatedProjects = await Project.find({
      isPublished: true,
      category: project.category ? project.category._id : null,
      _id: { $ne: project._id }
    })
      .select('title slug coverImage category shortDescription')
      .populate('category', 'name slug')
      .limit(3);

    res.status(200).json({
      success: true,
      project,
      navigation: {
        prev: prevProject,
        next: nextProject
      },
      relatedProjects
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single project by ID (admin)
// @route   GET /api/projects/:id
// @access  Private
const getProjectById = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id).populate('category', 'name slug');
    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }
    res.status(200).json({
      success: true,
      project
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new project
// @route   POST /api/projects
// @access  Private
const createProject = async (req, res, next) => {
  try {
    const body = { ...req.body };

    // Auto-generate slug if not provided
    if (!body.slug && body.title) {
      body.slug = slugify(body.title, { lower: true, strict: true });
    } else if (body.slug) {
      body.slug = slugify(body.slug, { lower: true, strict: true });
    }

    // Ensure unique slug
    let slugExists = await Project.findOne({ slug: body.slug });
    if (slugExists) {
      body.slug = `${body.slug}-${Date.now().toString().slice(-4)}`;
    }

    // Handle toolsUsed array parsing if sent as JSON string or comma-separated
    if (typeof body.toolsUsed === 'string') {
      try {
        body.toolsUsed = JSON.parse(body.toolsUsed);
      } catch {
        body.toolsUsed = body.toolsUsed.split(',').map((t) => t.trim()).filter(Boolean);
      }
    }

    // Handle galleryImages if sent as JSON string
    if (typeof body.galleryImages === 'string') {
      try {
        body.galleryImages = JSON.parse(body.galleryImages);
      } catch {
        body.galleryImages = [];
      }
    }

    // Handle coverImage if sent as JSON string
    if (typeof body.coverImage === 'string') {
      try {
        body.coverImage = JSON.parse(body.coverImage);
      } catch {
        body.coverImage = { url: body.coverImage };
      }
    }

    // If file uploaded via multer for coverImage
    if (req.files && req.files.cover) {
      const baseUrl = `${req.protocol}://${req.get('host')}`;
      const uploadRes = await uploadSingleFile(req.files.cover[0], baseUrl);
      body.coverImage = {
        url: uploadRes.url,
        publicId: uploadRes.publicId,
        alt: body.title || 'Project cover image'
      };
    }

    // If multiple gallery images uploaded via multer
    if (req.files && req.files.gallery) {
      const baseUrl = `${req.protocol}://${req.get('host')}`;
      const uploadedGallery = await Promise.all(
        req.files.gallery.map(async (file, idx) => {
          const up = await uploadSingleFile(file, baseUrl);
          return {
            url: up.url,
            publicId: up.publicId,
            alt: `${body.title} gallery image ${idx + 1}`,
            order: idx
          };
        })
      );
      body.galleryImages = [...(body.galleryImages || []), ...uploadedGallery];
    }

    const project = await Project.create(body);
    const populated = await Project.findById(project._id).populate('category', 'name slug');

    res.status(201).json({
      success: true,
      message: 'Project created successfully',
      project: populated
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update project
// @route   PUT /api/projects/:id
// @access  Private
const updateProject = async (req, res, next) => {
  try {
    let project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    const body = { ...req.body };

    // Slug management
    if (body.slug && body.slug !== project.slug) {
      body.slug = slugify(body.slug, { lower: true, strict: true });
      const slugExists = await Project.findOne({ slug: body.slug, _id: { $ne: project._id } });
      if (slugExists) {
        body.slug = `${body.slug}-${Date.now().toString().slice(-4)}`;
      }
    }

    // Tools parsing
    if (typeof body.toolsUsed === 'string') {
      try {
        body.toolsUsed = JSON.parse(body.toolsUsed);
      } catch {
        body.toolsUsed = body.toolsUsed.split(',').map((t) => t.trim()).filter(Boolean);
      }
    }

    // Cover image parsing
    if (typeof body.coverImage === 'string') {
      try {
        body.coverImage = JSON.parse(body.coverImage);
      } catch {
        body.coverImage = { url: body.coverImage };
      }
    }

    // Gallery images parsing
    if (typeof body.galleryImages === 'string') {
      try {
        body.galleryImages = JSON.parse(body.galleryImages);
      } catch {
        body.galleryImages = project.galleryImages;
      }
    }

    // Handle new cover image file upload
    if (req.files && req.files.cover) {
      const baseUrl = `${req.protocol}://${req.get('host')}`;
      const uploadRes = await uploadSingleFile(req.files.cover[0], baseUrl);
      body.coverImage = {
        url: uploadRes.url,
        publicId: uploadRes.publicId,
        alt: body.title || project.title
      };
    }

    // Handle new gallery files
    if (req.files && req.files.gallery) {
      const baseUrl = `${req.protocol}://${req.get('host')}`;
      const newImages = await Promise.all(
        req.files.gallery.map(async (file, idx) => {
          const up = await uploadSingleFile(file, baseUrl);
          return {
            url: up.url,
            publicId: up.publicId,
            alt: `${body.title || project.title} image`,
            order: (body.galleryImages ? body.galleryImages.length : 0) + idx
          };
        })
      );
      body.galleryImages = [...(body.galleryImages || project.galleryImages || []), ...newImages];
    }

    project = await Project.findByIdAndUpdate(req.params.id, body, {
      new: true,
      runValidators: true
    }).populate('category', 'name slug');

    res.status(200).json({
      success: true,
      message: 'Project updated successfully',
      project
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete project
// @route   DELETE /api/projects/:id
// @access  Private
const deleteProject = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    // Optionally cleanup cover image
    if (project.coverImage && project.coverImage.publicId) {
      deleteFile(project.coverImage.publicId, project.coverImage.url).catch(() => {});
    }

    // Cleanup gallery images
    if (project.galleryImages && project.galleryImages.length > 0) {
      project.galleryImages.forEach((img) => {
        if (img.publicId) {
          deleteFile(img.publicId, img.url).catch(() => {});
        }
      });
    }

    await Project.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Project deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle project publish status
// @route   PATCH /api/projects/:id/toggle-publish
// @access  Private
const togglePublish = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }
    project.isPublished = !project.isPublished;
    await project.save();

    res.status(200).json({
      success: true,
      message: `Project ${project.isPublished ? 'published' : 'moved to draft'}`,
      isPublished: project.isPublished
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle project featured status
// @route   PATCH /api/projects/:id/toggle-featured
// @access  Private
const toggleFeatured = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }
    project.isFeatured = !project.isFeatured;
    await project.save();

    res.status(200).json({
      success: true,
      message: `Project ${project.isFeatured ? 'featured' : 'unfeatured'}`,
      isFeatured: project.isFeatured
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProjects,
  getFeaturedProjects,
  getProjectBySlug,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
  togglePublish,
  toggleFeatured
};
