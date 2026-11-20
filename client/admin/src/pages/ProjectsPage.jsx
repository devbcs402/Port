import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  ExternalLink,
  Star,
  CheckCircle2,
  XCircle,
  Eye,
  Calendar
} from 'lucide-react';
import api from '../api/axios';
import Toast from '../components/Toast';
import ConfirmModal from '../components/ConfirmModal';

const ProjectsPage = () => {
  const [projects, setProjects] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('status') || 'all';
  const categoryFilter = searchParams.get('category') || 'all';
  const searchQuery = searchParams.get('search') || '';

  // Delete modal state
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetchCategories = async () => {
    try {
      const res = await api.get('/categories');
      if (res.data.success) {
        setCategories(res.data.categories);
      }
    } catch (err) {
      console.error('Error fetching categories:', err);
    }
  };

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const params = {};
      if (activeTab === 'published') params.status = 'published';
      if (activeTab === 'draft') params.status = 'draft';
      if (activeTab === 'featured') params.featured = 'true';
      if (categoryFilter !== 'all') params.category = categoryFilter;
      if (searchQuery.trim()) params.search = searchQuery.trim();

      const res = await api.get('/projects', { params });
      if (res.data.success) {
        setProjects(res.data.projects);
      }
    } catch (err) {
      console.error('Error fetching projects:', err);
      setToast({ type: 'error', message: 'Failed to load projects' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchProjects();
    }, 200);
    return () => clearTimeout(timer);
  }, [activeTab, categoryFilter, searchQuery]);

  const handleTabChange = (status) => {
    const nextParams = new URLSearchParams(searchParams);
    if (status === 'all') {
      nextParams.delete('status');
    } else {
      nextParams.set('status', status);
    }
    setSearchParams(nextParams);
  };

  const handleCategoryChange = (catSlug) => {
    const nextParams = new URLSearchParams(searchParams);
    if (catSlug === 'all') {
      nextParams.delete('category');
    } else {
      nextParams.set('category', catSlug);
    }
    setSearchParams(nextParams);
  };

  const handleSearchChange = (e) => {
    const nextParams = new URLSearchParams(searchParams);
    if (e.target.value) {
      nextParams.set('search', e.target.value);
    } else {
      nextParams.delete('search');
    }
    setSearchParams(nextParams);
  };

  const togglePublish = async (id) => {
    try {
      const res = await api.patch(`/projects/${id}/toggle-publish`);
      if (res.data.success) {
        setToast({ type: 'success', message: res.data.message });
        setProjects((prev) =>
          prev.map((p) => (p._id === id ? { ...p, isPublished: res.data.isPublished } : p))
        );
      }
    } catch {
      setToast({ type: 'error', message: 'Failed to update publish state' });
    }
  };

  const toggleFeatured = async (id) => {
    try {
      const res = await api.patch(`/projects/${id}/toggle-featured`);
      if (res.data.success) {
        setToast({ type: 'success', message: res.data.message });
        setProjects((prev) =>
          prev.map((p) => (p._id === id ? { ...p, isFeatured: res.data.isFeatured } : p))
        );
      }
    } catch {
      setToast({ type: 'error', message: 'Failed to update featured state' });
    }
  };

  const confirmDelete = (project) => {
    setProjectToDelete(project);
    setDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    if (!projectToDelete) return;
    setDeleting(true);
    try {
      const res = await api.delete(`/projects/${projectToDelete._id}`);
      if (res.data.success) {
        setToast({ type: 'success', message: 'Project deleted successfully' });
        setProjects((prev) => prev.filter((p) => p._id !== projectToDelete._id));
        setDeleteModalOpen(false);
      }
    } catch {
      setToast({ type: 'error', message: 'Failed to delete project' });
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      {toast && (
        <Toast
          type={toast.type}
          message={toast.message}
          onClose={() => setToast(null)}
        />
      )}

      <ConfirmModal
        isOpen={deleteModalOpen}
        title="Delete Project"
        message={`Are you sure you want to permanently delete "${projectToDelete?.title}"?\nThis will remove the project details and associated media.`}
        confirmText="Delete Project"
        confirmVariant="danger"
        loading={deleting}
        onConfirm={handleDelete}
        onCancel={() => setDeleteModalOpen(false)}
      />

      {/* Top Header / Create Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900">Project Directory</h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Create, edit, feature, and publish your graphic design case studies.
          </p>
        </div>
        <Link
          to="/projects/new"
          className="px-5 py-2.5 rounded-xl bg-slate-900 text-white hover:bg-black text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-md shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>New Project</span>
        </Link>
      </div>

      {/* Filters & Search Toolbar */}
      <div className="p-4 sm:p-6 bg-white rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          {/* Status Tabs */}
          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-2xl overflow-x-auto">
            {['all', 'published', 'draft', 'featured'].map((tab) => (
              <button
                key={tab}
                onClick={() => handleTabChange(tab)}
                className={`px-4 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap capitalize ${
                  activeTab === tab
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Search & Category Filter */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="relative min-w-[200px]">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={handleSearchChange}
                placeholder="Search projects..."
                className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:outline-none focus:border-slate-900 focus:bg-white transition-all"
              />
            </div>

            <select
              value={categoryFilter}
              onChange={(e) => handleCategoryChange(e.target.value)}
              className="px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-700 focus:outline-none focus:border-slate-900"
            >
              <option value="all">All Categories</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat.slug}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Projects Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/75 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                <th className="py-4 px-6">Project</th>
                <th className="py-4 px-4">Category</th>
                <th className="py-4 px-4 text-center">Status</th>
                <th className="py-4 px-4 text-center">Featured</th>
                <th className="py-4 px-4 text-center">Views</th>
                <th className="py-4 px-4">Date</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {loading ? (
                <tr>
                  <td colSpan="7" className="py-12 text-center text-slate-400">
                    Loading projects...
                  </td>
                </tr>
              ) : projects.length > 0 ? (
                projects.map((p) => (
                  <tr key={p._id} className="hover:bg-slate-50/60 transition-colors">
                    {/* Project info */}
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <img
                          src={p.coverImage?.url}
                          alt={p.title}
                          className="w-12 h-12 rounded-xl object-cover shrink-0 bg-slate-100 border border-slate-100"
                        />
                        <div className="min-w-0 max-w-xs">
                          <Link
                            to={`/projects/edit/${p._id}`}
                            className="font-bold text-slate-900 hover:text-indigo-600 transition-colors line-clamp-1 text-sm"
                          >
                            {p.title}
                          </Link>
                          <span className="text-[11px] text-slate-400 font-mono block truncate">
                            /{p.slug}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="py-4 px-4">
                      <span className="inline-block px-2.5 py-1 rounded-lg text-[10px] font-semibold bg-slate-100 text-slate-700">
                        {p.category?.name || 'Uncategorized'}
                      </span>
                    </td>

                    {/* Status Toggle */}
                    <td className="py-4 px-4 text-center">
                      <button
                        onClick={() => togglePublish(p._id)}
                        className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider transition-colors ${
                          p.isPublished
                            ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                            : 'bg-amber-50 text-amber-700 hover:bg-amber-100'
                        }`}
                      >
                        {p.isPublished ? 'Published' : 'Draft'}
                      </button>
                    </td>

                    {/* Featured Toggle */}
                    <td className="py-4 px-4 text-center">
                      <button
                        onClick={() => toggleFeatured(p._id)}
                        className={`p-1.5 rounded-lg transition-colors ${
                          p.isFeatured
                            ? 'text-amber-500 bg-amber-50 hover:bg-amber-100'
                            : 'text-slate-300 hover:text-slate-600 hover:bg-slate-100'
                        }`}
                        title={p.isFeatured ? 'Featured on homepage' : 'Mark as featured'}
                      >
                        <Star className={`w-4 h-4 ${p.isFeatured ? 'fill-amber-400' : ''}`} />
                      </button>
                    </td>

                    {/* Views */}
                    <td className="py-4 px-4 text-center font-mono text-slate-600">
                      {p.views || 0}
                    </td>

                    {/* Date */}
                    <td className="py-4 px-4 text-slate-500 whitespace-nowrap">
                      {p.projectDate || new Date(p.createdAt).toLocaleDateString()}
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-6 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        <a
                          href={`http://localhost:5173/portfolio/${p.slug}`}
                          target="_blank"
                          rel="noreferrer"
                          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition-colors"
                          title="View on public portfolio"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                        <Link
                          to={`/projects/edit/${p._id}`}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
                          title="Edit project"
                        >
                          <Edit className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => confirmDelete(p)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                          title="Delete project"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="py-16 text-center text-slate-400">
                    No projects found matching the criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ProjectsPage;
