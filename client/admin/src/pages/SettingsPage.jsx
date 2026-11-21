import React, { useState, useEffect } from 'react';
import { Save, Globe, Share2, Mail, Layout, Sparkles } from 'lucide-react';
import api from '../api/axios';
import Toast from '../components/Toast';

const SettingsPage = () => {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await api.get('/settings');
        if (res.data.success) {
          setSettings(res.data.settings);
        }
      } catch {
        setToast({ type: 'error', message: 'Failed to load website settings' });
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSettings((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await api.put('/settings', settings);
      if (res.data.success) {
        setToast({ type: 'success', message: 'Website settings updated successfully' });
      }
    } catch (err) {
      setToast({
        type: 'error',
        message: err.response?.data?.message || 'Failed to update settings'
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6 max-w-4xl mx-auto animate-pulse">
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900">Website & Global Settings</h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Configure site metadata, brand identities, social links, and contact channels.
          </p>
        </div>
        <button
          type="button"
          onClick={handleSubmit}
          disabled={saving}
          className="px-6 py-2.5 rounded-xl bg-slate-900 text-white hover:bg-black text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-md disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          <span>{saving ? 'Saving...' : 'Save All Settings'}</span>
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Brand & Identity Card */}
        <div className="p-6 sm:p-8 bg-white rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
          <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
            <Globe className="w-5 h-5 text-indigo-600" />
            <span>Brand & Website Identity</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Website Display Name
              </label>
              <input
                type="text"
                name="websiteName"
                value={settings?.websiteName || ''}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold focus:outline-none focus:border-slate-900 focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Designer Name <span className="text-indigo-600 font-normal lowercase">(shows on all website headers & footers)</span>
              </label>
              <input
                type="text"
                name="designerName"
                value={settings?.designerName || ''}
                onChange={handleChange}
                placeholder="e.g. Gracy Pandya"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold focus:outline-none focus:border-slate-900 focus:bg-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Logo Image URL (Optional)
              </label>
              <input
                type="url"
                value={settings?.logo?.url || ''}
                onChange={(e) =>
                  setSettings((prev) => ({
                    ...prev,
                    logo: { ...prev.logo, url: e.target.value }
                  }))
                }
                placeholder="https://..."
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:outline-none focus:border-slate-900 focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Favicon URL (Optional)
              </label>
              <input
                type="url"
                value={settings?.favicon?.url || ''}
                onChange={(e) =>
                  setSettings((prev) => ({
                    ...prev,
                    favicon: { ...prev.favicon, url: e.target.value }
                  }))
                }
                placeholder="https://..."
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:outline-none focus:border-slate-900 focus:bg-white"
              />
            </div>
          </div>
        </div>

        {/* Contact & Location Card */}
        <div className="p-6 sm:p-8 bg-white rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
          <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
            <Mail className="w-5 h-5 text-indigo-600" />
            <span>Public Contact Channels</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Inquiry Email
              </label>
              <input
                type="email"
                name="email"
                value={settings?.email || ''}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold focus:outline-none focus:border-slate-900 focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                WhatsApp Phone (+CountryCode)
              </label>
              <input
                type="text"
                name="whatsapp"
                value={settings?.whatsapp || ''}
                onChange={handleChange}
                placeholder="+15553829401"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold focus:outline-none focus:border-slate-900 focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Phone Number
              </label>
              <input
                type="text"
                name="phone"
                value={settings?.phone || ''}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold focus:outline-none focus:border-slate-900 focus:bg-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Studio Location / Working Hours Note
            </label>
            <input
              type="text"
              name="address"
              value={settings?.address || ''}
              onChange={handleChange}
              placeholder="Brooklyn, New York & Available Worldwide"
              className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:outline-none focus:border-slate-900 focus:bg-white"
            />
          </div>
        </div>

        {/* Social Profiles Card */}
        <div className="p-6 sm:p-8 bg-white rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
          <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
            <Share2 className="w-5 h-5 text-indigo-600" />
            <span>Social & Creative Profiles</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Behance Profile URL
              </label>
              <input
                type="url"
                name="behanceUrl"
                value={settings?.behanceUrl || ''}
                onChange={handleChange}
                placeholder="https://behance.net/..."
                className="w-full px-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:outline-none focus:border-slate-900 focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Dribbble Profile URL
              </label>
              <input
                type="url"
                name="dribbbleUrl"
                value={settings?.dribbbleUrl || ''}
                onChange={handleChange}
                placeholder="https://dribbble.com/..."
                className="w-full px-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:outline-none focus:border-slate-900 focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Instagram URL
              </label>
              <input
                type="url"
                name="instagramUrl"
                value={settings?.instagramUrl || ''}
                onChange={handleChange}
                placeholder="https://instagram.com/..."
                className="w-full px-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:outline-none focus:border-slate-900 focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                LinkedIn URL
              </label>
              <input
                type="url"
                name="linkedinUrl"
                value={settings?.linkedinUrl || ''}
                onChange={handleChange}
                placeholder="https://linkedin.com/in/..."
                className="w-full px-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:outline-none focus:border-slate-900 focus:bg-white"
              />
            </div>
          </div>
        </div>

        {/* Hero & CTA Copy Card */}
        <div className="p-6 sm:p-8 bg-white rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
          <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
            <Layout className="w-5 h-5 text-indigo-600" />
            <span>Homepage Hero & CTA Section Text</span>
          </h3>

          <div className="space-y-4 pt-2">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Availability Badge / Status
              </label>
              <input
                type="text"
                name="availabilityStatus"
                value={settings?.availabilityStatus || ''}
                onChange={handleChange}
                placeholder="e.g. Available for Select Projects 2026"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold focus:outline-none focus:border-slate-900 focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Hero Headline
              </label>
              <input
                type="text"
                name="heroHeadline"
                value={settings?.heroHeadline || ''}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold focus:outline-none focus:border-slate-900 focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Hero Subheadline
              </label>
              <textarea
                rows="2"
                name="heroSubheadline"
                value={settings?.heroSubheadline || ''}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:outline-none focus:border-slate-900 focus:bg-white"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Contact CTA Title
                </label>
                <input
                  type="text"
                  name="contactCtaTitle"
                  value={settings?.contactCtaTitle || ''}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold focus:outline-none focus:border-slate-900 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Footer Tagline
                </label>
                <input
                  type="text"
                  name="footerText"
                  value={settings?.footerText || ''}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:outline-none focus:border-slate-900 focus:bg-white"
                />
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default SettingsPage;
