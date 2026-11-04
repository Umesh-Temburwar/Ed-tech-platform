import React, { useState, useMemo } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaPlus, FaEdit, FaTrash, FaEye, FaSearch,
  FaFilter, FaStar, FaUsers, FaCheckCircle
} from "react-icons/fa";
import { deleteCourse as supabaseDeleteCourse } from "../../../services/courseService";
import { useInstructorCourses } from "../../../hooks/useInstructorCourses";
import CourseViewModal from "./CourseViewModal";
import CourseRow from "./CourseRow";

// ─── Confirmation Modal ─────────────────────────────────────────────────────────
function DeleteModal({ course, onConfirm, onCancel, loading }) {
  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/60 p-4">
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-surface border border-border rounded-xl w-full max-w-sm p-6 shadow-xl"
      >
        <div className="w-12 h-12 bg-danger/10 border border-danger/20 rounded-xl flex items-center justify-center mx-auto mb-4">
          <FaTrash className="text-lg text-danger" />
        </div>
        <h3 className="text-lg font-bold text-text text-center mb-1">Delete Course</h3>
        <p className="text-muted text-xs text-center mb-2">You are about to permanently delete:</p>
        <p className="text-text font-medium text-center text-xs mb-4 px-3 py-2 bg-surface-2 rounded-lg border border-border truncate">
          "{course?.title}"
        </p>
        <p className="text-danger/90 text-xs text-center mb-5">
          This action cannot be undone. All modules, enrollments, and attached analytics will be permanently removed.
        </p>
        <div className="flex gap-2">
          <button
            onClick={onCancel}
            disabled={loading}
            className="flex-1 py-2 bg-surface-2 hover:bg-surface border border-border text-text rounded-md font-medium text-xs transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="flex-1 py-2 bg-danger hover:bg-[#e03131] text-white rounded-md font-medium text-xs transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {loading ? <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <FaTrash className="text-xs" />}
            {loading ? "Deleting..." : "Delete Course"}
          </button>
        </div>
      </motion.div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function MyCourses() {
  const { user } = useSelector(s => s.profile);
  const navigate  = useNavigate();

  const { courses, loading, error: fetchError, setError: setFetchError, setCourses } = useInstructorCourses(user?.id);
  const [query, setQuery]               = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const [viewCourse,   setViewCourse]   = useState(null);
  const [deleteCourse, setDeleteCourse] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Normalize courses for display
  const normalizedCourses = useMemo(() => {
    return courses.map(c => {
      const ytId = c.youtube_video_id || null;
      const resolvedThumb =
        (ytId ? `https://img.youtube.com/vi/${ytId}/hqdefault.jpg` : null) ||
        c.youtube_thumbnail_url ||
        c.final_thumbnail_url ||
        c.custom_thumbnail_url ||
        c.thumbnail_url ||
        (c.thumbnail && !c.thumbnail.includes('unsplash') ? c.thumbnail : null) ||
        null;

      return {
        ...c,
        _id:               c.id,
        title:             c.title || c.course_name || "Untitled Course",
        thumbnail_url:     resolvedThumb || c.thumbnail_url || c.thumbnail,
        youtube_video_id:        c.youtube_video_id || null,
        youtube_thumbnail_url:   resolvedThumb,
        final_thumbnail_url:     c.final_thumbnail_url || resolvedThumb,
        category:          c.category,
        studentsEnrolled:  c.enrollments ?? [],
        price:             c.price,
        status:            c.status,
        rating:            c.rating ?? null,
        level:             c.level ?? null,
        preview_video_url: c.preview_video_url ?? null,
        youtube_url:       c.youtube_url ?? null,
        youtubeLink:       c.youtubeLink ?? null,
      };
    });
  }, [courses]);

  const filtered = useMemo(() => {
    let list = [...normalizedCourses];
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(c => (c.title ?? "").toLowerCase().includes(q));
    }
    if (statusFilter !== "all") list = list.filter(c => c.status === statusFilter);
    return list;
  }, [normalizedCourses, query, statusFilter]);

  const handleEditCourse = (course) => {
    const courseId = course.id || course._id;
    navigate(`/dashboard/instructor/edit-course/${courseId}`);
  };

  const handleConfirmDelete = async () => {
    setDeleteLoading(true);
    const { error } = await supabaseDeleteCourse(deleteCourse._id);
    if (error) {
      toast.error(`Delete failed: ${error.message}`);
    } else {
      setCourses(prev => prev.filter(c => c.id !== (deleteCourse.id || deleteCourse._id)));
      toast.success(`"${deleteCourse.title}" deleted`);
    }
    setDeleteLoading(false);
    setDeleteCourse(null);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-surface p-6 rounded-xl border border-border">
        <div>
          <h1 className="text-2xl font-bold text-text">My Courses</h1>
          <p className="text-sm text-muted mt-1">
            {courses.length} course{courses.length !== 1 ? "s" : ""} · {courses.filter(c => c.status === "published").length} published
          </p>
        </div>
        <button
          onClick={() => navigate("/dashboard/instructor/add-course")}
          className="flex items-center gap-2 px-4 py-2.5 bg-hot text-white rounded-md font-semibold hover:bg-[#e5482a] transition-colors text-sm"
        >
          <FaPlus className="text-xs" /> New Course
        </button>
      </div>

      {/* Database Error Banner */}
      {fetchError && (
        <div className="flex items-start gap-3 p-4 rounded-xl bg-danger/10 border border-danger/30 text-sm">
          <span className="text-danger text-base shrink-0">⚠️</span>
          <div className="min-w-0">
            <p className="font-semibold text-danger mb-0.5">Database Error</p>
            <p className="text-muted text-xs break-all">{fetchError}</p>
          </div>
          <button onClick={() => setFetchError(null)} className="text-muted hover:text-text text-base shrink-0 ml-auto">×</button>
        </div>
      )}

      {/* Filter Toolbar */}
      <div className="flex flex-wrap gap-3 items-center bg-surface p-4 rounded-xl border border-border">
        <div className="relative flex-1 min-w-[220px]">
          <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted text-xs" />
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search courses by title..."
            className="w-full pl-9 pr-3 py-2 text-xs rounded-md bg-surface-2 border border-border focus:border-accent outline-none text-text transition-colors"
          />
        </div>
        <div className="flex items-center gap-2">
          <FaFilter className="text-muted text-xs" />
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="px-3 py-2 text-xs rounded-md bg-surface-2 border border-border focus:border-accent outline-none text-text cursor-pointer"
          >
            <option value="all">All Status</option>
            <option value="published">Published</option>
            <option value="pending">Pending</option>
            <option value="draft">Draft</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
        {(query || statusFilter !== "all") && (
          <button onClick={() => { setQuery(""); setStatusFilter("all"); }} className="text-xs text-muted hover:text-text font-medium transition-colors">
            Clear filters
          </button>
        )}
      </div>

      {/* Courses Table */}
      <div className="rounded-xl border border-border bg-surface overflow-hidden">
        {loading ? (
          <div className="py-16 flex flex-col items-center gap-3">
            <div className="w-8 h-8 border-2 border-border border-t-accent rounded-full animate-spin" />
            <p className="text-muted text-xs">Loading course list...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-16 flex flex-col items-center gap-3 text-center px-6">
            <div className="w-12 h-12 bg-surface-2 border border-border rounded-xl flex items-center justify-center">
              <FaCheckCircle className="text-lg text-muted" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-text mb-0.5">No Courses Found</h3>
              <p className="text-muted text-xs mb-3 max-w-xs mx-auto">
                {query || statusFilter !== "all" ? "No courses matched your current filter criteria." : "You have not published or drafted any courses yet."}
              </p>
              {!(query || statusFilter !== "all") && (
                <button
                  onClick={() => navigate("/dashboard/instructor/add-course")}
                  className="px-4 py-2 bg-hot text-white rounded-md font-semibold text-xs hover:bg-[#e5482a] transition-colors"
                >
                  Create First Course
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-xs">
              <thead>
                <tr className="text-muted bg-surface-2 border-b border-border uppercase tracking-wider text-[11px] font-semibold">
                  <th className="py-3 px-5 text-left">Course Info</th>
                  <th className="py-3 px-5 text-left">Category</th>
                  <th className="py-3 px-5 text-left">Status</th>
                  <th className="py-3 px-5 text-left">Price</th>
                  <th className="py-3 px-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                <AnimatePresence mode="popLayout">
                  {filtered.map(course => (
                    <CourseRow
                      key={course._id}
                      course={course}
                      onView={setViewCourse}
                      onEdit={handleEditCourse}
                      onDelete={setDeleteCourse}
                    />
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        )}
      </div>

      <AnimatePresence>
        {viewCourse && <CourseViewModal course={viewCourse} onClose={() => setViewCourse(null)} />}
        {deleteCourse && (
          <DeleteModal
            course={deleteCourse}
            loading={deleteLoading}
            onConfirm={handleConfirmDelete}
            onCancel={() => setDeleteCourse(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
