import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  FolderKanban,
  FileCheck,
  FileClock,
  Tags,
  Image as ImageIcon,
  MessageSquare,
  Plus,
  ArrowUpRight,
  ExternalLink,
  Eye,
  CheckCircle2,
  Clock
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell
} from 'recharts';
import api from '../api/axios';
import Toast from '../components/Toast';

const DashboardPage = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

  const fetchStats = async () => {
    try {
      const res = await api.get('/dashboard/stats');
      if (res.data.success) {
        setData(res.data);
      }
    } catch (err) {
      console.error('Error fetching dashboard stats:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const handleTogglePublish = async (id) => {
    try {
      const res = await api.patch(`/projects/${id}/toggle-publish`);
      if (res.data.success) {
        setToast({ type: 'success', message: res.data.message });
        fetchStats();
      }
    } catch {
      setToast({ type: 'error', message: 'Failed to update status' });
    }
  };

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-32 bg-white rounded-3xl border border-slate-100"></div>
          ))}
        </div>
        <div className="h-80 bg-white rounded-3xl border border-slate-100"></div>
      </div>
    );
  }

  const stats = data?.stats || {};
  const categoryDistribution = data?.categoryDistribution || [];
  const recentProjects = data?.recentProjects || [];
  const recentContacts = data?.recentContacts || [];

  const statCards = [
    {
      label: 'Total Projects',
      value: stats.totalProjects || 0,
      sub: `${stats.publishedProjects || 0} Published · ${stats.draftProjects || 0} Draft`,
      icon: FolderKanban,
      color: 'bg-indigo-50 text-indigo-600',
      link: '/projects'
    },
    {
      label: 'Published Designs',
      value: stats.publishedProjects || 0,
      sub: 'Live on public portfolio',
      icon: FileCheck,
      color: 'bg-emerald-50 text-emerald-600',
      link: '/projects?status=published'
    },
    {
      label: 'Categories',
      value: stats.totalCategories || 0,
      sub: 'Design disciplines',
      icon: Tags,
      color: 'bg-amber-50 text-amber-600',
      link: '/categories'
    },
    {
      label: 'Client Inquiries',
      value: stats.totalContacts || 0,
      sub: `${stats.unreadContacts || 0} Unread inquiries`,
      icon: MessageSquare,
      color: 'bg-purple-50 text-purple-600',
      link: '/messages'
    }
  ];

  const chartColors = ['#4F46E5', '#3B82F6', '#10B981', '#F59E0B', '#EC4899', '#8B5CF6'];

  return (
    <div className="space-y-8">
      {toast && (
        <Toast
          type={toast.type}
          message={toast.message}
          onClose={() => setToast(null)}
        />
      )}

      {/* Top Banner / Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 sm:p-8 rounded-3xl bg-slate-900 text-white shadow-md">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold">Studio Overview</h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-1">
            Manage your graphic design portfolio, project galleries, and incoming client leads.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Link
            to="/projects/new"
            className="px-5 py-2.5 rounded-xl bg-white text-slate-900 hover:bg-slate-100 text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>Add Project</span>
          </Link>
          <Link
            to="/media"
            className="px-5 py-2.5 rounded-xl bg-slate-800 text-white hover:bg-slate-700 text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all border border-slate-700"
          >
            <ImageIcon className="w-4 h-4" />
            <span>Upload Media</span>
          </Link>
        </div>
      </div>

      {/* 4 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, i) => {
          const Icon = card.icon;
          return (
            <Link
              key={i}
              to={card.link}
              className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs hover:border-slate-300 hover:shadow-md transition-all flex flex-col justify-between group"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  {card.label}
                </span>
                <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 ${card.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
              </div>
              <div>
                <p className="font-extrabold text-3xl text-slate-900">{card.value}</p>
                <p className="text-xs text-slate-500 mt-1 font-medium">{card.sub}</p>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Projects per Category Chart */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="font-bold text-lg text-slate-900">Project Distribution by Category</h3>
            <p className="text-xs text-slate-500 mt-0.5">Total projects categorized across design disciplines</p>
          </div>
          <Link
            to="/categories"
            className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
          >
            <span>Manage Categories</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {categoryDistribution.length > 0 ? (
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryDistribution} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 11, fill: '#64748B' }}
                  interval={0}
                  angle={-15}
                  textAnchor="end"
                />
                <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: '#64748B' }} />
                <Tooltip
                  cursor={{ fill: '#F1F5F9' }}
                  contentStyle={{
                    backgroundColor: '#0F172A',
                    borderRadius: '12px',
                    color: '#FFF',
                    fontSize: '12px',
                    border: 'none'
                  }}
                />
                <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                  {categoryDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={chartColors[index % chartColors.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="h-48 flex items-center justify-center text-slate-400 text-xs">
            No category distribution data available yet.
          </div>
        )}
      </div>

      {/* Recent Projects and Recent Messages */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Recent Projects Table */}
        <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-bold text-lg text-slate-900">Recent Projects</h3>
              <p className="text-xs text-slate-500">Latest portfolio design additions</p>
            </div>
            <Link
              to="/projects"
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-3">
            {recentProjects.length > 0 ? (
              recentProjects.map((p) => (
                <div
                  key={p._id}
                  className="flex items-center justify-between p-3.5 rounded-2xl border border-slate-100 hover:border-slate-200 hover:bg-slate-50 transition-all gap-4"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={p.coverImage?.url}
                      alt={p.title}
                      className="w-12 h-12 rounded-xl object-cover shrink-0 bg-slate-100"
                    />
                    <div className="min-w-0">
                      <Link
                        to={`/projects/edit/${p._id}`}
                        className="font-bold text-sm text-slate-900 hover:text-indigo-600 transition-colors line-clamp-1"
                      >
                        {p.title}
                      </Link>
                      <span className="text-xs text-slate-400 block truncate">
                        {p.category?.name || 'Uncategorized'}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => handleTogglePublish(p._id)}
                      className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider transition-colors ${
                        p.isPublished
                          ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                          : 'bg-amber-50 text-amber-700 hover:bg-amber-100'
                      }`}
                    >
                      {p.isPublished ? 'Published' : 'Draft'}
                    </button>
                    <Link
                      to={`/projects/edit/${p._id}`}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition-colors"
                      title="Edit project"
                    >
                      <Eye className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center py-8 text-xs text-slate-400">No projects added yet.</p>
            )}
          </div>
        </div>

        {/* Recent Inquiries Inbox */}
        <div className="lg:col-span-5 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-bold text-lg text-slate-900">Recent Messages</h3>
              <p className="text-xs text-slate-500">Client inquiries from website contact form</p>
            </div>
            <Link
              to="/messages"
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
            >
              <span>Inbox</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-3">
            {recentContacts.length > 0 ? (
              recentContacts.map((c) => (
                <Link
                  key={c._id}
                  to="/messages"
                  className="block p-3.5 rounded-2xl border border-slate-100 hover:border-slate-200 hover:bg-slate-50 transition-all"
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-bold text-xs text-slate-900 truncate">{c.name}</span>
                    <span
                      className={`text-[9px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full ${
                        c.status === 'unread'
                          ? 'bg-rose-50 text-rose-700'
                          : c.status === 'replied'
                          ? 'bg-emerald-50 text-emerald-700'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {c.status}
                    </span>
                  </div>
                  <p className="text-xs font-semibold text-slate-700 truncate">{c.subject}</p>
                  <p className="text-xs text-slate-400 line-clamp-1 mt-0.5">{c.message}</p>
                </Link>
              ))
            ) : (
              <p className="text-center py-8 text-xs text-slate-400">No messages received yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
