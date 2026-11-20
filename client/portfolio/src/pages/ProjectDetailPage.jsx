import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Calendar,
  User,
  Wrench,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Maximize2
} from 'lucide-react';
import api from '../api/axios';
import LightboxModal from '../components/LightboxModal';
import ProjectCard from '../components/ProjectCard';

const ProjectDetailPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [navigation, setNavigation] = useState({ prev: null, next: null });
  const [relatedProjects, setRelatedProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Lightbox state
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  useEffect(() => {
    const fetchProject = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await api.get(`/projects/slug/${slug}`);
        if (res.data.success) {
          setProject(res.data.project);
          setNavigation(res.data.navigation || {});
          setRelatedProjects(res.data.relatedProjects || []);
        }
      } catch (err) {
        console.error('Error fetching project:', err);
        setError(err.response?.data?.message || 'Project not found');
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
    window.scrollTo(0, 0);
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAFAFA] pt-40 pb-28">
        <div className="max-w-5xl mx-auto px-6 sm:px-8 animate-pulse space-y-6">
          <div className="h-6 bg-gray-200 rounded w-1/4"></div>
          <div className="h-12 bg-gray-200 rounded w-3/4"></div>
          <div className="w-full aspect-[16/9] bg-gray-200 rounded-3xl mt-8"></div>
        </div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="min-h-screen bg-[#FAFAFA] pt-40 pb-28 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-8 bg-white rounded-3xl border border-gray-100 shadow-sm">
          <h2 className="font-display font-bold text-2xl text-gray-900 mb-2">Project Not Found</h2>
          <p className="text-sm text-gray-500 mb-6">{error || 'This case study does not exist or has been unpublished.'}</p>
          <Link
            to="/portfolio"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-gray-950 text-white text-xs font-semibold hover:bg-black transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Portfolio</span>
          </Link>
        </div>
      </div>
    );
  }

  // Combine cover image and gallery images for the lightbox viewer
  const allImages = [
    { url: project.coverImage?.url, alt: project.coverImage?.alt || project.title },
    ...(project.galleryImages || []).map((img, i) => ({
      url: img.url,
      alt: img.alt || `${project.title} - Image ${i + 2}`
    }))
  ].filter((img) => Boolean(img.url));

  const openLightbox = (index) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] pt-32 pb-28">
      {/* Lightbox Modal */}
      <LightboxModal
        isOpen={lightboxOpen}
        images={allImages}
        currentIndex={lightboxIndex}
        onClose={() => setLightboxOpen(false)}
        onNavigate={(newIdx) => setLightboxIndex(newIdx)}
      />

      <div className="max-w-6xl mx-auto px-6 sm:px-8">
        {/* Breadcrumb / Back Link */}
        <div className="mb-8">
          <Link
            to="/portfolio"
            className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-gray-500 hover:text-gray-950 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to All Works</span>
          </Link>
        </div>

        {/* Project Header */}
        <header className="mb-12 space-y-4">
          <div className="flex flex-wrap items-center gap-2 text-xs font-bold uppercase tracking-wider text-indigo-600">
            <span>{project.category?.name || 'Graphic Design'}</span>
            {project.projectDate && (
              <>
                <span>·</span>
                <span className="text-gray-400 font-normal">{project.projectDate}</span>
              </>
            )}
          </div>
          <h1 className="font-display font-black text-3xl sm:text-5xl md:text-6xl text-gray-950 tracking-tight leading-tight">
            {project.title}
          </h1>
          <p className="text-gray-600 text-lg sm:text-xl max-w-3xl leading-relaxed">
            {project.shortDescription}
          </p>
        </header>

        {/* Hero Cover Image */}
        <div
          onClick={() => openLightbox(0)}
          className="relative group cursor-pointer overflow-hidden rounded-3xl bg-gray-100 aspect-[16/10] sm:aspect-[16/9] mb-14 shadow-lg border border-gray-100"
        >
          <img
            src={project.coverImage?.url}
            alt={project.coverImage?.alt || project.title}
            className="w-full h-full object-cover object-center group-hover:scale-102 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <span className="px-4 py-2 rounded-full bg-white/90 backdrop-blur-md text-xs font-semibold text-gray-900 flex items-center gap-2 shadow-md">
              <Maximize2 className="w-3.5 h-3.5" />
              <span>Click to Expand</span>
            </span>
          </div>
        </div>

        {/* Project Metadata Specs Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 p-6 sm:p-8 rounded-3xl bg-white border border-gray-100 shadow-xs mb-16">
          <div>
            <p className="text-xs uppercase font-bold tracking-wider text-gray-400 mb-1 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-gray-400" />
              <span>Client</span>
            </p>
            <p className="font-semibold text-sm text-gray-900">{project.clientName || 'Confidential / Studio Project'}</p>
          </div>
          <div>
            <p className="text-xs uppercase font-bold tracking-wider text-gray-400 mb-1 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-gray-400" />
              <span>Timeline</span>
            </p>
            <p className="font-semibold text-sm text-gray-900">{project.projectDate || '2025 – 2026'}</p>
          </div>
          <div>
            <p className="text-xs uppercase font-bold tracking-wider text-gray-400 mb-1 flex items-center gap-1.5">
              <Wrench className="w-3.5 h-3.5 text-gray-400" />
              <span>Tools</span>
            </p>
            <p className="font-semibold text-sm text-gray-900 truncate">
              {project.toolsUsed && project.toolsUsed.length > 0
                ? project.toolsUsed.slice(0, 3).join(', ')
                : 'Illustrator, Photoshop'}
            </p>
          </div>
          <div>
            <p className="text-xs uppercase font-bold tracking-wider text-gray-400 mb-1 flex items-center gap-1.5">
              <ExternalLink className="w-3.5 h-3.5 text-gray-400" />
              <span>Website</span>
            </p>
            {project.projectUrl ? (
              <a
                href={project.projectUrl}
                target="_blank"
                rel="noreferrer"
                className="font-semibold text-sm text-indigo-600 hover:text-indigo-800 transition-colors inline-flex items-center gap-1"
              >
                <span>Live Project</span>
                <ArrowUpRight className="w-3 h-3" />
              </a>
            ) : (
              <p className="text-sm text-gray-400">Physical Print / N/A</p>
            )}
          </div>
        </div>

        {/* Project Narrative Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-20">
          <div className="lg:col-span-4 space-y-6">
            <div className="p-6 rounded-2xl bg-white border border-gray-100 shadow-xs space-y-3">
              <h4 className="font-display font-bold text-base text-gray-950">Design Objective</h4>
              <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">
                {project.designObjective ||
                  'Create an unmistakable visual identity and tactile packaging experience that resonates with international audiences and communicates brand distinction.'}
              </p>
            </div>

            {project.toolsUsed && project.toolsUsed.length > 0 && (
              <div className="p-6 rounded-2xl bg-white border border-gray-100 shadow-xs space-y-3">
                <h4 className="font-display font-bold text-base text-gray-950">Software & Mediums</h4>
                <div className="flex flex-wrap gap-2">
                  {project.toolsUsed.map((tool, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 rounded-full bg-gray-100 text-xs font-semibold text-gray-800"
                    >
                      {tool}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="lg:col-span-8 space-y-8">
            {/* Creative Process */}
            {project.designProcess && (
              <div className="space-y-4">
                <h3 className="font-display font-extrabold text-2xl text-gray-950 tracking-tight">
                  Creative Process & Strategy
                </h3>
                <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                  {project.designProcess}
                </p>
              </div>
            )}

            {/* Case Study Full Story */}
            <div className="space-y-4">
              <h3 className="font-display font-extrabold text-2xl text-gray-950 tracking-tight">
                Design System & Execution
              </h3>
              <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                {project.fullDescription}
              </p>
            </div>
          </div>
        </div>

        {/* Gallery Section */}
        {project.galleryImages && project.galleryImages.length > 0 && (
          <section className="mb-24">
            <div className="mb-8 flex items-end justify-between">
              <div>
                <span className="text-xs uppercase font-bold tracking-widest text-indigo-600">
                  Visual Showcase
                </span>
                <h3 className="font-display font-extrabold text-3xl text-gray-950 mt-1">
                  Project Gallery & Artifacts
                </h3>
              </div>
              <p className="text-xs text-gray-400">Click any image to view fullscreen</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {project.galleryImages.map((img, idx) => (
                <div
                  key={img._id || idx}
                  onClick={() => openLightbox(idx + 1)}
                  className="group cursor-pointer overflow-hidden rounded-2xl bg-gray-100 aspect-[4/3] relative border border-gray-100 shadow-xs"
                >
                  <img
                    src={img.url}
                    alt={img.alt || `${project.title} gallery item`}
                    loading="lazy"
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <div className="p-3 rounded-full bg-white text-gray-900 shadow-md">
                      <Maximize2 className="w-5 h-5" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Previous & Next Project Navigation */}
        <div className="py-12 border-y border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-6 mb-20">
          {navigation.prev ? (
            <Link
              to={`/portfolio/${navigation.prev.slug}`}
              className="group flex items-center gap-3 text-left w-full sm:w-auto"
            >
              <div className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-700 group-hover:bg-gray-950 group-hover:text-white transition-colors">
                <ChevronLeft className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs uppercase font-semibold text-gray-400">Previous Project</span>
                <p className="font-bold text-sm text-gray-900 group-hover:text-indigo-600 transition-colors line-clamp-1 max-w-[200px]">
                  {navigation.prev.title}
                </p>
              </div>
            </Link>
          ) : (
            <div className="w-10"></div>
          )}

          <Link
            to="/portfolio"
            className="px-5 py-2 rounded-full bg-white border border-gray-200 text-xs font-semibold text-gray-800 hover:bg-gray-100 transition-colors"
          >
            All Projects
          </Link>

          {navigation.next ? (
            <Link
              to={`/portfolio/${navigation.next.slug}`}
              className="group flex items-center gap-3 text-right w-full sm:w-auto justify-end"
            >
              <div>
                <span className="text-xs uppercase font-semibold text-gray-400">Next Project</span>
                <p className="font-bold text-sm text-gray-900 group-hover:text-indigo-600 transition-colors line-clamp-1 max-w-[200px]">
                  {navigation.next.title}
                </p>
              </div>
              <div className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-700 group-hover:bg-gray-950 group-hover:text-white transition-colors">
                <ChevronRight className="w-5 h-5" />
              </div>
            </Link>
          ) : (
            <div className="w-10"></div>
          )}
        </div>

        {/* Related Projects */}
        {relatedProjects.length > 0 && (
          <section>
            <div className="mb-10">
              <span className="text-xs uppercase font-bold tracking-widest text-indigo-600">
                More from {project.category?.name || 'this category'}
              </span>
              <h3 className="font-display font-extrabold text-2xl sm:text-3xl text-gray-950 mt-1">
                Related Design Works
              </h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {relatedProjects.map((relProj) => (
                <ProjectCard key={relProj._id} project={relProj} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default ProjectDetailPage;
