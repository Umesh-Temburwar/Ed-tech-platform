import React, { useEffect, useState } from "react";
import { supabase } from "../../config/supabaseClient";
import {
  Search,
  Plus,
  Trash2,
  Eye,
  ShieldOff,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  User
} from "lucide-react";
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

  const handleAddStudent = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const newStudent = {
      id: `student-${Date.now()}`,
      first_name: formData.get("firstName"),
      last_name: formData.get("lastName"),
      email: formData.get("email"),
      account_type: "Student",
      is_active: true,
      created_at: new Date().toISOString(),
    };

    setStudents([newStudent, ...students]);
    setShowAddModal(false);
    toast.success("Student added successfully");
  };

  const handleDeleteStudent = async () => {
    if (!studentToDelete) return;
    setStudents(students.filter((s) => s.id !== studentToDelete.id));
    setStudentToDelete(null);
    toast.success("Student account removed");
  };

  const handleToggleSuspend = (studentId) => {
    setStudents(
      students.map((s) =>
        s.id === studentId ? { ...s, is_active: !s.is_active } : s
      )
    );
    toast.success("Student access status updated");
  };

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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-surface p-6 rounded-xl border border-border">
        <div>
          <h1 className="text-2xl font-bold text-text">
            Students
          </h1>
          <p className="text-muted text-xs mt-1">
            Manage student records, access permissions, and curriculum progress.
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-hot text-white rounded-md text-xs font-semibold hover:bg-[#e5482a] transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          Add Student
        </button>
      </div>

      {/* ── Controls (Search) ───────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-surface p-4 rounded-xl border border-border">
        <div className="relative w-full sm:max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
          <input
            type="text"
            placeholder="Search students by name or email..."
            className="w-full pl-9 pr-3 py-2 bg-surface-2 border border-border rounded-md text-xs text-text placeholder:text-muted focus:outline-none focus:border-accent transition-colors"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>
        <div className="text-xs text-muted font-medium">
          Total students: <span className="text-text font-semibold">{filteredStudents.length}</span>
        </div>
      </div>

      {/* ── Data Table ──────────────────────────────────────────────────── */}
      <div className="rounded-xl border border-border bg-surface overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs whitespace-nowrap">
            <thead className="bg-surface-2 text-muted font-semibold border-b border-border uppercase tracking-wider text-[11px]">
              <tr>
                <th className="px-5 py-3">Student</th>
                <th className="px-5 py-3">Email</th>
                <th className="px-5 py-3">Joined</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border text-muted">
              {loading ? (
                [...Array(5)].map((_, idx) => (
                  <tr key={idx}>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-full bg-surface-2 animate-pulse" />
                        <div className="h-3.5 w-24 bg-surface-2 rounded animate-pulse" />
                      </div>
                    </td>
                    <td className="px-5 py-3.5"><div className="h-3.5 w-32 bg-surface-2 rounded animate-pulse" /></td>
                    <td className="px-5 py-3.5"><div className="h-3.5 w-20 bg-surface-2 rounded animate-pulse" /></td>
                    <td className="px-5 py-3.5"><div className="h-5 w-14 bg-surface-2 rounded-full animate-pulse" /></td>
                    <td className="px-5 py-3.5"><div className="h-7 w-7 ml-auto bg-surface-2 rounded animate-pulse" /></td>
                  </tr>
                ))
              ) : currentStudents.length > 0 ? (
                currentStudents.map((student) => {
                  const fullName = `${student.first_name || ""} ${student.last_name || ""}`.trim() || "Student";
                  return (
                    <tr key={student.id} className="hover:bg-surface-2/60 transition-colors">
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-2.5">
                          <img
                            src={student.image || student.avatar_url || `https://api.dicebear.com/7.x/initials/svg?seed=${fullName}&backgroundColor=0ea5e9`}
                            alt="avatar"
                            className="w-7 h-7 rounded-full object-cover border border-border"
                          />
                          <span className="font-semibold text-text">{fullName}</span>
                        </div>
                      </td>
                      <td className="px-5 py-3.5 text-muted">{student.email}</td>
                      <td className="px-5 py-3.5 text-muted">
                        {student.created_at ? new Date(student.created_at).toLocaleDateString("en-US", {
                          month: "short", day: "numeric", year: "numeric"
                        }) : "—"}
                      </td>
                      <td className="px-5 py-3.5">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium border ${
                          student.is_active 
                            ? "bg-success/10 text-success border-success/30" 
                            : "bg-danger/10 text-danger border-danger/30"
                        }`}>
                          {student.is_active ? "Active" : "Suspended"}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleViewStudent(student)}
                            className="p-1.5 text-muted hover:text-text hover:bg-surface-2 border border-border rounded transition-colors"
                            title="View Details"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleToggleSuspend(student.id)}
                            className={`p-1.5 rounded border border-border transition-colors ${
                              student.is_active 
                                ? "text-muted hover:text-warning hover:bg-warning/10" 
                                : "text-warning bg-warning/10"
                            }`}
                            title={student.is_active ? "Suspend Student" : "Activate Student"}
                          >
                            {student.is_active ? <ShieldOff className="w-3.5 h-3.5" /> : <ShieldCheck className="w-3.5 h-3.5 text-success" />}
                          </button>
                          <button
                            onClick={() => setStudentToDelete(student)}
                            className="p-1.5 text-muted hover:text-danger hover:bg-danger/10 border border-border rounded transition-colors"
                            title="Delete Student"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="5" className="px-5 py-10 text-center text-muted">
                    <User className="w-10 h-10 mx-auto text-muted mb-2 opacity-50" />
                    <p className="text-sm font-semibold text-text">No students found</p>
                    <p className="text-xs mt-0.5">Try adjusting your search criteria</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* ── Pagination ────────────────────────────────────────────────── */}
        {!loading && filteredStudents.length > 0 && (
          <div className="flex items-center justify-between px-5 py-3 border-t border-border bg-surface-2">
            <div className="text-xs text-muted">
              Showing <span className="text-text font-medium">{startIndex + 1}</span> to <span className="text-text font-medium">{Math.min(startIndex + itemsPerPage, filteredStudents.length)}</span> of <span className="text-text font-medium">{filteredStudents.length}</span> students
            </div>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-1.5 rounded bg-surface border border-border text-muted hover:text-text disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
              <div className="flex items-center gap-1">
                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`w-7 h-7 rounded text-xs font-medium transition-colors ${
                      currentPage === i + 1 
                        ? "bg-accent text-white" 
                        : "text-muted hover:text-text hover:bg-surface border border-border"
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="p-1.5 rounded bg-surface border border-border text-muted hover:text-text disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ── Modals ──────────────────────────────────────────────────────── */}
      
      {/* View Student Modal */}
      <Modal isOpen={!!viewStudent} onClose={() => setViewStudent(null)} title="Student Profile" size="large">
        {viewStudent && (
          <div className="p-5 space-y-5">
            <div className="flex items-center gap-3.5 pb-4 border-b border-border">
              <img
                src={viewStudent.image || viewStudent.avatar_url || `https://api.dicebear.com/7.x/initials/svg?seed=${viewStudent.first_name}&backgroundColor=0ea5e9`}
                alt="avatar"
                className="w-12 h-12 rounded-full object-cover border border-border"
              />
              <div>
                <h3 className="text-base font-bold text-text">{viewStudent.first_name} {viewStudent.last_name}</h3>
                <p className="text-xs text-muted">{viewStudent.email}</p>
                <p className="text-[11px] text-muted mt-0.5">
                  Joined: {new Date(viewStudent.created_at).toLocaleDateString()}
                </p>
              </div>
            </div>

            <div>
              <h4 className="text-xs font-semibold text-text uppercase tracking-wider mb-3">Enrolled Courses</h4>
              {isViewLoading ? (
                <div className="flex justify-center py-6 text-muted text-xs">
                  Loading enrollments...
                </div>
              ) : viewStudentEnrollments.length > 0 ? (
                <div className="grid gap-2.5">
                  {viewStudentEnrollments.map((env) => (
                    <div key={env.id} className="flex items-center gap-3 p-2.5 rounded-lg bg-surface-2 border border-border">
                      <div className="w-14 aspect-video rounded overflow-hidden bg-surface border border-border shrink-0">
                        {env.courses?.thumbnail ? (
                          <img src={env.courses.thumbnail} alt="course" className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-muted text-[10px]">Course</div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-text truncate">{env.courses?.title}</p>
                        <p className="text-[10px] text-muted">Enrolled on {new Date(env.enrolled_at).toLocaleDateString()}</p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-xs font-bold text-accent">{env.progress}%</p>
                        <p className="text-[9px] text-muted uppercase">Progress</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted text-xs py-3 text-center">No enrolled courses on record.</p>
              )}
            </div>
          </div>
        )}
      </Modal>

      {/* Add Student Modal */}
      <Modal isOpen={showAddModal} onClose={() => setShowAddModal(false)} title="Add Student Account">
        <form onSubmit={handleAddStudent} className="p-5 space-y-3.5">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="block text-xs font-semibold text-text">First Name</label>
              <input required name="firstName" type="text" className="w-full px-3 py-1.5 text-xs bg-surface-2 border border-border rounded-md text-text focus:outline-none focus:border-accent" />
            </div>
            <div className="space-y-1">
              <label className="block text-xs font-semibold text-text">Last Name</label>
              <input required name="lastName" type="text" className="w-full px-3 py-1.5 text-xs bg-surface-2 border border-border rounded-md text-text focus:outline-none focus:border-accent" />
            </div>
          </div>
          <div className="space-y-1">
            <label className="block text-xs font-semibold text-text">Email Address</label>
            <input required name="email" type="email" className="w-full px-3 py-1.5 text-xs bg-surface-2 border border-border rounded-md text-text focus:outline-none focus:border-accent" />
          </div>
          <div className="space-y-1">
            <label className="block text-xs font-semibold text-text">Temporary Password</label>
            <input required name="password" type="password" className="w-full px-3 py-1.5 text-xs bg-surface-2 border border-border rounded-md text-text focus:outline-none focus:border-accent" />
          </div>
          <div className="pt-3 flex justify-end gap-2 border-t border-border">
            <button type="button" onClick={() => setShowAddModal(false)} className="px-3 py-1.5 text-xs rounded-md bg-surface-2 border border-border text-muted hover:text-text font-medium">Cancel</button>
            <button type="submit" className="px-4 py-1.5 text-xs rounded-md bg-hot text-white font-semibold hover:bg-[#e5482a]">Create Student</button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal isOpen={!!studentToDelete} onClose={() => setStudentToDelete(null)} title="Confirm Account Removal">
        {studentToDelete && (
          <div className="p-5 text-center">
            <div className="w-12 h-12 rounded-xl bg-danger/10 border border-danger/20 flex items-center justify-center mx-auto mb-3">
              <Trash2 className="w-6 h-6 text-danger" />
            </div>
            <h3 className="text-base font-bold text-text mb-1">Remove Student Account</h3>
            <p className="text-muted text-xs mb-5">
              Are you sure you want to remove <span className="font-semibold text-text">{studentToDelete.first_name} {studentToDelete.last_name}</span>?
            </p>
            <div className="flex justify-center gap-2">
              <button onClick={() => setStudentToDelete(null)} className="px-4 py-2 text-xs rounded-md bg-surface-2 border border-border text-muted hover:text-text font-medium">Cancel</button>
              <button onClick={handleDeleteStudent} className="px-4 py-2 text-xs rounded-md bg-danger text-white font-semibold hover:bg-[#e03131]">Delete Account</button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
