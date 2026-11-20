import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Star, User, X, Save } from 'lucide-react';
import api from '../api/axios';
import Toast from '../components/Toast';
import ConfirmModal from '../components/ConfirmModal';

const TestimonialsManagePage = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTestimonial, setEditingTestimonial] = useState(null);
  const [saving, setSaving] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    clientName: '',
    clientRole: '',
    clientCompany: '',
    clientAvatarUrl: '',
    feedback: '',
    rating: 5,
    isFeatured: true,
    isActive: true,
    order: 0
  });

  // Delete State
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [testToDelete, setTestToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetchTestimonials = async () => {
    setLoading(true);
    try {
      const res = await api.get('/testimonials');
      if (res.data.success) {
        setTestimonials(res.data.testimonials);
      }
    } catch {
      setToast({ type: 'error', message: 'Failed to load testimonials' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const openCreateModal = () => {
    setEditingTestimonial(null);
    setFormData({
      clientName: '',
      clientRole: '',
      clientCompany: '',
      clientAvatarUrl: '',
      feedback: '',
      rating: 5,
      isFeatured: true,
      isActive: true,
      order: testimonials.length + 1
    });
    setIsModalOpen(true);
  };

  const openEditModal = (t) => {
    setEditingTestimonial(t);
    setFormData({
      clientName: t.clientName || '',
      clientRole: t.clientRole || '',
      clientCompany: t.clientCompany || '',
      clientAvatarUrl: t.clientAvatar?.url || '',
      feedback: t.feedback || '',
      rating: t.rating || 5,
      isFeatured: t.isFeatured !== undefined ? t.isFeatured : true,
      isActive: t.isActive !== undefined ? t.isActive : true,
      order: t.order || 0
    });
    setIsModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!formData.clientName.trim() || !formData.feedback.trim()) {
      setToast({ type: 'error', message: 'Client name and feedback are required' });
      return;
    }

    setSaving(true);
    try {
      const payload = {
        clientName: formData.clientName.trim(),
        clientRole: formData.clientRole.trim(),
        clientCompany: formData.clientCompany.trim(),
        clientAvatar: { url: formData.clientAvatarUrl.trim() },
        feedback: formData.feedback.trim(),
        rating: Number(formData.rating),
        isFeatured: formData.isFeatured,
        isActive: formData.isActive,
        order: Number(formData.order)
      };

      let res;
      if (editingTestimonial) {
        res = await api.put(`/testimonials/${editingTestimonial._id}`, payload);
      } else {
        res = await api.post('/testimonials', payload);
      }

      if (res.data.success) {
        setToast({
          type: 'success',
          message: editingTestimonial ? 'Review updated' : 'Review added'
        });
        setIsModalOpen(false);
        fetchTestimonials();
      }
    } catch (err) {
      setToast({
        type: 'error',
        message: err.response?.data?.message || 'Failed to save review'
      });
    } finally {
      setSaving(false);
    }
  };

  const confirmDelete = (t) => {
    setTestToDelete(t);
    setDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    if (!testToDelete) return;
    setDeleting(true);
    try {
      const res = await api.delete(`/testimonials/${testToDelete._id}`);
      if (res.data.success) {
        setToast({ type: 'success', message: 'Review deleted' });
        setDeleteModalOpen(false);
        fetchTestimonials();
      }
    } catch {
      setToast({ type: 'error', message: 'Failed to delete review' });
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
        title="Delete Review"
        message={`Are you sure you want to delete the testimonial from "${testToDelete?.clientName}"?`}
        confirmText="Delete Review"
        loading={deleting}
        onConfirm={handleDelete}
        onCancel={() => setDeleteModalOpen(false)}
      />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900">Client Testimonials</h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Manage feedback endorsements and ratings from founders and art directors.
          </p>
        </div>
        <button
          onClick={openCreateModal}
          className="px-5 py-2.5 rounded-xl bg-slate-900 text-white hover:bg-black text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-md shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>New Review</span>
        </button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full py-12 text-center text-slate-400">Loading reviews...</div>
        ) : testimonials.length > 0 ? (
          testimonials.map((t) => (
            <div
              key={t._id}
              className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-1 text-amber-400">
                    {Array.from({ length: t.rating || 5 }).map((_, r) => (
                      <Star key={r} className="w-4 h-4 fill-amber-400" />
                    ))}
                  </div>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${
                      t.isActive
                        ? 'bg-emerald-50 text-emerald-700'
                        : 'bg-slate-100 text-slate-500'
                    }`}
                  >
                    {t.isActive ? 'Active' : 'Hidden'}
                  </span>
                </div>

                <blockquote className="text-xs text-slate-700 leading-relaxed italic mb-6">
                  "{t.feedback}"
                </blockquote>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  {t.clientAvatar?.url ? (
                    <img
                      src={t.clientAvatar.url}
                      alt={t.clientName}
                      className="w-9 h-9 rounded-full object-cover shrink-0"
                    />
                  ) : (
                    <div className="w-9 h-9 rounded-full bg-slate-100 text-slate-600 font-bold flex items-center justify-center text-xs shrink-0">
                      {t.clientName.charAt(0)}
                    </div>
                  )}
                  <div className="truncate">
                    <p className="font-bold text-xs text-slate-900 truncate">{t.clientName}</p>
                    <p className="text-[10px] text-slate-400 truncate">
                      {t.clientRole}
                      {t.clientCompany ? ` · ${t.clientCompany}` : ''}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => openEditModal(t)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => confirmDelete(t)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full py-16 bg-white rounded-3xl text-center text-slate-400">
            No testimonials added yet. Click "New Review" to create one.
          </div>
        )}
      </div>

      {/* Add / Edit Review Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs select-none animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-100 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-bold text-lg text-slate-900">
                {editingTestimonial ? 'Edit Review' : 'Add Client Review'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Client Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.clientName}
                  onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                  placeholder="e.g. Frederik Lindqvist"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold focus:outline-none focus:border-slate-900 focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Client Role / Title
                  </label>
                  <input
                    type="text"
                    value={formData.clientRole}
                    onChange={(e) => setFormData({ ...formData, clientRole: e.target.value })}
                    placeholder="CEO & Co-Founder"
                    className="w-full px-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:outline-none focus:border-slate-900 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Company / Organization
                  </label>
                  <input
                    type="text"
                    value={formData.clientCompany}
                    onChange={(e) => setFormData({ ...formData, clientCompany: e.target.value })}
                    placeholder="Lumina Nordic"
                    className="w-full px-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:outline-none focus:border-slate-900 focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Avatar Image URL
                </label>
                <input
                  type="url"
                  value={formData.clientAvatarUrl}
                  onChange={(e) => setFormData({ ...formData, clientAvatarUrl: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:outline-none focus:border-slate-900 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Review Rating (Stars)
                </label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      type="button"
                      key={star}
                      onClick={() => setFormData({ ...formData, rating: star })}
                      className="p-1 hover:scale-110 transition-transform"
                    >
                      <Star
                        className={`w-6 h-6 ${
                          star <= formData.rating
                            ? 'text-amber-400 fill-amber-400'
                            : 'text-slate-300'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Feedback Review <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows="4"
                  required
                  value={formData.feedback}
                  onChange={(e) => setFormData({ ...formData, feedback: e.target.value })}
                  placeholder="Client review text..."
                  className="w-full px-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:outline-none focus:border-slate-900 focus:bg-white"
                />
              </div>

              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="featuredReview"
                    checked={formData.isFeatured}
                    onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                    className="w-4 h-4 accent-slate-900 rounded"
                  />
                  <label htmlFor="featuredReview" className="text-xs font-semibold text-slate-800">
                    Feature on Homepage
                  </label>
                </div>

                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="activeReview"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    className="w-4 h-4 accent-slate-900 rounded"
                  />
                  <label htmlFor="activeReview" className="text-xs font-semibold text-slate-800">
                    Active
                  </label>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2.5 rounded-xl bg-slate-900 text-white text-xs font-bold uppercase tracking-wider hover:bg-black transition-all disabled:opacity-50"
                >
                  {saving ? 'Saving...' : editingTestimonial ? 'Update' : 'Save'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TestimonialsManagePage;
