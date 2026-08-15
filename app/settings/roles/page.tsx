"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  PlusCircle,
  Trash2,
  ShieldCheck,
  Users,
  ChevronRight,
  Loader2,
  AlertCircle,
  Key,
  RefreshCw,
} from "lucide-react";
import { getRoles, deleteRole, RoleSummary } from "@/utils/api/roles";

// Deterministic color palette for role cards based on name hash
const COLOR_PALETTE = [
  "bg-blue-100 text-blue-700",
  "bg-purple-100 text-purple-700",
  "bg-emerald-100 text-emerald-700",
  "bg-amber-100 text-amber-700",
  "bg-rose-100 text-rose-700",
  "bg-indigo-100 text-indigo-700",
  "bg-cyan-100 text-cyan-700",
  "bg-pink-100 text-pink-700",
];

function getCardColor(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return COLOR_PALETTE[Math.abs(hash) % COLOR_PALETTE.length];
}

export default function RolesListPage() {
  const [roles, setRoles] = useState<RoleSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const fetchRoles = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getRoles();
      setRoles(data);
    } catch (err: any) {
      setError(err.message ?? "Failed to load roles.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRoles();
  }, [fetchRoles]);

  const handleDelete = async (role: RoleSummary) => {
    if (role._count.userRoles > 0) {
      setDeleteError(
        `Cannot delete "${role.name}" — it is assigned to ${role._count.userRoles} user(s). Unassign them first.`
      );
      return;
    }
    if (!confirm(`Delete role "${role.name}"? This action cannot be undone.`)) return;
    setDeletingId(role.id);
    setDeleteError(null);
    try {
      await deleteRole(role.id);
      setRoles((prev) => prev.filter((r) => r.id !== role.id));
    } catch (err: any) {
      setDeleteError(err.message ?? "Failed to delete role.");
    } finally {
      setDeletingId(null);
    }
  };

  const isSystemRole = (name: string) =>
    name.toLowerCase() === "super admin";

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Roles & Permissions
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Create custom roles and define granular permissions per module.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={fetchRoles}
            className="p-2 rounded-xl border border-slate-200 text-slate-400 hover:text-slate-700 hover:bg-slate-50 transition-colors"
            title="Refresh"
          >
            <RefreshCw size={16} />
          </button>
          <Link
            href="/settings/roles/create"
            className="inline-flex items-center gap-2 bg-[#00184d] hover:bg-[#002470] text-white font-semibold px-4 py-2.5 rounded-xl text-sm shadow-sm transition-colors"
          >
            <PlusCircle size={16} />
            New Role
          </Link>
        </div>
      </div>

      {/* Delete Error Banner */}
      {deleteError && (
        <div className="flex items-start gap-3 bg-rose-50 border border-rose-200 rounded-xl p-4">
          <AlertCircle size={16} className="text-rose-500 mt-0.5 shrink-0" />
          <p className="text-sm text-rose-700">{deleteError}</p>
          <button
            onClick={() => setDeleteError(null)}
            className="ml-auto text-rose-400 hover:text-rose-600 text-xs font-semibold"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="flex items-center justify-center py-24">
          <Loader2 size={32} className="animate-spin text-slate-300" />
        </div>
      )}

      {/* Error */}
      {!loading && error && (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <AlertCircle size={40} className="text-rose-300" />
          <p className="text-slate-500 text-sm">{error}</p>
          <button
            onClick={fetchRoles}
            className="text-xs font-semibold text-[#00184d] underline"
          >
            Try again
          </button>
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && roles.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <div className="p-5 bg-slate-100 rounded-2xl">
            <Key size={36} className="text-slate-400" />
          </div>
          <div className="text-center">
            <p className="font-semibold text-slate-700">No roles yet</p>
            <p className="text-slate-400 text-sm mt-1">
              Create your first role to control access across the system.
            </p>
          </div>
          <Link
            href="/settings/roles/create"
            className="inline-flex items-center gap-2 bg-[#00184d] text-white font-semibold px-4 py-2.5 rounded-xl text-sm shadow-sm"
          >
            <PlusCircle size={16} />
            Create Role
          </Link>
        </div>
      )}

      {/* Roles Grid */}
      {!loading && !error && roles.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {roles.map((role) => {
            const color = isSystemRole(role.name)
              ? "bg-rose-100 text-rose-700"
              : getCardColor(role.name);
            const isDeleting = deletingId === role.id;

            return (
              <div
                key={role.id}
                className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 hover:shadow-md transition-shadow"
              >
                {/* Role Header */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <div className={`p-2.5 rounded-xl ${color}`}>
                      <ShieldCheck size={18} />
                    </div>
                    <div>
                      <h2 className="font-bold text-slate-800 text-sm">{role.name}</h2>
                      <span
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                          isSystemRole(role.name)
                            ? "bg-rose-50 text-rose-600"
                            : "bg-slate-100 text-slate-500"
                        }`}
                      >
                        {isSystemRole(role.name) ? "System Role" : "Custom"}
                      </span>
                    </div>
                  </div>
                </div>

                <p className="text-xs text-slate-500 mt-3 leading-relaxed min-h-[2.5rem]">
                  {role.description || (
                    <span className="italic text-slate-300">No description</span>
                  )}
                </p>

                {/* Counts */}
                <div className="mt-3 flex items-center gap-3 text-xs text-slate-400">
                  <span className="flex items-center gap-1">
                    <Key size={11} />
                    {role._count.rolePermissions} permissions
                  </span>
                  <span>·</span>
                  <span className="flex items-center gap-1">
                    <Users size={11} />
                    {role._count.userRoles}{" "}
                    {role._count.userRoles === 1 ? "user" : "users"}
                  </span>
                </div>

                <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <Link
                    href={`/settings/roles/${role.id}`}
                    className="flex items-center gap-1 text-xs font-semibold text-[#00184d] hover:underline"
                  >
                    Edit permissions <ChevronRight size={12} />
                  </Link>
                  {!isSystemRole(role.name) && (
                    <button
                      onClick={() => handleDelete(role)}
                      disabled={isDeleting}
                      className="p-1.5 rounded-lg hover:bg-rose-50 text-slate-400 hover:text-rose-500 transition-colors ml-1 disabled:opacity-50"
                      title="Delete role"
                    >
                      {isDeleting ? (
                        <Loader2 size={14} className="animate-spin" />
                      ) : (
                        <Trash2 size={14} />
                      )}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
