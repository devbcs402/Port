import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowUpRight,
  ArrowRight,
  Sparkles,
  Star,
  Layers,
  Palette,
  Package,
  CheckCircle2,
  Users,
  Briefcase,
  Clock,
  Award
} from 'lucide-react';
import api from '../api/axios';
import { useSettings } from '../context/SettingsContext';
import ProjectCard from '../components/ProjectCard';
import { ProjectGridSkeleton } from '../components/SkeletonLoader';

const HomePage = () => {
  const { settings } = useSettings();
  const [featuredProjects, setFeaturedProjects] = useState([]);
  const [services, setServices] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [aboutData, setAboutData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [projRes, servRes, testRes, aboutRes] = await Promise.all([
          api.get('/projects/featured?limit=6'),
          api.get('/services'),
          api.get('/testimonials'),
          api.get('/about')
        ]);

        if (projRes.data.success) setFeaturedProjects(projRes.data.projects);
        if (servRes.data.success) setServices(servRes.data.services);
        if (testRes.data.success) setTestimonials(testRes.data.testimonials);
        if (aboutRes.data.success) setAboutData(aboutRes.data.about);
      } catch (err) {
        console.error('Error fetching homepage data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const headline = settings?.heroHeadline || 'Creative Designs That Make Brands Stand Out.';
  const subheadline =
    settings?.heroSubheadline ||
    'Visual identity, editorial posters, packaging, and digital design crafted with intention, timeless aesthetics, and high-impact visual storytelling.';
  const designerName = settings?.designerName || 'Gracy Pandya';

  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      {/* 1. HERO SECTION */}
      <section className="relative pt-36 pb-20 md:pt-44 md:pb-28 overflow-hidden">
        {/* Subtle background ambient light */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-gradient-to-tr from-indigo-100/40 via-purple-50/20 to-transparent blur-3xl -z-10 pointer-events-none rounded-full" />

        <div className="max-w-7xl mx-auto px-6 sm:px-8">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            {/* Availability Badge */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-gray-200/80 shadow-xs text-xs font-semibold text-gray-800"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>{settings?.availabilityStatus || 'Available for Select Projects 2026'}</span>
            </motion.div>

            {/* Main Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="font-display font-black text-4xl sm:text-6xl md:text-7xl tracking-tight text-gray-950 leading-[1.08]"
            >
              {headline}
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed"
            >
              {subheadline}
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-wrap items-center justify-center gap-4 pt-2"
            >
              <Link
                to="/portfolio"
                className="group px-7 py-3.5 rounded-full bg-gray-950 text-white font-medium text-sm flex items-center gap-2 hover:bg-black hover:shadow-lg transition-all"
              >
                <span>View My Work</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                to="/contact"
                className="px-7 py-3.5 rounded-full bg-white border border-gray-200 text-gray-900 font-medium text-sm hover:bg-gray-50 hover:border-gray-300 transition-all shadow-xs"
              >
                Contact Me
              </Link>
            </motion.div>
          </div>

          {/* Hero Visual Showcase Collage (Dynamically linked to Featured Projects from MongoDB) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mt-16 sm:mt-20 max-w-6xl mx-auto"
          >
            {featuredProjects && featuredProjects.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                {/* Primary Large Showcase */}
                {featuredProjects[0] && (
                  <Link
                    to={`/portfolio/${featuredProjects[0].slug}`}
                    className="md:col-span-8 overflow-hidden rounded-3xl bg-gray-100 aspect-[16/10] shadow-xl group border border-gray-100 relative block"
                  >
                    <img
                      src={featuredProjects[0].coverImage?.url}
                      alt={featuredProjects[0].title}
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6 sm:p-8">
                      <div className="text-white">
                        <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-[11px] font-bold uppercase tracking-wider mb-2 inline-block">
                          {featuredProjects[0].category?.name || 'Featured Project'}
                        </span>
                        <h3 className="font-display font-bold text-xl sm:text-2xl">
                          {featuredProjects[0].title}
                        </h3>
                        <p className="text-xs text-gray-200 mt-1 line-clamp-1 max-w-lg">
                          {featuredProjects[0].shortDescription}
                        </p>
                      </div>
                    </div>
                  </Link>
                )}

                {/* Secondary & Tertiary Showcases */}
                <div className="md:col-span-4 flex flex-col gap-6">
                  {featuredProjects[1] && (
                    <Link
                      to={`/portfolio/${featuredProjects[1].slug}`}
                      className="overflow-hidden rounded-3xl bg-gray-100 aspect-[4/3] shadow-lg group border border-gray-100 relative block"
                    >
                      <img
                        src={featuredProjects[1].coverImage?.url}
                        alt={featuredProjects[1].title}
                        className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-5">
                        <div className="text-white">
                          <span className="text-[10px] uppercase font-bold tracking-wider opacity-90 block">
                            {featuredProjects[1].category?.name}
                          </span>
                          <h4 className="font-display font-bold text-sm sm:text-base leading-tight mt-0.5">
                            {featuredProjects[1].title}
                          </h4>
                        </div>
                      </div>
                    </Link>
                  )}

                  {featuredProjects[2] ? (
                    <Link
                      to={`/portfolio/${featuredProjects[2].slug}`}
                      className="overflow-hidden rounded-3xl bg-gray-100 aspect-[4/3] shadow-lg group border border-gray-100 relative block"
                    >
                      <img
                        src={featuredProjects[2].coverImage?.url}
                        alt={featuredProjects[2].title}
                        className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-5">
                        <div className="text-white">
                          <span className="text-[10px] uppercase font-bold tracking-wider opacity-90 block">
                            {featuredProjects[2].category?.name}
                          </span>
                          <h4 className="font-display font-bold text-sm sm:text-base leading-tight mt-0.5">
                            {featuredProjects[2].title}
                          </h4>
                        </div>
                      </div>
                    </Link>
                  ) : featuredProjects[0]?.galleryImages?.[0] ? (
                    <div className="overflow-hidden rounded-3xl bg-gray-100 aspect-[4/3] shadow-lg group border border-gray-100">
                      <img
                        src={featuredProjects[0].galleryImages[0].url}
                        alt={featuredProjects[0].title}
                        className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
                      />
                    </div>
                  ) : null}
                </div>
              </div>
            ) : (
              <div className="aspect-[16/8] rounded-3xl bg-gray-50 border border-gray-200/80 flex items-center justify-center">
                <span className="text-xs uppercase font-bold tracking-wider text-gray-400">Loading Featured Projects...</span>
              </div>
            )}
          </motion.div>
        </div>
      </section>

      {/* 2. STATISTICS BANNER */}
      <section className="py-14 bg-white border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-6 sm:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 divide-y md:divide-y-0 md:divide-x divide-gray-100">
            {(aboutData?.statistics && aboutData.statistics.length > 0
              ? aboutData.statistics
              : [
                  { label: 'Completed Projects', value: '180', suffix: '+', icon: 'Briefcase' },
                  { label: 'Happy Global Clients', value: '75', suffix: '+', icon: 'Users' },
                  { label: 'Years Experience', value: '8', suffix: '+', icon: 'Clock' },
                  { label: 'Design Awards', value: '14', suffix: '', icon: 'Award' }
                ]
            ).map((stat, i) => (
              <div key={i} className={`text-center ${i > 0 ? 'pt-6 md:pt-0' : ''}`}>
                <p className="font-display font-extrabold text-3xl sm:text-5xl text-gray-950 tracking-tight">
                  {stat.value}
                  <span className="text-indigo-600 font-semibold">{stat.suffix}</span>
                </p>
                <p className="text-xs uppercase tracking-wider text-gray-500 font-semibold mt-2">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. FEATURED PROJECTS */}
      <section className="py-24 sm:py-32">
        <div className="max-w-7xl mx-auto px-6 sm:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-16">
            <div>
              <span className="text-xs uppercase font-bold tracking-widest text-indigo-600">
                Selected Works
              </span>
              <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-gray-950 mt-2 tracking-tight">
                Featured Projects
              </h2>
            </div>
            <Link
              to="/portfolio"
              className="group inline-flex items-center gap-2 text-sm font-semibold text-gray-900 hover:text-indigo-600 transition-colors"
            >
              <span>Explore All Projects</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          {loading ? (
            <ProjectGridSkeleton count={6} />
          ) : featuredProjects.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10">
              {featuredProjects.map((project, idx) => (
                <ProjectCard key={project._id} project={project} index={idx} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-gray-50 rounded-2xl border border-gray-100">
              <p className="text-gray-500">No featured projects found.</p>
            </div>
          )}
        </div>
      </section>

      {/* 4. ABOUT ME PREVIEW */}
      <section className="py-24 bg-white border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-6 sm:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            {/* Image */}
            <div className="lg:col-span-5">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                <div className="overflow-hidden rounded-3xl aspect-[4/5] bg-gray-100 shadow-xl border border-gray-100">
                  <img
                    src={
                      aboutData?.profileImage?.url ||
                      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80'
                    }
                    alt={designerName}
                    className="w-full h-full object-cover object-center"
                  />
                </div>
                {/* Floating experience badge */}
                <div className="absolute -bottom-6 -right-6 sm:bottom-6 sm:-right-6 bg-gray-950 text-white p-6 rounded-2xl shadow-xl max-w-[200px]">
                  <p className="font-display font-bold text-3xl">{aboutData?.experienceYears || 8}+</p>
                  <p className="text-xs text-gray-300 uppercase tracking-wider font-medium mt-1">
                    Years of Multidisciplinary Design Craft
                  </p>
                </div>
              </div>
            </div>

            {/* Narrative Content */}
            <div className="lg:col-span-7 space-y-6">
              <span className="text-xs uppercase font-bold tracking-widest text-indigo-600">
                About the Designer
              </span>
              <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-gray-950 tracking-tight">
                {aboutData?.tagline || 'Senior Brand Identity & Visual Designer'}
              </h2>
              <p className="text-gray-700 text-lg leading-relaxed font-normal">
                {aboutData?.bioIntro ||
                  'Crafting thoughtful brand identities, striking editorial posters, and bespoke visual systems that inspire and endure.'}
              </p>
              <p className="text-gray-500 text-sm leading-relaxed">
                {aboutData?.bioFull ||
                  'With over 8 years of multidisciplinary design experience, I partner with forward-thinking brands, visionary founders, and creative cultural institutions worldwide.'}
              </p>

              {/* Skills tags */}
              <div className="pt-2 flex flex-wrap gap-2">
                {(aboutData?.skills || [
                  { name: 'Brand Identity Systems' },
                  { name: 'Packaging & Dielines' },
                  { name: 'Typography & Layout' },
                  { name: 'Poster & Editorial Art' },
                  { name: 'UI / UX Design' }
                ]).map((skill, i) => (
                  <span
                    key={i}
                    className="px-3.5 py-1.5 rounded-full bg-gray-100 text-xs font-semibold text-gray-800"
                  >
                    {skill.name}
                  </span>
                ))}
              </div>

              <div className="pt-4">
                <Link
                  to="/about"
                  className="inline-flex items-center gap-2 text-sm font-semibold text-gray-950 hover:text-indigo-600 transition-colors"
                >
                  <span>Read Full Philosophy & Experience</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. SERVICES GRID */}
      <section className="py-24 sm:py-32">
        <div className="max-w-7xl mx-auto px-6 sm:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <span className="text-xs uppercase font-bold tracking-widest text-indigo-600">
              Capabilities
            </span>
            <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-gray-950 tracking-tight">
              Comprehensive Design Services
            </h2>
            <p className="text-sm text-gray-500">
              End-to-end creative solutions tailored to elevate brand presence across digital and physical mediums.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, idx) => (
              <div
                key={service._id || idx}
                className="group p-8 rounded-3xl bg-white border border-gray-200/80 hover:border-gray-950 transition-all duration-300 shadow-xs hover:shadow-md flex flex-col justify-between"
              >
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-900 group-hover:bg-gray-950 group-hover:text-white transition-colors mb-6">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <h3 className="font-display font-bold text-xl text-gray-950 mb-3">
                    {service.title}
                  </h3>
                  <p className="text-sm text-gray-500 leading-relaxed mb-6">
                    {service.shortDescription}
                  </p>
                  {service.deliverables && service.deliverables.length > 0 && (
                    <ul className="space-y-2 border-t border-gray-100 pt-5 text-xs text-gray-600">
                      {service.deliverables.slice(0, 3).map((d, dIdx) => (
                        <li key={dIdx} className="flex items-center gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                          <span className="truncate">{d}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
                <div className="pt-6 mt-6 border-t border-gray-100 flex items-center justify-between">
                  <Link
                    to="/services"
                    className="text-xs font-semibold text-gray-950 group-hover:text-indigo-600 flex items-center gap-1 transition-colors"
                  >
                    <span>View Details</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. CLIENT TESTIMONIALS */}
      <section className="py-24 bg-white border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-6 sm:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <span className="text-xs uppercase font-bold tracking-widest text-indigo-600">
              Endorsements
            </span>
            <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-gray-950 tracking-tight">
              What Founders & Art Directors Say
            </h2>
            <p className="text-sm text-gray-500">
              Trusted by international brands, creative cultural festivals, and fast-growing founders.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((test, idx) => (
              <div
                key={test._id || idx}
                className="p-8 rounded-3xl bg-[#FAFAFA] border border-gray-200/80 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-1 text-amber-400 mb-6">
                    {Array.from({ length: test.rating || 5 }).map((_, r) => (
                      <Star key={r} className="w-4 h-4 fill-amber-400" />
                    ))}
                  </div>
                  <blockquote className="text-sm sm:text-base text-gray-800 leading-relaxed font-normal italic">
                    "{test.feedback}"
                  </blockquote>
                </div>
                <div className="flex items-center gap-4 pt-8 mt-8 border-t border-gray-200/60">
                  {test.clientAvatar?.url ? (
                    <img
                      src={test.clientAvatar.url}
                      alt={test.clientName}
                      className="w-11 h-11 rounded-full object-cover shrink-0"
                    />
                  ) : (
                    <div className="w-11 h-11 rounded-full bg-gray-200 text-gray-700 font-bold flex items-center justify-center shrink-0 text-sm">
                      {test.clientName.charAt(0)}
                    </div>
                  )}
                  <div>
                    <h4 className="font-bold text-sm text-gray-950">{test.clientName}</h4>
                    <p className="text-xs text-gray-500">
                      {test.clientRole}
                      {test.clientCompany ? ` · ${test.clientCompany}` : ''}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. CONTACT CTA BANNER */}
      <section className="py-24 sm:py-32 bg-[#121212] text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-5xl mx-auto px-6 sm:px-8 text-center space-y-8 relative z-10">
          <span className="text-xs uppercase font-bold tracking-widest text-indigo-400">
            Let's Collaborate
          </span>
          <h2 className="font-display font-black text-3xl sm:text-5xl md:text-6xl tracking-tight leading-tight">
            {settings?.contactCtaTitle || 'Have a Project in Mind?'}
          </h2>
          <p className="text-gray-400 max-w-xl mx-auto text-base sm:text-lg leading-relaxed">
            {settings?.contactCtaSubtitle ||
              'Let’s collaborate to build something remarkable. Inquire about brand design, art direction, and custom creative commissions.'}
          </p>
          <div className="pt-2">
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-white text-gray-950 font-semibold text-sm hover:bg-gray-100 hover:shadow-2xl transition-all"
            >
              <span>Let's Start a Conversation</span>
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
