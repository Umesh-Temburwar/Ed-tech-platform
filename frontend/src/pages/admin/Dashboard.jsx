import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../../config/supabaseClient";
import { motion } from "framer-motion";
import {
  Users,
  GraduationCap,
  BookOpen,
  DollarSign,
  TrendingUp,
  Activity,
  UserPlus,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

// Utility to format currency
const formatCurrency = (value) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value || 0);
};

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    students: 0,
    instructors: 0,
    courses: 0,
    revenue: 0,
  });
  const [recentActivity, setRecentActivity] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;

    async function fetchDashboardData() {
      try {
        setLoading(true);

        // 1. Fetch Students Count (handle variations of casing gracefully)
        const { count: studentCount, error: studentErr } = await supabase
          .from("profiles")
          .select("*", { count: "exact", head: true })
          .ilike("account_type", "%Student%");

        // 2. Fetch Instructors Count
        const { count: instructorCount, error: instructorErr } = await supabase
          .from("profiles")
          .select("*", { count: "exact", head: true })
          .ilike("account_type", "%Instructor%");

        // 3. Fetch Courses Count
        const { count: courseCount, error: courseErr } = await supabase
          .from("courses")
          .select("*", { count: "exact", head: true });

        // 4. Fetch Revenue (safely try payments, fallback to 0 if fails)
        let totalRevenue = 0;
        const { data: paymentsData, error: paymentsErr } = await supabase
          .from("payments")
          .select("amount, status")
          .eq("status", "completed");

        if (!paymentsErr && paymentsData) {
          totalRevenue = paymentsData.reduce(
            (acc, curr) => acc + (Number(curr.amount) || 0),
            0
          );
        } else {
           // fallback attempt: fetch courses price joined with enrollments
           const { data: enrollmentsData, error: enrollErr } = await supabase
           .from("course_enrollments")
           .select("courses(price)");

           if (!enrollErr && enrollmentsData) {
               totalRevenue = enrollmentsData.reduce((acc, curr) => {
                   const price = curr?.courses?.price;
                   return acc + (Number(price) || 0);
               }, 0);
           }
        }

        if (mounted) {
          setStats({
            students: studentCount || 0,
            instructors: instructorCount || 0,
            courses: courseCount || 0,
            revenue: totalRevenue,
          });
        }

        // 5. Fetch Recent Activity
        const { data: recentUsers, error: usersErr } = await supabase
          .from("profiles")
          .select("id, full_name, first_name, email, account_type, created_at")
          .order("created_at", { ascending: false })
          .limit(5);

        const { data: recentCourses, error: rcourseErr } = await supabase
          .from("courses")
          .select("id, title, created_at, instructor_id")
          .order("created_at", { ascending: false })
          .limit(5);

        let activity = [];
        if (recentUsers && !usersErr) {
          activity.push(
            ...recentUsers.map((u) => ({
              id: `user_${u.id}`,
              type: "user",
              message: `New ${u.account_type || "user"} joined: ${
                u.full_name || u.first_name || u.email
              }`,
              time: u.created_at,
              icon: UserPlus,
              color: "text-blue-400",
              bg: "bg-blue-400/10",
            }))
          );
        }

        if (recentCourses && !rcourseErr) {
          activity.push(
            ...recentCourses.map((c) => ({
              id: `course_${c.id}`,
              type: "course",
              message: `New course created: ${c.title}`,
              time: c.created_at,
              icon: BookOpen,
              color: "text-emerald-400",
              bg: "bg-emerald-400/10",
            }))
          );
        }

        // Sort by most recent
        activity.sort((a, b) => new Date(b.time) - new Date(a.time));
        
        if (mounted) {
          setRecentActivity(activity.slice(0, 8));
        }

        // 6. Build Chart Data (Last 30 days user signups)
        const { data: allRecentUsers, error: allUsersErr } = await supabase
          .from("profiles")
          .select("created_at")
          .gte(
            "created_at",
            new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
          );

        if (allRecentUsers && !allUsersErr && mounted) {
          const dateCounts = {};
          
          // Initialize last 30 days with 0
          for (let i = 29; i >= 0; i--) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            const dateStr = d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
            dateCounts[dateStr] = 0;
          }

          allRecentUsers.forEach((u) => {
            const d = new Date(u.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric" });
            if (dateCounts[d] !== undefined) {
              dateCounts[d]++;
            }
          });

          const formattedChartData = Object.keys(dateCounts).map((date) => ({
            date,
            users: dateCounts[date],
          }));

          setChartData(formattedChartData);
        }
      } catch (err) {
        console.error("Dashboard fetch error:", err);
        if (mounted) setError("Failed to load dashboard data. Please try again.");
      } finally {
        if (mounted) setLoading(false);
      }
    }

    fetchDashboardData();

    return () => {
      mounted = false;
    };
  }, []);

  const statCards = [
    {
      title: "Total Students",
      value: stats.students.toLocaleString(),
      icon: GraduationCap,
      color: "text-accent",
    },
    {
      title: "Total Instructors",
      value: stats.instructors.toLocaleString(),
      icon: Users,
      color: "text-accent",
    },
    {
      title: "Active Courses",
      value: stats.courses.toLocaleString(),
      icon: BookOpen,
      color: "text-warning",
    },
    {
      title: "Total Revenue",
      value: formatCurrency(stats.revenue),
      icon: DollarSign,
      color: "text-success",
    },
  ];

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-center">
        <div className="w-12 h-12 rounded-xl bg-danger/10 border border-danger/20 flex items-center justify-center mb-3 text-danger">
          <Activity className="w-6 h-6" />
        </div>
        <h2 className="text-base font-semibold text-text mb-1">Unable to Load Telemetry</h2>
        <p className="text-muted text-xs mb-4">{error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="btn-secondary py-2 px-4 rounded-lg text-xs font-medium"
        >
          Retry Connection
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-10">
      {/* ── Header ──────────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-text tracking-tight">
            System Administration
          </h1>
          <p className="text-muted text-xs mt-0.5">
            Platform operations, user registry, and enrollment telemetry
          </p>
        </div>
        <Link
          to="/admin/reports"
          className="btn-primary py-2 px-4 rounded-lg text-xs font-semibold inline-flex items-center gap-1.5 self-start sm:self-auto"
        >
          <TrendingUp className="w-3.5 h-3.5" />
          <span>Detailed Reports</span>
        </Link>
      </div>

      {/* ── Metric Cards ────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, idx) => (
          <div
            key={idx}
            className="p-5 rounded-xl bg-surface border border-border shadow-sm flex items-start justify-between hover:border-border/80 transition-colors"
          >
            <div>
              <p className="text-muted text-xs font-medium">
                {stat.title}
              </p>
              <div className="mt-1">
                <h3 className="text-2xl font-semibold text-text tracking-tight">
                  {loading ? (
                    <div className="h-7 w-20 bg-surface-2 animate-pulse rounded" />
                  ) : (
                    stat.value
                  )}
                </h3>
              </div>
            </div>
            <div className="w-9 h-9 rounded-lg bg-surface-2 border border-border flex items-center justify-center shrink-0 text-text">
              <stat.icon className={`w-4 h-4 ${stat.color}`} />
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ── Growth Chart ─────────────────────────────────────────────── */}
        <div className="lg:col-span-2 p-5 rounded-xl bg-surface border border-border shadow-sm flex flex-col min-h-[380px]">
          <div className="mb-4">
            <h2 className="text-sm font-semibold text-text">Platform User Growth</h2>
            <p className="text-xs text-muted">New user registrations over the trailing 30 days</p>
          </div>
          
          <div className="flex-1 w-full h-[280px]">
            {loading ? (
              <div className="w-full h-full flex items-end gap-1.5">
                {[...Array(30)].map((_, i) => (
                  <div key={i} className="flex-1 bg-surface-2 animate-pulse rounded-t-sm" style={{ height: `${Math.max(10, Math.random() * 100)}%` }} />
                ))}
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" opacity={0.6} vertical={false} />
                  <XAxis 
                    dataKey="date" 
                    stroke="var(--muted)"
                    tick={{ fill: 'var(--muted)', fontSize: 11 }}
                    tickMargin={8}
                    minTickGap={20}
                    tickLine={false}
                  />
                  <YAxis 
                    stroke="var(--muted)"
                    tick={{ fill: 'var(--muted)', fontSize: 11 }}
                    tickMargin={8}
                    allowDecimals={false}
                    tickLine={false}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'var(--surface)', 
                      borderColor: 'var(--border)',
                      borderRadius: '8px',
                      fontSize: '12px'
                    }}
                    itemStyle={{ color: 'var(--text)' }}
                    labelStyle={{ color: 'var(--muted)', marginBottom: '2px' }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="users" 
                    name="Registrations"
                    stroke="#58a6ff" 
                    strokeWidth={2}
                    fillOpacity={0.15} 
                    fill="#58a6ff" 
                    activeDot={{ r: 5, fill: '#58a6ff' }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* ── Recent Activity ────────────────────────────────────────────── */}
        <div className="p-5 rounded-xl bg-surface border border-border shadow-sm flex flex-col">
          <div className="mb-4">
            <h2 className="text-sm font-semibold text-text">Audit Activity Feed</h2>
            <p className="text-xs text-muted">Recent account events and course enrollments</p>
          </div>

          <div className="flex-1 overflow-y-auto space-y-3">
            {loading ? (
              [...Array(4)].map((_, i) => (
                <div key={i} className="flex gap-3 items-start animate-pulse">
                  <div className="w-8 h-8 rounded-lg bg-surface-2 shrink-0" />
                  <div className="space-y-1.5 flex-1">
                    <div className="h-3.5 bg-surface-2 rounded w-3/4" />
                    <div className="h-3 bg-surface-2 rounded w-1/3" />
                  </div>
                </div>
              ))
            ) : recentActivity.length > 0 ? (
              recentActivity.map((activity) => (
                <div key={activity.id} className="flex gap-3 items-start p-2 rounded-lg hover:bg-surface-2 transition-colors">
                  <div className="w-8 h-8 rounded-lg bg-surface-2 border border-border flex items-center justify-center shrink-0 text-text">
                    <activity.icon className={`w-3.5 h-3.5 ${activity.color}`} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs text-text font-medium truncate">
                      {activity.message}
                    </p>
                    <p className="text-[10px] text-muted mt-0.5">
                      {new Date(activity.time).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-10">
                <Activity className="w-6 h-6 text-muted mx-auto mb-2" />
                <p className="text-xs text-muted">No recent administrative activity</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
