import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { 
  BookOpen, 
  Clock, 
  Award, 
  Calendar, 
  ArrowRight,
  CheckCircle2,
  Bookmark
} from 'lucide-react';
import { StatCard, ProgressBar } from '../../components/dashboard/Common';
import { supabase } from '../../config/supabaseClient';

const DashboardPage = () => {
  const { user } = useSelector((s) => s.profile);

  const firstName =
    (user?.full_name?.trim().split(' ')[0] || '') ||
    (user?.firstName?.trim() || '') ||
    (user?.first_name?.trim() || '') ||
    'Student';

  const [stats, setStats] = useState({
    activeCourses: 0,
    completedCourses: 0,
    totalProgress: 0,
  });
  const [recentCourses, setRecentCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const fetchDashboardData = async () => {
      if (!user?.id) {
        setLoading(false);
        return;
      }

      try {
        const { data: enrollments, error } = await supabase
          .from("course_enrollments")
          .select(`
            id, enrolled_at, completed, progress, progress_percent,
            courses (
              id, title, final_thumbnail_url, youtube_thumbnail_url, thumbnail_url, thumbnail,
              instructor:instructor_id(first_name, last_name)
            )
          `)
          .eq("student_id", user.id)
          .order("enrolled_at", { ascending: false });

        if (error) throw error;

        if (isMounted && enrollments) {
          const activeCoursesCount = enrollments.length;
          const completedCoursesCount = enrollments.filter(e => e.completed === true).length;
          
          let totalP = 0;
          const coursesList = [];

          enrollments.forEach(e => {
            const c = e.courses;
            if (!c) return;
            const inst = c.instructor || {};
            const thumb = c.final_thumbnail_url || c.youtube_thumbnail_url || c.thumbnail_url || c.thumbnail;
            const p = e.completed ? 100 : (Number(e.progress_percent) || Number(e.progress) || 0);
            totalP += p;

            if (coursesList.length < 4) {
              coursesList.push({
                id: c.id,
                title: c.title || 'Course',
                thumbnail: thumb || 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&auto=format&fit=crop&q=80',
                instructor: `${inst.first_name || ''} ${inst.last_name || ''}`.trim() || 'Faculty',
                progress: p,
                completed: e.completed
              });
            }
          });

          const avgProgress = activeCoursesCount > 0 ? Math.round(totalP / activeCoursesCount) : 0;

          setRecentCourses(coursesList);
          setStats({
            activeCourses: activeCoursesCount,
            completedCourses: completedCoursesCount,
            totalProgress: avgProgress,
          });
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchDashboardData();
    return () => { isMounted = false; };
  }, [user]);

  const h = new Date().getHours();
  const greeting = h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening';
  const todayFormatted = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <div className="space-y-6">
      {/* Top Welcome Card */}
      <div className="bg-surface border border-border rounded-xl p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-medium text-muted mb-2">
              <Calendar className="w-3.5 h-3.5" />
              <span>{todayFormatted}</span>
            </div>
            <h1 className="text-2xl font-semibold text-text tracking-tight">
              {greeting}, <span className="capitalize">{firstName}</span>
            </h1>
            <p className="text-muted text-xs mt-1">
              {stats.activeCourses > 0
                ? `You have ${stats.activeCourses} active ${stats.activeCourses === 1 ? 'course' : 'courses'} in your curriculum. Average completion: ${stats.totalProgress}%.`
                : "Welcome to your study dashboard. Explore available courses to begin your curriculum."}
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Link
              to="/explore"
              className="btn-secondary py-2 px-3.5 rounded-lg text-xs font-semibold"
            >
              Browse Catalog
            </Link>
            <Link
              to="/dashboard/enrolled-courses"
              className="btn-primary py-2 px-3.5 rounded-lg text-xs font-semibold flex items-center gap-1.5"
            >
              <span>My Courses</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          icon={BookOpen} 
          label="Enrolled Courses" 
          value={stats.activeCourses.toString()} 
          trend="Curriculum" 
          color="indigo" 
        />
        <StatCard 
          icon={CheckCircle2} 
          label="Completed Courses" 
          value={stats.completedCourses.toString()} 
          trend="Certified" 
          color="emerald" 
        />
        <StatCard 
          icon={Clock} 
          label="Avg. Progress" 
          value={`${stats.totalProgress}%`} 
          trend="All subjects" 
          color="amber" 
        />
        <StatCard 
          icon={Award} 
          label="Certificates" 
          value={stats.completedCourses.toString()} 
          trend="Verified" 
          color="blue" 
        />
      </div>

      {/* Main Grid: Continue Learning + Study Schedule */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 cols): Continue Learning */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold text-text">Continue Learning</h2>
            <Link
              to="/dashboard/enrolled-courses"
              className="text-xs font-medium text-accent hover:underline flex items-center gap-1"
            >
              <span>View all enrolled</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          {loading ? (
            <div className="p-8 bg-surface rounded-xl border border-border flex justify-center">
              <div className="w-6 h-6 border-2 border-border border-t-text rounded-full animate-spin" />
            </div>
          ) : recentCourses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {recentCourses.map((course) => (
                <div
                  key={course.id}
                  className="bg-surface border border-border rounded-xl p-4 shadow-sm flex flex-col justify-between hover:border-border/80 transition-colors"
                >
                  <div>
                    <div className="h-32 w-full rounded-lg overflow-hidden bg-surface-2 border border-border mb-3 relative">
                      <img
                        src={course.thumbnail}
                        alt={course.title}
                        className="w-full h-full object-cover"
                      />
                      {course.completed && (
                        <span className="absolute top-2 right-2 bg-success text-white text-[10px] font-semibold px-2 py-0.5 rounded shadow-sm">
                          Completed
                        </span>
                      )}
                    </div>
                    <h3 className="font-semibold text-sm text-text line-clamp-1 mb-1">
                      {course.title}
                    </h3>
                    <p className="text-xs text-muted">
                      Instructor: {course.instructor}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-border/60">
                    <div className="flex justify-between items-center text-xs font-medium mb-1.5">
                      <span className="text-muted">Progress</span>
                      <span className="text-text font-semibold">{course.progress}%</span>
                    </div>
                    <ProgressBar pct={course.progress} />

                    <Link
                      to={`/learn/${course.id}`}
                      className="mt-3 w-full btn-primary py-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5"
                    >
                      <span>{course.progress > 0 ? 'Resume Course' : 'Start Course'}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 bg-surface rounded-xl border border-dashed border-border text-center">
              <Bookmark className="w-8 h-8 text-muted mx-auto mb-2" />
              <h3 className="text-sm font-semibold text-text">No active enrollments</h3>
              <p className="text-xs text-muted mt-1 max-w-sm mx-auto">
                You haven't enrolled in any courses yet. Browse our catalog to get started.
              </p>
              <Link
                to="/explore"
                className="mt-4 inline-flex btn-primary py-2 px-4 rounded-lg text-xs font-semibold"
              >
                Browse Course Catalog
              </Link>
            </div>
          )}
        </div>

        {/* Right Column (1 col): Study Guidelines & Shortcuts */}
        <div className="space-y-4">
          <h2 className="text-base font-semibold text-text">Academic Resources</h2>
          
          <div className="bg-surface border border-border rounded-xl p-5 shadow-sm space-y-4">
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-muted mb-2">
                Quick Navigation
              </h3>
              <div className="space-y-1.5">
                <Link
                  to="/student/quizzes"
                  className="flex items-center justify-between p-2.5 rounded-lg bg-surface-2 hover:bg-surface-3 transition-colors text-xs font-medium text-text border border-border"
                >
                  <span>Practice Tests & Quizzes</span>
                  <ArrowRight className="w-3.5 h-3.5 text-muted" />
                </Link>
                <Link
                  to="/student/assignments"
                  className="flex items-center justify-between p-2.5 rounded-lg bg-surface-2 hover:bg-surface-3 transition-colors text-xs font-medium text-text border border-border"
                >
                  <span>Lab Assignments</span>
                  <ArrowRight className="w-3.5 h-3.5 text-muted" />
                </Link>
                <Link
                  to="/student/certificates"
                  className="flex items-center justify-between p-2.5 rounded-lg bg-surface-2 hover:bg-surface-3 transition-colors text-xs font-medium text-text border border-border"
                >
                  <span>Earned Certifications</span>
                  <ArrowRight className="w-3.5 h-3.5 text-muted" />
                </Link>
                <Link
                  to="/support/help"
                  className="flex items-center justify-between p-2.5 rounded-lg bg-surface-2 hover:bg-surface-3 transition-colors text-xs font-medium text-text border border-border"
                >
                  <span>Academic Support Desk</span>
                  <ArrowRight className="w-3.5 h-3.5 text-muted" />
                </Link>
              </div>
            </div>

            <div className="pt-3 border-t border-border">
              <h3 className="text-xs font-semibold text-text mb-1">Course Progress Standards</h3>
              <p className="text-xs text-muted leading-relaxed">
                Lectures must be completed and quizzes submitted with ≥70% score to generate verified course completion certificates.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
