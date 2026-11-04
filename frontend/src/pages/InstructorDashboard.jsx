import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FaBook, FaUsers, FaDollarSign, FaRocket,
  FaCheckCircle, FaFileAlt, FaPlus, FaArrowRight,
  FaClock, FaStar, FaPlay
} from "react-icons/fa";
import { getInstructorStats, getInstructorCourses } from "../services/courseService";
import { supabase } from "../config/supabaseClient";
import { getYoutubeThumbnail } from "../utils/youtubeUtils";

// ── Stat Card (Primer Calm Style) ─────────────────────────────────────────────
const StatCard = ({ icon: Icon, title, value, sub, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 12 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3, delay }}
    className="bg-surface border border-border rounded-xl p-5 hover:border-border-muted transition-colors"
  >
    <div className="flex items-start justify-between">
      <div>
        <p className="text-xs font-semibold text-muted uppercase tracking-wider mb-1.5">{title}</p>
        <p className="text-2xl font-bold text-text mb-1">{value}</p>
        <p className="text-xs text-muted">{sub}</p>
      </div>
      <div className="w-10 h-10 rounded-lg bg-surface-2 border border-border flex items-center justify-center shrink-0">
        <Icon className="text-muted text-base" />
      </div>
    </div>
  </motion.div>
);

// ── Status Pill ───────────────────────────────────────────────────────────────
const StatusPill = ({ status = "Draft" }) => {
  const isPublished = status?.toLowerCase() === "published";
  return (
    <span
      className={`text-[11px] font-medium px-2 py-0.5 rounded border ${
        isPublished
          ? "bg-success/10 text-success border-success/30"
          : "bg-surface-2 text-muted border-border"
      }`}
    >
      {isPublished ? "Published" : "Draft"}
    </span>
  );
};

// ── Onboarding Progress Card ─────────────────────────────────────────────────
const OnboardingCard = ({ profile, navigate }) => {
  const currentStep = profile?.onboarding_step || 1;
  const isCompleted = profile?.onboarding_completed || false;
  const isDraftSaved = profile?.draft_saved || false;

  if (isCompleted || !isDraftSaved) return null;

  const progress = Math.round(((currentStep - 1) / 5) * 100);
  const lastSaved = profile?.last_saved_at 
    ? new Date(profile.last_saved_at).toLocaleString() 
    : "Recently";

  return (
    <div className="p-6 rounded-xl bg-surface border border-border">
      <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
        <div>
          <h2 className="text-lg font-bold text-text">
            Complete Your Instructor Setup
          </h2>
          <p className="text-sm text-muted mt-1">
            Your onboarding draft is saved. Continue where you left off.
          </p>
          <p className="text-xs text-muted mt-1">
            Last saved: {lastSaved}
          </p>
        </div>
        <div className="text-right">
          <p className="text-xs font-semibold text-accent uppercase tracking-wider">Step {currentStep} of 5</p>
          <p className="text-2xl font-bold text-text">{progress}%</p>
        </div>
      </div>

      <div className="w-full h-2 bg-surface-2 border border-border rounded-full overflow-hidden">
        <div 
          style={{ width: `${(profile.onboarding_step / 5) * 100}%` }}
          className="h-full bg-accent rounded-full transition-all duration-500"
        />
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4 mt-5">
        <p className="text-xs text-muted">
          Finish your setup to publish courses and receive payouts.
        </p>
        <button 
          onClick={() => navigate("/instructor/setup")}
          className="inline-flex items-center gap-2 px-4 py-2 bg-hot text-white rounded-md text-xs font-semibold hover:bg-[#e5482a] transition-colors"
        >
          <FaPlay className="text-[10px]" />
          Continue Setup
        </button>
      </div>
    </div>
  );
};

// ── Course Row (Recent List) ──────────────────────────────────────────────────
const CourseRow = ({ course, navigate }) => {
  const enrollments = course.enrollments?.length ?? 0;
  const status      = course.status ?? "Draft";
  const courseTitle = course.title || course.course_name || "Untitled Course";

  const dbThumbnail = course.final_thumbnail_url || course.youtube_thumbnail_url || null;
  const youtubeUrl =
    course.preview_video_url ||
    course.youtube_video_url ||
    null;
  const youtubeThumbnail = dbThumbnail || getYoutubeThumbnail(youtubeUrl);
  const resolvedThumbnail = youtubeThumbnail || course.custom_thumbnail_url || course.thumbnail_url || (course.thumbnail && course.thumbnail !== '' ? course.thumbnail : null) || null;

  function handleImgError(e) {
    const src = e.target.src;
    if (youtubeUrl && src.includes("maxresdefault")) {
      const hq = getYoutubeThumbnail(youtubeUrl, "hq");
      if (hq && hq !== src) { e.target.src = hq; return; }
    }
    const fallback = course.thumbnail_url || course.thumbnail;
    if (fallback && src !== fallback) { e.target.src = fallback; return; }
    e.target.style.display = "none";
  }
  
  return (
    <div
      className="flex items-center gap-4 py-3 px-2 rounded-lg hover:bg-surface-2 transition-colors cursor-pointer group"
      onClick={() => navigate(`/dashboard/instructor/my-courses`)}
    >
      {/* Thumbnail */}
      <div className="w-14 aspect-video rounded-md overflow-hidden bg-surface-2 border border-border shrink-0 flex items-center justify-center">
        {resolvedThumbnail ? (
          <img
            src={resolvedThumbnail}
            alt={courseTitle}
            className="w-full h-full object-cover"
            onError={handleImgError}
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted"><FaBook className="text-xs" /></div>
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="font-medium text-sm text-text truncate group-hover:text-accent transition-colors">
          {courseTitle}
        </p>
        <p className="text-xs text-muted mt-0.5">{course.categories?.name ?? "General"}</p>
      </div>

      {/* Meta */}
      <div className="flex items-center gap-4 shrink-0">
        <div className="flex items-center gap-1.5 text-xs text-muted">
          <FaUsers className="text-muted text-[11px]" />
          <span>{enrollments}</span>
        </div>
        <StatusPill status={status} />
        <FaArrowRight className="text-muted text-[11px] group-hover:text-text group-hover:translate-x-0.5 transition-all" />
      </div>
    </div>
  );
};

// ── Main Dashboard ────────────────────────────────────────────────────────────
export default function InstructorDashboard() {
  const { user }  = useSelector((s) => s.profile);
  const navigate  = useNavigate();

  const [stats,   setStats]   = useState(null);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [instructorProfile, setInstructorProfile] = useState(null);

  const instructorId = user?.id;

  const firstName =
    user?.full_name?.trim().split(" ")[0] ||
    user?.firstName?.trim() ||
    user?.first_name?.trim() ||
    "Instructor";

  const h = new Date().getHours();
  const greeting = h < 12 ? "Good morning" : h < 17 ? "Good afternoon" : "Good evening";

  useEffect(() => {
    if (!instructorId) return;
    
    let isMounted = true;
    
    (async () => {
      try {
        setLoading(true);
        setError(null);
        
        const [statsRes, coursesRes, profileRes] = await Promise.all([
          getInstructorStats(instructorId),
          getInstructorCourses(instructorId),
          supabase.from("instructor_profiles").select("*").eq("user_id", instructorId).maybeSingle(),
        ]);
        
        if (!isMounted) return;
        
        const safeStatsRes = statsRes || { data: null, error: null };
        const safeCoursesRes = coursesRes || { data: [], error: null };
        
        setStats(safeStatsRes.data || {
          totalCourses: 0,
          publishedCourses: 0,
          draftCourses: 0,
          totalEnrollments: 0,
          totalRevenue: 0,
        });
        
        setCourses(safeCoursesRes.data || []);
        setInstructorProfile(profileRes?.data || null);
        
        if (statsRes?.error && coursesRes?.error) {
          setError("Unable to load dashboard data. Please refresh the page.");
          console.error("Dashboard errors:", { statsRes, coursesRes, profileRes });
        }
      } catch (err) {
        if (!isMounted) return;
        console.error("Unexpected dashboard error:", err);
        setError("An unexpected error occurred. Please try again.");
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    })();
    
    return () => {
      isMounted = false;
    };
  }, [instructorId]);

  const statCards = [
    {
      icon: FaBook,
      title: "Total Courses",
      delay: 0,
      value: loading ? "—" : (stats?.totalCourses ?? 0),
      sub: `${stats?.publishedCourses ?? 0} published · ${stats?.draftCourses ?? 0} draft`,
    },
    {
      icon: FaUsers,
      title: "Total Students",
      delay: 0.05,
      value: loading ? "—" : (stats?.totalEnrollments ?? 0).toLocaleString(),
      sub: "Active student enrollments",
    },
    {
      icon: FaDollarSign,
      title: "Total Revenue",
      delay: 0.1,
      value: loading ? "—" : `₹${(stats?.totalRevenue ?? 0).toLocaleString()}`,
      sub: "Gross platform earnings",
    },
    {
      icon: FaStar,
      title: "Average Rating",
      delay: 0.15,
      value: "4.8",
      sub: "Across all published courses",
    },
  ];

  const quickActions = [
    { label: "Create Course", icon: FaPlus, path: "/dashboard/instructor/add-course" },
    { label: "My Courses", icon: FaBook, path: "/dashboard/instructor/my-courses" },
    { label: "Analytics", icon: FaFileAlt, path: "/dashboard/instructor/analytics" },
  ];

  return (
    <div className="space-y-6">

      {/* ── Onboarding Card (if in progress) ──────────────────────────────── */}
      {instructorProfile && (
        <OnboardingCard profile={instructorProfile} navigate={navigate} />
      )}

      {/* ── Error Banner ─────────────────────────────────────────────────── */}
      {error && (
        <div className="p-4 rounded-xl bg-danger/10 border border-danger/30 text-danger text-sm">
          <p className="font-semibold mb-0.5">Error Loading Dashboard</p>
          <p className="text-xs opacity-90">{error}</p>
        </div>
      )}

      {/* ── Welcome Header ───────────────────────────────────────────────── */}
      <div className="p-6 rounded-xl bg-surface border border-border flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs font-medium text-muted uppercase tracking-wider mb-1">
            {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
          </p>
          <h1 className="text-2xl font-bold text-text">
            {greeting}, <span className="capitalize">{firstName}</span>
          </h1>
          <p className="text-sm text-muted mt-1 max-w-lg">
            {loading
              ? "Loading your instructor workspace..."
              : courses.length === 0
                ? "Welcome to your instructor console. Create your first course to begin teaching."
                : `You have ${stats?.publishedCourses ?? 0} published course${(stats?.publishedCourses ?? 0) !== 1 ? "s" : ""} reaching ${(stats?.totalEnrollments ?? 0).toLocaleString()} enrolled students.`
            }
          </p>
        </div>
        <Link
          to="/dashboard/instructor/add-course"
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-hot text-white rounded-md text-sm font-semibold hover:bg-[#e5482a] transition-colors"
        >
          <FaPlus className="text-xs" />
          Create New Course
        </Link>
      </div>

      {/* ── Stats Grid ───────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {statCards.map((s) => <StatCard key={s.title} {...s} />)}
      </div>

      {/* ── Quick Actions + Recent Courses ───────────────────────────────── */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

        {/* Quick Actions Panel */}
        <div className="bg-surface border border-border rounded-xl p-5 space-y-5">
          <div>
            <h2 className="text-xs font-semibold uppercase tracking-wider text-muted">Quick Actions</h2>
            <p className="text-xs text-muted mt-0.5">Common instructor tools</p>
          </div>

          <div className="grid grid-cols-1 gap-2">
            {quickActions.map((a) => (
              <Link
                key={a.label}
                to={a.path}
                className="flex items-center gap-3 p-3 rounded-lg border border-border bg-surface-2 hover:border-border-muted transition-colors text-text text-sm font-medium"
              >
                <div className="w-7 h-7 rounded bg-surface border border-border flex items-center justify-center shrink-0 text-muted">
                  <a.icon className="text-xs" />
                </div>
                <span>{a.label}</span>
              </Link>
            ))}
          </div>

          {/* Status Breakdown */}
          <div className="pt-3 border-t border-border space-y-2.5">
            <div className="flex items-center justify-between text-xs">
              <span className="flex items-center gap-2 text-muted">
                <FaCheckCircle className="text-success text-xs" /> Published
              </span>
              <span className="font-semibold text-text">{stats?.publishedCourses ?? 0}</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="flex items-center gap-2 text-muted">
                <FaFileAlt className="text-muted text-xs" /> Drafts
              </span>
              <span className="font-semibold text-text">{stats?.draftCourses ?? 0}</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="flex items-center gap-2 text-muted">
                <FaClock className="text-warning text-xs" /> Last updated
              </span>
              <span className="text-muted">
                {courses[0]?.updated_at
                  ? new Date(courses[0].updated_at).toLocaleDateString()
                  : "No updates yet"}
              </span>
            </div>
          </div>
        </div>

        {/* Recent Courses Panel */}
        <div className="xl:col-span-2 bg-surface border border-border rounded-xl p-5">
          <div className="flex items-center justify-between pb-3 border-b border-border mb-3">
            <div>
              <h2 className="text-sm font-semibold text-text">Your Courses</h2>
              <p className="text-xs text-muted">Recently updated curriculum</p>
            </div>
            <Link
              to="/dashboard/instructor/my-courses"
              className="text-xs font-semibold text-accent hover:underline flex items-center gap-1"
            >
              View all courses <FaArrowRight className="text-[10px]" />
            </Link>
          </div>

          {loading ? (
            <div className="space-y-3 py-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-14 rounded-lg bg-surface-2 animate-pulse" />
              ))}
            </div>
          ) : courses.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 gap-3 text-center">
              <div className="w-12 h-12 rounded-lg bg-surface-2 border border-border flex items-center justify-center text-muted">
                <FaRocket className="text-lg" />
              </div>
              <div>
                <h3 className="font-semibold text-sm text-text">No courses created yet</h3>
                <p className="text-xs text-muted mt-1 max-w-xs mx-auto">
                  Start teaching by drafting your first curriculum with modules and lessons.
                </p>
              </div>
              <Link
                to="/dashboard/instructor/add-course"
                className="mt-2 inline-flex items-center gap-1.5 px-3 py-1.5 bg-surface-2 border border-border text-text rounded-md text-xs font-medium hover:border-border-muted transition-colors"
              >
                <FaPlus className="text-[10px]" /> Create First Course
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {courses.slice(0, 5).map((course) => (
                <CourseRow key={course.id} course={course} navigate={navigate} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── Revenue Summary Banner ───────────────────────────────────────── */}
      {!loading && stats && stats.totalRevenue > 0 && (
        <div className="flex flex-wrap items-center justify-between gap-4 p-5 rounded-xl bg-surface border border-border">
          <div>
            <p className="text-xs font-semibold text-muted uppercase tracking-wider mb-1">Platform Earnings</p>
            <p className="text-xl font-bold text-text">₹{stats.totalRevenue.toLocaleString()}</p>
            <p className="text-xs text-muted mt-0.5">Estimated gross revenue from {stats.totalEnrollments} enrollments</p>
          </div>
          <Link
            to="/dashboard/instructor/analytics"
            className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-surface-2 border border-border rounded-md text-xs font-semibold text-text hover:border-border-muted transition-colors"
          >
            Detailed Analytics
          </Link>
        </div>
      )}
    </div>
  );
}
