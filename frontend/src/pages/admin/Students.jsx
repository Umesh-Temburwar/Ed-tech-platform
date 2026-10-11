import React, { useEffect, useState } from "react";
import { supabase } from "../../config/supabaseClient";
import {
  Search,
  Plus,
  MoreVertical,
  Edit2,
  Trash2,
  Eye,
  ShieldOff,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  User
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import Modal from "../../components/ui/Modal";
import Button from "../../components/ui/Button";

export default function AdminStudents() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Modals state
  const [viewStudent, setViewStudent] = useState(null);
  const [viewStudentEnrollments, setViewStudentEnrollments] = useState([]);
  const [isViewLoading, setIsViewLoading] = useState(false);
  
  const [showAddModal, setShowAddModal] = useState(false);
  const [studentToDelete, setStudentToDelete] = useState(null);

  // Fetch Students
  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .ilike("account_type", "%Student%")
        .order("created_at", { ascending: false });

      if (error) throw error;
      
      // Simulate an is_active field for UI purposes if it doesn't exist
      const enrichedData = (data || []).map(s => ({
        ...s,
        is_active: s.is_active !== undefined ? s.is_active : true
      }));

      setStudents(enrichedData);
    } catch (err) {
      console.error("Error fetching students:", err);
      toast.error("Failed to load students");
    } finally {
      setLoading(false);
    }
  };

  // Add Student Mock
  const handleAddStudent = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const newStudent = {
      id: `mock-id-${Date.now()}`,
      first_name: formData.get("firstName"),
      last_name: formData.get("lastName"),
      email: formData.get("email"),
      account_type: "Student",
      is_active: true,
      created_at: new Date().toISOString(),
    };

    setStudents([newStudent, ...students]);
    setShowAddModal(false);
    toast.success("Student added successfully (Simulated)");
    toast(
      "Note: Real account creation requires a backend Edge Function with the Supabase Admin API.",
      { icon: "ℹ️", duration: 5000 }
    );
  };

  // Delete Student
  const handleDeleteStudent = async () => {
    if (!studentToDelete) return;
    
    // Remove from local state
    setStudents(students.filter((s) => s.id !== studentToDelete.id));
    setStudentToDelete(null);
    toast.success("Student deleted successfully (Simulated)");
    toast(
      "Note: Real auth deletion requires a backend Edge Function.",
      { icon: "ℹ️", duration: 5000 }
    );
  };

  // Toggle Suspend
  const handleToggleSuspend = (studentId) => {
    setStudents(
      students.map((s) =>
        s.id === studentId ? { ...s, is_active: !s.is_active } : s
      )
    );
    toast.success("Student status updated (Simulated)");
  };

  // View Student Details
  const handleViewStudent = async (student) => {
    setViewStudent(student);
    setIsViewLoading(true);
    try {
      const { data, error } = await supabase
        .from("course_enrollments")
        .select("id, enrolled_at, progress, courses(title, thumbnail)")
        .eq("student_id", student.id);
        
      if (error) throw error;
      setViewStudentEnrollments(data || []);
    } catch (err) {
      console.error("Error fetching enrollments:", err);
      toast.error("Failed to load student enrollments");
    } finally {
      setIsViewLoading(false);
    }
  };

  // Pagination & Filtering
  const filteredStudents = students.filter((s) => {
    const fullName = `${s.first_name || ""} ${s.last_name || ""}`.toLowerCase();
    const email = (s.email || "").toLowerCase();
    const q = search.toLowerCase();
    return fullName.includes(q) || email.includes(q);
  });

  const totalPages = Math.ceil(filteredStudents.length / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentStudents = filteredStudents.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  return (
    <div className="space-y-6 pb-10">
      {/* ── Header ──────────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
            Students
          </h1>
          <p className="text-slate-400 mt-1 text-sm md:text-base">
            Manage student accounts and enrollments
          </p>
        </div>
        <Button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Student
        </Button>
      </div>

      {/* ── Controls (Search) ───────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 glass-dark p-4 rounded-2xl border border-white/5">
        <div className="relative w-full sm:max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search students by name or email..."
            className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 transition-all"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1); // Reset page on search
            }}
          />
        </div>
        <div className="text-sm text-slate-400 font-medium">
          Total: <span className="text-white">{filteredStudents.length}</span>
        </div>
      </div>

      {/* ── Data Table ──────────────────────────────────────────────────── */}
      <div className="glass-dark rounded-2xl border border-white/5 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-white/5 text-slate-300 font-semibold border-b border-white/10">
              <tr>
                <th className="px-6 py-4">Student</th>
                <th className="px-6 py-4">Email</th>
                <th className="px-6 py-4">Joined</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-slate-400">
              {loading ? (
                // Skeleton Rows
                [...Array(5)].map((_, idx) => (
                  <tr key={idx}>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-white/5 animate-pulse" />
                        <div className="h-4 w-24 bg-white/5 rounded animate-pulse" />
                      </div>
                    </td>
                    <td className="px-6 py-4"><div className="h-4 w-32 bg-white/5 rounded animate-pulse" /></td>
                    <td className="px-6 py-4"><div className="h-4 w-20 bg-white/5 rounded animate-pulse" /></td>
                    <td className="px-6 py-4"><div className="h-6 w-16 bg-white/5 rounded-full animate-pulse" /></td>
                    <td className="px-6 py-4"><div className="h-8 w-8 ml-auto bg-white/5 rounded-lg animate-pulse" /></td>
                  </tr>
                ))
              ) : currentStudents.length > 0 ? (
                currentStudents.map((student) => {
                  const fullName = `${student.first_name || ""} ${student.last_name || ""}`.trim() || "N/A";
                  return (
                    <tr key={student.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={student.image || student.avatar_url || `https://api.dicebear.com/7.x/initials/svg?seed=${fullName}&backgroundColor=0ea5e9`}
                            alt="avatar"
                            className="w-8 h-8 rounded-full object-cover border border-white/10"
                          />
                          <span className="font-semibold text-white">{fullName}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">{student.email}</td>
                      <td className="px-6 py-4">
                        {new Date(student.created_at).toLocaleDateString("en-US", {
                          month: "short", day: "numeric", year: "numeric"
                        })}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold border ${
                          student.is_active 
                            ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" 
                            : "bg-red-500/10 text-red-400 border-red-500/20"
                        }`}>
                          {student.is_active ? "Active" : "Suspended"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleViewStudent(student)}
                            className="p-2 text-slate-400 hover:text-cyan-400 hover:bg-cyan-500/10 rounded-lg transition-colors tooltip-trigger"
                            title="View Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleToggleSuspend(student.id)}
                            className={`p-2 rounded-lg transition-colors ${
                              student.is_active 
                                ? "text-slate-400 hover:text-amber-400 hover:bg-amber-500/10" 
                                : "text-amber-400 bg-amber-500/10 hover:bg-amber-500/20 hover:text-amber-300"
                            }`}
                            title={student.is_active ? "Suspend Student" : "Activate Student"}
                          >
                            {student.is_active ? <ShieldOff className="w-4 h-4" /> : <ShieldCheck className="w-4 h-4" />}
                          </button>
                          <button
                            onClick={() => setStudentToDelete(student)}
                            className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                            title="Delete Student"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-slate-400">
                    <User className="w-12 h-12 mx-auto text-slate-600 mb-3" />
                    <p className="text-lg font-medium text-white">No students found</p>
                    <p className="text-sm mt-1">Try adjusting your search criteria</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* ── Pagination ────────────────────────────────────────────────── */}
        {!loading && filteredStudents.length > 0 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-white/10 bg-white/5">
            <div className="text-sm text-slate-400">
              Showing <span className="text-white font-medium">{startIndex + 1}</span> to <span className="text-white font-medium">{Math.min(startIndex + itemsPerPage, filteredStudents.length)}</span> of <span className="text-white font-medium">{filteredStudents.length}</span> results
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-2 rounded-lg bg-white/5 text-slate-300 hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <div className="flex items-center gap-1">
                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`w-8 h-8 rounded-lg text-sm font-semibold transition-colors ${
                      currentPage === i + 1 
                        ? "bg-cyan-500 text-white" 
                        : "bg-transparent text-slate-400 hover:bg-white/10"
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="p-2 rounded-lg bg-white/5 text-slate-300 hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ── Modals ──────────────────────────────────────────────────────── */}
      
      {/* View Student Modal */}
      <Modal isOpen={!!viewStudent} onClose={() => setViewStudent(null)} title="Student Details" size="large">
        {viewStudent && (
          <div className="p-6">
            <div className="flex items-center gap-4 mb-8">
              <img
                src={viewStudent.image || viewStudent.avatar_url || `https://api.dicebear.com/7.x/initials/svg?seed=${viewStudent.first_name}&backgroundColor=0ea5e9`}
                alt="avatar"
                className="w-16 h-16 rounded-full object-cover border-2 border-white/10"
              />
              <div>
                <h3 className="text-xl font-bold text-white">{viewStudent.first_name} {viewStudent.last_name}</h3>
                <p className="text-sm text-slate-400">{viewStudent.email}</p>
                <p className="text-xs text-slate-500 mt-1">
                  Joined {new Date(viewStudent.created_at).toLocaleDateString()}
                </p>
              </div>
            </div>

            <h4 className="text-lg font-semibold text-white mb-4 border-b border-white/10 pb-2">Enrolled Courses</h4>
            {isViewLoading ? (
              <div className="flex justify-center py-8">
                <div className="w-6 h-6 border-2 border-white/20 border-t-cyan-400 rounded-full animate-spin" />
              </div>
            ) : viewStudentEnrollments.length > 0 ? (
              <div className="grid gap-3">
                {viewStudentEnrollments.map((env) => (
                  <div key={env.id} className="flex items-center gap-4 p-3 rounded-xl bg-white/5 border border-white/10">
                    <img 
                      src={env.courses?.thumbnail || "https://placehold.co/100x60/2a2a2a/ffffff?text=Course"} 
                      alt="course"
                      className="w-16 h-10 rounded-lg object-cover bg-black"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-white truncate">{env.courses?.title}</p>
                      <p className="text-xs text-slate-400">Enrolled on {new Date(env.enrolled_at).toLocaleDateString()}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-sm font-bold text-cyan-400">{env.progress}%</p>
                      <p className="text-[10px] text-slate-500 uppercase tracking-wide">Progress</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-slate-400 text-sm py-4">No enrolled courses found.</p>
            )}
          </div>
        )}
      </Modal>

      {/* Add Student Modal */}
      <Modal isOpen={showAddModal} onClose={() => setShowAddModal(false)} title="Add New Student">
        <form onSubmit={handleAddStudent} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">First Name</label>
              <input required name="firstName" type="text" className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-cyan-500/50" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Last Name</label>
              <input required name="lastName" type="text" className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-cyan-500/50" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Email Address</label>
            <input required name="email" type="email" className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-cyan-500/50" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Initial Password</label>
            <input required name="password" type="password" className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-cyan-500/50" />
          </div>
          <div className="pt-4 flex justify-end gap-3">
            <Button variant="ghost" type="button" onClick={() => setShowAddModal(false)}>Cancel</Button>
            <Button type="submit">Create Student</Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal isOpen={!!studentToDelete} onClose={() => setStudentToDelete(null)} title="Confirm Deletion">
        {studentToDelete && (
          <div className="p-6 text-center">
            <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-4 border border-red-500/20">
              <Trash2 className="w-8 h-8 text-red-400" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Delete Student?</h3>
            <p className="text-slate-400 mb-6">
              Are you sure you want to delete <span className="font-semibold text-white">{studentToDelete.first_name} {studentToDelete.last_name}</span>? 
              This action cannot be undone.
            </p>
            <div className="flex justify-center gap-3">
              <Button variant="ghost" onClick={() => setStudentToDelete(null)}>Cancel</Button>
              <Button variant="danger" onClick={handleDeleteStudent}>Yes, Delete</Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
