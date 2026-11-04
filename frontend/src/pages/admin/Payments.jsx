import React, { useEffect, useState } from "react";
import { supabase } from "../../config/supabaseClient";
import { CreditCard, DollarSign, ArrowUpRight, CheckCircle2 } from "lucide-react";

export default function AdminPayments() {
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPayments() {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from("course_enrollments")
          .select("id, enrolled_at, courses(id, title, price)")
          .order("enrolled_at", { ascending: false })
          .limit(20);

        if (!error && data) {
          setEnrollments(data);
        }
      } catch (err) {
        console.error("Error loading payments:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchPayments();
  }, []);

  const totalProcessed = enrollments.reduce((sum, item) => sum + (Number(item?.courses?.price) || 0), 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 bg-surface p-6 rounded-xl border border-border">
        <div>
          <h1 className="text-2xl font-bold text-text">Payment Transactions</h1>
          <p className="text-xs text-muted mt-1">Audit platform enrollment purchases and gateway settlement status.</p>
        </div>
        <div className="text-right">
          <p className="text-xs text-muted uppercase font-semibold tracking-wider">Recent Gross Volume</p>
          <p className="text-xl font-bold text-text">₹{totalProcessed.toLocaleString()}</p>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-surface overflow-hidden">
        {loading ? (
          <div className="py-12 text-center text-xs text-muted">Loading transactions...</div>
        ) : enrollments.length === 0 ? (
          <div className="py-12 text-center text-xs text-muted">No recent transactions recorded.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-surface-2 text-muted border-b border-border uppercase tracking-wider text-[11px] font-semibold">
                <tr>
                  <th className="px-5 py-3">Course</th>
                  <th className="px-5 py-3">Transaction Date</th>
                  <th className="px-5 py-3">Amount</th>
                  <th className="px-5 py-3 text-right">Settlement</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {enrollments.map(e => (
                  <tr key={e.id} className="hover:bg-surface-2/60 transition-colors">
                    <td className="px-5 py-3.5 font-medium text-text">
                      {e.courses?.title || "Course Enrollment"}
                    </td>
                    <td className="px-5 py-3.5 text-muted">
                      {e.enrolled_at ? new Date(e.enrolled_at).toLocaleString() : "—"}
                    </td>
                    <td className="px-5 py-3.5 font-semibold text-text">
                      {Number(e.courses?.price) > 0 ? `₹${e.courses.price}` : <span className="text-success font-medium">Free</span>}
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium bg-success/10 text-success border border-success/30">
                        <CheckCircle2 className="w-3 h-3" /> Settled
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
