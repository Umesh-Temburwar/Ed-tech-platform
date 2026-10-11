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
      color: "text-cyan-400",
      bg: "bg-cyan-500/10",
      border: "border-cyan-500/20",
    },
    {
      title: "Total Instructors",
      value: stats.instructors.toLocaleString(),
      icon: Users,
      color: "text-violet-400",
      bg: "bg-violet-500/10",
      border: "border-violet-500/20",
    },
    {
      title: "Active Courses",
      value: stats.courses.toLocaleString(),
      icon: BookOpen,
      color: "text-amber-400",
      bg: "bg-amber-500/10",
      border: "border-amber-500/20",
    },
    {
      title: "Total Revenue",
      value: formatCurrency(stats.revenue),
      icon: DollarSign,
      color: "text-emerald-400",
      bg: "bg-emerald-500/10",
      border: "border-emerald-500/20",
    },
  ];

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mb-4">
          <Activity className="w-8 h-8 text-red-400" />
        </div>
        <h2 className="text-xl font-bold text-white mb-2">Oops! Something went wrong</h2>
        <p className="text-slate-400 mb-6">{error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="px-6 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 md:space-y-8 pb-10">
      {/* ── Header ──────────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
            Dashboard Overview
          </h1>
          <p className="text-slate-400 mt-1 text-sm md:text-base">
            Welcome back. Here's what's happening on your platform today.
          </p>
        </div>
        <Link
          to="/admin/reports"
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-amber-950 font-bold transition-colors shrink-0"
        >
          <TrendingUp className="w-4 h-4" />
          Detailed Reports
        </Link>
      </div>

      {/* ── Metric Cards ────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {statCards.map((stat, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1, duration: 0.4 }}
            className={`p-6 rounded-2xl glass-dark border relative overflow-hidden group ${stat.border}`}
          >
            {/* Background Glow */}
            <div
              className={`absolute -top-10 -right-10 w-32 h-32 rounded-full blur-3xl opacity-20 group-hover:opacity-30 transition-opacity ${stat.bg.replace('/10', '')}`}
            />
            
            <div className="relative z-10 flex items-start justify-between">
              <div>
                <p className="text-slate-400 font-medium text-sm">
                  {stat.title}
                </p>
                <div className="mt-2 flex items-baseline gap-2">
                  <h3 className="text-2xl md:text-3xl font-extrabold text-white">
                    {loading ? (
                      <div className="h-8 w-20 bg-white/10 animate-pulse rounded" />
                    ) : (
                      stat.value
                    )}
                  </h3>
                </div>
              </div>
              <div
                className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${stat.bg}`}
              >
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
        {/* ── Growth Chart ─────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.4 }}
          className="lg:col-span-2 p-5 md:p-6 rounded-2xl glass-dark border border-white/5 flex flex-col min-h-[400px]"
        >
          <div className="mb-6">
            <h2 className="text-lg font-bold text-white">Platform Growth</h2>
            <p className="text-sm text-slate-400">New user signups over the last 30 days</p>
          </div>
          
          <div className="flex-1 w-full h-[300px]">
            {loading ? (
              <div className="w-full h-full flex items-end gap-2">
                {[...Array(30)].map((_, i) => (
                  <div key={i} className="flex-1 bg-white/5 animate-pulse rounded-t-sm" style={{ height: `${Math.max(10, Math.random() * 100)}%` }} />
                ))}
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#38bdf8" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                  <XAxis 
                    dataKey="date" 
                    stroke="rgba(255,255,255,0.3)"
                    tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 12 }}
                    tickMargin={10}
                    minTickGap={20}
                  />
                  <YAxis 
                    stroke="rgba(255,255,255,0.3)"
                    tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 12 }}
                    tickMargin={10}
                    allowDecimals={false}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'rgba(0,8,20,0.9)', 
                      borderColor: 'rgba(255,255,255,0.1)',
                      borderRadius: '12px',
                      boxShadow: '0 10px 25px -5px rgba(0,0,0,0.5)'
                    }}
                    itemStyle={{ color: '#fff' }}
                    labelStyle={{ color: 'rgba(255,255,255,0.5)', marginBottom: '4px' }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="users" 
                    name="New Users"
                    stroke="#38bdf8" 
                    strokeWidth={3}
                    fillOpacity={1} 
                    fill="url(#colorUsers)" 
                    activeDot={{ r: 6, fill: '#38bdf8', stroke: '#000814', strokeWidth: 2 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </motion.div>

        {/* ── Recent Activity ────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.4 }}
          className="p-5 md:p-6 rounded-2xl glass-dark border border-white/5 flex flex-col"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-white">Recent Activity</h2>
          </div>

          <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-4">
            {loading ? (
              [...Array(5)].map((_, i) => (
                <div key={i} className="flex gap-4 items-start">
                  <div className="w-10 h-10 rounded-full bg-white/10 animate-pulse shrink-0" />
                  <div className="space-y-2 flex-1">
                    <div className="h-4 bg-white/10 rounded w-3/4 animate-pulse" />
                    <div className="h-3 bg-white/5 rounded w-1/4 animate-pulse" />
                  </div>
                </div>
              ))
            ) : recentActivity.length > 0 ? (
              recentActivity.map((activity, i) => (
                <div key={activity.id} className="flex gap-4 items-start group">
                  <div className="relative">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${activity.bg}`}>
                      <activity.icon className={`w-4 h-4 ${activity.color}`} />
                    </div>
                    {/* Connection line */}
                    {i !== recentActivity.length - 1 && (
                      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[2px] h-full bg-white/5 group-hover:bg-white/10 transition-colors" />
                    )}
                  </div>
                  <div className="pb-4">
                    <p className="text-sm text-slate-200 font-medium">
                      {activity.message}
                    </p>
                    <p className="text-[11px] text-slate-500 mt-1">
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
                <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-3">
                  <Activity className="w-5 h-5 text-slate-500" />
                </div>
                <p className="text-sm text-slate-400">No recent activity</p>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
