import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { motion } from 'framer-motion';

const ProjectCard = ({ project, index = 0 }) => {
  if (!project) return null;

  const categoryName = project.category?.name || 'Design';

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.5, delay: (index % 4) * 0.1 }}
      className="group flex flex-col"
    >
      <Link
        to={`/portfolio/${project.slug}`}
        className="block relative overflow-hidden rounded-2xl bg-gray-100 aspect-[4/3] sm:aspect-[16/11] mb-4 shadow-xs"
      >
        <img
          src={project.coverImage?.url}
          alt={project.coverImage?.alt || project.title}
          loading="lazy"
          className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
        />

        {/* Hover overlay with badge */}
        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <div className="w-12 h-12 rounded-full bg-white text-black flex items-center justify-center shadow-lg transform translate-y-3 group-hover:translate-y-0 transition-transform duration-300">
            <ArrowUpRight className="w-5 h-5" />
          </div>
        </div>

        {/* Category Pill Tag */}
        <div className="absolute top-4 left-4">
          <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-white/90 backdrop-blur-md text-gray-900 shadow-xs">
            {categoryName}
          </span>
        </div>
      </Link>

      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="font-display font-bold text-lg text-gray-950 group-hover:text-indigo-600 transition-colors line-clamp-1">
            <Link to={`/portfolio/${project.slug}`}>{project.title}</Link>
          </h3>
          <p className="text-sm text-gray-500 mt-1 line-clamp-1">
            {project.shortDescription}
          </p>
        </div>
        {project.projectDate && (
          <span className="text-xs font-mono text-gray-400 shrink-0 mt-1">
            {project.projectDate.split(' ').pop()}
          </span>
        )}
      </div>
    </motion.article>
  );
};

export default ProjectCard;
