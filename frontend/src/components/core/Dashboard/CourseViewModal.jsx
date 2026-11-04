import React from "react";
import { FaStar, FaUsers, FaTimes, FaPlay, FaBook, FaClock } from "react-icons/fa";

export default function CourseViewModal({ course, onClose }) {
  if (!course) return null;
  const isPublished = (course.status || "").toLowerCase() === "published";

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/60 p-4" onClick={onClose}>
      <div className="bg-surface border border-border rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl" onClick={e => e.stopPropagation()}>
        {/* Header Image */}
        <div className="relative h-44 rounded-t-xl overflow-hidden bg-surface-2 border-b border-border">
          {course.thumbnail || course.thumbnail_url ? (
            <img src={course.thumbnail || course.thumbnail_url} alt={course.courseName || course.title} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-muted"><FaBook className="text-3xl" /></div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
          <button 
            onClick={onClose} 
            className="absolute top-3 right-3 w-7 h-7 bg-black/60 hover:bg-black/90 rounded-full flex items-center justify-center text-white transition-colors"
          >
            <FaTimes className="text-xs" />
          </button>
          <div className="absolute bottom-3 left-4">
            <span className={`px-2 py-0.5 rounded text-[11px] font-medium border ${
              isPublished ? "bg-success/20 text-success border-success/40" : "bg-surface-2 text-muted border-border"
            }`}>
              {course.status || "Draft"}
            </span>
          </div>
        </div>

        <div className="p-5 space-y-5">
          {/* Title & Meta */}
          <div>
            <h2 className="text-xl font-bold text-text mb-1">{course.courseName || course.title}</h2>
            <p className="text-muted text-xs leading-relaxed">{course.courseDescription || course.description}</p>
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-4 gap-2.5">
            {[
              { icon: FaUsers, label: "Students", value: course.studentsEnrolled?.length ?? 0 },
              { icon: FaStar, label: "Rating", value: course.rating ?? "4.8" },
              { icon: FaBook, label: "Sections", value: course.sections?.length ?? 0 },
              { icon: FaClock, label: "Duration", value: course.duration ?? "—" },
            ].map((s, i) => (
              <div key={i} className="bg-surface-2 rounded-lg p-2.5 text-center border border-border">
                <s.icon className="text-muted text-xs mx-auto mb-1" />
                <p className="text-sm font-bold text-text">{s.value}</p>
                <p className="text-[10px] text-muted uppercase font-medium">{s.label}</p>
              </div>
            ))}
          </div>

          {/* Details */}
          <div className="grid grid-cols-2 gap-3 bg-surface-2 rounded-lg p-3.5 border border-border">
            {[
              { label: "Category", value: course.category?.name ?? course.category ?? "—" },
              { label: "Level", value: course.level ?? "Beginner" },
              { label: "Price", value: course.price > 0 ? `₹${course.price}` : "Free" },
              { label: "Language", value: course.language ?? "English" },
            ].map((d, i) => (
              <div key={i}>
                <p className="text-[10px] text-muted uppercase font-semibold tracking-wider">{d.label}</p>
                <p className="text-text font-medium text-xs mt-0.5">{d.value}</p>
              </div>
            ))}
          </div>

          {/* Sections/Lectures */}
          {course.sections?.length > 0 && (
            <div>
              <h3 className="text-xs font-semibold text-text uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <FaBook className="text-muted text-xs" /> Curriculum Breakdown
              </h3>
              <div className="space-y-2">
                {course.sections.map((sec, i) => (
                  <div key={i} className="bg-surface-2 border border-border rounded-lg p-3">
                    <p className="text-text font-medium text-xs mb-1.5">
                      Section {i + 1}: {sec.sectionName}
                    </p>
                    {sec.subSection?.map((sub, j) => (
                      <div key={j} className="flex items-center gap-2 pl-2 py-1 text-muted text-xs border-l border-border">
                        <FaPlay className="text-[8px] text-muted shrink-0" />
                        <span>{sub.title}</span>
                        {sub.timeDuration && <span className="ml-auto text-[10px] text-muted">{sub.timeDuration}m</span>}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="pt-2 flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-surface-2 border border-border rounded-md text-xs font-medium text-text hover:bg-surface transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
