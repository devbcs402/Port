const mongoose = require('mongoose');

const testimonialSchema = new mongoose.Schema(
  {
    clientName: {
      type: String,
      required: [true, 'Please provide client name'],
      trim: true,
      maxlength: [100, 'Client name cannot exceed 100 characters']
    },
    clientRole: {
      type: String,
      default: '',
      trim: true
    },
    clientCompany: {
      type: String,
      default: '',
      trim: true
    },
    clientAvatar: {
      url: { type: String, default: '' },
      publicId: { type: String, default: '' }
    },
    feedback: {
      type: String,
      required: [true, 'Please provide client feedback review'],
      trim: true
    },
    rating: {
      type: Number,
      default: 5,
      min: [1, 'Minimum rating is 1'],
      max: [5, 'Maximum rating is 5']
    },
    isFeatured: {
      type: Boolean,
      default: true
    },
    isActive: {
      type: Boolean,
      default: true
    },
    order: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true
  }
);

testimonialSchema.index({ isActive: 1, isFeatured: 1 });
testimonialSchema.index({ order: 1 });

module.exports = mongoose.model('Testimonial', testimonialSchema);
