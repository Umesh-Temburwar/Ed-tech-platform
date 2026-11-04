import React from "react";
import { motion } from "framer-motion";
import { FaEye, FaEdit, FaTrash, FaUsers, FaStar, FaPlay } from "react-icons/fa";
import { getYoutubeThumbnail } from "../../../utils/youtubeUtils";

const STATUS_BADGE = {
  draft:     "bg-surface-2 text-muted border-border",
  published: "bg-success/10 text-success border-success/30",
  pending:   "bg-warning/10 text-warning border-warning/30",
  rejected:  "bg-danger/10 text-danger border-danger/30",
};

const CourseRow = React.forwardRef(({ course, onView, onEdit, onDelete }, ref) => {
  const dbThumbnail = course.final_thumbnail_url || course.youtube_thumbnail_url || null;
  const youtubeUrl =
    course.preview_video_url ||
    course.youtube_video_url ||
    null;
  const youtubeThumbnail = dbThumbnail || getYoutubeThumbnail(youtubeUrl);
  const uploadedThumbnail = course.custom_thumbnail_url || course.thumbnail_url || course.thumbnail || null;
  const resolvedThumbnail = youtubeThumbnail || uploadedThumbnail || null;

  function handleImgError(e) {
    const src = e.target.src;
    if (youtubeUrl && src.includes("maxresdefault")) {
      const hq = getYoutubeThumbnail(youtubeUrl, "hq");
      if (hq && hq !== src) { e.target.src = hq; return; }
    }
    if (uploadedThumbnail && src !== uploadedThumbnail) { e.target.src = uploadedThumbnail; return; }
    e.target.style.display = "none";
  }

  const statusKey = (course.status || "draft").toLowerCase();

  return (
    <motion.tr
      ref={ref}
      layout
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="hover:bg-surface-2/60 transition-colors border-b border-border last:border-0"
    >
      {/* Course Info */}
      <td className="py-4 px-5">
        <div className="flex items-center gap-3.5">
          <div className="w-16 aspect-video rounded-md overflow-hidden bg-surface-2 border border-border shrink-0 flex items-center justify-center">
            {resolvedThumbnail ? (
              <img
                src={resolvedThumbnail}
                alt={course.title}
                className="w-full h-full object-cover"
                onError={handleImgError}
                loading="lazy"
              />
            ) : (
              <FaPlay className="text-muted text-xs" />
            )}
          </div>
          <div className="min-w-0">
            <p className="font-semibold text-text truncate text-sm hover:text-accent transition-colors">
              {course.title}
            </p>
            <div className="flex items-center gap-3 mt-1 text-xs text-muted">
              {course.level && <span className="uppercase text-[10px] tracking-wider font-medium">{course.level}</span>}
              <span className="flex items-center gap-1">
                <FaUsers className="text-muted text-[10px]" /> {course.studentsEnrolled?.length ?? 0}
              </span>
              {course.rating && (
                <span className="flex items-center gap-1">
                  <FaStar className="text-warning text-[10px]" /> {course.rating}
                </span>
              )}
            </div>
          </div>
        </div>
      </td>

      {/* Category */}
      <td className="py-4 px-5">
        <span className="text-xs text-muted">
          {course.category?.name ?? course.category ?? "—"}
        </span>
      </td>

      {/* Status */}
      <td className="py-4 px-5">
        <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium border ${STATUS_BADGE[statusKey] ?? STATUS_BADGE.draft}`}>
          {course.status ? course.status.charAt(0).toUpperCase() + course.status.slice(1) : "Draft"}
        </span>
      </td>

      {/* Price */}
      <td className="py-4 px-5">
        <p className="font-semibold text-text text-sm">
          {Number(course.price) > 0 ? `₹${course.price}` : <span className="text-success font-medium">Free</span>}
        </p>
      </td>

      {/* Actions */}
      <td className="py-4 px-5 text-right">
        <div className="flex items-center justify-end gap-1.5">
          <button
            onClick={() => onView(course)}
            title="Preview Course"
            className="p-1.5 rounded border border-border text-muted hover:text-text hover:bg-surface-2 transition-colors"
          >
            <FaEye className="text-xs" />
          </button>
          <button
            onClick={() => onEdit(course)}
            title="Edit Course"
            className="p-1.5 rounded border border-border text-muted hover:text-text hover:bg-surface-2 transition-colors"
          >
            <FaEdit className="text-xs" />
          </button>
          <button
            onClick={() => onDelete(course)}
            title="Delete Course"
            className="p-1.5 rounded border border-border text-muted hover:text-danger hover:border-danger/30 hover:bg-danger/10 transition-colors"
          >
            <FaTrash className="text-xs" />
          </button>
        </div>
      </td>
    </motion.tr>
  );
});

CourseRow.displayName = "CourseRow";

export default CourseRow;
