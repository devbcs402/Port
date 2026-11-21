const mongoose = require('mongoose');

const websiteSettingsSchema = new mongoose.Schema(
  {
    websiteName: {
      type: String,
      default: 'Studio Rivera — Graphic Design & Art Direction',
      trim: true
    },
    designerName: {
      type: String,
      default: 'Alex Rivera',
      trim: true
    },
    logo: {
      url: { type: String, default: '' },
      publicId: { type: String, default: '' }
    },
    favicon: {
      url: { type: String, default: '' },
      publicId: { type: String, default: '' }
    },
    email: {
      type: String,
      default: 'hello@riveradesign.studio',
      trim: true
    },
    phone: {
      type: String,
      default: '+1 (555) 382-9401',
      trim: true
    },
    whatsapp: {
      type: String,
      default: '+15553829401',
      trim: true
    },
    address: {
      type: String,
      default: 'Brooklyn, New York & Available Worldwide',
      trim: true
    },
    instagramUrl: {
      type: String,
      default: 'https://instagram.com',
      trim: true
    },
    behanceUrl: {
      type: String,
      default: 'https://behance.net',
      trim: true
    },
    dribbbleUrl: {
      type: String,
      default: 'https://dribbble.com',
      trim: true
    },
    linkedinUrl: {
      type: String,
      default: 'https://linkedin.com',
      trim: true
    },
    githubUrl: {
      type: String,
      default: '',
      trim: true
    },
    twitterUrl: {
      type: String,
      default: '',
      trim: true
    },
    footerText: {
      type: String,
      default: 'Crafted with precision, passion, and artistic dedication.',
      trim: true
    },
    availabilityStatus: {
      type: String,
      default: 'Available for Select Projects 2026',
      trim: true
    },
    heroHeadline: {
      type: String,
      default: 'Creative Designs That Make Brands Stand Out.',
      trim: true
    },
    heroSubheadline: {
      type: String,
      default: 'Visual identity, editorial posters, packaging, and digital design crafted with intention, timeless aesthetics, and high-impact visual storytelling.',
      trim: true
    },
    contactCtaTitle: {
      type: String,
      default: 'Have a Project in Mind?',
      trim: true
    },
    contactCtaSubtitle: {
      type: String,
      default: 'Let’s collaborate to build something remarkable. Inquire about brand design, art direction, and custom creative commissions.',
      trim: true
    },
    metaTitle: {
      type: String,
      default: 'Alex Rivera — Premium Graphic Designer & Art Director',
      trim: true
    },
    metaDescription: {
      type: String,
      default: 'Award-winning graphic design portfolio specializing in brand identity, packaging, typography, poster design, and art direction.',
      trim: true
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('WebsiteSettings', websiteSettingsSchema);
