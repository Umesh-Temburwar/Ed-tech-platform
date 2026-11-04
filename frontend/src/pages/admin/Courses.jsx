import React, { useEffect, useState } from "react";
import { apiConnector } from "../../services/apiconnector";
import { adminEndpoints } from "../../services/apis";
import { supabase } from "../../config/supabaseClient";
import toast from "react-hot-toast";
import { Badge } from "../../components/dashboard/Common";

export default function AdminCourses() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [title, setTitle] = useState("");

  const load = async () => {
    setLoading(true);
    try {
      const res = await apiConnector("GET", adminEndpoints.COURSES);
      if (res?.data?.courses) {
        setRows(res.data.courses);
        return;
      }
    } catch (err) {
      console.warn("Backend API unavailable, falling back to Supabase client:", err.message);
    }

    try {
      const { data, error } = await supabase
        .from("courses")
        .select("id, title, status, instructor:instructor_id(first_name, last_name)")
        .order("created_at", { ascending: false });

      if (!error && data) {
        setRows(data.map((c) => ({
          id: c.id,
          title: c.title,
          status: c.status,
          instructor: c.instructor ? `${c.instructor.first_name || ""} ${c.instructor.last_name || ""}`.trim() : "-"
        })));
      } else {
        setRows([]);
      }
    } catch (err) {
      console.error("Error fetching courses from Supabase:", err);
      setRows([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const approve = async (id) => {
    try {
      await apiConnector("PATCH", adminEndpoints.APPROVE_COURSE.replace(":id", id));
      toast.success("Course approved");
    } catch {
      const { error } = await supabase.from("courses").update({ status: "approved" }).eq("id", id);
      if (error) toast.error("Failed to approve course");
      else toast.success("Course approved");
    }
    load();
  };

  const remove = async (id) => {
    if (!window.confirm("Are you sure you want to delete this course?")) return;
    try {
      await apiConnector("DELETE", adminEndpoints.DELETE_COURSE.replace(":id", id));
      toast.success("Course deleted");
    } catch {
      const { error } = await supabase.from("courses").delete().eq("id", id);
      if (error) toast.error("Failed to delete course");
      else toast.success("Course deleted");
    }
    load();
  };

  const startEdit = (c) => { setEditing(c.id); setTitle(c.title); };

  const saveEdit = async (id) => {
    try {
      await apiConnector("PATCH", adminEndpoints.EDIT_COURSE.replace(":id", id), { title });
      toast.success("Course updated");
    } catch {
      const { error } = await supabase.from("courses").update({ title }).eq("id", id);
      if (error) toast.error("Failed to update course");
      else toast.success("Course updated");
    }
    setEditing(null);
    load();
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-text tracking-tight">Course Catalog Approvals</h1>
        <p className="text-xs text-muted mt-0.5">Review, moderate, and publish faculty course submissions</p>
      </div>

      <div className="bg-surface border border-border rounded-xl shadow-sm overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="bg-surface-2 border-b border-border text-muted">
            <tr>
              <th className="px-4 py-3 font-semibold">Course Title</th>
              <th className="px-4 py-3 font-semibold">Lead Instructor</th>
              <th className="px-4 py-3 font-semibold">Status</th>
              <th className="px-4 py-3 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {loading ? (
              <tr>
                <td className="px-4 py-8 text-center text-muted" colSpan="4">
                  <div className="w-5 h-5 border-2 border-border border-t-text rounded-full animate-spin mx-auto mb-2" />
                  Loading courses...
                </td>
              </tr>
            ) : rows.length === 0 ? (
              <tr>
                <td className="px-4 py-8 text-center text-muted" colSpan="4">
                  No courses in catalog.
                </td>
              </tr>
            ) : rows.map(c => (
              <tr key={c.id} className="hover:bg-surface-2 transition-colors">
                <td className="px-4 py-3 font-medium text-text">
                  {editing === c.id ? (
                    <input 
                      className="input-field py-1 text-xs" 
                      value={title} 
                      onChange={(e) => setTitle(e.target.value)} 
                    />
                  ) : (
                    c.title
                  )}
                </td>
                <td className="px-4 py-3 text-muted">{c.instructor || "-"}</td>
                <td className="px-4 py-3">
                  <Badge 
                    text={c.status || "draft"} 
                    color={c.status === "approved" || c.status === "published" ? "emerald" : "amber"} 
                  />
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="flex items-center justify-end gap-2">
                    {c.status !== "approved" && (
                      <button 
                        onClick={() => approve(c.id)} 
                        className="btn-primary py-1 px-2.5 rounded text-xs font-semibold"
                      >
                        Approve
                      </button>
                    )}
                    {editing === c.id ? (
                      <button 
                        onClick={() => saveEdit(c.id)} 
                        className="btn-secondary py-1 px-2.5 rounded text-xs"
                      >
                        Save
                      </button>
                    ) : (
                      <button 
                        onClick={() => startEdit(c)} 
                        className="btn-secondary py-1 px-2.5 rounded text-xs"
                      >
                        Edit
                      </button>
                    )}
                    <button 
                      onClick={() => remove(c.id)} 
                      className="px-2.5 py-1 rounded text-xs text-danger hover:bg-danger/10 border border-transparent hover:border-danger/20 transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
