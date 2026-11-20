const mongoose = require('mongoose');

const mediaSchema = new mongoose.Schema(
  {
    fileName: {
      type: String,
      required: true,
      trim: true
    },
    originalName: {
      type: String,
      required: true,
      trim: true
    },
    url: {
      type: String,
      required: true
    },
    publicId: {
      type: String,
      default: ''
    },
    mimeType: {
      type: String,
      default: 'image/jpeg'
    },
    size: {
      type: Number,
      default: 0
    },
    width: {
      type: Number,
      default: 0
    },
    height: {
      type: Number,
      default: 0
    },
    format: {
      type: String,
      default: ''
    },
    storageProvider: {
      type: String,
      enum: ['cloudinary', 'local'],
      default: 'local'
    }
  },
  {
    timestamps: true
  }
);

mediaSchema.index({ createdAt: -1 });
mediaSchema.index({ fileName: 'text', originalName: 'text' });

module.exports = mongoose.model('Media', mediaSchema);
