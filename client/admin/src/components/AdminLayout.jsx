import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Topbar from './Topbar';

const getPageTitle = (pathname) => {
  if (pathname === '/') return 'Dashboard Overview';
  if (pathname.startsWith('/projects/new')) return 'Create New Project';
  if (pathname.startsWith('/projects/edit')) return 'Edit Project';
  if (pathname.startsWith('/projects')) return 'Project Management';
  if (pathname.startsWith('/categories')) return 'Category Management';
  if (pathname.startsWith('/media')) return 'Media Library';
  if (pathname.startsWith('/about')) return 'About Story & Profile';
  if (pathname.startsWith('/services')) return 'Services Management';
  if (pathname.startsWith('/testimonials')) return 'Testimonials Management';
  if (pathname.startsWith('/messages')) return 'Contact Inquiries Inbox';
  if (pathname.startsWith('/settings')) return 'Website & Social Settings';
  return 'Admin Dashboard';
};

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const title = getPageTitle(location.pathname);

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 lg:pl-64 flex flex-col min-w-0">
        <Topbar onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} title={title} />
        <main className="p-6 sm:p-8 flex-1 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
