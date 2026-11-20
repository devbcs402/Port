const mongoose = require('mongoose');

const imageSubSchema = new mongoose.Schema(
  {
    url: {
      type: String,
      required: true
    },
    publicId: {
      type: String,
      default: ''
    },
    alt: {
      type: String,
      default: ''
    },
    order: {
      type: Number,
      default: 0
    }
  },
  { _id: true }
);

const projectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide a project title'],
      trim: true,
      maxlength: [150, 'Title cannot exceed 150 characters']
    },
    slug: {
      type: String,
      required: [true, 'Please provide a project slug'],
      unique: true,
      lowercase: true,
      trim: true
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: [true, 'Please select a category']
    },
    shortDescription: {
      type: String,
      required: [true, 'Please provide a short summary description'],
      maxlength: [300, 'Short description cannot exceed 300 characters'],
      trim: true
    },
    fullDescription: {
      type: String,
      required: [true, 'Please provide full project details or case study text'],
      trim: true
    },
    coverImage: {
      url: {
        type: String,
        required: [true, 'Please provide a cover image']
      },
      publicId: {
        type: String,
        default: ''
      },
      alt: {
        type: String,
        default: ''
      }
    },
    galleryImages: [imageSubSchema],
    clientName: {
      type: String,
      default: '',
      trim: true
    },
    projectDate: {
      type: String,
      default: '',
      trim: true
    },
    projectUrl: {
      type: String,
      default: '',
      trim: true
    },
    designObjective: {
      type: String,
      default: '',
      trim: true
    },
    designProcess: {
      type: String,
      default: '',
      trim: true
    },
    toolsUsed: [
      {
        type: String,
        trim: true
      }
    ],
    isFeatured: {
      type: Boolean,
      default: false
    },
    isPublished: {
      type: Boolean,
      default: true
    },
    seoTitle: {
      type: String,
      default: '',
      trim: true
    },
    seoDescription: {
      type: String,
      default: '',
      trim: true
    },
    views: {
      type: Number,
      default: 0
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

projectSchema.index({ isPublished: 1, isFeatured: 1 });
projectSchema.index({ category: 1, isPublished: 1 });
projectSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Project', projectSchema);
