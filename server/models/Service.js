const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide service title'],
      trim: true,
      maxlength: [100, 'Title cannot exceed 100 characters']
    },
    slug: {
      type: String,
      required: [true, 'Please provide service slug'],
      unique: true,
      lowercase: true,
      trim: true
    },
    shortDescription: {
      type: String,
      required: [true, 'Please provide short description'],
      maxlength: [300, 'Short description cannot exceed 300 characters'],
      trim: true
    },
    fullDescription: {
      type: String,
      default: '',
      trim: true
    },
    icon: {
      type: String,
      default: 'Sparkles',
      trim: true
    },
    image: {
      url: { type: String, default: '' },
      publicId: { type: String, default: '' }
    },
    deliverables: [
      {
        type: String,
        trim: true
      }
    ],
    order: {
      type: Number,
      default: 0
    },
    isActive: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
);

serviceSchema.index({ order: 1 });

module.exports = mongoose.model('Service', serviceSchema);
