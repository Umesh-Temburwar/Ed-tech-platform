import React, { useEffect, useState } from "react"
import { apiConnector } from "../../services/apiconnector"
import { adminEndpoints } from "../../services/apis"
import { supabase } from "../../config/supabaseClient"
import toast from "react-hot-toast"

export default function AdminCourses() {
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(null)
  const [title, setTitle] = useState("")

  const load = async () => {
    setLoading(true)
    try {
      const res = await apiConnector("GET", adminEndpoints.COURSES)
      if (res?.data?.courses) {
        setRows(res.data.courses)
        return
      }
    } catch (err) {
      console.warn("Backend API unavailable, falling back to Supabase client:", err.message)
    }

    try {
      const { data, error } = await supabase
        .from("courses")
        .select("id, title, status, instructor:instructor_id(first_name, last_name)")
        .order("created_at", { ascending: false })

      if (!error && data) {
        setRows(data.map((c) => ({
          id: c.id,
          title: c.title,
          status: c.status,
          instructor: c.instructor ? `${c.instructor.first_name || ""} ${c.instructor.last_name || ""}`.trim() : "-"
        })))
      } else {
        setRows([])
      }
    } catch (err) {
      console.error("Error fetching courses from Supabase:", err)
      setRows([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  const approve = async (id) => {
    try {
      await apiConnector("PATCH", adminEndpoints.APPROVE_COURSE.replace(":id", id))
      toast.success("Course approved")
    } catch {
      const { error } = await supabase.from("courses").update({ status: "approved" }).eq("id", id)
      if (error) toast.error("Failed to approve course")
      else toast.success("Course approved")
    }
    load()
  }

  const remove = async (id) => {
    if (!window.confirm("Are you sure you want to delete this course?")) return
    try {
      await apiConnector("DELETE", adminEndpoints.DELETE_COURSE.replace(":id", id))
      toast.success("Course deleted")
    } catch {
      const { error } = await supabase.from("courses").delete().eq("id", id)
      if (error) toast.error("Failed to delete course")
      else toast.success("Course deleted")
    }
    load()
  }

  const startEdit = (c) => { setEditing(c.id); setTitle(c.title) }

  const saveEdit = async (id) => {
    try {
      await apiConnector("PATCH", adminEndpoints.EDIT_COURSE.replace(":id", id), { title })
      toast.success("Course updated")
    } catch {
      const { error } = await supabase.from("courses").update({ title }).eq("id", id)
      if (error) toast.error("Failed to update course")
      else toast.success("Course updated")
    }
    setEditing(null)
    load()
  }

  return (
    <div>
      <h1 className="text-3xl font-bold">Courses</h1>
      <div className="mt-6 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-white/10">
            <tr>
              <th className="px-4 py-3 text-sm">Title</th>
              <th className="px-4 py-3 text-sm">Instructor</th>
              <th className="px-4 py-3 text-sm">Status</th>
              <th className="px-4 py-3 text-sm"></th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td className="px-4 py-6 text-sm text-richblack-300" colSpan="4">Loading...</td></tr>
            ) : rows.length === 0 ? (
              <tr><td className="px-4 py-6 text-sm text-richblack-300" colSpan="4">No courses</td></tr>
            ) : rows.map(c=>(
              <tr key={c.id} className="border-t border-white/10">
                <td className="px-4 py-3">
                  {editing===c.id ? (
                    <input className="bg-white/10 border border-white/10 rounded-lg px-3 py-1" value={title} onChange={(e)=>setTitle(e.target.value)} />
                  ) : c.title}
                </td>
                <td className="px-4 py-3">{c.instructor || "-"}</td>
                <td className="px-4 py-3 capitalize">{c.status}</td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    {c.status!=="approved" && <button onClick={()=>approve(c.id)} className="px-3 py-2 rounded-lg bg-yellow-400 text-black text-sm">Approve</button>}
                    {editing===c.id ? (
                      <button onClick={()=>saveEdit(c.id)} className="px-3 py-2 rounded-lg bg-white/10 border border-white/15 text-sm">Save</button>
                    ) : (
                      <button onClick={()=>startEdit(c)} className="px-3 py-2 rounded-lg bg-white/10 border border-white/15 text-sm">Edit</button>
                    )}
                    <button onClick={()=>remove(c.id)} className="px-3 py-2 rounded-lg bg-white/10 border border-white/15 text-sm">Delete</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
