const Service = require('../models/Service');
const slugify = require('slugify');

// @desc    Get all services
// @route   GET /api/services
// @access  Public / Private
const getServices = async (req, res, next) => {
  try {
    const filter = req.admin ? {} : { isActive: true };
    const services = await Service.find(filter).sort('order createdAt');

    res.status(200).json({
      success: true,
      count: services.length,
      services
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create service
// @route   POST /api/services
// @access  Private
const createService = async (req, res, next) => {
  try {
    const body = { ...req.body };

    if (!body.title) {
      return res.status(400).json({ success: false, message: 'Service title is required' });
    }

    if (!body.slug) {
      body.slug = slugify(body.title, { lower: true, strict: true });
    } else {
      body.slug = slugify(body.slug, { lower: true, strict: true });
    }

    const exists = await Service.findOne({ slug: body.slug });
    if (exists) {
      body.slug = `${body.slug}-${Date.now().toString().slice(-4)}`;
    }

    if (typeof body.deliverables === 'string') {
      try {
        body.deliverables = JSON.parse(body.deliverables);
      } catch {
        body.deliverables = body.deliverables.split(',').map((d) => d.trim()).filter(Boolean);
      }
    }

    const service = await Service.create(body);

    res.status(201).json({
      success: true,
      message: 'Service created successfully',
      service
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update service
// @route   PUT /api/services/:id
// @access  Private
const updateService = async (req, res, next) => {
  try {
    let service = await Service.findById(req.params.id);
    if (!service) {
      return res.status(404).json({ success: false, message: 'Service not found' });
    }

    const body = { ...req.body };

    if (body.slug && body.slug !== service.slug) {
      body.slug = slugify(body.slug, { lower: true, strict: true });
    }

    if (typeof body.deliverables === 'string') {
      try {
        body.deliverables = JSON.parse(body.deliverables);
      } catch {
        body.deliverables = body.deliverables.split(',').map((d) => d.trim()).filter(Boolean);
      }
    }

    service = await Service.findByIdAndUpdate(req.params.id, body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      message: 'Service updated successfully',
      service
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete service
// @route   DELETE /api/services/:id
// @access  Private
const deleteService = async (req, res, next) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) {
      return res.status(404).json({ success: false, message: 'Service not found' });
    }

    await Service.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Service deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getServices,
  createService,
  updateService,
  deleteService
};
