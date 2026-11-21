import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, Instagram, Linkedin, Github, Twitter, Mail, Phone, MessageSquare } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';

const Footer = () => {
  const { settings } = useSettings();
  const currentYear = new Date().getFullYear();

  const brandName = settings?.designerName || 'Gracy Pandya';
  const email = settings?.email || 'hello@riveradesign.studio';
  const whatsapp = settings?.whatsapp || '+15553829401';
  const footerText = settings?.footerText || 'Crafted with precision, passion, and artistic dedication.';

  return (
    <footer className="bg-[#111317] text-gray-300 pt-20 pb-12 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 pb-16 border-b border-gray-800/80">
          {/* Brand Column */}
          <div className="md:col-span-5 space-y-4">
            <Link to="/" className="inline-block">
              <span className="font-display font-black text-2xl tracking-tight text-white">
                {brandName}
                <span className="text-indigo-400">.</span>
              </span>
            </Link>
            <p className="text-gray-400 text-sm max-w-sm leading-relaxed">
              {footerText}
            </p>
            <div className="pt-2 flex items-center gap-4 text-xs tracking-wider uppercase text-gray-500 font-semibold">
              <span className="flex items-center gap-1.5 text-emerald-400">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                {settings?.availabilityStatus || 'Available for Select Projects 2026'}
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-2 space-y-3">
            <h4 className="text-xs uppercase font-bold tracking-wider text-gray-400">Navigation</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="text-gray-300 hover:text-white transition-colors">Home</Link>
              </li>
              <li>
                <Link to="/portfolio" className="text-gray-300 hover:text-white transition-colors">Portfolio</Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-300 hover:text-white transition-colors">About Story</Link>
              </li>
              <li>
                <Link to="/services" className="text-gray-300 hover:text-white transition-colors">Design Services</Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-300 hover:text-white transition-colors">Contact</Link>
              </li>
            </ul>
          </div>

          {/* Connect / Socials */}
          <div className="md:col-span-2 space-y-3">
            <h4 className="text-xs uppercase font-bold tracking-wider text-gray-400">Follow Works</h4>
            <ul className="space-y-2 text-sm">
              {settings?.behanceUrl && (
                <li>
                  <a
                    href={settings.behanceUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 text-gray-300 hover:text-white transition-colors"
                  >
                    <span>Behance</span>
                    <ArrowUpRight className="w-3.5 h-3.5 opacity-60" />
                  </a>
                </li>
              )}
              {settings?.dribbbleUrl && (
                <li>
                  <a
                    href={settings.dribbbleUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 text-gray-300 hover:text-white transition-colors"
                  >
                    <span>Dribbble</span>
                    <ArrowUpRight className="w-3.5 h-3.5 opacity-60" />
                  </a>
                </li>
              )}
              {settings?.instagramUrl && (
                <li>
                  <a
                    href={settings.instagramUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 text-gray-300 hover:text-white transition-colors"
                  >
                    <span>Instagram</span>
                    <ArrowUpRight className="w-3.5 h-3.5 opacity-60" />
                  </a>
                </li>
              )}
              {settings?.linkedinUrl && (
                <li>
                  <a
                    href={settings.linkedinUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 text-gray-300 hover:text-white transition-colors"
                  >
                    <span>LinkedIn</span>
                    <ArrowUpRight className="w-3.5 h-3.5 opacity-60" />
                  </a>
                </li>
              )}
            </ul>
          </div>

          {/* Contact Direct */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-xs uppercase font-bold tracking-wider text-gray-400">Direct Inquiries</h4>
            <div className="space-y-2 text-sm">
              <a
                href={`mailto:${email}`}
                className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors truncate"
              >
                <Mail className="w-4 h-4 text-indigo-400 shrink-0" />
                <span className="truncate">{email}</span>
              </a>
              {whatsapp && (
                <a
                  href={`https://wa.me/${whatsapp.replace(/[^0-9]/g, '')}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors"
                >
                  <MessageSquare className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Chat on WhatsApp</span>
                </a>
              )}
              {settings?.address && (
                <p className="text-xs text-gray-400 pt-1 leading-relaxed">
                  {settings.address}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500 gap-4">
          <p>© {currentYear} {brandName}. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span>Portfolio CMS Edition 2.0</span>
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-gray-700"></span>
            <span>Premium Graphic Design & Art Direction</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
