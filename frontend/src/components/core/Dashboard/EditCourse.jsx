import React, { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";
import {
  FaSave, FaTrash, FaArrowLeft, FaYoutube, FaBook,
  FaChartBar, FaSpinner, FaGlobe, FaLock, FaList
} from "react-icons/fa";
import { supabase } from "../../../config/supabaseClient";
import { getYoutubeVideoId, getYoutubeThumbnail } from "../../../utils/youtubeUtils";
import LessonManager from "./LessonManager";

// ── YouTube URL preview helper ───────────────────────────────────────────────
function YoutubeUrlPreview({ url }) {
  const id = getYoutubeVideoId(url);
  if (!id) return null;
  return (
    <div className="mt-2 flex items-center gap-2 p-2 bg-surface-2 rounded-lg border border-border">
      <img
        src={`https://img.youtube.com/vi/${id}/mqdefault.jpg`}
        alt="Preview"
        className="w-16 aspect-video object-cover rounded border border-border"
        onError={(e) => (e.target.style.display = "none")}
      />
      <div>
        <p className="text-[11px] text-success font-medium">Valid YouTube URL</p>
        <p className="text-[10px] text-muted font-mono">ID: {id}</p>
      </div>
    </div>
  );
}

// ── Tab system ───────────────────────────────────────────────────────────────
const TABS = [
  { id: "details", label: "Course Details", icon: FaBook },
  { id: "curriculum", label: "Curriculum & Lessons", icon: FaList },
  { id: "stats", label: "Stats", icon: FaChartBar },
];

export default function EditCourse() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("details");

  // ─── Fetch State ─────────────────────────────────────────────────────────
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState(null);
  const [course, setCourse] = useState(null);

  // ─── Editable Fields ────────────────────────────────────────────────────
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [isFree, setIsFree] = useState(false);
  const [status, setStatus] = useState("draft");
  const [previewVideoUrl, setPreviewVideoUrl] = useState("");
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState(null);
  const [videoSource, setVideoSource] = useState("youtube");

  // ─── Fetch Course ────────────────────────────────────────────────────────
  const fetchCourse = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const { data, error: err } = await supabase
        .from("courses")
        .select(`
          id, title, description, course_description, price, is_free, status,
          preview_video_url, youtube_video_url, youtube_video_id,
          final_thumbnail_url, youtube_thumbnail_url, thumbnail_url, thumbnail,
          created_at, updated_at,
          instructor_id, level, language, tags, category_id
        `)
        .eq("id", courseId)
        .single();

      if (err) throw err;
      setCourse(data);
      setTitle(data.title || "");
      setDescription(data.description || data.course_description || "");
      setPrice(data.price?.toString() || "");
      setIsFree(data.is_free || false);
      setStatus(data.status || "draft");
      const initialUrl = data.preview_video_url || data.youtube_video_url || "";
      setPreviewVideoUrl(initialUrl);
      setVideoSource(initialUrl ? "youtube" : "upload");
      
      const thumb =
        data.final_thumbnail_url ||
        data.youtube_thumbnail_url ||
        data.thumbnail_url ||
        data.thumbnail;
      setThumbnailPreview(thumb || null);
    } catch (e) {
      setError(e.message || "Failed to load course");
    } finally {
      setLoading(false);
    }
  }, [courseId]);

  useEffect(() => {
    if (courseId) fetchCourse();
  }, [courseId, fetchCourse]);

  function handleThumbnailChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setThumbnailFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setThumbnailPreview(reader.result);
    reader.readAsDataURL(file);
  }

  async function handleSave() {
    if (!title.trim()) return toast.error("Course title is required");
    setSaving(true);
    setError(null);
    try {
      const videoId = getYoutubeVideoId(previewVideoUrl);
      const youtubeThumbnail = videoId ? getYoutubeThumbnail(previewVideoUrl) : null;

      let customThumbnailUrl = null;
      if (thumbnailFile) {
        const fileName = `${courseId}/${Date.now()}_${thumbnailFile.name}`;
        const { error: uploadErr } = await supabase.storage
          .from("course-thumbnails")
          .upload(fileName, thumbnailFile, { upsert: true });
        if (!uploadErr) {
          const { data: urlData } = supabase.storage
            .from("course-thumbnails")
            .getPublicUrl(fileName);
          customThumbnailUrl = urlData?.publicUrl;
        }
      }

      const patch = {
        title: title.trim(),
        description: description.trim(),
        course_description: description.trim(),
        price: isFree ? 0 : Number(price) || 0,
        is_free: isFree,
        status: status.toLowerCase(),
        preview_video_url: previewVideoUrl || null,
        youtube_video_url: previewVideoUrl || null,
        youtube_video_id: videoId || null,
        youtube_embed_url: videoId
          ? `https://www.youtube.com/embed/${videoId}`
          : null,
        youtube_thumbnail_url: youtubeThumbnail || null,
        updated_at: new Date().toISOString(),
      };

      if (videoSource === "upload" && customThumbnailUrl) {
        patch.custom_thumbnail_url = customThumbnailUrl;
        patch.thumbnail_url = customThumbnailUrl;
        patch.thumbnail_source = "custom";
        patch.final_thumbnail_url = customThumbnailUrl;
      } else if (videoSource === "youtube" && youtubeThumbnail) {
        patch.final_thumbnail_url = youtubeThumbnail;
        patch.thumbnail_source = "youtube";
        patch.thumbnail_url = youtubeThumbnail;
      }

      const { error: saveErr } = await supabase
        .from("courses")
        .update(patch)
        .eq("id", courseId);

      if (saveErr) throw saveErr;

      toast.success("Course changes saved successfully");
      await fetchCourse();
      setThumbnailFile(null);
    } catch (e) {
      setError(e.message || "Failed to save course");
      toast.error(e.message || "Failed to save course");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!window.confirm("Permanently delete this course and all its modules?")) return;
    setDeleting(true);
    try {
      const { data: sections } = await supabase
        .from("sections")
        .select("id")
        .eq("course_id", courseId);

      for (const s of sections || []) {
        await supabase.from("course_lessons").delete().eq("section_id", s.id);
      }
      await supabase.from("sections").delete().eq("course_id", courseId);
      await supabase.from("courses").delete().eq("id", courseId);

      toast.success("Course deleted");
      navigate("/dashboard/instructor/my-courses");
    } catch (e) {
      toast.error(e.message || "Delete failed");
      setDeleting(false);
    }
  }

  function handlePreviewUrlChange(url) {
    setPreviewVideoUrl(url);
    const videoId = getYoutubeVideoId(url);
    if (videoId && !thumbnailFile) {
      setThumbnailPreview(getYoutubeThumbnail(url));
    }
  }

  if (loading) {
    return (
      <div className="flex items-center gap-2 justify-center py-16 text-muted text-xs">
        <FaSpinner className="animate-spin text-accent" /> Loading course details...
      </div>
    );
  }

  if (error && !course) {
    return <div className="p-5 text-danger text-xs">{error}</div>;
  }

  if (!course) return null;

  return (
    <div className="space-y-6 pb-12">
      {/* ── Page Header ──────────────────────────────────────────────────── */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-surface p-5 rounded-xl border border-border">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/dashboard/instructor/my-courses")}
            className="w-8 h-8 flex items-center justify-center rounded-md bg-surface-2 border border-border text-muted hover:text-text hover:bg-surface transition-colors"
          >
            <FaArrowLeft className="text-xs" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-text">{course.title}</h1>
            <p className="text-[10px] text-muted font-mono mt-0.5">ID: {courseId}</p>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-md bg-hot text-white hover:bg-[#e5482a] disabled:opacity-50 transition-colors"
          >
            {saving ? <FaSpinner className="animate-spin text-xs" /> : <FaSave className="text-xs" />}
            {saving ? "Saving..." : "Save Changes"}
          </button>
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="flex items-center gap-2 px-3 py-2 text-xs font-medium rounded-md bg-surface-2 text-muted hover:text-danger hover:border-danger/30 hover:bg-danger/10 border border-border disabled:opacity-50 transition-colors"
          >
            {deleting ? <FaSpinner className="animate-spin text-xs" /> : <FaTrash className="text-xs" />}
            {deleting ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>

      {/* ── Error Banner ─────────────────────────────────────────────────── */}
      {error && (
        <div className="px-4 py-2.5 rounded-lg bg-danger/10 border border-danger/30 text-danger text-xs font-medium">
          {error}
        </div>
      )}

      {/* ── Tab Nav ──────────────────────────────────────────────────────── */}
      <div className="flex gap-1 bg-surface-2 p-1 rounded-lg border border-border w-fit">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
              activeTab === tab.id
                ? "bg-surface text-text shadow-sm"
                : "text-muted hover:text-text"
            }`}
          >
            <tab.icon className="text-xs" /> {tab.label}
          </button>
        ))}
      </div>

      {/* ── Tab: Details ─────────────────────────────────────────────────── */}
      {activeTab === "details" && (
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Left Form */}
          <div className="lg:col-span-2 space-y-4 bg-surface p-5 rounded-xl border border-border">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-text block">
                Course Title <span className="text-danger">*</span>
              </label>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-md bg-surface-2 border border-border focus:border-accent outline-none text-text transition-colors"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-text block">
                Course Description <span className="text-danger">*</span>
              </label>
              <textarea
                rows={5}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full resize-none px-3 py-2 text-xs rounded-md bg-surface-2 border border-border focus:border-accent outline-none text-text transition-colors"
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-text block">
                  Price (INR)
                </label>
                <input
                  type="number"
                  value={isFree ? "0" : price}
                  onChange={(e) => setPrice(e.target.value)}
                  disabled={isFree}
                  min="0"
                  className="w-full px-3 py-2 text-xs rounded-md bg-surface-2 border border-border focus:border-accent outline-none text-text disabled:opacity-50 transition-colors"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-text block">
                  Publish Status
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-md bg-surface-2 border border-border focus:border-accent outline-none text-text transition-colors cursor-pointer"
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                </select>
              </div>
            </div>

            {/* Free course toggle */}
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={isFree}
                onChange={(e) => setIsFree(e.target.checked)}
                className="accent-hot cursor-pointer"
              />
              <span className="text-xs text-text font-medium">Free course (no student payment required)</span>
            </label>

            {/* Video Source & URL */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-text block">
                  Trailer / Preview Source
                </label>
                <div className="flex bg-surface-2 p-1 rounded border border-border text-xs">
                  <button
                    onClick={() => setVideoSource('youtube')}
                    className={`px-2.5 py-1 rounded transition-colors ${videoSource === 'youtube' ? 'bg-surface text-text shadow-sm' : 'text-muted hover:text-text'}`}
                  >
                    YouTube
                  </button>
                  <button
                    onClick={() => setVideoSource('upload')}
                    className={`px-2.5 py-1 rounded transition-colors ${videoSource === 'upload' ? 'bg-surface text-text shadow-sm' : 'text-muted hover:text-text'}`}
                  >
                    Direct Upload
                  </button>
                </div>
              </div>

              {videoSource === "youtube" ? (
                <div>
                  <div className="relative">
                    <FaYoutube className="absolute left-3 top-1/2 -translate-y-1/2 text-danger text-sm" />
                    <input
                      type="url"
                      value={previewVideoUrl}
                      onChange={(e) => handlePreviewUrlChange(e.target.value)}
                      placeholder="https://youtube.com/watch?v=..."
                      className="w-full pl-9 pr-3 py-2 text-xs rounded-md bg-surface-2 border border-border focus:border-accent outline-none text-text transition-colors"
                    />
                  </div>
                  <YoutubeUrlPreview url={previewVideoUrl} />
                </div>
              ) : (
                <div className="p-3 bg-surface-2 border border-border rounded-lg text-center">
                  <p className="text-xs text-muted">Direct video upload is configured in the Curriculum tab.</p>
                </div>
              )}
            </div>
          </div>

          {/* Right: Media & Status */}
          <div className="space-y-4">
            <div className="bg-surface p-5 rounded-xl border border-border space-y-3">
              <label className="text-xs font-semibold text-text block">
                Course Thumbnail
              </label>
              <div className="aspect-video rounded-md overflow-hidden bg-surface-2 border border-border relative">
                {thumbnailPreview ? (
                  <img
                    src={thumbnailPreview}
                    alt="Thumbnail"
                    className="w-full h-full object-cover"
                    onError={(e) => (e.target.style.display = "none")}
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center gap-1 text-muted">
                    <FaBook className="text-2xl" />
                    <p className="text-[11px]">No thumbnail</p>
                  </div>
                )}
              </div>
              <div>
                <label className="text-[11px] text-muted block mb-1">Upload New Thumbnail</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleThumbnailChange}
                  className="text-xs text-muted file:mr-2 file:px-2.5 file:py-1 file:rounded file:bg-surface-2 file:border file:border-border file:text-text file:text-xs file:cursor-pointer"
                />
                {thumbnailFile && (
                  <p className="text-[10px] text-success mt-1">✓ {thumbnailFile.name}</p>
                )}
              </div>
            </div>

            <div className="p-4 rounded-xl bg-surface border border-border space-y-2">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted">Course Status</p>
              <div className="flex items-center gap-2">
                {status === "published" ? (
                  <>
                    <FaGlobe className="text-success text-xs" />
                    <span className="text-xs font-semibold text-success">Published</span>
                  </>
                ) : (
                  <>
                    <FaLock className="text-warning text-xs" />
                    <span className="text-xs font-semibold text-warning">Draft</span>
                  </>
                )}
              </div>
              <p className="text-[10px] text-muted">
                Last modified: {course.updated_at ? new Date(course.updated_at).toLocaleString() : "—"}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ── Tab: Curriculum ──────────────────────────────────────────────── */}
      {activeTab === "curriculum" && (
        <div className="bg-surface p-5 rounded-xl border border-border">
          <LessonManager courseId={courseId} />
        </div>
      )}

      {/* ── Tab: Stats ───────────────────────────────────────────────────── */}
      {activeTab === "stats" && (
        <div className="grid gap-4 sm:grid-cols-3">
          {[
            { label: "Status", value: status.toUpperCase() },
            { label: "Price", value: isFree ? "FREE" : `₹${price || 0}` },
            { label: "Level", value: course.level || "Beginner" },
          ].map((s) => (
            <div key={s.label} className="p-4 rounded-xl bg-surface border border-border text-center">
              <p className="text-[10px] text-muted uppercase tracking-wider mb-1">{s.label}</p>
              <p className="text-lg font-bold text-text">{s.value}</p>
            </div>
          ))}
          <div className="sm:col-span-3 p-4 rounded-xl bg-surface border border-border">
            <p className="text-[10px] text-muted font-mono">Course ID: {courseId}</p>
            <p className="text-[10px] text-muted font-mono mt-0.5">
              Created: {course.created_at ? new Date(course.created_at).toLocaleString() : "—"}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
