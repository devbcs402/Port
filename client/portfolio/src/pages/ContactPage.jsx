import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Mail, Phone, MessageSquare, MapPin, Send, CheckCircle2, AlertCircle, ArrowUpRight } from 'lucide-react';
import api from '../api/axios';
import { useSettings } from '../context/SettingsContext';

const ContactPage = () => {
  const { settings } = useSettings();
  const [searchParams] = useSearchParams();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
    _honeypot: ''
  });

  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const serviceParam = searchParams.get('service');
    if (serviceParam) {
      setFormData((prev) => ({
        ...prev,
        subject: `Inquiry about ${serviceParam}`
      }));
    }
    window.scrollTo(0, 0);
  }, [searchParams]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    if (errorMessage) setErrorMessage('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setSuccessMessage('');
    setErrorMessage('');

    if (!formData.name.trim() || !formData.email.trim() || !formData.subject.trim() || !formData.message.trim()) {
      setErrorMessage('Please fill in all required fields (Name, Email, Subject, and Message).');
      setSubmitting(false);
      return;
    }

    try {
      const res = await api.post('/contact', formData);
      if (res.data.success) {
        setSuccessMessage(res.data.message || 'Thank you! Your message has been sent successfully.');
        setFormData({
          name: '',
          email: '',
          phone: '',
          subject: '',
          message: '',
          _honeypot: ''
        });
      }
    } catch (err) {
      console.error('Contact submission error:', err);
      setErrorMessage(
        err.response?.data?.message || 'Failed to deliver message. Please try again or email directly.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  const email = settings?.email || 'hello@riveradesign.studio';
  const phone = settings?.phone || '+1 (555) 382-9401';
  const whatsapp = settings?.whatsapp || '+15553829401';
  const address = settings?.address || 'Brooklyn, New York & Available Worldwide';

  return (
    <div className="min-h-screen bg-[#FAFAFA] pt-32 pb-28">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        {/* Header */}
        <div className="max-w-3xl mb-16 space-y-4">
          <span className="text-xs uppercase font-bold tracking-widest text-indigo-600">
            Get In Touch
          </span>
          <h1 className="font-display font-black text-4xl sm:text-6xl text-gray-950 tracking-tight leading-tight">
            Let’s Build Something Remarkable Together.
          </h1>
          <p className="text-gray-600 text-lg sm:text-xl leading-relaxed">
            Have a project in mind, an upcoming brand launch, or an art direction inquiry? Drop a line below or reach out directly.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Left Column: Direct Contact Info & Socials */}
          <div className="lg:col-span-5 space-y-8">
            <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-xs space-y-6">
              <h3 className="font-display font-bold text-xl text-gray-950">
                Contact Information
              </h3>
              <p className="text-sm text-gray-500 leading-relaxed">
                Currently booking brand identity, packaging, and art direction commissions for Q1/Q2 2026.
              </p>

              <div className="space-y-4 pt-2">
                <a
                  href={`mailto:${email}`}
                  className="flex items-center gap-3 p-3 rounded-2xl hover:bg-gray-50 transition-colors group"
                >
                  <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-wider text-gray-400">Direct Email</span>
                    <p className="font-semibold text-sm text-gray-900 group-hover:text-indigo-600 transition-colors truncate">
                      {email}
                    </p>
                  </div>
                </a>

                {whatsapp && (
                  <a
                    href={`https://wa.me/${whatsapp.replace(/[^0-9]/g, '')}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-3 p-3 rounded-2xl hover:bg-gray-50 transition-colors group"
                  >
                    <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                      <MessageSquare className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-bold tracking-wider text-gray-400">Instant Chat</span>
                      <p className="font-semibold text-sm text-gray-900 group-hover:text-emerald-600 transition-colors">
                        WhatsApp Message
                      </p>
                    </div>
                  </a>
                )}

                {phone && (
                  <div className="flex items-center gap-3 p-3 rounded-2xl">
                    <div className="w-10 h-10 rounded-xl bg-gray-50 text-gray-600 flex items-center justify-center shrink-0">
                      <Phone className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-bold tracking-wider text-gray-400">Phone</span>
                      <p className="font-semibold text-sm text-gray-900">{phone}</p>
                    </div>
                  </div>
                )}

                {address && (
                  <div className="flex items-center gap-3 p-3 rounded-2xl">
                    <div className="w-10 h-10 rounded-xl bg-gray-50 text-gray-600 flex items-center justify-center shrink-0">
                      <MapPin className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-bold tracking-wider text-gray-400">Location</span>
                      <p className="font-semibold text-sm text-gray-900">{address}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Social Links Box */}
            <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-xs space-y-4">
              <h4 className="text-xs uppercase font-bold tracking-wider text-gray-400">
                Follow Design Portfolios
              </h4>
              <div className="flex flex-wrap gap-3">
                {settings?.behanceUrl && (
                  <a
                    href={settings.behanceUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="px-4 py-2 rounded-full bg-gray-50 hover:bg-gray-100 border border-gray-200 text-xs font-semibold text-gray-800 flex items-center gap-1.5 transition-colors"
                  >
                    <span>Behance</span>
                    <ArrowUpRight className="w-3.5 h-3.5 text-gray-400" />
                  </a>
                )}
                {settings?.dribbbleUrl && (
                  <a
                    href={settings.dribbbleUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="px-4 py-2 rounded-full bg-gray-50 hover:bg-gray-100 border border-gray-200 text-xs font-semibold text-gray-800 flex items-center gap-1.5 transition-colors"
                  >
                    <span>Dribbble</span>
                    <ArrowUpRight className="w-3.5 h-3.5 text-gray-400" />
                  </a>
                )}
                {settings?.instagramUrl && (
                  <a
                    href={settings.instagramUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="px-4 py-2 rounded-full bg-gray-50 hover:bg-gray-100 border border-gray-200 text-xs font-semibold text-gray-800 flex items-center gap-1.5 transition-colors"
                  >
                    <span>Instagram</span>
                    <ArrowUpRight className="w-3.5 h-3.5 text-gray-400" />
                  </a>
                )}
                {settings?.linkedinUrl && (
                  <a
                    href={settings.linkedinUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="px-4 py-2 rounded-full bg-gray-50 hover:bg-gray-100 border border-gray-200 text-xs font-semibold text-gray-800 flex items-center gap-1.5 transition-colors"
                  >
                    <span>LinkedIn</span>
                    <ArrowUpRight className="w-3.5 h-3.5 text-gray-400" />
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Contact Form */}
          <div className="lg:col-span-7">
            <div className="bg-white p-8 sm:p-12 rounded-3xl border border-gray-100 shadow-sm">
              <h3 className="font-display font-bold text-2xl text-gray-950 mb-2">
                Send a Message
              </h3>
              <p className="text-sm text-gray-500 mb-8">
                Fill in the details below and I will respond within 24 business hours.
              </p>

              {successMessage && (
                <div className="mb-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-start gap-3 text-emerald-800 text-sm">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{successMessage}</span>
                </div>
              )}

              {errorMessage && (
                <div className="mb-6 p-4 rounded-2xl bg-rose-50 border border-rose-200 flex items-start gap-3 text-rose-800 text-sm">
                  <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                  <span>{errorMessage}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Honeypot field (hidden from real users to trap spam bots) */}
                <input
                  type="text"
                  name="_honeypot"
                  value={formData._honeypot}
                  onChange={handleChange}
                  className="hidden"
                  tabIndex="-1"
                  autoComplete="off"
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
                      Your Name <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Jane Doe"
                      className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-sm focus:outline-none focus:border-gray-950 focus:bg-white transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
                      Email Address <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="jane@company.com"
                      className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-sm focus:outline-none focus:border-gray-950 focus:bg-white transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
                      Phone Number (Optional)
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+1 (555) 000-0000"
                      className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-sm focus:outline-none focus:border-gray-950 focus:bg-white transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
                      Subject / Project Scope <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="subject"
                      required
                      value={formData.subject}
                      onChange={handleChange}
                      placeholder="e.g. Brand Identity Redesign"
                      className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-sm focus:outline-none focus:border-gray-950 focus:bg-white transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
                    Message & Project Goals <span className="text-rose-500">*</span>
                  </label>
                  <textarea
                    name="message"
                    rows="6"
                    required
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Tell me about your brand, timeline, design expectations, and key deliverables..."
                    className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-sm focus:outline-none focus:border-gray-950 focus:bg-white transition-all resize-y"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-gray-950 text-white font-semibold text-xs uppercase tracking-wider hover:bg-black transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-md"
                >
                  {submitting ? (
                    <span>Sending Message...</span>
                  ) : (
                    <>
                      <span>Submit Message</span>
                      <Send className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
