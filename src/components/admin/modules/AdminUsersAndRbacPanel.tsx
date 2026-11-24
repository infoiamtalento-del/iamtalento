import React, { useMemo, useState } from "react";
import {
  Search,
  UserCheck,
  KeyRound,
  Shield,
  Download,
  UserPlus,
  Eye,
  Ban,
  Check,
  StickyNote,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import {
  exportRecordsAsCsv,
  type SuperAdminSnapshot,
} from "@/services/admin/superAdminData";
import type {
  AdminRoleDefinition,
  AdminRoleKey,
  InternalStaffAccount,
} from "@/services/admin/superAdminEnterpriseData";
import type { InspectedEntity } from "../SuperAdminInspector";
import { toast } from "sonner";

export type UsersSubTab =
  | "all"
  | "candidates"
  | "employers"
  | "admins"
  | "verification"
  | "activity"
  | "roles";

interface UnifiedUserRow {
  id: string;
  code: string;
  fullName: string;
  email: string;
  phone: string;
  accountType: "Candidate" | "Employer" | "Admin";
  roleOrPlan: string;
  verified: boolean;
  status: string;
  mfaEnabled: boolean;
  lastActiveAt: string;
  sourceCandidate?: SuperAdminSnapshot["candidates"][number];
  sourceEmployer?: SuperAdminSnapshot["employers"][number];
  sourceStaff?: InternalStaffAccount;
}

interface Props {
  snapshot: SuperAdminSnapshot;
  roles: AdminRoleDefinition[];
  staffAccounts: InternalStaffAccount[];
  initialTab?: UsersSubTab;
  onInspect: (entity: InspectedEntity) => void;
  onImpersonate: (target: { id: string; name: string; email: string; role: "Candidate" | "Employer" }) => void;
  onVerifyCandidate: (id: string) => void;
  onVerifyEmployer: (id: string) => void;
  onSuspendCandidate: (id: string) => void;
  onAddStaff: (staff: InternalStaffAccount) => void;
  onToggleStaffStatus: (id: string) => void;
  onUpdateRolePermission: (
    roleKey: AdminRoleKey,
    moduleKey: keyof AdminRoleDefinition["permissions"],
    level: "full" | "write" | "read" | "none"
  ) => void;
  onLogAudit: (action: string, table: string, entityId: string, details: string) => void;
}

const PERM_LEVELS: Array<"none" | "read" | "write" | "full"> = ["none", "read", "write", "full"];

const PERM_LABELS: Record<keyof AdminRoleDefinition["permissions"], string> = {
  users: "Users",
  employers: "Employers",
  candidates: "Candidates",
  recruitment: "Recruitment",
  assessments: "CIR & Tests",
  ai_hub: "AI Hub",
  lms_mentors: "LMS & Mentors",
  events_freelance: "Events & Gigs",
  finance_plans: "Finance & Plans",
  cms_comms: "CMS & Comms",
  support: "Support",
  analytics: "Analytics",
  system_security: "System & Sec",
};

export const AdminUsersAndRbacPanel: React.FC<Props> = ({
  snapshot,
  roles,
  staffAccounts,
  initialTab = "all",
  onInspect,
  onImpersonate,
  onVerifyCandidate,
  onVerifyEmployer,
  onSuspendCandidate,
  onAddStaff,
  onToggleStaffStatus,
  onUpdateRolePermission,
  onLogAudit,
}) => {
  const [subTab, setSubTab] = useState<UsersSubTab>(initialTab);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "pending" | "suspended">("all");
  const [notesByUserId, setNotesByUserId] = useState<Record<string, string>>({});
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [noteDraft, setNoteDraft] = useState("");
  const [showAddStaff, setShowAddStaff] = useState(false);
  const [newStaff, setNewStaff] = useState({
    fullName: "",
    email: "",
    phone: "",
    roleKey: "support_admin" as AdminRoleKey,
    department: "Trust & Support",
  });

  const unifiedUsers = useMemo<UnifiedUserRow[]>(() => {
    const cands: UnifiedUserRow[] = snapshot.candidates.map((c) => ({
      id: `cand-${c.id}`,
      code: c.talentCirId,
      fullName: c.fullName,
      email: c.email,
      phone: c.phone,
      accountType: "Candidate",
      roleOrPlan: c.accountTier === "premium" ? "Candidate Pro" : "Candidate Free",
      verified: c.kycStatus === "verified",
      status: c.archived ? "archived" : c.availabilityStatus === "Suspended" ? "suspended" : "active",
      mfaEnabled: c.mfaEnabled,
      lastActiveAt: c.lastActiveAt,
      sourceCandidate: c,
    }));

    const emps: UnifiedUserRow[] = snapshot.employers.map((e) => ({
      id: `emp-${e.id}`,
      code: e.employerCode,
      fullName: e.companyName,
      email: e.officialEmail,
      phone: e.phone,
      accountType: "Employer",
      roleOrPlan: e.subscriptionPlan,
      verified: e.verificationStatus === "verified",
      status: e.archived ? "archived" : e.verificationStatus === "suspended" ? "suspended" : e.verificationStatus === "pending" ? "pending" : "active",
      mfaEnabled: true,
      lastActiveAt: e.lastActiveAt,
      sourceEmployer: e,
    }));

    const admins: UnifiedUserRow[] = staffAccounts.map((s) => ({
      id: s.id,
      code: s.code,
      fullName: s.fullName,
      email: s.email,
      phone: s.phone,
      accountType: "Admin",
      roleOrPlan: s.roleLabel,
      verified: true,
      status: s.status,
      mfaEnabled: s.mfaEnabled,
      lastActiveAt: s.lastLoginAt,
      sourceStaff: s,
    }));

    return [...admins, ...emps, ...cands];
  }, [snapshot.candidates, snapshot.employers, staffAccounts]);

  const filteredUsers = useMemo(() => {
    const q = query.trim().toLowerCase();
    return unifiedUsers
      .filter((u) => {
        if (subTab === "candidates") return u.accountType === "Candidate";
        if (subTab === "employers") return u.accountType === "Employer";
        if (subTab === "admins") return u.accountType === "Admin";
        if (subTab === "verification") return !u.verified;
        return true;
      })
      .filter((u) => {
        if (statusFilter === "all") return true;
        if (statusFilter === "pending") return !u.verified || u.status === "pending";
        return u.status === statusFilter;
      })
      .filter(
        (u) =>
          !q ||
          [u.fullName, u.email, u.code, u.phone, u.roleOrPlan, u.accountType].some((f) =>
            f?.toLowerCase().includes(q)
          )
      );
  }, [unifiedUsers, subTab, statusFilter, query]);

  const handleCreateStaff = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStaff.fullName.trim() || !newStaff.email.trim()) return;
    const roleDef = roles.find((r) => r.key === newStaff.roleKey);
    const created: InternalStaffAccount = {
      id: `stf-${Date.now()}`,
      code: `ADM-${Math.floor(100 + Math.random() * 899)}`,
      fullName: newStaff.fullName.trim(),
      email: newStaff.email.trim(),
      phone: newStaff.phone.trim() || "+91 98000 00000",
      roleKey: newStaff.roleKey,
      roleLabel: roleDef?.name || "Admin",
      department: roleDef?.department || newStaff.department,
      status: "active",
      mfaEnabled: true,
      lastLoginAt: new Date().toISOString(),
      lastIp: "Console Session",
      notes: "Provisioned via Super Admin RBAC directory",
    };
    onAddStaff(created);
    setNewStaff({ fullName: "", email: "", phone: "", roleKey: "support_admin", department: "Trust & Support" });
    setShowAddStaff(false);
  };

  const tabs: Array<{ id: UsersSubTab; label: string; count?: number }> = [
    { id: "all", label: "All users", count: unifiedUsers.length },
    { id: "candidates", label: "Candidate users", count: snapshot.candidates.length },
    { id: "employers", label: "Employer users", count: snapshot.employers.length },
    { id: "admins", label: "Admin & staff", count: staffAccounts.length },
    { id: "verification", label: "Account verification", count: unifiedUsers.filter((u) => !u.verified).length },
    { id: "activity", label: "User activity logs", count: snapshot.auditLogs.length },
    { id: "roles", label: "RBAC roles & permissions", count: roles.length },
  ];

  return (
    <div className="space-y-5">
      {/* Sub-navigation bar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-1.5 rounded-xl border border-[#111827]/[0.08] bg-[#f5f7fa] p-1">
          {tabs.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setSubTab(t.id)}
              className={cn(
                "rounded-lg px-3 py-1.5 text-xs font-medium transition-colors duration-150 cursor-pointer inline-flex items-center gap-1.5",
                subTab === t.id
                  ? "bg-[#002C66] text-white"
                  : "text-[#4b5565] hover:text-[#111827]"
              )}
            >
              <span>{t.label}</span>
              {typeof t.count === "number" && (
                <span className={cn("font-mono text-[11px] tabular-nums", subTab === t.id ? "text-blue-200" : "text-[#6b7487]")}>
                  {t.count}
                </span>
              )}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            className="h-8 rounded-lg text-xs gap-1.5 cursor-pointer"
            onClick={() => {
              exportRecordsAsCsv(
                "talentcir-all-users",
                filteredUsers.map((u) => ({
                  code: u.code,
                  fullName: u.fullName,
                  email: u.email,
                  type: u.accountType,
                  roleOrPlan: u.roleOrPlan,
                  verified: u.verified,
                  status: u.status,
                }))
              );
              toast.success(`Exported ${filteredUsers.length} user records`);
            }}
          >
            <Download className="h-3.5 w-3.5" strokeWidth={1.5} />
            Bulk export CSV
          </Button>
          <Button
            size="sm"
            className="h-8 rounded-lg bg-[#002C66] hover:bg-[#002250] text-white text-xs gap-1.5 cursor-pointer"
            onClick={() => {
              setSubTab("admins");
              setShowAddStaff((v) => !v);
            }}
          >
            <UserPlus className="h-3.5 w-3.5" strokeWidth={1.5} />
            Add admin staff
          </Button>
        </div>
      </div>

      {/* Add Internal Staff Form */}
      {showAddStaff && (
        <form
          onSubmit={handleCreateStaff}
          className="rounded-xl border border-[#002C66]/20 bg-[#f5f7fa] p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 items-end"
        >
          <div>
            <label className="block text-xs text-[#4b5565] mb-1">Full name</label>
            <Input
              value={newStaff.fullName}
              onChange={(e) => setNewStaff((p) => ({ ...p, fullName: e.target.value }))}
              placeholder="e.g. Meenakshi Rao"
              className="h-9 text-xs bg-white"
              required
            />
          </div>
          <div>
            <label className="block text-xs text-[#4b5565] mb-1">Work email</label>
            <Input
              type="email"
              value={newStaff.email}
              onChange={(e) => setNewStaff((p) => ({ ...p, email: e.target.value }))}
              placeholder="name@talentcir.com"
              className="h-9 text-xs bg-white"
              required
            />
          </div>
          <div>
            <label className="block text-xs text-[#4b5565] mb-1">Mobile</label>
            <Input
              value={newStaff.phone}
              onChange={(e) => setNewStaff((p) => ({ ...p, phone: e.target.value }))}
              placeholder="+91 98..."
              className="h-9 text-xs bg-white"
            />
          </div>
          <div>
            <label className="block text-xs text-[#4b5565] mb-1">RBAC role</label>
            <select
              value={newStaff.roleKey}
              onChange={(e) => setNewStaff((p) => ({ ...p, roleKey: e.target.value as AdminRoleKey }))}
              className="h-9 w-full rounded-lg border border-[#111827]/[0.12] bg-white px-2.5 text-xs text-[#111827]"
            >
              {roles.map((r) => (
                <option key={r.key} value={r.key}>
                  {r.name}
                </option>
              ))}
            </select>
          </div>
          <div className="flex gap-2">
            <Button type="submit" size="sm" className="h-9 bg-[#002C66] text-white text-xs flex-1 cursor-pointer">
              Create staff
            </Button>
            <Button type="button" size="sm" variant="outline" className="h-9 text-xs cursor-pointer" onClick={() => setShowAddStaff(false)}>
              Cancel
            </Button>
          </div>
        </form>
      )}

      {/* RBAC ROLES & PERMISSIONS MATRIX */}
      {subTab === "roles" ? (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <h3 className="text-sm font-medium text-[#111827]">Role-based access control (RBAC) matrix</h3>
              <p className="text-xs text-[#6b7487]">
                Click any permission cell to cycle access level (None → Read → Write → Full)
              </p>
            </div>
          </div>

          <div className="overflow-x-auto rounded-xl border border-[#111827]/[0.08]">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#111827]/[0.08] bg-[#f5f7fa] text-[#6b7487]">
                  <th className="py-2.5 px-3 font-medium">Role &amp; department</th>
                  {(Object.keys(PERM_LABELS) as Array<keyof AdminRoleDefinition["permissions"]>).map((k) => (
                    <th key={k} className="py-2.5 px-2 font-medium text-center whitespace-nowrap">
                      {PERM_LABELS[k]}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#111827]/[0.06] bg-white">
                {roles.map((role) => (
                  <tr key={role.key} className="hover:bg-[#f5f7fa]/60">
                    <td className="py-3 px-3 min-w-[180px]">
                      <p className="font-medium text-[#111827]">{role.name}</p>
                      <p className="text-[11px] text-[#6b7487]">{role.department} · {role.assignedUsers} seats</p>
                    </td>
                    {(Object.keys(PERM_LABELS) as Array<keyof AdminRoleDefinition["permissions"]>).map((modKey) => {
                      const val = role.permissions[modKey];
                      const nextLevel = PERM_LEVELS[(PERM_LEVELS.indexOf(val) + 1) % PERM_LEVELS.length];
                      return (
                        <td key={modKey} className="py-2.5 px-1.5 text-center">
                          <button
                            type="button"
                            disabled={role.key === "super_admin"}
                            onClick={() => onUpdateRolePermission(role.key, modKey, nextLevel)}
                            className={cn(
                              "rounded-md px-2 py-1 font-mono text-[11px] capitalize transition-colors duration-150",
                              role.key === "super_admin" ? "cursor-default" : "cursor-pointer",
                              val === "full"
                                ? "bg-[#002C66] text-white"
                                : val === "write"
                                  ? "bg-[#eceff4] text-[#002C66] font-medium"
                                  : val === "read"
                                    ? "bg-[#f5f7fa] text-[#4b5565] border border-[#111827]/[0.08]"
                                    : "text-[#9ca3af]"
                            )}
                          >
                            {val}
                          </button>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : subTab === "activity" ? (
        /* USER ACTIVITY & LOGIN LOGS */
        <div className="space-y-2.5">
          {snapshot.auditLogs.map((log) => (
            <div
              key={log.id}
              onClick={() => onInspect({ kind: "audit", data: log })}
              className="rounded-xl border border-[#111827]/[0.08] px-4 py-3 hover:bg-[#f5f7fa] transition-colors duration-150 cursor-pointer flex flex-wrap items-center justify-between gap-3 text-xs"
            >
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#002C66]" />
                  <span className="font-mono font-medium text-[#111827]">{log.action}</span>
                  <span className="font-mono text-[11px] text-[#6b7487]">
                    {log.entityTable} ({log.entityId})
                  </span>
                </div>
                <p className="text-[#4b5565]">{log.details}</p>
              </div>
              <div className="text-right text-[11px] text-[#6b7487] tabular-nums">
                <p className="font-medium text-[#111827]">{log.actorName} ({log.actorRole})</p>
                <p className="font-mono">{log.actorIp} · {new Date(log.timestamp).toLocaleString()}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* CENTRALIZED USERS DIRECTORY */
        <div className="space-y-4">
          {/* Dark Navy Filter Bar with Highlighted Search */}
          <div className="rounded-xl border border-[#001D44] bg-[#002C66] p-4 flex flex-wrap items-center justify-between gap-3 text-white">
            <div className="relative flex-1 min-w-[240px] max-w-md">
              <Search className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#ea580c]" strokeWidth={1.75} />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search users by name, email, TalentCIR ID, or phone"
                className="h-10 pl-10 text-xs font-medium text-[#111827] placeholder:text-[#4b5565] bg-white rounded-lg border-2 border-[#FB923C]"
              />
            </div>

            <div className="inline-flex rounded-lg border border-white/15 bg-[#001F4D] p-1">
              {(["all", "active", "pending", "suspended"] as const).map((st) => (
                <button
                  key={st}
                  type="button"
                  onClick={() => setStatusFilter(st)}
                  className={cn(
                    "rounded-md px-3 py-1 text-xs font-medium capitalize transition-colors duration-150 cursor-pointer",
                    statusFilter === st ? "bg-white text-[#002C66]" : "text-blue-100/80 hover:text-white"
                  )}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#111827]/[0.08] text-[#6b7487]">
                  <th className="py-2.5 pr-3 font-medium">User &amp; ID</th>
                  <th className="py-2.5 px-3 font-medium">Account type &amp; plan</th>
                  <th className="py-2.5 px-3 font-medium">Verification &amp; 2FA</th>
                  <th className="py-2.5 px-3 font-medium">Status</th>
                  <th className="py-2.5 px-3 font-medium">Last active</th>
                  <th className="py-2.5 pl-3 text-right font-medium">Admin controls</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#111827]/[0.06]">
                {filteredUsers.map((u) => (
                  <React.Fragment key={u.id}>
                    <tr className="hover:bg-[#f5f7fa] transition-colors duration-150">
                      <td className="py-3 pr-3">
                        <p className="font-medium text-[#111827]">{u.fullName}</p>
                        <p className="font-mono text-[11px] text-[#6b7487]">
                          {u.code} · {u.email}
                        </p>
                        {notesByUserId[u.id] && (
                          <p className="mt-1 text-[11px] text-[#002C66]">
                            Note: {notesByUserId[u.id]}
                          </p>
                        )}
                      </td>
                      <td className="py-3 px-3">
                        <p className="font-medium text-[#111827]">{u.accountType}</p>
                        <p className="text-[11px] text-[#6b7487]">{u.roleOrPlan}</p>
                      </td>
                      <td className="py-3 px-3">
                        <span className="inline-flex items-center gap-1.5 text-xs text-[#111827]">
                          <span className={cn("h-1.5 w-1.5 rounded-full", u.verified ? "bg-[#16a34a]" : "bg-[#d97706]")} />
                          {u.verified ? "Verified" : "Pending"}
                        </span>
                        <p className="text-[11px] text-[#6b7487]">2FA {u.mfaEnabled ? "Enabled" : "Off"}</p>
                      </td>
                      <td className="py-3 px-3 capitalize">
                        <span className="inline-flex items-center gap-1.5 text-xs text-[#111827]">
                          <span
                            className={cn(
                              "h-1.5 w-1.5 rounded-full",
                              u.status === "active"
                                ? "bg-[#16a34a]"
                                : u.status === "suspended"
                                  ? "bg-[#dc2626]"
                                  : "bg-[#d97706]"
                            )}
                          />
                          {u.status}
                        </span>
                      </td>
                      <td className="py-3 px-3 font-mono text-[11px] text-[#6b7487] tabular-nums">
                        {new Date(u.lastActiveAt).toLocaleDateString()}
                      </td>
                      <td className="py-3 pl-3 text-right">
                        <div className="inline-flex flex-wrap items-center justify-end gap-1.5">
                          {!u.verified && (u.sourceCandidate || u.sourceEmployer) && (
                            <Button
                              size="sm"
                              className="h-7 px-2 text-[11px] bg-[#002C66] hover:bg-[#002250] text-white gap-1 cursor-pointer"
                              onClick={() =>
                                u.sourceCandidate
                                  ? onVerifyCandidate(u.sourceCandidate.id)
                                  : u.sourceEmployer && onVerifyEmployer(u.sourceEmployer.id)
                              }
                            >
                              <UserCheck className="h-3 w-3" strokeWidth={1.5} />
                              Verify
                            </Button>
                          )}
                          {(u.sourceCandidate || u.sourceEmployer) && (
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-7 px-2 text-[11px] gap-1 cursor-pointer"
                              title="Audit-logged user impersonation session"
                              onClick={() =>
                                onImpersonate({
                                  id: u.code,
                                  name: u.fullName,
                                  email: u.email,
                                  role: u.accountType === "Employer" ? "Employer" : "Candidate",
                                })
                              }
                            >
                              <Shield className="h-3 w-3 text-[#6b7487]" strokeWidth={1.5} />
                              Impersonate
                            </Button>
                          )}
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-7 px-2 text-[11px] gap-1 cursor-pointer"
                            title="Send password reset link"
                            onClick={() => {
                              onLogAudit("user.password_reset_triggered", "auth.users", u.code, `Password reset link dispatched to ${u.email}`);
                              toast.success(`Password reset link sent to ${u.email}`);
                            }}
                          >
                            <KeyRound className="h-3 w-3 text-[#6b7487]" strokeWidth={1.5} />
                            Reset PW
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-7 px-2 text-[11px] gap-1 cursor-pointer"
                            onClick={() => {
                              setEditingNoteId(editingNoteId === u.id ? null : u.id);
                              setNoteDraft(notesByUserId[u.id] || "");
                            }}
                          >
                            <StickyNote className="h-3 w-3 text-[#6b7487]" strokeWidth={1.5} />
                            Note
                          </Button>
                          {u.sourceCandidate && (
                            <>
                              <Button
                                size="sm"
                                variant="outline"
                                className="h-7 px-2 text-[11px] gap-1 cursor-pointer"
                                onClick={() => onInspect({ kind: "candidate", data: u.sourceCandidate! })}
                              >
                                <Eye className="h-3 w-3 text-[#6b7487]" strokeWidth={1.5} />
                                Inspect
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="h-7 px-2 text-[11px] text-[#dc2626] cursor-pointer"
                                onClick={() => onSuspendCandidate(u.sourceCandidate!.id)}
                                title="Toggle suspension"
                              >
                                <Ban className="h-3 w-3" strokeWidth={1.5} />
                              </Button>
                            </>
                          )}
                          {u.sourceEmployer && (
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-7 px-2 text-[11px] gap-1 cursor-pointer"
                              onClick={() => onInspect({ kind: "employer", data: u.sourceEmployer! })}
                            >
                              <Eye className="h-3 w-3 text-[#6b7487]" strokeWidth={1.5} />
                              Inspect
                            </Button>
                          )}
                          {u.sourceStaff && u.sourceStaff.roleKey !== "super_admin" && (
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-7 px-2 text-[11px] cursor-pointer"
                              onClick={() => onToggleStaffStatus(u.sourceStaff!.id)}
                            >
                              {u.status === "active" ? "Suspend" : "Activate"}
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                    {editingNoteId === u.id && (
                      <tr className="bg-[#f5f7fa]">
                        <td colSpan={6} className="p-3">
                          <div className="flex items-center gap-2">
                            <Input
                              value={noteDraft}
                              onChange={(e) => setNoteDraft(e.target.value)}
                              placeholder="Add internal administrative note (stored with audit log)"
                              className="h-8 text-xs bg-white"
                            />
                            <Button
                              size="sm"
                              className="h-8 bg-[#002C66] text-white text-xs gap-1 cursor-pointer"
                              onClick={() => {
                                setNotesByUserId((p) => ({ ...p, [u.id]: noteDraft.trim() }));
                                onLogAudit("user.admin_note_updated", "admin_notes", u.code, noteDraft.trim() || "Cleared note");
                                setEditingNoteId(null);
                                toast.success("Internal admin note saved");
                              }}
                            >
                              <Check className="h-3.5 w-3.5" strokeWidth={1.5} />
                              Save note
                            </Button>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
