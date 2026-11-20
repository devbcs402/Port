import React, { useState, useEffect } from 'react';
import {
  Upload,
  Search,
  Copy,
  Check,
  Trash2,
  Maximize2,
  X,
  FileCheck,
  AlertTriangle,
  FolderKanban
} from 'lucide-react';
import api from '../api/axios';
import Toast from '../components/Toast';
import ConfirmModal from '../components/ConfirmModal';

const MediaPage = () => {
  const [media, setMedia] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [formatFilter, setFormatFilter] = useState('all');
  const [copiedId, setCopiedId] = useState(null);
  const [toast, setToast] = useState(null);

  // Preview Modal State
  const [selectedMedia, setSelectedMedia] = useState(null);

  // Delete State
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [mediaToDelete, setMediaToDelete] = useState(null);
  const [forceDelete, setForceDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const fetchMedia = async () => {
    setLoading(true);
    try {
      const params = {};
      if (searchQuery.trim()) params.search = searchQuery.trim();
      if (formatFilter !== 'all') params.format = formatFilter;

      const res = await api.get('/media', { params });
      if (res.data.success) {
        setMedia(res.data.media);
      }
    } catch {
      setToast({ type: 'error', message: 'Failed to load media items' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchMedia();
    }, 200);
    return () => clearTimeout(timer);
  }, [searchQuery, formatFilter]);

  const handleFileUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    setUploading(true);
    const formData = new FormData();
    files.forEach((file) => {
      formData.append('images', file);
    });

    try {
      const res = await api.post('/media/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      if (res.data.success) {
        setToast({ type: 'success', message: res.data.message || 'Media uploaded successfully' });
        fetchMedia();
      }
    } catch (err) {
      setToast({
        type: 'error',
        message: err.response?.data?.message || 'Failed to upload files'
      });
    } finally {
      setUploading(false);
    }
  };

  const copyToClipboard = (url, id) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const confirmDelete = (item) => {
    setMediaToDelete(item);
    setForceDelete(false);
    setDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    if (!mediaToDelete) return;
    setDeleting(true);
    try {
      const url = forceDelete
        ? `/media/${mediaToDelete._id}?force=true`
        : `/media/${mediaToDelete._id}`;
      const res = await api.delete(url);
      if (res.data.success) {
        setToast({ type: 'success', message: 'Media deleted successfully' });
        setDeleteModalOpen(false);
        if (selectedMedia?._id === mediaToDelete._id) {
          setSelectedMedia(null);
        }
        fetchMedia();
      }
    } catch (err) {
      if (err.response?.data?.isUsed) {
        setForceDelete(true);
      }
      setToast({
        type: 'error',
        message: err.response?.data?.message || 'Failed to delete media'
      });
    } finally {
      setDeleting(false);
    }
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
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
        title={forceDelete ? 'Force Delete Media' : 'Delete Media'}
        message={
          forceDelete
            ? `WARNING: This media is used in active projects!\nAre you sure you want to force delete it? Broken image links may appear.`
            : `Are you sure you want to permanently delete "${mediaToDelete?.fileName}"?`
        }
        confirmText={forceDelete ? 'Force Delete' : 'Delete'}
        confirmVariant="danger"
        loading={deleting}
        onConfirm={handleDelete}
        onCancel={() => setDeleteModalOpen(false)}
      />

      {/* Header & Upload Zone */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900">Media Library</h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Central repository for design mockups, packaging photos, and poster prints.
          </p>
        </div>

        <label className="cursor-pointer px-5 py-2.5 rounded-xl bg-slate-900 text-white hover:bg-black text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-md shrink-0">
          <Upload className="w-4 h-4" />
          <span>{uploading ? 'Uploading...' : 'Upload New Media'}</span>
          <input
            type="file"
            multiple
            accept="image/*"
            disabled={uploading}
            onChange={handleFileUpload}
            className="hidden"
          />
        </label>
      </div>

      {/* Filters & Search Toolbar */}
      <div className="p-4 sm:p-6 bg-white rounded-3xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div className="relative min-w-[260px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by filename..."
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:outline-none focus:border-slate-900 focus:bg-white"
          />
        </div>

        <div className="flex items-center gap-2">
          {['all', 'jpg', 'png', 'webp'].map((fmt) => (
            <button
              key={fmt}
              onClick={() => setFormatFilter(fmt)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors ${
                formatFilter === fmt
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
              }`}
            >
              {fmt}
            </button>
          ))}
        </div>
      </div>

      {/* Media Grid */}
      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 animate-pulse">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="aspect-square bg-slate-200 rounded-2xl"></div>
          ))}
        </div>
      ) : media.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {media.map((item) => (
            <div
              key={item._id}
              className="group relative rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 aspect-square flex flex-col justify-end"
            >
              <img
                src={item.url}
                alt={item.fileName}
                loading="lazy"
                className="w-full h-full object-cover object-center absolute inset-0"
              />

              {/* Usage badge if in projects */}
              {item.isUsed && (
                <div className="absolute top-2 left-2 z-10">
                  <span className="px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider bg-slate-900/90 text-white backdrop-blur-xs">
                    Linked
                  </span>
                </div>
              )}

              {/* Hover Overlay with actions */}
              <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-opacity p-3 flex flex-col justify-between z-10">
                <div className="flex items-center justify-end gap-1.5">
                  <button
                    onClick={() => copyToClipboard(item.url, item._id)}
                    className="p-1.5 rounded-lg bg-white/20 text-white hover:bg-white hover:text-slate-900 transition-colors"
                    title="Copy URL"
                  >
                    {copiedId === item._id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                  <button
                    onClick={() => setSelectedMedia(item)}
                    className="p-1.5 rounded-lg bg-white/20 text-white hover:bg-white hover:text-slate-900 transition-colors"
                    title="Inspect media"
                  >
                    <Maximize2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => confirmDelete(item)}
                    className="p-1.5 rounded-lg bg-white/20 text-white hover:bg-rose-600 transition-colors"
                    title="Delete media"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="text-white">
                  <p className="text-[11px] font-bold truncate leading-tight">{item.fileName}</p>
                  <p className="text-[10px] text-slate-300 font-mono mt-0.5">{formatFileSize(item.size)}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="py-20 bg-white rounded-3xl border border-slate-200/80 text-center p-8">
          <Upload className="w-10 h-10 text-slate-300 mx-auto mb-3" />
          <h3 className="font-bold text-base text-slate-900 mb-1">No media files found</h3>
          <p className="text-xs text-slate-500">
            Upload design images directly above or they will automatically register when creating projects.
          </p>
        </div>
      )}

      {/* Inspect Media Detail Modal */}
      {selectedMedia && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-100 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-lg text-slate-900">Media Details</h3>
              <button
                onClick={() => setSelectedMedia(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="rounded-2xl overflow-hidden bg-slate-100 aspect-[16/9] mb-6 border border-slate-200">
              <img
                src={selectedMedia.url}
                alt={selectedMedia.fileName}
                className="w-full h-full object-contain"
              />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
              <div className="p-3 bg-slate-50 rounded-xl">
                <p className="text-[10px] font-bold uppercase text-slate-400">Format</p>
                <p className="font-bold text-xs text-slate-800 uppercase">{selectedMedia.format || 'Image'}</p>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl">
                <p className="text-[10px] font-bold uppercase text-slate-400">File Size</p>
                <p className="font-bold text-xs text-slate-800">{formatFileSize(selectedMedia.size)}</p>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl">
                <p className="text-[10px] font-bold uppercase text-slate-400">Dimensions</p>
                <p className="font-bold text-xs text-slate-800">
                  {selectedMedia.width && selectedMedia.height
                    ? `${selectedMedia.width} × ${selectedMedia.height}`
                    : 'Auto-scaled'}
                </p>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl">
                <p className="text-[10px] font-bold uppercase text-slate-400">Storage</p>
                <p className="font-bold text-xs text-slate-800 capitalize">
                  {selectedMedia.storageProvider || 'Local'}
                </p>
              </div>
            </div>

            {/* Referencing Projects */}
            {selectedMedia.usedInProjects && selectedMedia.usedInProjects.length > 0 ? (
              <div className="mb-6 p-4 rounded-2xl bg-amber-50 border border-amber-200">
                <div className="flex items-center gap-2 text-amber-800 font-bold text-xs mb-1">
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                  <span>Referenced in {selectedMedia.usedInProjects.length} Project(s):</span>
                </div>
                <ul className="text-xs text-amber-700 space-y-1 list-disc list-inside">
                  {selectedMedia.usedInProjects.map((p, idx) => (
                    <li key={idx}>
                      <span className="font-semibold">{p.title}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <p className="text-xs text-slate-400 mb-6">
                This asset is currently not linked to any projects and is safe to delete.
              </p>
            )}

            <div className="flex items-center justify-between gap-3 pt-4 border-t border-slate-100">
              <button
                onClick={() => copyToClipboard(selectedMedia.url, selectedMedia._id)}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold flex items-center gap-2"
              >
                {copiedId === selectedMedia._id ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-600" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    <span>Copy Image URL</span>
                  </>
                )}
              </button>

              <button
                onClick={() => {
                  confirmDelete(selectedMedia);
                }}
                className="px-4 py-2 rounded-xl bg-rose-50 text-rose-700 hover:bg-rose-100 text-xs font-semibold flex items-center gap-2"
              >
                <Trash2 className="w-4 h-4" />
                <span>Delete Asset</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MediaPage;
