import React, { useEffect, useState } from "react";
import { supabase } from "../../config/supabaseClient";
import { Users, Search, BookOpen, CheckCircle } from "lucide-react";

export default function AdminInstructors() {
  const [instructors, setInstructors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    async function fetchInstructors() {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from("profiles")
          .select("*")
          .ilike("account_type", "%Instructor%")
          .order("created_at", { ascending: false });

        if (!error && data) {
          setInstructors(data);
        }
      } catch (err) {
        console.error("Error fetching instructors:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchInstructors();
  }, []);

  const filtered = instructors.filter(i => {
    const q = search.toLowerCase();
    const name = `${i.first_name || ""} ${i.last_name || ""}`.toLowerCase();
    return name.includes(q) || (i.email || "").toLowerCase().includes(q);
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 bg-surface p-6 rounded-xl border border-border">
        <div>
          <h1 className="text-2xl font-bold text-text">Instructors</h1>
          <p className="text-xs text-muted mt-1">Manage verified faculty, onboarding status, and assigned courses.</p>
        </div>
        <div className="text-xs text-muted font-medium">
          Total instructors: <span className="font-semibold text-text">{instructors.length}</span>
        </div>
      </div>

      <div className="flex items-center gap-3 bg-surface p-3.5 rounded-xl border border-border">
        <Search className="w-4 h-4 text-muted" />
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Filter by name or email address..."
          className="w-full bg-transparent text-xs text-text outline-none placeholder:text-muted"
        />
        {search && (
          <button onClick={() => setSearch("")} className="text-xs text-muted hover:text-text font-medium">
            Clear
          </button>
        )}
      </div>

      <div className="rounded-xl border border-border bg-surface overflow-hidden">
        {loading ? (
          <div className="py-12 text-center text-xs text-muted">Loading instructors...</div>
        ) : filtered.length === 0 ? (
          <div className="py-12 text-center text-xs text-muted">No instructors found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-surface-2 text-muted border-b border-border uppercase tracking-wider text-[11px] font-semibold">
                <tr>
                  <th className="px-5 py-3">Instructor</th>
                  <th className="px-5 py-3">Email</th>
                  <th className="px-5 py-3">Joined</th>
                  <th className="px-5 py-3 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filtered.map(inst => {
                  const name = `${inst.first_name || ""} ${inst.last_name || ""}`.trim() || "Instructor";
                  return (
                    <tr key={inst.id} className="hover:bg-surface-2/60 transition-colors">
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-full bg-surface-2 border border-border flex items-center justify-center text-xs font-semibold text-text">
                            {name.charAt(0)}
                          </div>
                          <span className="font-medium text-text">{name}</span>
                        </div>
                      </td>
                      <td className="px-5 py-3.5 text-muted">{inst.email}</td>
                      <td className="px-5 py-3.5 text-muted">
                        {inst.created_at ? new Date(inst.created_at).toLocaleDateString() : "—"}
                      </td>
                      <td className="px-5 py-3.5 text-right">
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-success/10 text-success border border-success/30">
                          Active
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
