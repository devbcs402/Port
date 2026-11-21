const About = require('../models/About');
const WebsiteSettings = require('../models/WebsiteSettings');

// @desc    Get about section information
// @route   GET /api/about
// @access  Public
const getAbout = async (req, res, next) => {
  try {
    let about = await About.findOne();
    if (!about) {
      about = await About.create({
        designerName: 'Alex Rivera',
        tagline: 'Senior Brand Identity & Visual Designer',
        bioIntro: 'Crafting thoughtful brand identities, striking editorial posters, and bespoke visual systems that inspire and endure.',
        bioFull: 'With over 8 years of multidisciplinary design experience, I partner with forward-thinking brands, visionary founders, and creative cultural institutions worldwide. My approach balances conceptual rigor with expressive modern typography and meticulous craftsmanship.',
        experienceYears: 8,
        skills: [
          { name: 'Brand Identity Systems', level: 95, category: 'Branding' },
          { name: 'Typography & Layout', level: 98, category: 'Print' },
          { name: 'Packaging & Print Production', level: 90, category: 'Physical' },
          { name: 'Poster & Editorial Art', level: 96, category: 'Visual Art' },
          { name: 'UI / UX Design', level: 88, category: 'Digital' },
          { name: '3D Mockup & Visuals', level: 84, category: '3D' }
        ],
        softwareKnowledge: [
          { name: 'Adobe Photoshop', icon: 'Photoshop', proficiency: 'Master' },
          { name: 'Adobe Illustrator', icon: 'Illustrator', proficiency: 'Master' },
          { name: 'Adobe InDesign', icon: 'InDesign', proficiency: 'Expert' },
          { name: 'Figma', icon: 'Figma', proficiency: 'Expert' },
          { name: 'Blender 3D', icon: 'Blender', proficiency: 'Proficient' },
          { name: 'After Effects', icon: 'AfterEffects', proficiency: 'Proficient' }
        ],
        workProcess: [
          {
            stepNumber: 1,
            title: 'Discovery & Creative Brief',
            description: 'Deep dive into brand core, competitive market landscape, audience psychology, and clear aesthetic goals.'
          },
          {
            stepNumber: 2,
            title: 'Concept & Visual Strategy',
            description: 'Moodboards, typographic exploration, sketch ideation, and defining distinct art direction routes.'
          },
          {
            stepNumber: 3,
            title: 'Design Execution & Refinement',
            description: 'Transforming approved concepts into meticulous vector systems, packaging dies, posters, and real-world mockups.'
          },
          {
            stepNumber: 4,
            title: 'Delivery & Brand Guidelines',
            description: 'Exporting production-ready vector assets, high-res print files, digital specs, and brand style guides.'
          }
        ],
        statistics: [
          { label: 'Completed Projects', value: '180', suffix: '+', icon: 'Briefcase' },
          { label: 'Happy Global Clients', value: '75', suffix: '+', icon: 'Users' },
          { label: 'Years of Experience', value: '8', suffix: '+', icon: 'Clock' },
          { label: 'Design Awards Won', value: '14', suffix: '', icon: 'Award' }
        ]
      });
    }

    res.status(200).json({
      success: true,
      about
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update about section
// @route   PUT /api/about
// @access  Private
const updateAbout = async (req, res, next) => {
  try {
    let about = await About.findOne();

    if (!about) {
      about = await About.create(req.body);
    } else {
      about = await About.findByIdAndUpdate(about._id, req.body, {
        new: true,
        runValidators: true
      });
    }

    // Automatically synchronize designerName across WebsiteSettings so it reflects everywhere
    if (req.body.designerName && req.body.designerName.trim()) {
      await WebsiteSettings.findOneAndUpdate(
        {},
        { $set: { designerName: req.body.designerName.trim() } },
        { upsert: true }
      );
    }

    res.status(200).json({
      success: true,
      message: 'About information updated successfully',
      about
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAbout,
  updateAbout
};
