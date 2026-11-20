import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Save,
  Upload,
  X,
  Plus,
  Image as ImageIcon,
  Lock,
  Unlock,
  Sparkles,
  ExternalLink,
  Trash2
} from 'lucide-react';
import api from '../api/axios';
import Toast from '../components/Toast';

const ProjectFormPage = () => {
  const { id } = useParams();
  const isEditMode = Boolean(id);
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(isEditMode);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);
  const [slugLocked, setSlugLocked] = useState(true);

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    category: '',
    shortDescription: '',
    fullDescription: '',
    clientName: '',
    projectDate: '',
    projectUrl: '',
    designObjective: '',
    designProcess: '',
    toolsUsed: 'Adobe Illustrator, Photoshop',
    isFeatured: false,
    isPublished: true,
    seoTitle: '',
    seoDescription: ''
  });

  // Images State
  const [coverImageUrl, setCoverImageUrl] = useState('');
  const [coverFile, setCoverFile] = useState(null);

  const [galleryImages, setGalleryImages] = useState([]); // [{ url, alt, publicId }]
  const [galleryFiles, setGalleryFiles] = useState([]); // File objects to upload

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await api.get('/categories');
        if (res.data.success) {
          setCategories(res.data.categories);
          if (!isEditMode && res.data.categories.length > 0) {
            setFormData((prev) => ({ ...prev, category: res.data.categories[0]._id }));
          }
        }
      } catch (err) {
        console.error('Error fetching categories:', err);
      }
    };

    fetchCategories();

    if (isEditMode) {
      const fetchProject = async () => {
        try {
          const res = await api.get(`/projects/${id}`);
          if (res.data.success) {
            const p = res.data.project;
            setFormData({
              title: p.title || '',
              slug: p.slug || '',
              category: p.category?._id || p.category || '',
              shortDescription: p.shortDescription || '',
              fullDescription: p.fullDescription || '',
              clientName: p.clientName || '',
              projectDate: p.projectDate || '',
              projectUrl: p.projectUrl || '',
              designObjective: p.designObjective || '',
              designProcess: p.designProcess || '',
              toolsUsed: Array.isArray(p.toolsUsed) ? p.toolsUsed.join(', ') : p.toolsUsed || '',
              isFeatured: p.isFeatured || false,
              isPublished: p.isPublished !== undefined ? p.isPublished : true,
              seoTitle: p.seoTitle || '',
              seoDescription: p.seoDescription || ''
            });

            if (p.coverImage?.url) {
              setCoverImageUrl(p.coverImage.url);
            }

            if (p.galleryImages && Array.isArray(p.galleryImages)) {
              setGalleryImages(p.galleryImages);
            }
          }
        } catch (err) {
          console.error('Error loading project details:', err);
          setToast({ type: 'error', message: 'Failed to load project details' });
        } finally {
          setLoading(false);
        }
      };

      fetchProject();
    }
  }, [id, isEditMode]);

  // Handle title change and auto-slugify
  const handleTitleChange = (e) => {
    const val = e.target.value;
    const updates = { title: val };
    if (!isEditMode && slugLocked) {
      updates.slug = val
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
    }
    setFormData((prev) => ({ ...prev, ...updates }));
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Cover image file selection
  const handleCoverFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCoverFile(file);
      setCoverImageUrl(URL.createObjectURL(file));
    }
  };

  // Gallery multi-file selection
  const handleGalleryFilesChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      setGalleryFiles((prev) => [...prev, ...files]);
      const newPreviews = files.map((f, i) => ({
        url: URL.createObjectURL(f),
        alt: `${formData.title || 'Project'} visual ${i + 1}`,
        isNewLocal: true
      }));
      setGalleryImages((prev) => [...prev, ...newPreviews]);
    }
  };

  const removeGalleryImage = (indexToRemove) => {
    setGalleryImages((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    if (!formData.title.trim()) {
      setToast({ type: 'error', message: 'Project title is required' });
      setSaving(false);
      return;
    }

    if (!formData.category) {
      setToast({ type: 'error', message: 'Please select a design category' });
      setSaving(false);
      return;
    }

    if (!coverImageUrl && !coverFile) {
      setToast({ type: 'error', message: 'Please provide a cover image' });
      setSaving(false);
      return;
    }

    try {
      const payload = new FormData();
      payload.append('title', formData.title.trim());
      payload.append('slug', formData.slug.trim());
      payload.append('category', formData.category);
      payload.append('shortDescription', formData.shortDescription.trim());
      payload.append('fullDescription', formData.fullDescription.trim());
      payload.append('clientName', formData.clientName.trim());
      payload.append('projectDate', formData.projectDate.trim());
      payload.append('projectUrl', formData.projectUrl.trim());
      payload.append('designObjective', formData.designObjective.trim());
      payload.append('designProcess', formData.designProcess.trim());
      payload.append('toolsUsed', formData.toolsUsed);
      payload.append('isFeatured', formData.isFeatured);
      payload.append('isPublished', formData.isPublished);
      payload.append('seoTitle', formData.seoTitle.trim());
      payload.append('seoDescription', formData.seoDescription.trim());

      // If user provided a URL directly for cover
      if (coverImageUrl && !coverFile) {
        payload.append('coverImage', JSON.stringify({ url: coverImageUrl, alt: formData.title }));
      } else if (coverFile) {
        payload.append('cover', coverFile);
      }

      // Existing gallery images that are already saved remotely
      const existingGallery = galleryImages
        .filter((img) => !img.isNewLocal)
        .map((img, i) => ({ url: img.url, alt: img.alt || '', order: i }));
      payload.append('galleryImages', JSON.stringify(existingGallery));

      // Append new gallery files
      galleryFiles.forEach((file) => {
        payload.append('gallery', file);
      });

      let res;
      if (isEditMode) {
        res = await api.put(`/projects/${id}`, payload, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      } else {
        res = await api.post('/projects', payload, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      }

      if (res.data.success) {
        setToast({
          type: 'success',
          message: isEditMode ? 'Project updated successfully' : 'Project created successfully'
        });
        setTimeout(() => {
          navigate('/projects');
        }, 800);
      }
    } catch (err) {
      console.error('Project save error:', err);
      setToast({
        type: 'error',
        message: err.response?.data?.message || 'Failed to save project. Please check input.'
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8 max-w-4xl mx-auto space-y-6 animate-pulse">
        <div className="h-8 bg-slate-200 rounded w-1/3"></div>
        <div className="h-64 bg-slate-200 rounded-3xl"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-16">
      {toast && (
        <Toast
          type={toast.type}
          message={toast.message}
          onClose={() => setToast(null)}
        />
      )}

      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            to="/projects"
            className="p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-200 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
              {isEditMode ? 'Edit Design Project' : 'Create New Project'}
            </h2>
            <p className="text-xs text-slate-500">
              {isEditMode
                ? 'Update visual showcase and case study copy'
                : 'Publish a new graphic design project to your live portfolio'}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleSubmit}
          disabled={saving}
          className="px-6 py-2.5 rounded-xl bg-slate-900 text-white hover:bg-black text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all shadow-md disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          <span>{saving ? 'Saving...' : 'Save Project'}</span>
        </button>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column (Primary Details) */}
        <div className="lg:col-span-8 space-y-6">
          {/* Main Card */}
          <div className="p-6 sm:p-8 bg-white rounded-3xl border border-slate-200/80 shadow-xs space-y-5">
            <h3 className="font-bold text-base text-slate-900 mb-2">Project Overview</h3>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Project Title <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={handleTitleChange}
                placeholder="e.g. Lumina Botanicals — Cosmetic Identity"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:border-slate-900 focus:bg-white transition-all font-semibold"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  URL Slug <span className="text-rose-500">*</span>
                </label>
                <button
                  type="button"
                  onClick={() => setSlugLocked(!slugLocked)}
                  className="text-xs text-slate-400 hover:text-slate-700 flex items-center gap-1"
                >
                  {slugLocked ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
                  <span>{slugLocked ? 'Locked (Auto)' : 'Manual Edit'}</span>
                </button>
              </div>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-mono text-slate-400">
                  /portfolio/
                </span>
                <input
                  type="text"
                  required
                  disabled={slugLocked}
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  placeholder="lumina-botanicals-cosmetic-identity"
                  className="w-full pl-24 pr-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono text-slate-700 focus:outline-none focus:border-slate-900 focus:bg-white disabled:opacity-60 transition-all"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Design Category <span className="text-rose-500">*</span>
                </label>
                <select
                  required
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-800 focus:outline-none focus:border-slate-900"
                >
                  <option value="">Select Category</option>
                  {categories.map((c) => (
                    <option key={c._id} value={c._id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Client Name
                </label>
                <input
                  type="text"
                  value={formData.clientName}
                  onChange={handleInputChange}
                  name="clientName"
                  placeholder="e.g. Lumina Nordic Lab"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:outline-none focus:border-slate-900 focus:bg-white transition-all"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Project Date / Year
                </label>
                <input
                  type="text"
                  value={formData.projectDate}
                  onChange={handleInputChange}
                  name="projectDate"
                  placeholder="e.g. January 2026"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:outline-none focus:border-slate-900 focus:bg-white transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Live Project URL (Optional)
                </label>
                <input
                  type="url"
                  value={formData.projectUrl}
                  onChange={handleInputChange}
                  name="projectUrl"
                  placeholder="https://example.com"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:outline-none focus:border-slate-900 focus:bg-white transition-all"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Short Summary Description <span className="text-rose-500">*</span>
                </label>
                <span className="text-[10px] text-slate-400">
                  {formData.shortDescription.length} / 300
                </span>
              </div>
              <textarea
                rows="2"
                required
                maxLength="300"
                value={formData.shortDescription}
                onChange={handleInputChange}
                name="shortDescription"
                placeholder="Brief summary appearing on homepage and gallery cards..."
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:outline-none focus:border-slate-900 focus:bg-white transition-all"
              />
            </div>
          </div>

          {/* Narrative & Case Study Content */}
          <div className="p-6 sm:p-8 bg-white rounded-3xl border border-slate-200/80 shadow-xs space-y-5">
            <h3 className="font-bold text-base text-slate-900 mb-2">Case Study Narrative</h3>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Design Objective
              </label>
              <textarea
                rows="3"
                value={formData.designObjective}
                onChange={handleInputChange}
                name="designObjective"
                placeholder="What challenge was this design commissioned to solve? Goals, market positioning, target audience..."
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:outline-none focus:border-slate-900 focus:bg-white transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Creative Process & Visual Strategy
              </label>
              <textarea
                rows="4"
                value={formData.designProcess}
                onChange={handleInputChange}
                name="designProcess"
                placeholder="Describe your research, sketching, typographic exploration, tactile prototypes, or print tests..."
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:outline-none focus:border-slate-900 focus:bg-white transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Full Case Study Story <span className="text-rose-500">*</span>
              </label>
              <textarea
                rows="6"
                required
                value={formData.fullDescription}
                onChange={handleInputChange}
                name="fullDescription"
                placeholder="In-depth narrative explaining the final identity system, typography, color palettes, finishes, and results..."
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:outline-none focus:border-slate-900 focus:bg-white transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Tools Used (Comma separated)
              </label>
              <input
                type="text"
                value={formData.toolsUsed}
                onChange={handleInputChange}
                name="toolsUsed"
                placeholder="Adobe Illustrator, Photoshop, InDesign, Blender 3D, Figma"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:outline-none focus:border-slate-900 focus:bg-white transition-all"
              />
            </div>
          </div>

          {/* Gallery Images Management */}
          <div className="p-6 sm:p-8 bg-white rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-base text-slate-900">Gallery Images & Artifacts</h3>
                <p className="text-xs text-slate-500">Posters, packaging unboxing, banners, and 3D mockups</p>
              </div>
              <label className="cursor-pointer px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold flex items-center gap-2 transition-colors">
                <Plus className="w-3.5 h-3.5" />
                <span>Add Images</span>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleGalleryFilesChange}
                  className="hidden"
                />
              </label>
            </div>

            {galleryImages.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-2">
                {galleryImages.map((img, idx) => (
                  <div
                    key={idx}
                    className="relative group aspect-[4/3] rounded-2xl overflow-hidden bg-slate-100 border border-slate-200"
                  >
                    <img src={img.url} alt="Gallery item" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => removeGalleryImage(idx)}
                      className="absolute top-2 right-2 p-1.5 rounded-full bg-slate-900/80 text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-rose-600"
                      title="Remove image"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 border-2 border-dashed border-slate-200 rounded-2xl text-center">
                <ImageIcon className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                <p className="text-xs text-slate-500">No gallery images added yet.</p>
              </div>
            )}
          </div>
        </div>

        {/* Right Column (Status, Cover Image, SEO) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Status & Visibility Card */}
          <div className="p-6 bg-white rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
            <h3 className="font-bold text-sm text-slate-900">Visibility & Status</h3>

            {/* Published toggle */}
            <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-100">
              <div>
                <p className="font-bold text-xs text-slate-900">Published Status</p>
                <p className="text-[10px] text-slate-400">Visible on public portfolio</p>
              </div>
              <input
                type="checkbox"
                name="isPublished"
                checked={formData.isPublished}
                onChange={handleInputChange}
                className="w-4 h-4 accent-slate-900 rounded"
              />
            </div>

            {/* Featured toggle */}
            <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-100">
              <div>
                <p className="font-bold text-xs text-slate-900">Featured Design</p>
                <p className="text-[10px] text-slate-400">Showcase on Homepage</p>
              </div>
              <input
                type="checkbox"
                name="isFeatured"
                checked={formData.isFeatured}
                onChange={handleInputChange}
                className="w-4 h-4 accent-slate-900 rounded"
              />
            </div>
          </div>

          {/* Cover Image Card */}
          <div className="p-6 bg-white rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
            <h3 className="font-bold text-sm text-slate-900">
              Cover Image <span className="text-rose-500">*</span>
            </h3>

            {coverImageUrl ? (
              <div className="relative group rounded-2xl overflow-hidden aspect-[16/11] bg-slate-100 border border-slate-200">
                <img
                  src={coverImageUrl}
                  alt="Cover preview"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <label className="cursor-pointer px-3 py-1.5 rounded-lg bg-white text-slate-900 text-xs font-bold hover:bg-slate-100">
                    Replace
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleCoverFileChange}
                      className="hidden"
                    />
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setCoverImageUrl('');
                      setCoverFile(null);
                    }}
                    className="p-1.5 rounded-lg bg-rose-600 text-white text-xs hover:bg-rose-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ) : (
              <label className="cursor-pointer flex flex-col items-center justify-center p-6 border-2 border-dashed border-slate-200 rounded-2xl hover:border-slate-400 hover:bg-slate-50 transition-colors">
                <Upload className="w-8 h-8 text-slate-400 mb-2" />
                <span className="text-xs font-semibold text-slate-700">Upload Cover Image</span>
                <span className="text-[10px] text-slate-400 mt-0.5">PNG, JPG, WEBP up to 15MB</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleCoverFileChange}
                  className="hidden"
                />
              </label>
            )}

            {/* Direct URL input fallback */}
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                Or Paste Image URL Directly
              </label>
              <input
                type="url"
                value={coverImageUrl}
                onChange={(e) => {
                  setCoverImageUrl(e.target.value);
                  setCoverFile(null);
                }}
                placeholder="https://images.unsplash.com/..."
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:outline-none focus:border-slate-900 focus:bg-white"
              />
            </div>
          </div>

          {/* SEO Metadata Card */}
          <div className="p-6 bg-white rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
            <h3 className="font-bold text-sm text-slate-900">SEO Meta Settings</h3>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                SEO Meta Title
              </label>
              <input
                type="text"
                value={formData.seoTitle}
                onChange={handleInputChange}
                name="seoTitle"
                placeholder={formData.title || 'Brand Identity Case Study'}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:outline-none focus:border-slate-900 focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                SEO Description
              </label>
              <textarea
                rows="3"
                value={formData.seoDescription}
                onChange={handleInputChange}
                name="seoDescription"
                placeholder="Brief meta description for search engine ranking..."
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:outline-none focus:border-slate-900 focus:bg-white"
              />
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ProjectFormPage;
