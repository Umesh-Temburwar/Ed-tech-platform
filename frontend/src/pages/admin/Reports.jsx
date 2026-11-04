import React, { useEffect, useState } from "react";
import { apiConnector } from "../../services/apiconnector";
import { adminEndpoints } from "../../services/apis";
import { BarChart3, Users, DollarSign, BookOpen } from "lucide-react";

export default function AdminReports() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await apiConnector("GET", adminEndpoints.REPORTS);
        setData(res?.data || null);
      } catch (err) {
        console.error("Failed to load reports:", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return (
    <div className="space-y-6">
      <div className="bg-surface p-6 rounded-xl border border-border">
        <h1 className="text-2xl font-bold text-text">Platform Reports</h1>
        <p className="text-xs text-muted mt-1">Aggregated platform analytics, course enrollments, and gross revenue.</p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-28 rounded-xl bg-surface border border-border animate-pulse" />
          ))}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <StatCard
              icon={Users}
              title="Active Students"
              value={data?.activeStudents ?? 0}
            />
            <StatCard
              icon={BookOpen}
              title="Total Course Enrollments"
              value={data?.enrollments ?? 0}
            />
            <StatCard
              icon={DollarSign}
              title="Gross Platform Revenue"
              value={`₹${Number(data?.revenue ?? 0).toLocaleString()}`}
            />
          </div>

          <div className="bg-surface rounded-xl border border-border p-5 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <h2 className="text-sm font-semibold text-text">Top Performing Courses</h2>
              <span className="text-xs text-muted">Ranked by total enrollments</span>
            </div>

            {(!data?.topCourses || data.topCourses.length === 0) ? (
              <p className="text-xs text-muted py-6 text-center">No course activity recorded yet.</p>
            ) : (
              <div className="divide-y divide-border">
                {data.topCourses.map((c, i) => (
                  <div key={c.id || i} className="flex items-center justify-between py-3 px-1 text-xs">
                    <div className="flex items-center gap-3">
                      <span className="w-5 text-muted font-mono">{i + 1}.</span>
                      <span className="font-medium text-text">{c.title}</span>
                    </div>
                    <span className="px-2 py-0.5 rounded bg-surface-2 border border-border text-muted font-mono">
                      {c.enrollments} enrollments
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

function StatCard({ icon: Icon, title, value }) {
  return (
    <div className="p-5 rounded-xl bg-surface border border-border">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-semibold text-muted uppercase tracking-wider">{title}</span>
        <Icon className="w-4 h-4 text-muted" />
      </div>
      <div className="text-2xl font-bold text-text">{value}</div>
    </div>
  );
}
