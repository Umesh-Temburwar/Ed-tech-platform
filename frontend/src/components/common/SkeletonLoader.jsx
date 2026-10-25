import React from 'react';

/**
 * Skeleton Loader Component
 * Provides shimmer placeholder states for courses, dashboard cards, and lists
 */

export const CourseCardSkeleton = () => (
  <div className="bg-richblack-800 border border-richblack-700 rounded-2xl overflow-hidden animate-pulse">
    <div className="h-44 bg-richblack-700/60 w-full" />
    <div className="p-5 space-y-3">
      <div className="h-4 bg-richblack-700/60 rounded w-3/4" />
      <div className="h-3 bg-richblack-700/40 rounded w-1/2" />
      <div className="flex items-center justify-between pt-3">
        <div className="h-5 bg-richblack-700/60 rounded w-20" />
        <div className="h-8 bg-richblack-700/60 rounded-xl w-24" />
      </div>
    </div>
  </div>
);

export const StatCardSkeleton = () => (
  <div className="bg-richblack-800 border border-richblack-700 rounded-2xl p-6 animate-pulse space-y-3">
    <div className="flex items-center justify-between">
      <div className="h-3 bg-richblack-700/50 rounded w-24" />
      <div className="w-10 h-10 bg-richblack-700/60 rounded-xl" />
    </div>
    <div className="h-7 bg-richblack-700/80 rounded w-32" />
    <div className="h-3 bg-richblack-700/40 rounded w-20" />
  </div>
);

export const TableRowSkeleton = ({ columns = 5 }) => (
  <tr className="border-b border-richblack-700/50 animate-pulse">
    {Array.from({ length: columns }).map((_, i) => (
      <td key={i} className="py-4 px-4">
        <div className="h-4 bg-richblack-700/50 rounded w-full max-w-[120px]" />
      </td>
    ))}
  </tr>
);

export default {
  CourseCardSkeleton,
  StatCardSkeleton,
  TableRowSkeleton,
};
