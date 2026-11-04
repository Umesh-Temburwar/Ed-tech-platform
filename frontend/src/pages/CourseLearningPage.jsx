// ═══════════════════════════════════════════════════════════════════════════
// COURSE LEARNING PAGE — Full Supabase-native player with curriculum sidebar
// Fixes: auto-load first lesson, thumbnail cards, multi-lesson playback,
//        video_url fallback, dynamic embed URL, debug console logs
// ═══════════════════════════════════════════════════════════════════════════

import { useState, useEffect, useRef, useCallback, memo } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-hot-toast";
import {
  FaPlay, FaCheckCircle, FaArrowLeft, FaChevronDown, FaChevronUp,
  FaLock, FaShareAlt, FaBookOpen, FaRegStickyNote, FaFolderOpen,
  FaCommentDots, FaSpinner, FaYoutube, FaList, FaClock,
  FaChevronLeft, FaChevronRight
} from "react-icons/fa";
import { supabase } from "../config/supabaseClient";
import { extractYouTubeVideoId, getYoutubeThumbnail } from "../utils/youtubeUtils";
import Navbar from "../components/common/Navbar";
import Footer from "../components/common/Footer";

// ─── Utility: resolve the best embed URL from a lesson ─────────────────────
function getLessonEmbedUrl(lesson) {
  if (!lesson) return null;

  // Already computed embed URL from DB trigger
  if (lesson.youtube_embed_url) {
    return lesson.youtube_embed_url + "?autoplay=1&rel=0&modestbranding=1";
  }

  // Has explicit video_id
  if (lesson.youtube_video_id) {
    return `https://www.youtube.com/embed/${lesson.youtube_video_id}?autoplay=1&rel=0&modestbranding=1`;
  }

  // Derive from any available URL field
  const rawUrl =
    lesson.youtube_video_url ||
    lesson.video_url ||
    lesson.preview_video_url ||
    null;

  if (rawUrl) {
    const vid = extractYouTubeVideoId(rawUrl);
    if (vid) {
      return `https://www.youtube.com/embed/${vid}?autoplay=1&rel=0&modestbranding=1`;
    }
  }

  return null;
}

// ─── Utility: get lesson thumbnail ──────────────────────────────────────────
function getLessonThumbnail(lesson) {
  if (!lesson) return null;

  if (lesson.youtube_thumbnail_url) return lesson.youtube_thumbnail_url;

  const id =
    lesson.youtube_video_id ||
    extractYouTubeVideoId(lesson.youtube_video_url || lesson.video_url || "");

  return id ? `https://img.youtube.com/vi/${id}/hqdefault.jpg` : null;
}

// ─── Utility: format duration ────────────────────────────────────────────────
function formatDuration(lesson) {
  if (lesson.duration_seconds && lesson.duration_seconds > 0) {
    const m = Math.floor(lesson.duration_seconds / 60);
    const s = lesson.duration_seconds % 60;
    return `${m}:${String(s).padStart(2, "0")}`;
  }
  if (lesson.duration) return String(lesson.duration);
  return null;
}

// ─── Lesson Thumbnail Card ───────────────────────────────────────────────────
const LessonCard = memo(function LessonCard({ lesson, index, isActive, isDone, onSelect, onToggleDone }) {
  const thumb = getLessonThumbnail(lesson);
  const embedUrl = getLessonEmbedUrl(lesson);
  const hasVideo = !!embedUrl;
  const dur = formatDuration(lesson);

  return (
    <div
      onClick={() => onSelect(lesson)}
      className={`group cursor-pointer transition-colors border-l-2 ${
        isActive
          ? "bg-accent/10 border-accent"
          : "border-transparent hover:bg-surface-2 hover:border-border"
      }`}
    >
      {/* Thumbnail row */}
      <div className="flex gap-3 px-4 pt-3 pb-1">
        {/* Checkbox */}
        <button
          onClick={(e) => { e.stopPropagation(); onToggleDone(lesson.id); }}
          className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 mt-1 transition-colors ${
            isDone ? "bg-success border-success text-white" : "border-border hover:border-muted bg-surface"
          }`}
        >
          {isDone && <FaCheckCircle className="text-[8px]" />}
        </button>

        {/* Thumbnail */}
        <div className="relative w-24 h-14 rounded-md overflow-hidden bg-surface-2 shrink-0 border border-border">
          {thumb ? (
            <img
              src={thumb}
              alt={lesson.title}
              className="w-full h-full object-cover"
              onError={(e) => {
                if (e.target.src.includes("maxresdefault")) {
                  e.target.src = thumb.replace("maxresdefault", "hqdefault");
                } else {
                  e.target.style.display = "none";
                }
              }}
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <FaYoutube className="text-slate-600 text-xl" />
            </div>
          )}
          {/* Play overlay */}
          <div className={`absolute inset-0 flex items-center justify-center transition-opacity ${
            isActive ? "opacity-100" : "opacity-0 group-hover:opacity-100"
          }`}>
            <div className="w-7 h-7 bg-black/60 rounded-full flex items-center justify-center">
              <FaPlay className={`text-[9px] ml-0.5 ${isActive ? "text-purple-400" : "text-white"}`} />
            </div>
          </div>
          {/* Duration badge */}
          {dur && (
            <span className="absolute bottom-1 right-1 bg-black/80 text-white text-[9px] px-1 rounded font-mono">
              {dur}
            </span>
          )}
          {/* Lock */}
          {!hasVideo && (
            <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
              <FaLock className="text-slate-500 text-xs" />
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <p className={`text-xs font-semibold line-clamp-2 leading-snug ${
            isActive ? "text-white" : "text-slate-400 group-hover:text-slate-300"
          }`}>
            {index + 1}. {lesson.title}
          </p>
          {dur && (
            <span className="flex items-center gap-1 mt-1 text-[10px] text-slate-600">
              <FaClock className="text-[8px]" /> {dur}
            </span>
          )}
          {hasVideo && (
            <span className="inline-flex items-center gap-0.5 mt-1 text-[9px] text-red-400/70 font-bold">
              <FaYoutube className="text-[10px]" /> YouTube
            </span>
          )}
        </div>
      </div>
    </div>
  );
});

// ─── Main Page ───────────────────────────────────────────────────────────────
export default function CourseLearningPage() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { token, user } = useSelector((s) => s.auth);
  const { user: profileUser } = useSelector((s) => s.profile);
  const currentUser = user || profileUser;

  // ─── Data State ───────────────────────────────────────────────────────────
  const [courseData, setCourseData] = useState(null);
  const [curriculum, setCurriculum] = useState([]);   // [{...section, lessons:[]}]
  const [flatLessons, setFlatLessons] = useState([]);
  const [activeLesson, setActiveLesson] = useState(null);
  const [completedIds, setCompletedIds] = useState(new Set());
  const [expandedSections, setExpandedSections] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ─── UI State ─────────────────────────────────────────────────────────────
  const [activeTab, setActiveTab] = useState("overview");
  const [notes, setNotes] = useState("");
  const [savedNotes, setSavedNotes] = useState(() => {
    try {
      const stored = localStorage.getItem(`notes_${courseId}`);
      return stored ? JSON.parse(stored) : {};
    } catch {
      return {};
    }
  });
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const playerRef = useRef(null);

  // ─── Fetch Data ───────────────────────────────────────────────────────────
  useEffect(() => {
    if (!courseId) return;
    if (!currentUser) {
      toast.error("Please login to access this course");
      navigate("/login");
      return;
    }
    fetchData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [courseId, currentUser?.id]);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      // ── 1. Fetch course ────────────────────────────────────────────────────
      const { data: course, error: courseErr } = await supabase
        .from("courses")
        .select(`
          id, title, description, status, is_free, price,
          final_thumbnail_url, youtube_thumbnail_url, thumbnail_url, thumbnail,
          youtube_video_id, youtube_embed_url, preview_video_url,
          learning_outcomes, requirements,
          instructor:instructor_id(first_name, last_name, avatar_url, image, about)
        `)
        .eq("id", courseId)
        .single();

      if (courseErr) throw new Error("Course not found: " + courseErr.message);

      console.log("[Learning] Course:", course);
      setCourseData(course);

      // ── 2. Fetch sections ──────────────────────────────────────────────────
      const { data: sections, error: secErr } = await supabase
        .from("sections")
        .select("id, section_name, order_index")
        .eq("course_id", courseId)
        .order("order_index", { ascending: true });

      if (secErr) throw new Error("Failed to load sections: " + secErr.message);

      // ── 3. Fetch lessons ───────────────────────────────────────────────────
      const { data: lessons, error: lesErr } = await supabase
        .from("course_lessons")
        .select(`
          id, title, description,
          video_url, youtube_video_url, youtube_video_id,
          youtube_embed_url, youtube_thumbnail_url,
          duration, duration_seconds, lesson_order,
          position, is_preview, is_free_preview, is_locked, is_published,
          section_id, course_id
        `)
        .eq("course_id", courseId)
        .order("position", { ascending: true });

      if (lesErr) throw new Error("Failed to load lessons: " + lesErr.message);

      // ── 4. Enrich lessons with derived YouTube fields ──────────────────────
      const enriched = (lessons || []).map((l) => {
        const rawUrl = l.youtube_video_url || l.video_url || "";
        const vid = l.youtube_video_id || extractYouTubeVideoId(rawUrl);
        return {
          ...l,
          youtube_video_id: vid || null,
          youtube_embed_url:
            l.youtube_embed_url ||
            (vid ? `https://www.youtube.com/embed/${vid}` : null),
          youtube_thumbnail_url:
            l.youtube_thumbnail_url ||
            (vid ? `https://img.youtube.com/vi/${vid}/hqdefault.jpg` : null),
          youtube_video_url: l.youtube_video_url || rawUrl || null,
        };
      });

      // ── 5. Build curriculum tree ───────────────────────────────────────────
      const curriculumTree = (sections || []).map((sec) => ({
        ...sec,
        lessons: enriched
          .filter((l) => l.section_id === sec.id)
          .sort(
            (a, b) =>
              (a.position ?? a.lesson_order ?? 0) -
              (b.position ?? b.lesson_order ?? 0)
          ),
      }));

      // ── 6. Flat list + lessons without a section ───────────────────────────
      const sectionIds = new Set((sections || []).map((s) => s.id));
      const orphans = enriched.filter(
        (l) => !l.section_id || !sectionIds.has(l.section_id)
      );

      if (orphans.length > 0) {
        curriculumTree.push({
          id: "__orphans__",
          section_name: "Lessons",
          order_index: 9999,
          lessons: orphans,
        });
      }

      const flat = curriculumTree.flatMap((s) => s.lessons);

      setCurriculum(curriculumTree);
      setFlatLessons(flat);

      // ── 7. Auto-expand first section ──────────────────────────────────────
      if (curriculumTree.length > 0) {
        setExpandedSections({ [curriculumTree[0].id]: true });
      }

      // ── 8. Auto-select URL specified lesson or first lesson ───────────────
      const searchLessonId = new URLSearchParams(window.location.search).get("lesson");
      const matchedLesson = searchLessonId ? flat.find((l) => String(l.id) === String(searchLessonId)) : null;
      const firstWithVideo = flat.find((l) => getLessonEmbedUrl(l));
      const targetLesson = matchedLesson || firstWithVideo || flat[0] || null;
      if (targetLesson) {
        setActiveLesson(targetLesson);
      }

      // ── 9. Load progress ──────────────────────────────────────────────────
      const saved = localStorage.getItem(`progress_${courseId}`);
      if (saved) {
        try { setCompletedIds(new Set(JSON.parse(saved))); } catch {}
      }

    } catch (err) {
      console.error("[Learning] Error:", err);
      setError(err.message || "Failed to load course");
    } finally {
      setLoading(false);
    }
  };

  // ─── Lesson selection ──────────────────────────────────────────────────────
  const selectLesson = useCallback((lesson) => {
    setActiveLesson(lesson);
    setNotes((prev) => savedNotes[lesson.id] || "");
    playerRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [savedNotes]);

  const toggleSection = (id) =>
    setExpandedSections((p) => ({ ...p, [id]: !p[id] }));

  // Auto-expand section containing the active lesson
  useEffect(() => {
    if (activeLesson?.section_id) {
      setExpandedSections((prev) => ({ ...prev, [activeLesson.section_id]: true }));
    }
  }, [activeLesson?.id, activeLesson?.section_id]);

  const toggleComplete = (lessonId) => {
    setCompletedIds((prev) => {
      const next = new Set(prev);
      const isFinishing = !next.has(lessonId);
      if (isFinishing) {
        next.add(lessonId);
        if (next.size === totalCount && totalCount > 0) {
          toast.success("🎉 Outstanding achievement! You completed all lessons!", {
            duration: 5000,
            icon: "🏆",
          });
        }
      } else {
        next.delete(lessonId);
      }
      localStorage.setItem(`progress_${courseId}`, JSON.stringify([...next]));
      return next;
    });
  };

  // ─── Computed values ──────────────────────────────────────────────────────
  const totalCount = flatLessons.length;
  const completedCount = completedIds.size;
  const progressPct = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
  const currentIndex = flatLessons.findIndex((l) => l.id === activeLesson?.id);
  const prevLesson = currentIndex > 0 ? flatLessons[currentIndex - 1] : null;
  const nextLesson = currentIndex >= 0 && currentIndex < flatLessons.length - 1 ? flatLessons[currentIndex + 1] : null;

  const goToNextLesson = () => {
    if (nextLesson) selectLesson(nextLesson);
  };

  const goToPrevLesson = () => {
    if (prevLesson) selectLesson(prevLesson);
  };

  // Keyboard navigation shortcuts (Alt+ArrowRight, Alt+ArrowLeft, Alt+M)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (['INPUT', 'TEXTAREA'].includes(e.target?.tagName)) return;
      if (e.altKey && e.key === 'ArrowRight') {
        e.preventDefault();
        if (nextLesson) selectLesson(nextLesson);
      } else if (e.altKey && e.key === 'ArrowLeft') {
        e.preventDefault();
        if (prevLesson) selectLesson(prevLesson);
      } else if (e.altKey && (e.key === 'm' || e.key === 'M')) {
        e.preventDefault();
        if (activeLesson) toggleComplete(activeLesson.id);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [nextLesson, prevLesson, activeLesson, selectLesson]);
  const courseEmbedUrl = courseData?.youtube_embed_url || 
    (courseData?.youtube_video_id ? `https://www.youtube.com/embed/${courseData.youtube_video_id}?autoplay=1&rel=0&modestbranding=1` : null);
  const embedUrl = getLessonEmbedUrl(activeLesson) || (totalCount === 0 ? courseEmbedUrl : null);
  const coursePoster =
    courseData?.final_thumbnail_url ||
    courseData?.youtube_thumbnail_url ||
    courseData?.thumbnail_url ||
    courseData?.thumbnail ||
    null;

  // ─────────────────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen bg-[#070B19] flex flex-col items-center justify-center gap-4">
        <FaSpinner className="text-purple-500 text-5xl animate-spin" />
        <p className="text-slate-400 font-bold tracking-wider animate-pulse">
          Loading Course...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#070B19] flex items-center justify-center">
        <div className="text-center space-y-4">
          <p className="text-rose-400 text-lg font-bold">{error}</p>
          <button
            onClick={() => navigate("/explore-courses")}
            className="px-6 py-2 bg-purple-600 text-white rounded-xl font-semibold"
          >
            Browse Courses
          </button>
        </div>
      </div>
    );
  }


  if (!courseData) return null;

  return (
    <div>
      <Navbar />
      <div className="min-h-screen bg-canvas text-text flex flex-col pt-16">
        {/* ── TOP HEADER ──────────────────────────────────────────────────── */}
        <header className="bg-surface border-b border-border py-2.5 px-4 md:px-8 flex items-center justify-between gap-4 sticky top-16 z-30 shadow-sm">
          <div className="flex items-center gap-3 min-w-0">
            <Link
              to="/dashboard/enrolled-courses"
              className="w-8 h-8 rounded-lg bg-surface-2 border border-border flex items-center justify-center hover:bg-surface-3 transition-colors shrink-0 text-muted hover:text-text"
            >
              <FaArrowLeft className="text-xs" />
            </Link>
            <div className="min-w-0">
              <h1 className="text-sm md:text-base font-semibold text-text line-clamp-1">{courseData.title}</h1>
              <p className="text-muted text-[11px]">
                {courseData.instructor?.first_name} {courseData.instructor?.last_name}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            {/* Progress */}
            <div className="hidden sm:flex items-center gap-2">
              <div className="w-24 h-1.5 bg-surface-2 rounded-full overflow-hidden border border-border">
                <div
                  className="h-full bg-hot transition-all duration-300"
                  style={{ width: `${progressPct}%` }}
                />
              </div>
              <span className="text-xs text-muted font-medium whitespace-nowrap">
                {completedCount}/{totalCount}
              </span>
            </div>

            <button
              onClick={() => setSidebarOpen((p) => !p)}
              className="w-8 h-8 rounded-lg bg-surface-2 border border-border flex items-center justify-center hover:bg-surface-3 transition-colors text-muted hover:text-text"
              title="Toggle curriculum"
            >
              <FaList className="text-xs" />
            </button>

            <button
              onClick={() => {
                const url = new URL(window.location.href);
                if (activeLesson?.id) {
                  url.searchParams.set("lesson", activeLesson.id);
                }
                navigator.clipboard.writeText(url.toString());
                toast.success("Lesson link copied to clipboard!");
              }}
              className="hidden md:flex items-center gap-1.5 px-3 py-1.5 border border-border bg-surface-2 hover:bg-surface-3 text-xs font-medium rounded-lg text-muted hover:text-text transition-colors"
            >
              <FaShareAlt className="text-xs" />
              <span>Share</span>
            </button>
          </div>
        </header>

        {/* ── MAIN LAYOUT ─────────────────────────────────────────────────── */}
        <main className="flex-1 flex overflow-hidden">

          {/* LEFT: Player + Tabs */}
          <section className="flex-1 overflow-y-auto">
            <div className="max-w-5xl mx-auto px-4 py-6 space-y-6">

              {/* ── VIDEO PLAYER ─────────────────────────────────────────── */}
              <div
                ref={playerRef}
                className="aspect-video w-full rounded-xl overflow-hidden bg-black shadow-sm border border-border relative"
            >
              {embedUrl ? (
                <iframe
                  key={activeLesson?.id || "idle"}
                  src={embedUrl}
                  title={activeLesson?.title || "Lesson"}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  className="w-full h-full"
                />
              ) : (

                <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-950 gap-4">
                  {coursePoster && (
                    <img
                      src={coursePoster}
                      alt="Course"
                      className="absolute inset-0 w-full h-full object-cover opacity-10"
                    />
                  )}
                  <FaYoutube className="text-slate-700 text-6xl relative z-10" />
<div className="text-center px-6 relative z-10">
  {activeLesson ? (
    <>
      <p className="text-slate-400 font-bold text-sm">{activeLesson.title}</p>
      <p className="text-slate-600 text-xs mt-1">
        No video URL attached. Instructor can add one in Edit Course - Lessons.
      </p>
    </>
  ) : totalCount === 0 ? (
    <>
      <p className="text-slate-400 font-bold text-sm">No lessons yet</p>
      <p className="text-slate-600 text-xs mt-1">
        Instructor hasn't added lessons to this course yet.
      </p>
    </>
  ) : (
    <p className="text-slate-400 text-sm">Select a lesson from the curriculum -</p>
  )}
</div>
                </div>
              )}
            </div>


            {/* ── ACTIVE LESSON INFO ───────────────────────────────────── */}
            {activeLesson && (
              <div className="p-5 bg-surface border border-border rounded-xl shadow-sm">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <h2 className="text-base md:text-lg font-semibold text-text line-clamp-2">
                      {activeLesson.title}
                    </h2>
                    {activeLesson.description && (
                      <p className="text-muted text-xs mt-1.5 leading-relaxed">
                        {activeLesson.description}
                      </p>
                    )}
                    {(activeLesson.youtube_video_url || activeLesson.video_url) && (
                      <a
                        href={activeLesson.youtube_video_url || activeLesson.video_url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 mt-2 text-xs text-danger hover:underline"
                      >
                        <FaYoutube /> Watch on YouTube
                      </a>
                    )}
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={goToPrevLesson}
                      disabled={!prevLesson}
                      className="btn-secondary p-2 rounded-lg text-xs disabled:opacity-30 disabled:cursor-not-allowed"
                      title={prevLesson ? `Previous: ${prevLesson.title}` : "First lesson"}
                    >
                      <FaChevronLeft className="text-xs" />
                    </button>
                    <button
                      onClick={goToNextLesson}
                      disabled={!nextLesson}
                      className="btn-secondary p-2 rounded-lg text-xs disabled:opacity-30 disabled:cursor-not-allowed"
                      title={nextLesson ? `Next: ${nextLesson.title}` : "Last lesson"}
                    >
                      <FaChevronRight className="text-xs" />
                    </button>
                    <button
                      onClick={() => toggleComplete(activeLesson.id)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors ${
                        completedIds.has(activeLesson.id)
                          ? "bg-success/10 border-success/30 text-success"
                          : "btn-secondary"
                      }`}
                    >
                      <FaCheckCircle className="text-xs" />
                      <span>{completedIds.has(activeLesson.id) ? "Completed" : "Mark Done"}</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* ── TAB BAR ─────────────────────────────────────────────── */}
            <div className="flex bg-surface-2 p-1 rounded-lg border border-border overflow-x-auto">
              {[
                { id: "overview",    label: "Overview",    icon: FaBookOpen },
                { id: "notes",       label: "Notes",       icon: FaRegStickyNote },
                { id: "resources",   label: "Resources",   icon: FaFolderOpen },
                { id: "discussion",  label: "Discussion",  icon: FaCommentDots },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-3.5 py-1.5 rounded-md font-medium text-xs transition-colors whitespace-nowrap ${
                    activeTab === tab.id
                      ? "bg-surface text-text shadow-sm border border-border font-semibold"
                      : "text-muted hover:text-text"
                  }`}
                >
                  <tab.icon className="text-xs" /> {tab.label}
                </button>
              ))}
            </div>

            {/* ── TAB CONTENT ─────────────────────────────────────────── */}
            <div className="bg-surface p-6 rounded-xl border border-border shadow-sm min-h-[280px]">
              {activeTab === "overview" && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-muted mb-2">About This Course</h3>
                    <p className="text-text text-sm leading-relaxed">
                      {courseData.description || "No description available."}
                    </p>
                  </div>
                  {courseData.learning_outcomes?.length > 0 && (
                    <div>
                      <h3 className="text-xs font-semibold uppercase tracking-wider text-muted mb-2">What You'll Learn</h3>
                      <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {courseData.learning_outcomes.map((o, i) => (
                          <li key={i} className="flex items-start gap-2 text-xs text-text">
                            <FaCheckCircle className="text-success shrink-0 mt-0.5 text-xs" />
                            <span>{o}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  <div className="flex flex-col sm:flex-row gap-3.5 p-4 bg-surface-2 border border-border rounded-lg">
                    <div className="w-10 h-10 rounded-lg bg-surface border border-border flex items-center justify-center text-sm font-semibold text-text shrink-0">
                      {courseData.instructor?.first_name?.[0] || "I"}
                    </div>
                    <div>
                      <p className="font-semibold text-text text-sm">
                        {courseData.instructor?.first_name} {courseData.instructor?.last_name}
                      </p>
                      <p className="text-muted text-xs mt-0.5">
                        {courseData.instructor?.about || "Course Instructor"}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "notes" && (
                <div className="space-y-3">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-muted">Lecture Notes</h3>
                  <textarea
                    rows={6}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Capture key concepts, algorithm steps, or questions..."
                    className="input-field"
                  />
                  <div className="flex justify-end">
                    <button
                      onClick={() => {
                        if (!activeLesson) return;
                        const next = { ...savedNotes, [activeLesson.id]: notes };
                        setSavedNotes(next);
                        try {
                          localStorage.setItem(`notes_${courseId}`, JSON.stringify(next));
                          toast.success("Note saved locally!");
                        } catch {
                          toast.error("Could not save note to local storage");
                        }
                      }}
                      className="btn-primary py-2 px-4 text-xs font-semibold rounded-lg"
                    >
                      Save Notes
                    </button>
                  </div>
                </div>
              )}

              {activeTab === "resources" && (
                <div className="space-y-2">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-muted">Lesson Resources</h3>
                  <p className="text-muted text-xs">No supplemental resources attached to this lesson.</p>
                </div>
              )}

              {activeTab === "discussion" && (
                <div className="space-y-2">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-muted">Discussion Board</h3>
                  <p className="text-muted text-xs">Discussion board accessible via Student Q&A forum.</p>
                </div>
              )}
            </div>

          </div>
        </section>

        {/* ── RIGHT: CURRICULUM SIDEBAR ──────────────────────────────────── */}
        <AnimatePresence>
          {sidebarOpen && (
            <motion.aside
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 340, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="hidden lg:flex flex-col border-l border-border bg-surface overflow-hidden shrink-0"
            >
              <div className="p-4 border-b border-border bg-surface-2">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-text flex items-center gap-2">
                  <span className="w-1.5 h-3.5 bg-hot rounded-full" />
                  <span>Course Curriculum</span>
                </h3>
                <p className="text-[11px] text-muted mt-0.5">
                  {totalCount} lesson{totalCount !== 1 ? "s" : ""} · {progressPct}% complete
                </p>
              </div>

              <div className="flex-1 overflow-y-auto">
                {curriculum.length === 0 ? (
                  <div className="p-6 text-center">
                    <p className="text-muted text-xs">No curriculum uploaded yet.</p>
                  </div>
                ) : (
                  curriculum.map((section, sIdx) => {
                    const isExpanded = !!expandedSections[section.id];
                    return (
                      <div key={section.id} className="border-b border-border last:border-0">
                        {/* Section Header */}
                        <button
                          onClick={() => toggleSection(section.id)}
                          className="w-full px-4 py-3 flex items-center justify-between hover:bg-surface-2 transition-colors"
                        >
                          <div className="flex items-center gap-2.5 min-w-0 text-left">
                            <span className="w-5 h-5 rounded bg-surface-2 border border-border flex items-center justify-center text-[10px] font-semibold text-text shrink-0">
                              {sIdx + 1}
                            </span>
                            <div className="min-w-0">
                              <p className="font-semibold text-text text-xs line-clamp-1">{section.section_name}</p>
                              <p className="text-[10px] text-muted">
                                {section.lessons?.length || 0} lesson{section.lessons?.length !== 1 ? "s" : ""}
                              </p>
                            </div>
                          </div>
                          {isExpanded ? (
                            <FaChevronUp className="text-muted text-xs shrink-0" />
                          ) : (
                            <FaChevronDown className="text-muted text-xs shrink-0" />
                          )}
                        </button>

                        {/* Lesson Cards */}
                        <AnimatePresence initial={false}>
                          {isExpanded && (
                            <motion.div
                              initial={{ height: 0 }}
                              animate={{ height: "auto" }}
                              exit={{ height: 0 }}
                              className="overflow-hidden"
                            >
                              {section.lessons?.length === 0 ? (
                                <p className="px-10 py-3 text-slate-600 text-xs">No lessons in this section.</p>
                              ) : (
                                <div className="py-1 space-y-1">
                                  {section.lessons.map((lesson, lIdx) => (
                                    <LessonCard
                                      key={lesson.id}
                                      lesson={lesson}
                                      index={lIdx}
                                      isActive={activeLesson?.id === lesson.id}
                                      isDone={completedIds.has(lesson.id)}
                                      onSelect={selectLesson}
                                      onToggleDone={toggleComplete}
                                    />
                                  ))}
                                </div>
                              )}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  })
                )}
              </div>
            </motion.aside>
          )}
        </AnimatePresence>
      </main>

      {/* ── MOBILE CURRICULUM (bottom sheet) ──────────────────────────────── */}
      <div className="lg:hidden border-t border-border bg-surface">
        <div className="p-3 border-b border-border bg-surface-2">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-muted">
            Curriculum · {totalCount} lesson{totalCount !== 1 ? "s" : ""}
          </h3>
        </div>
        <div className="max-h-72 overflow-y-auto">
          {curriculum.map((section, sIdx) => (
            <div key={section.id}>
              <p className="px-4 py-1.5 text-[11px] font-semibold text-muted bg-surface-2/60 border-y border-border/40">
                {sIdx + 1}. {section.section_name}
              </p>
              <div className="space-y-1 py-1">
                {section.lessons?.map((lesson, lIdx) => (
                  <LessonCard
                    key={lesson.id}
                    lesson={lesson}
                    index={lIdx}
                    isActive={activeLesson?.id === lesson.id}
                    isDone={completedIds.has(lesson.id)}
                    onSelect={selectLesson}
                    onToggleDone={toggleComplete}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
</div>
      <Footer />
    </div>
  );
}
