import React, { useState, useEffect } from 'react';
import {
  Mail,
  Search,
  Trash2,
  CheckCircle2,
  MessageSquare,
  Clock,
  ExternalLink,
  X,
  Phone,
  Calendar,
  Save
} from 'lucide-react';
import api from '../api/axios';
import Toast from '../components/Toast';
import ConfirmModal from '../components/ConfirmModal';

const MessagesPage = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [toast, setToast] = useState(null);

  // Detail Modal
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [internalNotes, setInternalNotes] = useState('');
  const [savingNotes, setSavingNotes] = useState(false);

  // Delete State
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [messageToDelete, setMessageToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetchMessages = async () => {
    setLoading(true);
    try {
      const params = {};
      if (statusFilter !== 'all') params.status = statusFilter;
      if (searchQuery.trim()) params.search = searchQuery.trim();

      const res = await api.get('/contact', { params });
      if (res.data.success) {
        setMessages(res.data.messages);
      }
    } catch {
      setToast({ type: 'error', message: 'Failed to load inquiries' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchMessages();
    }, 200);
    return () => clearTimeout(timer);
  }, [statusFilter, searchQuery]);

  const openMessageDetail = async (msg) => {
    setSelectedMessage(msg);
    setInternalNotes(msg.notes || '');

    // If it was unread, mark as read
    if (msg.status === 'unread') {
      try {
        await api.put(`/contact/${msg._id}`, { status: 'read' });
        setMessages((prev) =>
          prev.map((m) => (m._id === msg._id ? { ...m, status: 'read' } : m))
        );
      } catch {}
    }
  };

  const updateStatus = async (id, newStatus) => {
    try {
      const res = await api.put(`/contact/${id}`, { status: newStatus });
      if (res.data.success) {
        setToast({ type: 'success', message: `Message marked as ${newStatus}` });
        setMessages((prev) =>
          prev.map((m) => (m._id === id ? { ...m, status: newStatus } : m))
        );
        if (selectedMessage?._id === id) {
          setSelectedMessage((prev) => ({ ...prev, status: newStatus }));
        }
      }
    } catch {
      setToast({ type: 'error', message: 'Failed to update message status' });
    }
  };

  const handleSaveNotes = async () => {
    if (!selectedMessage) return;
    setSavingNotes(true);
    try {
      const res = await api.put(`/contact/${selectedMessage._id}`, { notes: internalNotes });
      if (res.data.success) {
        setToast({ type: 'success', message: 'Notes saved' });
        setSelectedMessage((prev) => ({ ...prev, notes: internalNotes }));
      }
    } catch {
      setToast({ type: 'error', message: 'Failed to save notes' });
    } finally {
      setSavingNotes(false);
    }
  };

  const confirmDelete = (msg) => {
    setMessageToDelete(msg);
    setDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    if (!messageToDelete) return;
    setDeleting(true);
    try {
      const res = await api.delete(`/contact/${messageToDelete._id}`);
      if (res.data.success) {
        setToast({ type: 'success', message: 'Message deleted' });
        setDeleteModalOpen(false);
        if (selectedMessage?._id === messageToDelete._id) {
          setSelectedMessage(null);
        }
        fetchMessages();
      }
    } catch {
      setToast({ type: 'error', message: 'Failed to delete message' });
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
        title="Delete Message"
        message={`Are you sure you want to delete message from "${messageToDelete?.name}"?`}
        confirmText="Delete Message"
        loading={deleting}
        onConfirm={handleDelete}
        onCancel={() => setDeleteModalOpen(false)}
      />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900">Contact Inquiries Inbox</h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Client messages submitted from the public portfolio contact form.
          </p>
        </div>
      </div>

      {/* Toolbar */}
      <div className="p-4 sm:p-6 bg-white rounded-3xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-2xl overflow-x-auto">
          {['all', 'unread', 'read', 'replied'].map((tab) => (
            <button
              key={tab}
              onClick={() => setStatusFilter(tab)}
              className={`px-4 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap capitalize ${
                statusFilter === tab
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="relative min-w-[260px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by sender, email, subject..."
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:outline-none focus:border-slate-900 focus:bg-white"
          />
        </div>
      </div>

      {/* Messages List / Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/75 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                <th className="py-4 px-6">Sender</th>
                <th className="py-4 px-4">Subject</th>
                <th className="py-4 px-4 text-center">Status</th>
                <th className="py-4 px-4">Date</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {loading ? (
                <tr>
                  <td colSpan="5" className="py-12 text-center text-slate-400">
                    Loading messages...
                  </td>
                </tr>
              ) : messages.length > 0 ? (
                messages.map((msg) => (
                  <tr
                    key={msg._id}
                    onClick={() => openMessageDetail(msg)}
                    className="hover:bg-slate-50/80 cursor-pointer transition-colors group"
                  >
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-slate-100 text-slate-700 font-bold flex items-center justify-center shrink-0 text-xs">
                          {msg.name.charAt(0)}
                        </div>
                        <div>
                          <p className={`text-sm ${msg.status === 'unread' ? 'font-bold text-slate-900' : 'font-medium text-slate-700'}`}>
                            {msg.name}
                          </p>
                          <p className="text-[11px] text-slate-400 font-mono">{msg.email}</p>
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-4 max-w-xs">
                      <p className={`truncate text-sm ${msg.status === 'unread' ? 'font-bold text-slate-900' : 'text-slate-700'}`}>
                        {msg.subject}
                      </p>
                      <p className="text-slate-400 text-xs truncate mt-0.5">{msg.message}</p>
                    </td>

                    <td className="py-4 px-4 text-center whitespace-nowrap">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          msg.status === 'unread'
                            ? 'bg-rose-50 text-rose-700'
                            : msg.status === 'replied'
                            ? 'bg-emerald-50 text-emerald-700'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {msg.status}
                      </span>
                    </td>

                    <td className="py-4 px-4 text-slate-400 whitespace-nowrap font-mono text-[11px]">
                      {new Date(msg.createdAt).toLocaleDateString()}
                    </td>

                    <td
                      className="py-4 px-6 text-right whitespace-nowrap"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="flex items-center justify-end gap-1.5">
                        <a
                          href={`mailto:${msg.email}?subject=Re: ${encodeURIComponent(msg.subject)}`}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50"
                          title="Reply via email client"
                        >
                          <Mail className="w-4 h-4" />
                        </a>
                        <button
                          onClick={() => confirmDelete(msg)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50"
                          title="Delete message"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="py-16 text-center text-slate-400">
                    No inquiries found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Message Inspection Modal */}
      {selectedMessage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-slate-100 animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <div>
                <span
                  className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                    selectedMessage.status === 'unread'
                      ? 'bg-rose-50 text-rose-700'
                      : selectedMessage.status === 'replied'
                      ? 'bg-emerald-50 text-emerald-700'
                      : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {selectedMessage.status}
                </span>
                <h3 className="font-bold text-lg text-slate-900 mt-2">{selectedMessage.subject}</h3>
              </div>
              <button
                onClick={() => setSelectedMessage(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Sender Metadata Box */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 grid grid-cols-2 gap-4 mb-6 text-xs">
              <div>
                <p className="text-[10px] uppercase font-bold text-slate-400">From</p>
                <p className="font-bold text-slate-900 mt-0.5">{selectedMessage.name}</p>
                <a href={`mailto:${selectedMessage.email}`} className="text-indigo-600 hover:underline">
                  {selectedMessage.email}
                </a>
              </div>
              <div>
                <p className="text-[10px] uppercase font-bold text-slate-400">Received On</p>
                <p className="font-semibold text-slate-700 mt-0.5">
                  {new Date(selectedMessage.createdAt).toLocaleString()}
                </p>
                {selectedMessage.phone && (
                  <p className="text-slate-500 mt-0.5">Tel: {selectedMessage.phone}</p>
                )}
              </div>
            </div>

            {/* Message Body */}
            <div className="mb-6 space-y-2">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Message Body</p>
              <div className="p-4 rounded-2xl bg-white border border-slate-200 text-slate-800 text-sm leading-relaxed whitespace-pre-line">
                {selectedMessage.message}
              </div>
            </div>

            {/* Internal Notes */}
            <div className="mb-6 space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Internal Notes</p>
                <button
                  type="button"
                  onClick={handleSaveNotes}
                  disabled={savingNotes}
                  className="text-[11px] font-bold text-indigo-600 hover:text-indigo-800"
                >
                  {savingNotes ? 'Saving...' : 'Save Notes'}
                </button>
              </div>
              <textarea
                rows="2"
                value={internalNotes}
                onChange={(e) => setInternalNotes(e.target.value)}
                placeholder="Private notes (e.g. Sent pricing deck, follow up on Friday)..."
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:outline-none focus:border-slate-900 focus:bg-white"
              />
            </div>

            {/* Actions Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-100">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => updateStatus(selectedMessage._id, 'replied')}
                  className="px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 hover:bg-emerald-100 text-xs font-bold transition-colors"
                >
                  Mark Replied
                </button>
                <button
                  onClick={() => updateStatus(selectedMessage._id, 'read')}
                  className="px-3 py-1.5 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 text-xs font-bold transition-colors"
                >
                  Mark Read
                </button>
              </div>

              <div className="flex items-center gap-2">
                <a
                  href={`mailto:${selectedMessage.email}?subject=Re: ${encodeURIComponent(selectedMessage.subject)}`}
                  className="px-4 py-2 rounded-xl bg-slate-900 text-white hover:bg-black text-xs font-bold flex items-center gap-2 transition-all shadow-sm"
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>Reply via Email</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MessagesPage;
