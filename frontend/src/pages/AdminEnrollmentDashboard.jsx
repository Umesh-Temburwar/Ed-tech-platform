import { useState, useEffect } from "react";
import { supabase } from "../config/supabaseClient";
import { Search, Users, CreditCard, Gift, DollarSign } from "lucide-react";

export default function AdminEnrollmentDashboard({ userId, userRole }) {
  const [enrollments, setEnrollments] = useState([]);
  const [stats, setStats] = useState({ total: 0, free: 0, paid: 0, revenue: 0 });
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchEnrollments();

    const channel = supabase
      .channel("enrollment-changes")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "course_enrollments" },
        () => {
          fetchEnrollments();
        }
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [userId, userRole]);

  const fetchEnrollments = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from("course_enrollments")
        .select(`
          id,
          enrolled_at,
          payment_status,
          student_id,
          course_id,
          student_name,
          student_email,
          courses:course_id (
            title,
            price,
            is_free,
            instructor_id,
            profiles:instructor_id (
              full_name
            )
          )
        `)
        .order("enrolled_at", { ascending: false });

      if (userRole === "instructor") {
        query = query.eq("courses.instructor_id", userId);
      }

      const { data, error } = await query;
      if (error) throw error;

      const filtered = (data || []).filter((e) => e.courses !== null);
      setEnrollments(filtered);

      const total = filtered.length;
      const freeCount = filtered.filter((e) => e.payment_status === "Free").length;
      const paidCount = filtered.filter((e) => e.payment_status === "paid").length;
      const revenue = 0;

      setStats({ total, free: freeCount, paid: paidCount, revenue });
    } catch (err) {
      console.error("Error fetching enrollments:", err);
    } finally {
      setLoading(false);
    }
  };

  const displayEnrollments = enrollments.filter((e) => {
    const matchesFilter = filter === "all" || 
      (filter === "free" && e.payment_status === "Free") ||
      (filter === "paid" && e.payment_status === "paid");
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      !q ||
      (e.student_name || "").toLowerCase().includes(q) ||
      (e.student_email || "").toLowerCase().includes(q) ||
      e.courses?.title?.toLowerCase().includes(q);
    return matchesFilter && matchesSearch;
  });

  const formatDate = (iso) =>
    new Date(iso).toLocaleDateString("en-IN", {
      day: "numeric", month: "short", year: "numeric",
      hour: "2-digit", minute: "2-digit",
    });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-surface p-6 rounded-xl border border-border">
        <div>
          <h1 className="text-2xl font-bold text-text">
            {userRole === "admin" ? "All Platform Enrollments" : "Course Enrollments"}
          </h1>
          <p className="text-xs text-muted mt-1">
            Real-time student registry and active enrollment records.
          </p>
        </div>
        <div className="text-xs text-muted font-mono">
          Live stream connected
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={Users}
          label="Total Enrollments"
          value={stats.total}
        />
        <StatCard
          icon={Gift}
          label="Free Enrollments"
          value={stats.free}
        />
        <StatCard
          icon={CreditCard}
          label="Paid Enrollments"
          value={stats.paid}
        />
        {userRole === "admin" && (
          <StatCard
            icon={DollarSign}
            label="Gross Volume"
            value={`₹${stats.revenue.toLocaleString("en-IN")}`}
          />
        )}
      </div>

      {/* Filters + Search */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-surface p-4 rounded-xl border border-border">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
          <input
            type="text"
            placeholder="Search by student name, email, or course..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs rounded-md bg-surface-2 border border-border focus:border-accent outline-none text-text placeholder:text-muted"
          />
        </div>
        <div className="flex items-center gap-1.5">
          {["all", "free", "paid"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-md text-xs font-medium capitalize transition-colors ${
                filter === f
                  ? "bg-accent text-white"
                  : "bg-surface-2 text-muted hover:text-text border border-border"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="rounded-xl border border-border bg-surface overflow-hidden">
        {loading ? (
          <div className="py-12 text-center text-xs text-muted">Loading live enrollments...</div>
        ) : displayEnrollments.length === 0 ? (
          <div className="py-12 text-center text-xs text-muted">No enrollments found for current filters.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs whitespace-nowrap">
              <thead className="bg-surface-2 text-muted font-semibold border-b border-border uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="px-5 py-3">Student</th>
                  <th className="px-5 py-3">Email</th>
                  <th className="px-5 py-3">Course</th>
                  {userRole === "admin" && <th className="px-5 py-3">Instructor</th>}
                  <th className="px-5 py-3">Type</th>
                  <th className="px-5 py-3 text-right">Date & Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border text-muted">
                {displayEnrollments.map((e) => (
                  <tr key={e.id} className="hover:bg-surface-2/60 transition-colors">
                    <td className="px-5 py-3.5 font-semibold text-text">
                      {e.student_name || "Enrolled Student"}
                    </td>
                    <td className="px-5 py-3.5 text-muted">{e.student_email || "—"}</td>
                    <td className="px-5 py-3.5 text-text font-medium">{e.courses?.title || "—"}</td>
                    {userRole === "admin" && (
                      <td className="px-5 py-3.5 text-muted">
                        {e.courses?.profiles?.full_name || "—"}
                      </td>
                    )}
                    <td className="px-5 py-3.5">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium border ${
                        e.payment_status === "paid"
                          ? "bg-accent/10 text-accent border-accent/30"
                          : "bg-success/10 text-success border-success/30"
                      }`}>
                        {e.payment_status === "paid" ? "Paid" : "Free"}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-right text-muted font-mono text-[11px]">
                      {formatDate(e.enrolled_at)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <p className="text-[11px] text-muted">
        Showing {displayEnrollments.length} of {enrollments.length} enrollments · Updates via Supabase real-time
      </p>
    </div>
  );
}

function StatCard({ icon: Icon, label, value }) {
  return (
    <div className="p-4 rounded-xl bg-surface border border-border flex items-center justify-between">
      <div>
        <p className="text-xs text-muted uppercase tracking-wider font-semibold mb-1">{label}</p>
        <p className="text-xl font-bold text-text">{value}</p>
      </div>
      <div className="w-9 h-9 rounded-lg bg-surface-2 border border-border flex items-center justify-center text-muted">
        <Icon className="w-4 h-4" />
      </div>
    </div>
  );
}
