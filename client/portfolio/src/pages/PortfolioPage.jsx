import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, RefreshCw } from 'lucide-react';
import api from '../api/axios';
import ProjectCard from '../components/ProjectCard';
import { ProjectGridSkeleton } from '../components/SkeletonLoader';

const PortfolioPage = () => {
  const [projects, setProjects] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  // Fetch categories on mount
  useEffect(() => {
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
    fetchCategories();
  }, []);

  // Fetch projects when category, search query, or page changes
  useEffect(() => {
    const fetchProjects = async () => {
      setLoading(true);
      try {
        const params = {
          category: selectedCategory,
          page,
          limit: 12
        };
        if (searchQuery.trim()) {
          params.search = searchQuery.trim();
        }

        const res = await api.get('/projects', { params });
        if (res.data.success) {
          setProjects(res.data.projects);
          setTotalPages(res.data.totalPages);
          setTotalCount(res.data.total);
        }
      } catch (err) {
        console.error('Error fetching projects:', err);
      } finally {
        setLoading(false);
      }
    };

    // Debounce search
    const timer = setTimeout(() => {
      fetchProjects();
    }, 250);

    return () => clearTimeout(timer);
  }, [selectedCategory, searchQuery, page]);

  const handleCategoryChange = (slug) => {
    setSelectedCategory(slug);
    setPage(1);
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] pt-32 pb-28">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        {/* Header */}
        <div className="max-w-3xl mb-12 space-y-3">
          <span className="text-xs uppercase font-bold tracking-widest text-indigo-600">
            Selected Portfolio
          </span>
          <h1 className="font-display font-black text-4xl sm:text-5xl md:text-6xl text-gray-950 tracking-tight">
            Graphic Design & Case Studies
          </h1>
          <p className="text-gray-600 text-base sm:text-lg">
            A curated showcase of brand identities, packaging architectures, typographic prints, and visual communication projects.
          </p>
        </div>

        {/* Filter & Search Bar */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-6 pb-8 border-b border-gray-200">
          {/* Category Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-none no-scrollbar">
            <button
              onClick={() => handleCategoryChange('all')}
              className={`px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider transition-all whitespace-nowrap ${
                selectedCategory === 'all'
                  ? 'bg-gray-950 text-white shadow-xs'
                  : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              All Projects ({totalCount})
            </button>
            {categories.map((cat) => (
              <button
                key={cat._id}
                onClick={() => handleCategoryChange(cat.slug)}
                className={`px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider transition-all whitespace-nowrap ${
                  selectedCategory === cat.slug
                    ? 'bg-gray-950 text-white shadow-xs'
                    : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="relative min-w-[260px]">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setPage(1);
              }}
              placeholder="Search by title, tool, client..."
              className="w-full pl-10 pr-4 py-2 rounded-full bg-white border border-gray-200 text-sm focus:outline-none focus:border-gray-950 focus:ring-1 focus:ring-gray-950 transition-all shadow-xs"
            />
          </div>
        </div>

        {/* Projects Grid */}
        <div className="pt-12">
          {loading ? (
            <ProjectGridSkeleton count={9} />
          ) : projects.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10">
              {projects.map((project, idx) => (
                <ProjectCard key={project._id} project={project} index={idx} />
              ))}
            </div>
          ) : (
            <div className="text-center py-24 bg-white rounded-3xl border border-gray-100 shadow-xs max-w-lg mx-auto p-8">
              <div className="w-12 h-12 rounded-full bg-gray-100 text-gray-400 flex items-center justify-center mx-auto mb-4">
                <Search className="w-5 h-5" />
              </div>
              <h3 className="font-display font-bold text-lg text-gray-900 mb-2">No projects found</h3>
              <p className="text-sm text-gray-500 mb-6">
                No published designs matched your search criteria or category filter.
              </p>
              <button
                onClick={() => {
                  setSelectedCategory('all');
                  setSearchQuery('');
                }}
                className="px-5 py-2 rounded-full bg-gray-950 text-white text-xs font-semibold hover:bg-black transition-all"
              >
                Reset Filters
              </button>
            </div>
          )}
        </div>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="pt-16 flex items-center justify-center gap-2">
            <button
              disabled={page <= 1}
              onClick={() => setPage(page - 1)}
              className="px-4 py-2 rounded-lg border border-gray-200 bg-white text-xs font-semibold disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50 transition-all"
            >
              Previous
            </button>
            <span className="text-xs text-gray-500 font-mono px-3">
              Page {page} of {totalPages}
            </span>
            <button
              disabled={page >= totalPages}
              onClick={() => setPage(page + 1)}
              className="px-4 py-2 rounded-lg border border-gray-200 bg-white text-xs font-semibold disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50 transition-all"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PortfolioPage;
