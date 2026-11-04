import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-hot-toast";
import {
  FaPlus, FaTrash, FaEdit, FaCheck, FaTimes, FaYoutube,
  FaChevronDown, FaChevronUp, FaGripVertical, FaSpinner,
  FaPlay
} from "react-icons/fa";
import {
  getSectionsByCourse,
  createSection,
  updateSection,
  deleteSection,
  getLessonsBySection,
  createLesson,
  updateLesson,
  deleteLesson,
} from "../../../services/lessonService";
import { getYoutubeVideoId } from "../../../utils/youtubeUtils";

// ── Inline YouTube Preview ───────────────────────────────────────────────────
function YoutubePreview({ url }) {
  const videoId = getYoutubeVideoId(url);
  if (!videoId) return null;
  const thumb = `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`;
  return (
    <div className="mt-2 flex items-center gap-2.5 p-2 bg-surface-2 rounded-md border border-border">
      <img src={thumb} alt="Preview" className="w-14 aspect-video object-cover rounded border border-border" onError={(e) => (e.target.style.display = "none")} />
      <div>
        <p className="text-[11px] text-success font-medium">Valid YouTube URL</p>
        <p className="text-[10px] text-muted font-mono">{videoId}</p>
      </div>
    </div>
  );
}

// ── Lesson Form (inline) ─────────────────────────────────────────────────────
function LessonForm({ sectionId, courseId, onSave, onCancel, initialData = null }) {
  const [title, setTitle] = useState(initialData?.title || "");
  const [youtubeUrl, setYoutubeUrl] = useState(
    initialData?.youtube_video_url || initialData?.video_url || ""
  );
  const [description, setDescription] = useState(initialData?.description || "");
  const [isFreePreview, setIsFreePreview] = useState(initialData?.is_free_preview ?? false);
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!title.trim()) return toast.error("Lesson title is required");

    setSaving(true);
    try {
      const payload = {
        title: title.trim(),
        youtube_video_url: youtubeUrl.trim() || null,
        video_url: youtubeUrl.trim() || null,
        description: description.trim() || null,
        is_free_preview: isFreePreview,
        is_published: true,
      };

      if (initialData?.id) {
        const { data, error } = await updateLesson(initialData.id, payload);
        if (error) throw error;
        toast.success("Lesson updated");
        onSave(data);
      } else {
        const { data, error } = await createLesson(courseId, sectionId, payload);
        if (error) throw error;
        toast.success("Lesson added");
        onSave(data);
      }
    } catch (err) {
      toast.error(err.message || "Failed to save lesson");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-surface-2 border border-border rounded-lg p-3.5 space-y-3"
    >
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="space-y-1">
          <label className="text-xs font-semibold text-text block">
            Lesson Title <span className="text-danger">*</span>
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Cache Invalidation Strategies"
            className="w-full px-3 py-1.5 text-xs rounded-md bg-surface border border-border focus:border-accent outline-none text-text transition-colors"
            required
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs font-semibold text-text block">
            YouTube URL
          </label>
          <div className="relative">
            <FaYoutube className="absolute left-2.5 top-1/2 -translate-y-1/2 text-danger text-xs" />
            <input
              type="url"
              value={youtubeUrl}
              onChange={(e) => setYoutubeUrl(e.target.value)}
              placeholder="https://youtube.com/watch?v=..."
              className="w-full pl-8 pr-3 py-1.5 text-xs rounded-md bg-surface border border-border focus:border-accent outline-none text-text transition-colors"
            />
          </div>
          <YoutubePreview url={youtubeUrl} />
        </div>
      </div>

      <div className="space-y-1">
        <label className="text-xs font-semibold text-text block">
          Description (optional)
        </label>
        <textarea
          rows={2}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Summary of concepts covered in this lesson..."
          className="w-full px-3 py-1.5 text-xs rounded-md bg-surface border border-border focus:border-accent outline-none text-text resize-none transition-colors"
        />
      </div>

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id={`free_preview_${sectionId}`}
          checked={isFreePreview}
          onChange={(e) => setIsFreePreview(e.target.checked)}
          className="accent-hot cursor-pointer"
        />
        <label htmlFor={`free_preview_${sectionId}`} className="text-xs text-muted cursor-pointer">
          Free preview (accessible without enrollment)
        </label>
      </div>

      <div className="flex items-center gap-2 pt-1">
        <button
          type="submit"
          disabled={saving}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-hot text-white text-xs font-semibold rounded-md hover:bg-[#e5482a] disabled:opacity-50 transition-colors"
        >
          {saving ? <FaSpinner className="animate-spin text-xs" /> : <FaCheck className="text-xs" />}
          {saving ? "Saving..." : initialData ? "Update Lesson" : "Add Lesson"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-surface text-muted text-xs font-medium rounded-md hover:text-text border border-border transition-colors"
        >
          <FaTimes className="text-xs" /> Cancel
        </button>
      </div>
    </form>
  );
}

// ── Single Lesson Row ────────────────────────────────────────────────────────
function LessonRow({ lesson, onEdit, onDelete }) {
  const [deleting, setDeleting] = useState(false);
  const hasVideo = !!(lesson.youtube_video_id || lesson.youtube_video_url);
  const thumb = lesson.youtube_video_id
    ? `https://img.youtube.com/vi/${lesson.youtube_video_id}/mqdefault.jpg`
    : null;

  async function handleDelete() {
    if (!window.confirm(`Delete lesson "${lesson.title}"?`)) return;
    setDeleting(true);
    const { error } = await deleteLesson(lesson.id);
    if (error) {
      toast.error(error.message);
      setDeleting(false);
    } else {
      toast.success("Lesson deleted");
      onDelete(lesson.id);
    }
  }

  return (
    <div className="flex items-center gap-3 p-2.5 bg-surface border border-border rounded-md group hover:border-border-muted transition-colors">
      <FaGripVertical className="text-muted text-xs shrink-0 cursor-grab opacity-50" />

      {/* Thumbnail or play icon */}
      <div className="w-10 aspect-video rounded overflow-hidden bg-surface-2 border border-border shrink-0 flex items-center justify-center">
        {thumb ? (
          <img src={thumb} alt={lesson.title} className="w-full h-full object-cover" onError={(e) => (e.target.style.display = "none")} />
        ) : (
          <FaPlay className="text-muted text-[10px]" />
        )}
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-xs font-medium text-text truncate">{lesson.title}</p>
        <div className="flex items-center gap-2 mt-0.5">
          {hasVideo ? (
            <span className="flex items-center gap-1 text-[10px] text-danger font-medium">
              <FaYoutube /> Video
            </span>
          ) : (
            <span className="text-[10px] text-muted">No video URL</span>
          )}
          {lesson.is_free_preview && (
            <span className="text-[10px] text-success border border-success/30 px-1 rounded font-medium">
              Free Preview
            </span>
          )}
        </div>
      </div>

      <div className="flex items-center gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={() => onEdit(lesson)}
          className="p-1 rounded text-muted hover:text-text hover:bg-surface-2 border border-border transition-colors text-xs"
          title="Edit lesson"
        >
          <FaEdit className="text-xs" />
        </button>
        <button
          onClick={handleDelete}
          disabled={deleting}
          className="p-1 rounded text-muted hover:text-danger hover:bg-danger/10 border border-border transition-colors text-xs disabled:opacity-50"
          title="Delete lesson"
        >
          {deleting ? <FaSpinner className="animate-spin text-xs" /> : <FaTrash className="text-xs" />}
        </button>
      </div>
    </div>
  );
}

// ── Section Card ─────────────────────────────────────────────────────────────
function SectionCard({ section, courseId, sectionIndex, onSectionUpdated, onSectionDeleted }) {
  const [lessons, setLessons] = useState([]);
  const [loadingLessons, setLoadingLessons] = useState(true);
  const [isExpanded, setIsExpanded] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingLesson, setEditingLesson] = useState(null);
  const [editingTitle, setEditingTitle] = useState(false);
  const [sectionTitle, setSectionTitle] = useState(section.section_name);
  const [savingTitle, setSavingTitle] = useState(false);
  const [deletingSection, setDeletingSection] = useState(false);

  useEffect(() => {
    fetchLessons();
  }, [section.id]);

  async function fetchLessons() {
    setLoadingLessons(true);
    const { data, error } = await getLessonsBySection(section.id);
    if (!error) setLessons(data || []);
    setLoadingLessons(false);
  }

  async function handleSaveTitle() {
    if (!sectionTitle.trim()) return;
    setSavingTitle(true);
    const { data, error } = await updateSection(section.id, { section_name: sectionTitle.trim() });
    if (error) toast.error(error.message);
    else {
      toast.success("Section renamed");
      onSectionUpdated({ ...section, section_name: sectionTitle.trim() });
    }
    setSavingTitle(false);
    setEditingTitle(false);
  }

  async function handleDeleteSection() {
    if (!window.confirm(`Delete section "${section.section_name}" and all its lessons?`)) return;
    setDeletingSection(true);
    const { error } = await deleteSection(section.id);
    if (error) { toast.error(error.message); setDeletingSection(false); }
    else { toast.success("Section deleted"); onSectionDeleted(section.id); }
  }

  function handleLessonSaved(savedLesson) {
    setLessons((prev) => {
      const exists = prev.find((l) => l.id === savedLesson.id);
      if (exists) return prev.map((l) => (l.id === savedLesson.id ? savedLesson : l));
      return [...prev, savedLesson];
    });
    setShowAddForm(false);
    setEditingLesson(null);
  }

  function handleLessonDeleted(lessonId) {
    setLessons((prev) => prev.filter((l) => l.id !== lessonId));
  }

  return (
    <div className="border border-border rounded-xl overflow-hidden bg-surface">
      {/* Section Header */}
      <div className="flex items-center gap-3 p-3.5 bg-surface-2 border-b border-border">
        <span className="w-6 h-6 rounded bg-surface border border-border flex items-center justify-center text-xs font-semibold text-text shrink-0">
          {sectionIndex + 1}
        </span>

        {editingTitle ? (
          <div className="flex-1 flex items-center gap-2">
            <input
              value={sectionTitle}
              onChange={(e) => setSectionTitle(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") handleSaveTitle(); if (e.key === "Escape") setEditingTitle(false); }}
              className="flex-1 px-2 py-1 text-xs bg-surface border border-accent rounded outline-none text-text"
              autoFocus
            />
            <button onClick={handleSaveTitle} disabled={savingTitle} className="text-success hover:opacity-80 text-xs">
              {savingTitle ? <FaSpinner className="animate-spin" /> : <FaCheck />}
            </button>
            <button onClick={() => { setSectionTitle(section.section_name); setEditingTitle(false); }} className="text-muted hover:text-text text-xs">
              <FaTimes />
            </button>
          </div>
        ) : (
          <button
            onClick={() => setEditingTitle(true)}
            className="flex-1 text-left font-semibold text-text text-xs hover:text-accent transition-colors flex items-center gap-2"
          >
            <span>{section.section_name}</span>
            <FaEdit className="text-muted text-[10px]" />
          </button>
        )}

        <div className="flex items-center gap-1.5 shrink-0">
          <span className="text-[10px] text-muted font-medium px-2">{lessons.length} lesson{lessons.length !== 1 ? "s" : ""}</span>
          <button
            onClick={handleDeleteSection}
            disabled={deletingSection}
            className="p-1 rounded text-muted hover:text-danger hover:bg-danger/10 border border-border transition-colors text-xs disabled:opacity-50"
            title="Delete section"
          >
            {deletingSection ? <FaSpinner className="animate-spin text-xs" /> : <FaTrash className="text-xs" />}
          </button>
          <button
            onClick={() => setIsExpanded((p) => !p)}
            className="p-1 rounded text-muted hover:text-text hover:bg-surface border border-border transition-colors text-xs"
          >
            {isExpanded ? <FaChevronUp className="text-xs" /> : <FaChevronDown className="text-xs" />}
          </button>
        </div>
      </div>

      {/* Section Body */}
      {isExpanded && (
        <div className="p-4 space-y-2.5">
          {loadingLessons ? (
            <div className="flex items-center gap-2 text-muted text-xs py-2">
              <FaSpinner className="animate-spin" /> Loading lessons...
            </div>
          ) : (
            <div className="space-y-2">
              {lessons.length === 0 && !showAddForm && (
                <p className="text-muted text-xs text-center py-3">
                  No lessons in this section. Click <strong className="text-text">Add Lesson</strong> below.
                </p>
              )}
              {lessons.map((lesson) =>
                editingLesson?.id === lesson.id ? (
                  <LessonForm
                    key={lesson.id}
                    sectionId={section.id}
                    courseId={courseId}
                    initialData={lesson}
                    onSave={handleLessonSaved}
                    onCancel={() => setEditingLesson(null)}
                  />
                ) : (
                  <LessonRow
                    key={lesson.id}
                    lesson={lesson}
                    onEdit={setEditingLesson}
                    onDelete={handleLessonDeleted}
                  />
                )
              )}
            </div>
          )}

          {showAddForm && (
            <LessonForm
              sectionId={section.id}
              courseId={courseId}
              onSave={handleLessonSaved}
              onCancel={() => setShowAddForm(false)}
            />
          )}

          {!showAddForm && !editingLesson && (
            <button
              onClick={() => setShowAddForm(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-accent bg-surface-2 border border-border rounded-md hover:bg-surface transition-colors mt-2"
            >
              <FaPlus className="text-[10px]" /> Add Lesson
            </button>
          )}
        </div>
      )}
    </div>
  );
}

// ── MAIN LESSON MANAGER ──────────────────────────────────────────────────────
export default function LessonManager({ courseId }) {
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addingSection, setAddingSection] = useState(false);
  const [newSectionTitle, setNewSectionTitle] = useState("");
  const [savingSection, setSavingSection] = useState(false);

  useEffect(() => {
    if (courseId) fetchSections();
  }, [courseId]);

  async function fetchSections() {
    setLoading(true);
    const { data, error } = await getSectionsByCourse(courseId);
    if (!error) setSections(data || []);
    setLoading(false);
  }

  async function handleAddSection(e) {
    e.preventDefault();
    if (!newSectionTitle.trim()) return;
    setSavingSection(true);
    const orderIndex = sections.length;
    const { data, error } = await createSection(courseId, newSectionTitle.trim(), orderIndex);
    if (error) {
      toast.error(error.message);
    } else {
      setSections((p) => [...p, data]);
      setNewSectionTitle("");
      setAddingSection(false);
      toast.success("Section added");
    }
    setSavingSection(false);
  }

  function handleSectionUpdated(updated) {
    setSections((p) => p.map((s) => (s.id === updated.id ? updated : s)));
  }

  function handleSectionDeleted(id) {
    setSections((p) => p.filter((s) => s.id !== id));
  }

  if (loading) {
    return (
      <div className="flex items-center gap-2 py-6 justify-center text-muted text-xs">
        <FaSpinner className="animate-spin text-accent" /> Loading curriculum modules...
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-border">
        <div>
          <h2 className="text-sm font-semibold text-text">Course Curriculum</h2>
          <p className="text-xs text-muted">
            {sections.length} section{sections.length !== 1 ? "s" : ""} · Manage sections and lessons
          </p>
        </div>
        <button
          onClick={() => setAddingSection(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-hot text-white text-xs font-semibold rounded-md hover:bg-[#e5482a] transition-colors"
        >
          <FaPlus className="text-[10px]" /> Add Section
        </button>
      </div>

      {/* Add Section Form */}
      {addingSection && (
        <form
          onSubmit={handleAddSection}
          className="flex items-center gap-2 p-3 bg-surface-2 border border-border rounded-lg"
        >
          <input
            autoFocus
            type="text"
            value={newSectionTitle}
            onChange={(e) => setNewSectionTitle(e.target.value)}
            placeholder="Section title (e.g. Memory Layout & Virtual Memory)"
            className="flex-1 px-3 py-1.5 text-xs bg-surface border border-border focus:border-accent rounded-md outline-none text-text"
            onKeyDown={(e) => e.key === "Escape" && setAddingSection(false)}
          />
          <button
            type="submit"
            disabled={savingSection}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-hot text-white text-xs font-semibold rounded-md disabled:opacity-50 hover:bg-[#e5482a] transition-colors"
          >
            {savingSection ? <FaSpinner className="animate-spin text-xs" /> : <FaCheck className="text-xs" />}
            <span>Save</span>
          </button>
          <button
            type="button"
            onClick={() => setAddingSection(false)}
            className="p-1.5 rounded-md bg-surface border border-border text-muted hover:text-text text-xs"
          >
            <FaTimes className="text-xs" />
          </button>
        </form>
      )}

      {/* Empty state */}
      {sections.length === 0 && !addingSection && (
        <div className="text-center py-10 border border-dashed border-border rounded-xl">
          <FaPlay className="text-muted text-xl mx-auto mb-2 opacity-50" />
          <p className="text-text font-medium text-xs">No sections created yet</p>
          <p className="text-muted text-xs mt-0.5">Click "Add Section" to begin structuring your curriculum</p>
        </div>
      )}

      {/* Section Cards */}
      <div className="space-y-3">
        {sections.map((section, idx) => (
          <SectionCard
            key={section.id}
            section={section}
            courseId={courseId}
            sectionIndex={idx}
            onSectionUpdated={handleSectionUpdated}
            onSectionDeleted={handleSectionDeleted}
          />
        ))}
      </div>
    </div>
  );
}
