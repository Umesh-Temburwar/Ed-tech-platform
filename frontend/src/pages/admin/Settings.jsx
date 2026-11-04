import React from "react";
import { Settings, Shield, Bell, Database } from "lucide-react";

export default function AdminSettings() {
  return (
    <div className="space-y-6">
      <div className="bg-surface p-6 rounded-xl border border-border">
        <h1 className="text-2xl font-bold text-text">System Settings</h1>
        <p className="text-xs text-muted mt-1">Configure global application parameters, notification policies, and system defaults.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-5 rounded-xl bg-surface border border-border space-y-2">
          <div className="w-8 h-8 rounded-lg bg-surface-2 border border-border flex items-center justify-center text-muted">
            <Shield className="w-4 h-4" />
          </div>
          <h3 className="text-sm font-semibold text-text">Security & Authentication</h3>
          <p className="text-xs text-muted">Supabase JWT session timeout, MFA rules, and password strength requirements.</p>
        </div>

        <div className="p-5 rounded-xl bg-surface border border-border space-y-2">
          <div className="w-8 h-8 rounded-lg bg-surface-2 border border-border flex items-center justify-center text-muted">
            <Bell className="w-4 h-4" />
          </div>
          <h3 className="text-sm font-semibold text-text">Platform Notifications</h3>
          <p className="text-xs text-muted">System broadcast templates, transactional email dispatch, and event webhooks.</p>
        </div>

        <div className="p-5 rounded-xl bg-surface border border-border space-y-2">
          <div className="w-8 h-8 rounded-lg bg-surface-2 border border-border flex items-center justify-center text-muted">
            <Database className="w-4 h-4" />
          </div>
          <h3 className="text-sm font-semibold text-text">Storage & Backups</h3>
          <p className="text-xs text-muted">Course video asset buckets, daily backup snapshots, and RLS audit logs.</p>
        </div>
      </div>
    </div>
  );
}
