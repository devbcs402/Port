const mongoose = require('mongoose');

const skillSubSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    level: { type: Number, default: 90, min: 0, max: 100 },
    category: { type: String, default: 'General' }
  },
  { _id: false }
);

const softwareSubSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    icon: { type: String, default: '' },
    proficiency: { type: String, default: 'Expert' }
  },
  { _id: false }
);

const workProcessSubSchema = new mongoose.Schema(
  {
    stepNumber: { type: Number, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true }
  },
  { _id: false }
);

const statisticSubSchema = new mongoose.Schema(
  {
    label: { type: String, required: true },
    value: { type: String, required: true },
    suffix: { type: String, default: '+' },
    icon: { type: String, default: '' }
  },
  { _id: false }
);

const aboutSchema = new mongoose.Schema(
  {
    designerName: {
      type: String,
      default: 'Alex Rivera',
      trim: true
    },
    tagline: {
      type: String,
      default: 'Senior Brand Identity & Visual Designer',
      trim: true
    },
    profileImage: {
      url: { type: String, default: '' },
      publicId: { type: String, default: '' }
    },
    bioIntro: {
      type: String,
      default: 'Crafting thoughtful brand identities, striking editorial posters, and bespoke visual systems that inspire and endure.',
      trim: true
    },
    bioFull: {
      type: String,
      default: 'With over 8 years of multidisciplinary design experience, I partner with forward-thinking brands, visionary founders, and creative cultural institutions worldwide. My approach balances conceptual rigor with expressive modern typography and meticulous craftsmanship.',
      trim: true
    },
    experienceYears: {
      type: Number,
      default: 8
    },
    skills: [skillSubSchema],
    softwareKnowledge: [softwareSubSchema],
    workProcess: [workProcessSubSchema],
    statistics: [statisticSubSchema],
    resumeUrl: {
      type: String,
      default: ''
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('About', aboutSchema);
