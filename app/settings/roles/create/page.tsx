"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
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
} from "lucide-react";
import {
  getPermissionsGrouped,
  createRole,
  PermissionsGrouped,
  Permission,
} from "@/utils/api/roles";

// Module display metadata (icon + color mapped by moduleCode)
const MODULE_META: Record<
  string,
  { label: string; icon: any; color: string }
> = {
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

export default function CreateRolePage() {
  const router = useRouter();

  const [roleName, setRoleName] = useState("");
  const [roleDesc, setRoleDesc] = useState("");
  const [checkedPerms, setCheckedPerms] = useState<Set<string>>(new Set());

  const [permissionsGrouped, setPermissionsGrouped] = useState<PermissionsGrouped>({});
  const [loadingPerms, setLoadingPerms] = useState(true);
  const [permsError, setPermsError] = useState<string | null>(null);

  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const data = await getPermissionsGrouped();
        setPermissionsGrouped(data);
      } catch (err: any) {
        setPermsError(err.message ?? "Failed to load permissions.");
      } finally {
        setLoadingPerms(false);
      }
    })();
  }, []);

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
    // Owners must supply businessId — read from the active session
    const businessId =
      typeof window !== "undefined"
        ? localStorage.getItem("activeBizId") ?? undefined
        : undefined;

    setSaving(true);
    setSaveError(null);
    try {
      await createRole({
        name: roleName.trim(),
        description: roleDesc.trim() || undefined,
        permissionIds: Array.from(checkedPerms), // backend accepts codes
        businessId,
      });
      router.push("/settings/roles");
    } catch (err: any) {
      setSaveError(err.message ?? "Failed to create role.");
    } finally {
      setSaving(false);
    }
  };


  const modules = Object.entries(permissionsGrouped);

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
            Create New Role
          </h1>
          <p className="text-slate-500 text-sm mt-0.5">
            Define a name and assign granular permissions per module.
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
                Role Name <span className="text-rose-500">*</span>
              </label>
              <input
                value={roleName}
                onChange={(e) => setRoleName(e.target.value)}
                className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                placeholder="e.g. Store Keeper"
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
                placeholder="Describe what this role does..."
              />
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
            <h2 className="font-bold text-slate-800 text-sm mb-3">
              Permission Summary
            </h2>
            {loadingPerms ? (
              <p className="text-xs text-slate-400">Loading…</p>
            ) : (
              <>
                <p className="text-3xl font-black text-[#00184d]">{totalSelected}</p>
                <p className="text-xs text-slate-500 mt-0.5">
                  permissions selected across {modulesWithPerms} modules
                </p>
              </>
            )}
          </div>

          <button
            onClick={handleSave}
            disabled={saving || loadingPerms}
            className="w-full py-3 rounded-xl font-bold text-sm transition-all shadow-sm bg-[#00184d] hover:bg-[#002470] text-white disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {saving ? (
              <>
                <Loader2 size={15} className="animate-spin" />
                Saving…
              </>
            ) : (
              "Save Role"
            )}
          </button>
        </div>

        {/* Right — Permissions Panel */}
        <div className="lg:col-span-2 space-y-4">
          {loadingPerms && (
            <div className="flex items-center justify-center py-24">
              <Loader2 size={28} className="animate-spin text-slate-300" />
            </div>
          )}
          {permsError && (
            <div className="flex items-center gap-3 bg-rose-50 border border-rose-200 rounded-xl p-4">
              <AlertCircle size={16} className="text-rose-500 shrink-0" />
              <p className="text-sm text-rose-700">{permsError}</p>
            </div>
          )}
          {!loadingPerms &&
            !permsError &&
            modules.map(([moduleCode, perms]) => {
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
                              isChecked
                                ? "bg-blue-600 border-blue-600"
                                : "border-slate-300"
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
