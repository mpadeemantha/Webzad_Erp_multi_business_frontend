"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Wrench,
  FileText,
  Package,
  ShoppingCart,
  Users,
  BarChart2,
  Settings,
  Check,
  Loader2,
  AlertCircle,
  Shield,
  UserCheck,
} from "lucide-react";
import {
  getRoleById,
  getPermissionsGrouped,
  updateRole,
  setRolePermissions,
  PermissionsGrouped,
  Permission,
  RoleDetail,
} from "@/utils/api/roles";

// Module display metadata (icon + color mapped by moduleCode)
const MODULE_META: Record<string, { label: string; icon: any; color: string }> = {
  jobs: { label: "Job Cards", icon: Wrench, color: "bg-blue-50 text-blue-600" },
  invoices: { label: "Invoicing", icon: FileText, color: "bg-emerald-50 text-emerald-600" },
  stock: { label: "Stock Management", icon: Package, color: "bg-purple-50 text-purple-600" },
  purchase_orders: { label: "Purchase Orders", icon: ShoppingCart, color: "bg-indigo-50 text-indigo-600" },
  hr: { label: "HR & Payroll", icon: Users, color: "bg-rose-50 text-rose-600" },
  employees: { label: "Employees", icon: Users, color: "bg-rose-50 text-rose-600" },
  attendance: { label: "Attendance", icon: Users, color: "bg-rose-50 text-rose-600" },
  leave: { label: "Leave", icon: Users, color: "bg-rose-50 text-rose-600" },
  payroll: { label: "Payroll", icon: Users, color: "bg-rose-50 text-rose-600" },
  reports: { label: "Reports & Analytics", icon: BarChart2, color: "bg-amber-50 text-amber-600" },
  settings: { label: "System Settings", icon: Settings, color: "bg-slate-100 text-slate-600" },
  roles: { label: "Roles & Permissions", icon: Shield, color: "bg-slate-100 text-slate-600" },
  users: { label: "User Accounts", icon: Users, color: "bg-slate-100 text-slate-600" },
};

function getFallbackMeta(code: string) {
  return {
    label: code.charAt(0).toUpperCase() + code.slice(1),
    icon: Shield,
    color: "bg-slate-100 text-slate-600",
  };
}

export default function EditRolePage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const [role, setRole] = useState<RoleDetail | null>(null);
  const [permissionsGrouped, setPermissionsGrouped] = useState<PermissionsGrouped>({});
  const [loadingPage, setLoadingPage] = useState(true);
  const [pageError, setPageError] = useState<string | null>(null);

  const [roleName, setRoleName] = useState("");
  const [roleDesc, setRoleDesc] = useState("");
  const [checkedPerms, setCheckedPerms] = useState<Set<string>>(new Set());

  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  const isSystemRole = (name: string) => name.toLowerCase() === "super admin";

  const loadData = useCallback(async () => {
    setLoadingPage(true);
    setPageError(null);
    try {
      const [roleData, allPerms] = await Promise.all([
        getRoleById(id),
        getPermissionsGrouped(),
      ]);
      setRole(roleData);
      setRoleName(roleData.name);
      setRoleDesc(roleData.description ?? "");
      setPermissionsGrouped(allPerms);

      // Pre-check all permissions the role currently has
      const existingCodes = new Set<string>();
      for (const perms of Object.values(roleData.permissionsGrouped)) {
        for (const p of perms) {
          existingCodes.add(p.code);
        }
      }
      setCheckedPerms(existingCodes);
    } catch (err: any) {
      setPageError(err.message ?? "Failed to load role.");
    } finally {
      setLoadingPage(false);
    }
  }, [id]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const togglePerm = (code: string) => {
    setCheckedPerms((prev) => {
      const next = new Set(prev);
      next.has(code) ? next.delete(code) : next.add(code);
      return next;
    });
  };

  const toggleModule = (perms: Permission[]) => {
    const allCodes = perms.map((p) => p.code);
    const allChecked = allCodes.every((c) => checkedPerms.has(c));
    setCheckedPerms((prev) => {
      const next = new Set(prev);
      if (allChecked) {
        allCodes.forEach((c) => next.delete(c));
      } else {
        allCodes.forEach((c) => next.add(c));
      }
      return next;
    });
  };

  const totalSelected = checkedPerms.size;
  const modulesWithPerms = Object.keys(permissionsGrouped).filter((mod) =>
    permissionsGrouped[mod].some((p) => checkedPerms.has(p.code))
  ).length;

  const handleSave = async () => {
    if (!roleName.trim()) {
      setSaveError("Role name is required.");
      return;
    }
    setSaving(true);
    setSaveError(null);
    try {
      // Update name/description
      await updateRole(id, {
        name: roleName.trim(),
        description: roleDesc.trim() || undefined,
      });
      // Replace permissions
      await setRolePermissions(id, Array.from(checkedPerms));
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (err: any) {
      setSaveError(err.message ?? "Failed to update role.");
    } finally {
      setSaving(false);
    }
  };

  const modules = Object.entries(permissionsGrouped);

  if (loadingPage) {
    return (
      <div className="flex items-center justify-center py-32">
        <Loader2 size={32} className="animate-spin text-slate-300" />
      </div>
    );
  }

  if (pageError) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4">
        <AlertCircle size={40} className="text-rose-300" />
        <p className="text-slate-500 text-sm">{pageError}</p>
        <button
          onClick={loadData}
          className="text-xs font-semibold text-[#00184d] underline"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link
          href="/settings/roles"
          className="p-2 rounded-xl hover:bg-slate-100 text-slate-500 transition-colors"
        >
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Edit Role — {role?.name}
          </h1>
          <p className="text-slate-500 text-sm mt-0.5">
            Modify permissions for this role. Changes apply to all assigned users immediately.
          </p>
        </div>
      </div>

      {/* Save error */}
      {saveError && (
        <div className="flex items-start gap-3 bg-rose-50 border border-rose-200 rounded-xl p-4">
          <AlertCircle size={16} className="text-rose-500 mt-0.5 shrink-0" />
          <p className="text-sm text-rose-700">{saveError}</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Left — Role Info */}
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 space-y-4">
            <h2 className="font-bold text-slate-800 text-sm">Role Details</h2>
            <div>
              <label className="text-xs font-semibold text-slate-600 block mb-1.5">
                Role Name
              </label>
              <input
                value={roleName}
                onChange={(e) => setRoleName(e.target.value)}
                disabled={isSystemRole(role?.name ?? "")}
                className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 disabled:bg-slate-50 disabled:text-slate-400"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-600 block mb-1.5">
                Description
              </label>
              <textarea
                value={roleDesc}
                onChange={(e) => setRoleDesc(e.target.value)}
                rows={3}
                className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 resize-none"
              />
            </div>
          </div>

          {/* Permission Summary */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
            <h2 className="font-bold text-slate-800 text-sm mb-2">Permission Summary</h2>
            <p className="text-3xl font-black text-[#00184d]">{totalSelected}</p>
            <p className="text-xs text-slate-500 mt-0.5">
              permissions across {modulesWithPerms} modules
            </p>
          </div>

          {/* Assigned Users */}
          {role && role.users.length > 0 && (
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
              <h2 className="font-bold text-slate-800 text-sm mb-3 flex items-center gap-2">
                <UserCheck size={14} className="text-slate-400" />
                Assigned Users ({role.users.length})
              </h2>
              <div className="space-y-2">
                {role.users.map((u) => (
                  <div key={u.id} className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-500">
                      {u.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-slate-700 truncate">{u.name}</p>
                      <p className="text-[10px] text-slate-400 truncate">{u.email}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <button
            onClick={handleSave}
            disabled={saving}
            className={`w-full py-3 rounded-xl font-bold text-sm transition-all shadow-sm flex items-center justify-center gap-2 ${
              saved
                ? "bg-emerald-500 text-white"
                : "bg-[#00184d] hover:bg-[#002470] text-white"
            } disabled:opacity-60 disabled:cursor-not-allowed`}
          >
            {saving ? (
              <>
                <Loader2 size={15} className="animate-spin" />
                Saving…
              </>
            ) : saved ? (
              "✓ Saved!"
            ) : (
              "Update Role"
            )}
          </button>
        </div>

        {/* Right — Permissions Panel */}
        <div className="lg:col-span-2 space-y-4">
          {modules.map(([moduleCode, perms]) => {
            const meta = MODULE_META[moduleCode] ?? getFallbackMeta(moduleCode);
            const Icon = meta.icon;
            const allChecked = perms.every((p) => checkedPerms.has(p.code));
            const checkedCount = perms.filter((p) => checkedPerms.has(p.code)).length;

            return (
              <div
                key={moduleCode}
                className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5"
              >
                {/* Module Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-xl ${meta.color}`}>
                      <Icon size={16} />
                    </div>
                    <h3 className="font-bold text-slate-800 text-sm">{meta.label}</h3>
                    {checkedCount > 0 && (
                      <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
                        {checkedCount}/{perms.length}
                      </span>
                    )}
                  </div>
                  <button
                    onClick={() => toggleModule(perms)}
                    className={`text-xs font-semibold px-3 py-1 rounded-full transition-colors ${
                      allChecked
                        ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-200"
                        : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                    }`}
                  >
                    {allChecked ? "Deselect All" : "Select All"}
                  </button>
                </div>

                {/* Permission Checkboxes */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {perms.map((perm) => {
                    const isChecked = checkedPerms.has(perm.code);
                    return (
                      <button
                        key={perm.code}
                        onClick={() => togglePerm(perm.code)}
                        className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-left transition-all border ${
                          isChecked
                            ? "bg-blue-50 border-blue-200 text-blue-800 font-medium"
                            : "bg-slate-50 border-slate-100 text-slate-600 hover:border-blue-200 hover:bg-blue-50/50"
                        }`}
                      >
                        <div
                          className={`w-4 h-4 rounded border-2 flex items-center justify-center shrink-0 transition-all ${
                            isChecked ? "bg-blue-600 border-blue-600" : "border-slate-300"
                          }`}
                        >
                          {isChecked && (
                            <Check size={10} className="text-white" strokeWidth={3} />
                          )}
                        </div>
                        <span className="truncate">{perm.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
