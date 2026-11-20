import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import {
  LayoutDashboard,
  FolderKanban,
  Tags,
  Image as ImageIcon,
  UserCheck,
  Briefcase,
  Star,
  MessageSquare,
  Settings,
  ExternalLink,
  X
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const navItems = [
  { name: 'Dashboard', path: '/', icon: LayoutDashboard },
  { name: 'Projects', path: '/projects', icon: FolderKanban },
  { name: 'Categories', path: '/categories', icon: Tags },
  { name: 'Media Library', path: '/media', icon: ImageIcon },
  { name: 'About Story', path: '/about', icon: UserCheck },
  { name: 'Services', path: '/services', icon: Briefcase },
  { name: 'Testimonials', path: '/testimonials', icon: Star },
  { name: 'Contact Inbox', path: '/messages', icon: MessageSquare },
  { name: 'Site Settings', path: '/settings', icon: Settings }
];

const Sidebar = ({ isOpen, onClose }) => {
  const { admin } = useAuth();

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-xs lg:hidden"
        />
      )}

      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 w-64 bg-white border-r border-slate-200/80 flex flex-col justify-between transition-transform duration-300 lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div>
          {/* Header / Brand */}
          <div className="h-18 px-6 flex items-center justify-between border-b border-slate-100">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-slate-900 text-white flex items-center justify-center font-black text-sm">
                R
              </div>
              <div>
                <span className="font-bold text-base text-slate-900 leading-tight block">
                  Rivera CMS
                </span>
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                  Admin Control
                </span>
              </div>
            </Link>
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-600 lg:hidden"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.name}
                  to={item.path}
                  end={item.path === '/'}
                  onClick={onClose}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-2.5 rounded-2xl text-xs font-semibold uppercase tracking-wider transition-all ${
                      isActive
                        ? 'bg-slate-900 text-white shadow-xs font-bold'
                        : 'text-slate-600 hover:text-slate-950 hover:bg-slate-50'
                    }`
                  }
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.name}</span>
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Footer / Quick View Website Link */}
        <div className="p-4 border-t border-slate-100 space-y-3">
          <a
            href="http://localhost:5173"
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-200/80 hover:bg-slate-100 text-slate-700 hover:text-slate-950 text-xs font-semibold transition-all group"
          >
            <span className="flex items-center gap-2">
              <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-slate-600" />
              <span>Live Portfolio</span>
            </span>
            <span className="text-[10px] text-slate-400 font-mono">:5173</span>
          </a>

          {/* Logged in admin chip */}
          <div className="flex items-center gap-3 px-2 pt-1">
            {admin?.avatar ? (
              <img
                src={admin.avatar}
                alt={admin.name}
                className="w-8 h-8 rounded-full object-cover shrink-0"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-700 font-bold flex items-center justify-center shrink-0 text-xs">
                {admin?.name?.charAt(0) || 'A'}
              </div>
            )}
            <div className="truncate">
              <p className="text-xs font-bold text-slate-900 truncate">{admin?.name || 'Administrator'}</p>
              <p className="text-[10px] text-slate-400 truncate">{admin?.email || 'admin@portfolio.com'}</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
