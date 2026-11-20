const Testimonial = require('../models/Testimonial');

// @desc    Get all testimonials
// @route   GET /api/testimonials
// @access  Public / Private
const getTestimonials = async (req, res, next) => {
  try {
    const filter = req.admin ? {} : { isActive: true };
    const testimonials = await Testimonial.find(filter).sort('order createdAt');

    res.status(200).json({
      success: true,
      count: testimonials.length,
      testimonials
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create testimonial
// @route   POST /api/testimonials
// @access  Private
const createTestimonial = async (req, res, next) => {
  try {
    const { clientName, clientRole, clientCompany, clientAvatar, feedback, rating, isFeatured, isActive, order } = req.body;

    if (!clientName || !feedback) {
      return res.status(400).json({
        success: false,
        message: 'Client name and feedback review are required'
      });
    }

    const testimonial = await Testimonial.create({
      clientName,
      clientRole: clientRole || '',
      clientCompany: clientCompany || '',
      clientAvatar: clientAvatar || { url: '', publicId: '' },
      feedback,
      rating: rating ? Number(rating) : 5,
      isFeatured: isFeatured !== undefined ? isFeatured : true,
      isActive: isActive !== undefined ? isActive : true,
      order: order ? Number(order) : 0
    });

    res.status(201).json({
      success: true,
      message: 'Testimonial created successfully',
      testimonial
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update testimonial
// @route   PUT /api/testimonials/:id
// @access  Private
const updateTestimonial = async (req, res, next) => {
  try {
    const testimonial = await Testimonial.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    if (!testimonial) {
      return res.status(404).json({ success: false, message: 'Testimonial not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Testimonial updated successfully',
      testimonial
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete testimonial
// @route   DELETE /api/testimonials/:id
// @access  Private
const deleteTestimonial = async (req, res, next) => {
  try {
    const testimonial = await Testimonial.findById(req.params.id);
    if (!testimonial) {
      return res.status(404).json({ success: false, message: 'Testimonial not found' });
    }

    await Testimonial.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Testimonial deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getTestimonials,
  createTestimonial,
  updateTestimonial,
  deleteTestimonial
};
