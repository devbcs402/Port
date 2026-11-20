import React from 'react';

export const ProjectSkeleton = () => (
  <div className="flex flex-col animate-pulse">
    <div className="w-full aspect-[4/3] sm:aspect-[16/11] bg-gray-200 rounded-2xl mb-4"></div>
    <div className="h-5 bg-gray-200 rounded w-3/4 mb-2"></div>
    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
  </div>
);

export const ProjectGridSkeleton = ({ count = 6 }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10">
    {Array.from({ length: count }).map((_, idx) => (
      <ProjectSkeleton key={idx} />
    ))}
  </div>
);
