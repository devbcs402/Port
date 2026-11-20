import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, CheckCircle2, Award, Download, Sparkles, Clock, Users, Briefcase } from 'lucide-react';
import api from '../api/axios';
import { useSettings } from '../context/SettingsContext';

const AboutPage = () => {
  const { settings } = useSettings();
  const [about, setAbout] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAbout = async () => {
      try {
        const res = await api.get('/about');
        if (res.data.success) {
          setAbout(res.data.about);
        }
      } catch (err) {
        console.error('Error fetching about data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAbout();
    window.scrollTo(0, 0);
  }, []);

  const designerName = about?.designerName || settings?.designerName || 'Alex Rivera';

  return (
    <div className="min-h-screen bg-[#FAFAFA] pt-32 pb-28">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        {/* Header */}
        <div className="max-w-3xl mb-16 space-y-4">
          <span className="text-xs uppercase font-bold tracking-widest text-indigo-600">
            About the Designer
          </span>
          <h1 className="font-display font-black text-4xl sm:text-6xl text-gray-950 tracking-tight leading-tight">
            Design Built with Rigor, Craft, and Purpose.
          </h1>
          <p className="text-gray-600 text-lg sm:text-xl leading-relaxed">
            {about?.tagline || 'Senior Brand Identity & Visual Designer'}
          </p>
        </div>

        {/* Hero Narrative & Portrait */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start mb-24">
          <div className="lg:col-span-5">
            <div className="relative">
              <div className="overflow-hidden rounded-3xl aspect-[4/5] bg-gray-100 shadow-xl border border-gray-100">
                <img
                  src={
                    about?.profileImage?.url ||
                    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80'
                  }
                  alt={designerName}
                  className="w-full h-full object-cover object-center"
                />
              </div>
              <div className="absolute -bottom-6 -right-4 bg-gray-950 text-white p-6 rounded-2xl shadow-xl max-w-[220px]">
                <p className="font-display font-bold text-3xl">{about?.experienceYears || 8}+</p>
                <p className="text-xs text-gray-300 uppercase tracking-wider font-medium mt-1">
                  Years of Creative Art Direction
                </p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 space-y-6">
            <h3 className="font-display font-bold text-2xl text-gray-950">
              {about?.bioIntro ||
                'Crafting thoughtful brand identities, striking editorial posters, and bespoke visual systems that inspire and endure.'}
            </h3>
            <div className="text-gray-700 leading-relaxed space-y-4 whitespace-pre-line text-base">
              {about?.bioFull ||
                'With over 8 years of multidisciplinary design experience, I partner with forward-thinking brands, visionary founders, and creative cultural institutions worldwide. My approach balances conceptual rigor with expressive modern typography, tactile print craftsmanship, and functional digital aesthetics.\n\nEvery project is treated as an original piece of architectural visual art — tailored to withstand trends and build genuine emotional affinity with audiences.'}
            </div>

            {/* Statistics Row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 border-t border-gray-200">
              {(about?.statistics || [
                { label: 'Projects Completed', value: '180', suffix: '+' },
                { label: 'Happy Clients', value: '75', suffix: '+' },
                { label: 'Years Experience', value: '8', suffix: '+' },
                { label: 'Design Awards', value: '14', suffix: '' }
              ]).map((stat, i) => (
                <div key={i} className="p-4 rounded-2xl bg-white border border-gray-100 shadow-xs">
                  <p className="font-display font-bold text-2xl text-gray-950">
                    {stat.value}
                    <span className="text-indigo-600 text-lg">{stat.suffix}</span>
                  </p>
                  <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mt-1">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>

            <div className="pt-4 flex flex-wrap gap-4">
              <Link
                to="/contact"
                className="px-7 py-3 rounded-full bg-gray-950 text-white text-xs font-semibold hover:bg-black transition-all shadow-xs"
              >
                Let's Work Together
              </Link>
            </div>
          </div>
        </div>

        {/* Skills & Software Knowledge */}
        <section className="mb-24 pt-16 border-t border-gray-200">
          <div className="max-w-2xl mb-12">
            <span className="text-xs uppercase font-bold tracking-widest text-indigo-600">
              Expertise & Tools
            </span>
            <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-gray-950 mt-1">
              Skills & Software Mastery
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            {/* Skills Bars */}
            <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-xs space-y-6">
              <h3 className="font-display font-bold text-xl text-gray-950 mb-4">
                Core Competencies
              </h3>
              {(about?.skills || [
                { name: 'Brand Identity Systems', level: 98 },
                { name: 'Typography & Editorial Layout', level: 96 },
                { name: 'Packaging Design & Dielines', level: 92 },
                { name: 'Poster & Visual Artwork', level: 95 },
                { name: 'UI / UX Product Concept', level: 88 },
                { name: '3D Mockup Rendering', level: 85 }
              ]).map((skill, idx) => (
                <div key={idx} className="space-y-2">
                  <div className="flex justify-between text-xs font-bold uppercase tracking-wider text-gray-700">
                    <span>{skill.name}</span>
                    <span className="text-indigo-600">{skill.level}%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-gray-100 overflow-hidden">
                    <div
                      className="h-full bg-gray-950 rounded-full transition-all duration-1000"
                      style={{ width: `${skill.level}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Software Knowledge Cards */}
            <div className="grid grid-cols-2 gap-4">
              {(about?.softwareKnowledge || [
                { name: 'Adobe Photoshop', proficiency: 'Master' },
                { name: 'Adobe Illustrator', proficiency: 'Master' },
                { name: 'Adobe InDesign', proficiency: 'Expert' },
                { name: 'Figma', proficiency: 'Expert' },
                { name: 'Blender 3D', proficiency: 'Proficient' },
                { name: 'After Effects', proficiency: 'Proficient' }
              ]).map((software, idx) => (
                <div
                  key={idx}
                  className="p-6 rounded-2xl bg-white border border-gray-100 shadow-xs flex flex-col justify-between"
                >
                  <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-900 mb-4 font-bold text-sm">
                    <Sparkles className="w-4 h-4 text-indigo-600" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-gray-900">{software.name}</h4>
                    <span className="inline-block mt-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider bg-indigo-50 text-indigo-700">
                      {software.proficiency}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 4-Step Creative Work Process */}
        <section className="mb-24 pt-16 border-t border-gray-200">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <span className="text-xs uppercase font-bold tracking-widest text-indigo-600">
              Methodology
            </span>
            <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-gray-950">
              The 4-Phase Creative Process
            </h2>
            <p className="text-sm text-gray-500">
              How every project moves from raw concept to world-class execution with total transparency.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {(about?.workProcess || [
              {
                stepNumber: 1,
                title: 'Discovery & Brief',
                description:
                  'Deep dive into brand core, competitive market landscape, audience psychology, and clear aesthetic goals.'
              },
              {
                stepNumber: 2,
                title: 'Concept Strategy',
                description:
                  'Moodboards, typographic exploration, sketch ideation, and defining distinct art direction routes.'
              },
              {
                stepNumber: 3,
                title: 'Design Execution',
                description:
                  'Transforming approved concepts into meticulous vector systems, packaging dies, posters, and real-world mockups.'
              },
              {
                stepNumber: 4,
                title: 'Launch Delivery',
                description:
                  'Exporting production-ready vector assets, high-res print files, digital specs, and brand style guides.'
              }
            ]).map((step, idx) => (
              <div
                key={idx}
                className="p-8 rounded-3xl bg-white border border-gray-100 shadow-xs flex flex-col justify-between"
              >
                <div>
                  <span className="font-display font-black text-4xl text-gray-200">
                    0{step.stepNumber}
                  </span>
                  <h3 className="font-display font-bold text-lg text-gray-950 mt-4 mb-2">
                    {step.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Bottom CTA */}
        <div className="p-10 sm:p-14 rounded-3xl bg-gray-950 text-white text-center space-y-6">
          <h3 className="font-display font-black text-2xl sm:text-4xl">
            Ready to Elevate Your Brand's Visual Presence?
          </h3>
          <p className="text-gray-400 max-w-xl mx-auto text-sm sm:text-base">
            Let's connect and discuss your upcoming project or branding initiative.
          </p>
          <div>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-white text-gray-950 font-semibold text-xs uppercase tracking-wider hover:bg-gray-100 transition-all shadow-lg"
            >
              <span>Get in Touch</span>
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
