import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, BookOpen } from 'lucide-react';
import CourseCard from './CourseCard';
import { getAllCourses } from '../../../services/operations/courseDetailsAPI';

export default function CoursesSection() {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true);
      const result = await getAllCourses();
      if (result) {
        setCourses(result);
      }
      setLoading(false);
    };
    fetchCourses();
  }, []);

  return (
    <section className="py-20 px-4 md:px-8 lg:px-12 bg-canvas border-y border-border relative">
      <div className="max-w-7xl mx-auto">
        {/* Section Title */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-6">
          <div className="max-w-2xl">
            <span className="text-[11px] font-semibold text-muted uppercase tracking-wider block mb-2">
              Featured Curricula
            </span>
            <h2 className="text-2xl sm:text-3xl font-semibold text-text tracking-tight mb-2">
              Popular Courses
            </h2>
            <p className="text-muted text-sm leading-relaxed">
              Engineered for rigorous self-paced learning with verified faculty support and practical projects.
            </p>
          </div>

          <button
            onClick={() => navigate('/explore-courses')}
            className="hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold text-accent hover:underline shrink-0"
          >
            Explore all {courses.length > 0 ? `${courses.length} courses` : 'courses'}
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Courses Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-surface border border-border rounded-xl p-4 space-y-3 animate-pulse">
                <div className="h-44 bg-surface-2 rounded-lg"></div>
                <div className="h-5 bg-surface-2 rounded w-3/4"></div>
                <div className="h-4 bg-surface-2 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : courses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.slice(0, 6).map((course, index) => (
              <CourseCard
                key={course.id || course._id || index}
                course={{
                  id: course.id || course._id,
                  title: course.title || course.course_name || course.courseName || "Untitled Course",
                  description: course.description || course.course_description || course.courseDescription || course.short_description || "",
                  thumbnail: course.thumbnail || null,
                  thumbnail_url: course.thumbnail_url || null,
                  custom_thumbnail_url: course.custom_thumbnail_url || null,
                  final_thumbnail_url: course.final_thumbnail_url || null,
                  youtube_thumbnail_url: course.youtube_thumbnail_url || null,
                  youtube_video_url: course.youtube_video_url || null,
                  preview_video_url: course.preview_video_url || null,
                  price: course.price,
                  rating: course.average_rating || course.rating || 0,
                  duration: course.total_duration || course.duration || "Self-Paced",
                  level: course.level || "Intermediate",
                  isFree: course.is_free || course.price === 0,
                }}
                index={index}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-surface border border-dashed border-border rounded-xl">
            <BookOpen className="w-8 h-8 text-muted mx-auto mb-2" />
            <p className="text-text font-medium text-sm">No courses available at the moment.</p>
            <p className="text-xs text-muted mt-1">Please check back soon for new additions.</p>
          </div>
        )}

        {/* View All Mobile Button */}
        <div className="text-center mt-10 sm:hidden">
          <button
            onClick={() => navigate('/explore-courses')}
            className="w-full py-2.5 px-4 rounded-lg bg-surface border border-border text-xs font-semibold text-text hover:bg-surface-2 transition-colors"
          >
            View All Courses
          </button>
        </div>
      </div>
    </section>
  );
}
