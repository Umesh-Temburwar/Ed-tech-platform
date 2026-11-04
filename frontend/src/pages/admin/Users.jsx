import React, { useEffect, useState } from "react";
import { apiConnector } from "../../services/apiconnector";
import { adminEndpoints } from "../../services/apis";
import { Badge } from "../../components/dashboard/Common";

export default function AdminUsers() {
  const [role, setRole] = useState("all");
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async (r = role) => {
    setLoading(true);
    try {
      const res = await apiConnector("GET", `${adminEndpoints.USERS}?role=${r}`);
      setRows(res.data.users || []);
    } catch (e) {
      console.error(e);
      setRows([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const toggleBan = async (id) => {
    await apiConnector("PATCH", adminEndpoints.BAN_USER.replace(":id", id));
    load();
  };

  const remove = async (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      await apiConnector("DELETE", adminEndpoints.DELETE_USER.replace(":id", id));
      load();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-text tracking-tight">User Registry</h1>
          <p className="text-xs text-muted mt-0.5">Manage student, faculty, and administrator platform accounts</p>
        </div>
        <div className="flex items-center gap-3">
          <select 
            className="input-field text-xs py-1.5" 
            value={role} 
            onChange={(e) => { setRole(e.target.value); load(e.target.value); }}
          >
            <option value="all">All Roles</option>
            <option value="student">Students</option>
            <option value="instructor">Instructors</option>
            <option value="admin">Administrators</option>
          </select>
        </div>
      </div>

      <div className="bg-surface border border-border rounded-xl shadow-sm overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="bg-surface-2 border-b border-border text-muted">
            <tr>
              <th className="px-4 py-3 font-semibold">User Name</th>
              <th className="px-4 py-3 font-semibold">Email Address</th>
              <th className="px-4 py-3 font-semibold">Role</th>
              <th className="px-4 py-3 font-semibold">Status</th>
              <th className="px-4 py-3 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {loading ? (
              <tr>
                <td className="px-4 py-8 text-center text-muted" colSpan="5">
                  <div className="w-5 h-5 border-2 border-border border-t-text rounded-full animate-spin mx-auto mb-2" />
                  Loading accounts...
                </td>
              </tr>
            ) : rows.length === 0 ? (
              <tr>
                <td className="px-4 py-8 text-center text-muted" colSpan="5">
                  No accounts found for selected role.
                </td>
              </tr>
            ) : rows.map(u => (
              <tr key={u.id} className="hover:bg-surface-2 transition-colors">
                <td className="px-4 py-3 font-medium text-text">{u.name || "-"}</td>
                <td className="px-4 py-3 text-muted">{u.email}</td>
                <td className="px-4 py-3">
                  <Badge 
                    text={u.role || "user"} 
                    color={u.role === "admin" ? "purple" : u.role === "instructor" ? "amber" : "indigo"} 
                  />
                </td>
                <td className="px-4 py-3">
                  <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-medium border ${
                    u.banned 
                      ? 'bg-danger/10 border-danger/20 text-danger' 
                      : 'bg-success/10 border-success/20 text-success'
                  }`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${u.banned ? 'bg-danger' : 'bg-success'}`} />
                    <span>{u.banned ? "Suspended" : "Active"}</span>
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button 
                      onClick={() => toggleBan(u.id)} 
                      className="btn-secondary py-1 px-2.5 rounded text-xs"
                    >
                      {u.banned ? "Reinstate" : "Suspend"}
                    </button>
                    <button 
                      onClick={() => remove(u.id)} 
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
