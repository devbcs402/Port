const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '..', '.env') });

const Admin = require('../models/Admin');
const Category = require('../models/Category');
const Project = require('../models/Project');
const Service = require('../models/Service');
const Testimonial = require('../models/Testimonial');
const About = require('../models/About');
const WebsiteSettings = require('../models/WebsiteSettings');
const Media = require('../models/Media');

const seedData = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/graphic_portfolio';
    await mongoose.connect(mongoUri);
    console.log('[Seed] Connected to MongoDB database successfully.');

    // 1. Seed or update Admin
    console.log('[Seed] Seeding Admin account...');
    await Admin.deleteMany({});
    const admin = await Admin.create({
      name: 'Alex Rivera',
      email: 'admin@portfolio.com',
      password: 'Admin@123456',
      role: 'superadmin',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80'
    });
    console.log(`[Seed] Admin created: ${admin.email} (Password: Admin@123456)`);

    // 2. Seed Categories
    console.log('[Seed] Seeding Categories...');
    await Category.deleteMany({});
    const categoriesData = [
      {
        name: 'Brand Identity',
        slug: 'brand-identity',
        description: 'Cohesive brand ecosystems, visual style guides, stationery systems, and modern identity manuals.',
        thumbnail: {
          url: 'https://images.unsplash.com/photo-1600132806370-bf17e65e942f?auto=format&fit=crop&w=800&q=80',
          publicId: 'cat_brand'
        },
        order: 1,
        isActive: true
      },
      {
        name: 'Packaging Design',
        slug: 'packaging-design',
        description: 'Bespoke product packaging, structural box dies, label architecture, and tactile unboxing experiences.',
        thumbnail: {
          url: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80',
          publicId: 'cat_packaging'
        },
        order: 2,
        isActive: true
      },
      {
        name: 'Poster & Editorial',
        slug: 'poster-editorial',
        description: 'Typographic posters, cultural festival prints, editorial magazines, and custom visual art prints.',
        thumbnail: {
          url: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=800&q=80',
          publicId: 'cat_poster'
        },
        order: 3,
        isActive: true
      },
      {
        name: 'Social Media & Ads',
        slug: 'social-media-ads',
        description: 'High-converting social ad campaigns, promotional carousels, banner suites, and viral visual content.',
        thumbnail: {
          url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',
          publicId: 'cat_social'
        },
        order: 4,
        isActive: true
      },
      {
        name: 'Logo Design',
        slug: 'logo-design',
        description: 'Memorable brand marks, conceptual monograms, wordmarks, and geometric symbol systems.',
        thumbnail: {
          url: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?auto=format&fit=crop&w=800&q=80',
          publicId: 'cat_logo'
        },
        order: 5,
        isActive: true
      },
      {
        name: 'UI/UX & Web',
        slug: 'ui-ux-design',
        description: 'Design systems, artistic web interfaces, creative direction for interactive web experiences.',
        thumbnail: {
          url: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=800&q=80',
          publicId: 'cat_ui'
        },
        order: 6,
        isActive: true
      }
    ];

    const insertedCategories = await Category.insertMany(categoriesData);
    const catMap = {};
    insertedCategories.forEach((c) => {
      catMap[c.slug] = c._id;
    });

    // 3. Seed Projects
    console.log('[Seed] Seeding Projects...');
    await Project.deleteMany({});
    const projectsData = [
      {
        title: 'Lumina Botanicals — Modern Cosmetic Identity & Packaging',
        slug: 'lumina-botanicals-identity-packaging',
        category: catMap['brand-identity'],
        shortDescription: 'Complete visual identity and luxury eco-packaging system for a sustainable organic skincare lab in Copenhagen.',
        fullDescription: 'Lumina Botanicals required a transformative brand overhaul that merged clinical dermatological authority with the organic warmth of Nordic herbal botany. We developed a custom sans-serif wordmark, minimalist amber glass label system, and embossed biodegradable unboxing cartons featuring subtle foil accents. The visual identity establishes an aspirational presence across physical retail and digital flagship spaces.',
        coverImage: {
          url: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=1200&q=85',
          publicId: 'proj_lumina_cover',
          alt: 'Lumina Botanicals packaging mockup'
        },
        galleryImages: [
          {
            url: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=1200&q=85',
            publicId: 'proj_lumina_gal1',
            alt: 'Lumina skincare bottles on minimalist pedestal',
            order: 0
          },
          {
            url: 'https://images.unsplash.com/photo-1608248597359-255964f77626?auto=format&fit=crop&w=1200&q=85',
            publicId: 'proj_lumina_gal2',
            alt: 'Cosmetic dropper bottles and botanical arrangement',
            order: 1
          },
          {
            url: 'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&w=1200&q=85',
            publicId: 'proj_lumina_gal3',
            alt: 'Minimalist brand packaging box with embossing',
            order: 2
          },
          {
            url: 'https://images.unsplash.com/photo-1616683693504-3ea7e9ad6fec?auto=format&fit=crop&w=1200&q=85',
            publicId: 'proj_lumina_gal4',
            alt: 'Brand stationery suite and embossed business cards',
            order: 3
          }
        ],
        clientName: 'Lumina Skincare Nordic',
        projectDate: 'January 2026',
        projectUrl: 'https://luminabotanicals.example.com',
        designObjective: 'Establish an unmistakably premium skincare identity that communicates purity, scientific efficacy, and ecological responsibility to high-discretion consumers.',
        designProcess: '1. Conducted competitive market audit across 20 European luxury skincare brands.\n2. Drafted 40+ typographic iterations balancing high-contrast strokes with organic curves.\n3. Prototyped 3D bottle shapes and evaluated tactile paper stocks with Copenhagen print artisans.\n4. Standardized a 90-page Brand Identity Guidelines manual.',
        toolsUsed: ['Adobe Illustrator', 'Adobe InDesign', 'Photoshop', 'Blender 3D'],
        isFeatured: true,
        isPublished: true,
        seoTitle: 'Lumina Botanicals Brand Identity & Packaging — Alex Rivera Portfolio',
        seoDescription: 'Case study of Lumina Botanicals visual identity and sustainable luxury cosmetic packaging system.',
        views: 342,
        order: 1
      },
      {
        title: 'Verde Artisanal Coffee — Roastery Packaging Suite',
        slug: 'verde-coffee-packaging-suite',
        category: catMap['packaging-design'],
        shortDescription: 'Bold typographic coffee bag packaging and tactile unboxing suite celebrating single-origin micro-lot harvest traditions.',
        fullDescription: 'Verde Coffee is a boutique specialty coffee roaster focusing on biodynamic high-altitude beans. The packaging architecture utilizes custom illustrated topographical contour lines, vibrant neon spot colors on raw kraft substrates, and metallic degassing valves. The system easily differentiates bean varietals with modular color-coded labeling bands.',
        coverImage: {
          url: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?auto=format&fit=crop&w=1200&q=85',
          publicId: 'proj_verde_cover',
          alt: 'Verde coffee bags with modern typography'
        },
        galleryImages: [
          {
            url: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=1200&q=85',
            publicId: 'proj_verde_gal1',
            alt: 'Verde coffee beans and packaging flat lay',
            order: 0
          },
          {
            url: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=1200&q=85',
            publicId: 'proj_verde_gal2',
            alt: 'Coffee cup with branded sleeve and roast notes',
            order: 1
          },
          {
            url: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=1200&q=85',
            publicId: 'proj_verde_gal3',
            alt: 'Cafe interior with branded signage and menu board',
            order: 2
          }
        ],
        clientName: 'Verde Roasters Collective',
        projectDate: 'November 2025',
        projectUrl: 'https://verdecoffee.example.com',
        designObjective: 'Stand out on crowded retail specialty shelves while communicating origin altitude, processing method, and flavor profiles with maximum clarity.',
        designProcess: 'Explored custom geographic contour line illustration generated from GPS coordinates of harvest farms. Combined heavy grotesk typography with refined serif tasting notes.',
        toolsUsed: ['Adobe Illustrator', 'Photoshop', 'Figma'],
        isFeatured: true,
        isPublished: true,
        seoTitle: 'Verde Coffee Packaging Design — Alex Rivera',
        seoDescription: 'Modern specialty coffee packaging and visual branding case study.',
        views: 289,
        order: 2
      },
      {
        title: 'Metropolis Avant-Garde Film Festival — Poster Series',
        slug: 'metropolis-film-festival-poster-series',
        category: catMap['poster-editorial'],
        shortDescription: 'Triennial experimental cinema poster collection celebrating international indie filmmakers, brutalist geometry, and typographic tension.',
        fullDescription: 'Commissioned for the 14th edition of the Metropolis International Film Festival in Berlin, this series of silk-screen printed posters explores themes of temporal distortion, architectural shadows, and cinematic framing. We employed radical typography, intentional ink misregistration, and metallic silver split fountains across German heavy cotton rag paper.',
        coverImage: {
          url: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=1200&q=85',
          publicId: 'proj_metropolis_cover',
          alt: 'Experimental typographic poster artwork'
        },
        galleryImages: [
          {
            url: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&w=1200&q=85',
            publicId: 'proj_metropolis_gal1',
            alt: 'Abstract colorful design poster composition',
            order: 0
          },
          {
            url: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=1200&q=85',
            publicId: 'proj_metropolis_gal2',
            alt: 'Framed gallery wall exhibition of posters',
            order: 1
          },
          {
            url: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=1200&q=85',
            publicId: 'proj_metropolis_gal3',
            alt: 'Silkscreen print detail and ink texture',
            order: 2
          }
        ],
        clientName: 'Berlin Kino Art Foundation',
        projectDate: 'August 2025',
        projectUrl: '',
        designObjective: 'Evoke the tension and conceptual boundary-pushing ethos of independent cinema through uncompromising poster graphics.',
        designProcess: 'Created physical collage experiments combining found film stills with photocopy distress, followed by digital vector refinement and 4-color screen printing.',
        toolsUsed: ['Adobe Photoshop', 'Adobe Illustrator', 'Screen Printing'],
        isFeatured: true,
        isPublished: true,
        seoTitle: 'Metropolis Film Festival Poster Design — Alex Rivera',
        seoDescription: 'Award-winning festival poster and cultural typography series.',
        views: 412,
        order: 3
      },
      {
        title: 'Nexus Fintech — Global Brand Transformation & Web Suite',
        slug: 'nexus-fintech-global-brand-system',
        category: catMap['brand-identity'],
        shortDescription: 'Modern brand architecture, dynamic logo symbol, and high-performance visual language for a next-gen digital banking institution.',
        fullDescription: 'Nexus is a digital wealth management platform serving over 2 million customers across North America and Europe. We redefined the brand with a sleek kinetic logo mark signifying growth and security, an authoritative typographic hierarchy, and a bold color palette of deep obsidian and fluorescent electric mint.',
        coverImage: {
          url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=85',
          publicId: 'proj_nexus_cover',
          alt: 'Nexus financial visual identity and digital assets'
        },
        galleryImages: [
          {
            url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=85',
            publicId: 'proj_nexus_gal1',
            alt: 'Data visualization and sleek UI design interface',
            order: 0
          },
          {
            url: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=1200&q=85',
            publicId: 'proj_nexus_gal2',
            alt: 'Mobile banking app screens and card design',
            order: 1
          },
          {
            url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=85',
            publicId: 'proj_nexus_gal3',
            alt: 'Brand identity guidelines spread on desktop',
            order: 2
          }
        ],
        clientName: 'Nexus Global Financial Inc.',
        projectDate: 'December 2025',
        projectUrl: 'https://nexusfintech.example.com',
        designObjective: 'Bridge the trust deficit of fintech through institutional dignity paired with ultra-fluid modern user interfaces.',
        designProcess: 'Iterated through 60+ monogram concepts, built a comprehensive design token library in Figma, and created responsive guidelines for 120 global team members.',
        toolsUsed: ['Figma', 'Illustrator', 'After Effects', 'Photoshop'],
        isFeatured: true,
        isPublished: true,
        seoTitle: 'Nexus Fintech Brand Identity — Alex Rivera',
        seoDescription: 'Fintech brand system and UI visual design case study.',
        views: 520,
        order: 4
      },
      {
        title: 'Aura Haute Parfumerie — Monogram & Luxury Packaging',
        slug: 'aura-parfumerie-monogram-packaging',
        category: catMap['logo-design'],
        shortDescription: 'Refined optical monogram mark and custom gold-foiled perfume bottle packaging for an exclusive Parisian fragrance house.',
        fullDescription: 'Aura is an artisanal perfume maison crafting niche olfactive compositions in Grasse. We created an intricate geometric ligature monogram that embosses flawlessly into glass flacons, heavy cotton paper boxes, and wax seals, creating an aura of timeless luxury.',
        coverImage: {
          url: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=1200&q=85',
          publicId: 'proj_aura_cover',
          alt: 'Aura luxury perfume bottle with embossed logo'
        },
        galleryImages: [
          {
            url: 'https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&w=1200&q=85',
            publicId: 'proj_aura_gal1',
            alt: 'Perfume flacon with gold cap and custom label',
            order: 0
          },
          {
            url: 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&w=1200&q=85',
            publicId: 'proj_aura_gal2',
            alt: 'Fragrance gift box packaging with ribbon',
            order: 1
          }
        ],
        clientName: 'Aura Parfums Paris',
        projectDate: 'September 2025',
        projectUrl: '',
        designObjective: 'Craft a hallmark logo monogram that conveys century-old heritage while appealing to modern luxury collectors.',
        designProcess: 'Hand-lettered calligraphic flourishes digitized into mathematically balanced bezier curves with sub-millimeter tolerances for micro-embossing.',
        toolsUsed: ['Adobe Illustrator', 'Photoshop', 'Blender 3D'],
        isFeatured: false,
        isPublished: true,
        seoTitle: 'Aura Luxury Fragrance Packaging — Alex Rivera',
        seoDescription: 'High-end fragrance branding, monogram logo, and packaging.',
        views: 198,
        order: 5
      },
      {
        title: 'Solstice Music & Arts Festival — Multi-Platform Campaign',
        slug: 'solstice-festival-campaign-suite',
        category: catMap['social-media-ads'],
        shortDescription: 'Comprehensive digital social campaign, animated stage visuals, and promotional banners for a 3-day outdoor music festival.',
        fullDescription: 'Developing the complete summer campaign assets for Solstice 2025, reaching over 4.5 million music fans. The design utilized iridescent chromatic aberration, neon gradients, kinetic typography, and multi-format social carousel templates.',
        coverImage: {
          url: 'https://images.unsplash.com/photo-1506157786151-b8491531f063?auto=format&fit=crop&w=1200&q=85',
          publicId: 'proj_solstice_cover',
          alt: 'Festival crowd and vibrant visual stage lights'
        },
        galleryImages: [
          {
            url: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=1200&q=85',
            publicId: 'proj_solstice_gal1',
            alt: 'Live music stage lighting and visual graphics',
            order: 0
          },
          {
            url: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=1200&q=85',
            publicId: 'proj_solstice_gal2',
            alt: 'DJ performance with dynamic visual branding',
            order: 1
          }
        ],
        clientName: 'Solstice Festival Group',
        projectDate: 'July 2025',
        projectUrl: 'https://solsticefestival.example.com',
        designObjective: 'Drive record ticket pre-sales through electrifying social media visual assets and consistent multi-channel storytelling.',
        designProcess: 'Engineered an adaptable modular visual toolkit allowing rapid production of 120+ artist announcement assets across Instagram, TikTok, and street billboards.',
        toolsUsed: ['Adobe Photoshop', 'After Effects', 'Illustrator'],
        isFeatured: false,
        isPublished: true,
        seoTitle: 'Solstice Festival Social Campaign — Alex Rivera',
        seoDescription: 'Digital festival campaign and social media ad suite design.',
        views: 264,
        order: 6
      }
    ];

    await Project.insertMany(projectsData);

    // 4. Seed Services
    console.log('[Seed] Seeding Services...');
    await Service.deleteMany({});
    const servicesData = [
      {
        title: 'Brand Identity Systems',
        slug: 'brand-identity-systems',
        shortDescription: 'End-to-end visual identities that give brands an unmistakable personality, authority, and emotional resonance.',
        fullDescription: 'From primary logo marks and secondary badges to typographic hierarchies, color palettes, stationery suites, and detailed brand guideline manuals that ensure consistency across all touchpoints.',
        icon: 'Palette',
        deliverables: [
          'Primary & Secondary Logo Marks',
          'Comprehensive Brand Guidelines (PDF & Digital)',
          'Custom Typography Hierarchy & Color System',
          'Business Cards & Stationery Suite',
          'Social Media Profile Kits & Templates',
          'Full Vector & High-Res Export Formats'
        ],
        order: 1,
        isActive: true
      },
      {
        title: 'Packaging & Print Architecture',
        slug: 'packaging-print-architecture',
        shortDescription: 'Tactile packaging, unboxing experiences, structural box dies, and shelf-dominating label designs.',
        fullDescription: 'Bridging structural functionality with high-end aesthetic craft. I manage dieline preparation, specialty finishing specifications (foil stamping, spot UV, blind embossing), and direct printer liaison.',
        icon: 'Package',
        deliverables: [
          'Custom Box & Container Dieline Layouts',
          'Product Label Systems & Compliance Specs',
          'Print Finishes: Foil, Deboss, Spot UV',
          'Photorealistic 3D Unboxing Mockups',
          'Printer-Ready CMYK / Pantone Vector Files'
        ],
        order: 2,
        isActive: true
      },
      {
        title: 'Poster Design & Editorial Layout',
        slug: 'poster-design-editorial-layout',
        shortDescription: 'Captivating typographic posters, event prints, magazines, annual reports, and editorial publications.',
        fullDescription: 'Transforming complex information and artistic concepts into striking printed layouts with impeccable grid precision, editorial pacing, and museum-worthy poster design.',
        icon: 'Layers',
        deliverables: [
          'Large-Format Silk-Screen & Offset Posters',
          'Magazine, Book, & Catalog Grid Layouts',
          'Exhibition Graphics & Signage',
          'Editorial Typography & Typesetting',
          'Pre-Press Color Proofing & Specifications'
        ],
        order: 3,
        isActive: true
      },
      {
        title: 'Social Media & Ad Campaigns',
        slug: 'social-media-ad-campaigns',
        shortDescription: 'Scroll-stopping social graphics, promotional carousels, banner suites, and viral visual marketing assets.',
        fullDescription: 'Strategic visual content engineered to capture attention in fractions of a second and convert viewers into loyal customers across Instagram, LinkedIn, and digital display networks.',
        icon: 'Sparkles',
        deliverables: [
          'Multi-Slide Educational & Promotional Carousels',
          'Display Ad Sets (Google, Meta, LinkedIn)',
          'Event & Launch Campaign Visual Suites',
          'Custom Figma Template Systems for Marketing Teams'
        ],
        order: 4,
        isActive: true
      },
      {
        title: 'Logo Design & Monogram Marks',
        slug: 'logo-design-monogram-marks',
        shortDescription: 'Distilled brand marks, geometric emblems, timeless monograms, and custom hand-drawn wordmarks.',
        fullDescription: 'Crafting minimalist, memorable marks that scale effortlessly from a 16px favicon to a 10-meter building sign while retaining maximum recognition.',
        icon: 'PenTool',
        deliverables: [
          'Exploratory Logo Concepts (3 Distinct Routes)',
          'Responsive Logo Lockups (Horizontal, Vertical, Icon)',
          'Monochrome & Color Variations',
          'Favicon & App Icon Suites',
          'Vector Source Files (AI, SVG, EPS, PDF, PNG)'
        ],
        order: 5,
        isActive: true
      },
      {
        title: 'Creative Direction & UI Concept',
        slug: 'creative-direction-ui-concept',
        shortDescription: 'High-concept digital design, art direction, and website aesthetics that match real-world brand elegance.',
        fullDescription: 'Guiding digital products with creative direction that elevates digital interactions into memorable brand stories through artful layout, typography, and micro-interactions.',
        icon: 'Layout',
        deliverables: [
          'Creative Direction & Moodboard Systems',
          'High-Fidelity Web Homepage & Key Page UI',
          'Figma Design Systems & Style Guides',
          'Interactive Prototype Walkthroughs'
        ],
        order: 6,
        isActive: true
      }
    ];

    await Service.insertMany(servicesData);

    // 5. Seed Testimonials
    console.log('[Seed] Seeding Testimonials...');
    await Testimonial.deleteMany({});
    const testimonialsData = [
      {
        clientName: 'Frederik Lindqvist',
        clientRole: 'Co-Founder & CEO',
        clientCompany: 'Lumina Skincare Nordic',
        clientAvatar: {
          url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
          publicId: 'test_frederik'
        },
        feedback: 'Alex transformed Lumina from a modest laboratory concept into an internationally recognized luxury brand. The packaging design won retail shelf placement across 40 boutique Nordic department stores within 60 days of launch.',
        rating: 5,
        isFeatured: true,
        isActive: true,
        order: 1
      },
      {
        clientName: 'Elena Rostova',
        clientRole: 'Head of Creative Strategy',
        clientCompany: 'Metropolis Film Festival Berlin',
        clientAvatar: {
          url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
          publicId: 'test_elena'
        },
        feedback: 'Working with Alex was the most seamless and inspiring creative collaboration our institution has experienced. The poster series became a collector item that festival attendees bought out within hours.',
        rating: 5,
        isFeatured: true,
        isActive: true,
        order: 2
      },
      {
        clientName: 'Marcus Vance',
        clientRole: 'Chief Marketing Officer',
        clientCompany: 'Nexus Global Financial Inc.',
        clientAvatar: {
          url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
          publicId: 'test_marcus'
        },
        feedback: 'In the fintech sector, standing out without sacrificing credibility is extremely rare. Alex delivered a masterclass in brand architecture and visual precision that our investors and customers both adore.',
        rating: 5,
        isFeatured: true,
        isActive: true,
        order: 3
      },
      {
        clientName: 'Sofia Thorne',
        clientRole: 'Founding Roaster',
        clientCompany: 'Verde Coffee Roasters',
        clientAvatar: {
          url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80',
          publicId: 'test_sofia'
        },
        feedback: 'Our coffee packaging consistently receives compliments from customers and baristas worldwide. Alex understands how tactile substrates and typography come together in the physical world.',
        rating: 5,
        isFeatured: true,
        isActive: true,
        order: 4
      }
    ];

    await Testimonial.insertMany(testimonialsData);

    // 6. Seed About
    console.log('[Seed] Seeding About...');
    await About.deleteMany({});
    await About.create({
      designerName: 'Alex Rivera',
      tagline: 'Senior Brand Identity & Visual Designer',
      profileImage: {
        url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
        publicId: 'about_alex'
      },
      bioIntro: 'Crafting thoughtful brand identities, striking editorial posters, and bespoke visual systems that inspire and endure.',
      bioFull: 'With over 8 years of multidisciplinary design experience, I partner with forward-thinking brands, visionary founders, and creative cultural institutions worldwide. My approach balances conceptual rigor with expressive modern typography, tactile print craftsmanship, and functional digital aesthetics.\n\nEvery project is treated as an original piece of architectural visual art — tailored to withstand trends and build genuine emotional affinity with audiences.',
      experienceYears: 8,
      skills: [
        { name: 'Brand Identity Systems', level: 98, category: 'Branding' },
        { name: 'Typography & Layout', level: 96, category: 'Print' },
        { name: 'Packaging & Dielines', level: 92, category: 'Physical' },
        { name: 'Poster & Editorial Art', level: 95, category: 'Visual Art' },
        { name: 'UI / UX Design', level: 88, category: 'Digital' },
        { name: '3D Mockups & Staging', level: 85, category: '3D' }
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
      ],
      resumeUrl: '#'
    });

    // 7. Seed Settings
    console.log('[Seed] Seeding Website Settings...');
    await WebsiteSettings.deleteMany({});
    await WebsiteSettings.create({
      websiteName: 'Studio Rivera — Graphic Design & Art Direction',
      designerName: 'Alex Rivera',
      logo: {
        url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=200&q=80',
        publicId: 'logo_rivera'
      },
      favicon: {
        url: '',
        publicId: ''
      },
      email: 'alex@riveradesign.studio',
      phone: '+1 (555) 382-9401',
      whatsapp: '+15553829401',
      address: 'Brooklyn, New York & Available Worldwide',
      instagramUrl: 'https://instagram.com',
      behanceUrl: 'https://behance.net',
      dribbbleUrl: 'https://dribbble.com',
      linkedinUrl: 'https://linkedin.com',
      githubUrl: 'https://github.com',
      twitterUrl: 'https://twitter.com',
      footerText: 'Crafted with precision, passion, and artistic dedication.',
      heroHeadline: 'Creative Designs That Make Brands Stand Out.',
      heroSubheadline: 'Visual identity, editorial posters, packaging, and digital design crafted with intention, timeless aesthetics, and high-impact visual storytelling.',
      contactCtaTitle: 'Have a Project in Mind?',
      contactCtaSubtitle: 'Let’s collaborate to build something remarkable. Inquire about brand design, art direction, and custom creative commissions.',
      metaTitle: 'Alex Rivera — Premium Graphic Designer & Art Director',
      metaDescription: 'Award-winning graphic design portfolio specializing in brand identity, packaging, typography, poster design, and art direction.'
    });

    // 8. Seed Media items
    console.log('[Seed] Seeding Media Library items...');
    await Media.deleteMany({});
    const sampleMedia = [
      {
        fileName: 'lumina-cover-bottle.jpg',
        originalName: 'lumina-cover-bottle.jpg',
        url: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=1200&q=85',
        publicId: 'proj_lumina_cover',
        mimeType: 'image/jpeg',
        size: 420000,
        width: 1200,
        height: 800,
        format: 'jpg',
        storageProvider: 'local'
      },
      {
        fileName: 'verde-coffee-bag.jpg',
        originalName: 'verde-coffee-bag.jpg',
        url: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?auto=format&fit=crop&w=1200&q=85',
        publicId: 'proj_verde_cover',
        mimeType: 'image/jpeg',
        size: 380000,
        width: 1200,
        height: 800,
        format: 'jpg',
        storageProvider: 'local'
      },
      {
        fileName: 'metropolis-poster-art.jpg',
        originalName: 'metropolis-poster-art.jpg',
        url: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=1200&q=85',
        publicId: 'proj_metropolis_cover',
        mimeType: 'image/jpeg',
        size: 512000,
        width: 1200,
        height: 800,
        format: 'jpg',
        storageProvider: 'local'
      },
      {
        fileName: 'nexus-fintech-brand.jpg',
        originalName: 'nexus-fintech-brand.jpg',
        url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=85',
        publicId: 'proj_nexus_cover',
        mimeType: 'image/jpeg',
        size: 460000,
        width: 1200,
        height: 800,
        format: 'jpg',
        storageProvider: 'local'
      }
    ];
    await Media.insertMany(sampleMedia);

    console.log('[Seed] Database seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('[Seed Error]', error);
    process.exit(1);
  }
};

seedData();
