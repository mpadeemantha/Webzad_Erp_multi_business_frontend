"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  PlusCircle, Search, Pencil, Trash2, ShieldCheck, CheckCircle,
  XCircle, Mail, Loader2, AlertCircle, X, ShieldAlert, KeyRound,
  RefreshCw, ChevronLeft, ChevronRight, UserPlus, ShieldPlus, Key
} from "lucide-react";
import {
  getUsers, createUser, updateUser, deactivateUser,
  assignRoleToUser, removeRoleFromUser, resetUserPassword,
  UserAccount
} from "@/utils/api/users";
import { getRoles, RoleSummary } from "@/utils/api/roles";

export default function UserAccountsPage() {
  // Lists
  const [users, setUsers] = useState<UserAccount[]>([]);
  const [roles, setRoles] = useState<RoleSummary[]>([]);
  const [rolesLoading, setRolesLoading] = useState(false);
  const [rolesError, setRolesError] = useState<string | null>(null);

  // Filtering & Pagination
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Loaders & Errors
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modals state
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isRolesOpen, setIsRolesOpen] = useState(false);
  const [isPasswordOpen, setIsPasswordOpen] = useState(false);

  // Action targets
  const [selectedUser, setSelectedUser] = useState<UserAccount | null>(null);

  // Form Fields
  const [formName, setFormName] = useState("");
  const [formEmail, setFormEmail] = useState("");
  const [formPassword, setFormPassword] = useState("");
  const [formStatus, setFormStatus] = useState("ACTIVE");
  const [formNewPassword, setFormNewPassword] = useState("");

  const [modalLoading, setModalLoading] = useState(false);
  const [modalError, setModalError] = useState<string | null>(null);

  // Load Roles
  const loadRoles = async () => {
    setRolesLoading(true);
    setRolesError(null);
    try {
      const data = await getRoles();
      setRoles(data || []);
    } catch (err: any) {
      setRolesError(err?.message || "Failed to load roles.");
    } finally {
      setRolesLoading(false);
    }
  };

  // Load Users
  const loadUsers = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await getUsers({
        search,
        status: statusFilter === "All" ? undefined : statusFilter,
        page,
        limit: 10
      });
      setUsers(res.data || []);
      setTotalPages(res.meta?.totalPages || 1);
    } catch (err: any) {
      setError(err?.message || "Failed to load user accounts.");
    } finally {
      setIsLoading(false);
    }
  }, [search, statusFilter, page]);

  useEffect(() => {
    loadUsers();
    loadRoles();
  }, [loadUsers]);

  // Handle Create User
  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setModalLoading(true);
    setModalError(null);
    try {
      await createUser({
        name: formName,
        email: formEmail,
        password: formPassword || undefined,
        status: formStatus
      });
      setIsCreateOpen(false);
      resetForm();
      loadUsers();
    } catch (err: any) {
      setModalError(err?.message || "Failed to create user.");
    } finally {
      setModalLoading(false);
    }
  };

  // Handle Edit User
  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) return;
    setModalLoading(true);
    setModalError(null);
    try {
      await updateUser(selectedUser.id, {
        name: formName,
        email: formEmail,
        status: formStatus
      });
      setIsEditOpen(false);
      resetForm();
      loadUsers();
    } catch (err: any) {
      setModalError(err?.message || "Failed to update user.");
    } finally {
      setModalLoading(false);
    }
  };

  // Handle Deactivate User
  const handleDeactivate = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to deactivate ${name}? This will block system access.`)) return;
    try {
      await deactivateUser(id);
      loadUsers();
    } catch (err: any) {
      alert(err?.message || "Failed to deactivate user.");
    }
  };

  // Handle Role Assignment/Revocation
  const handleToggleRole = async (roleId: string, hasRole: boolean) => {
    if (!selectedUser) return;
    setModalLoading(true);
    setModalError(null);
    try {
      if (hasRole) {
        await removeRoleFromUser(selectedUser.id, roleId);
      } else {
        await assignRoleToUser(selectedUser.id, roleId);
      }
      // Optimistically update selectedUser roles in the modal
      const roleObj = roles.find(r => r.id === roleId);
      const newRoles = hasRole
        ? selectedUser.roles.filter(r => r.id !== roleId)
        : [...selectedUser.roles, { id: roleId, name: roleObj?.name ?? "" }];
      const nextUser = { ...selectedUser, roles: newRoles };
      setSelectedUser(nextUser);
      // Also update the roles list user count
      setRoles(prev => prev.map(r =>
        r.id === roleId
          ? { ...r, _count: { ...r._count, userRoles: r._count.userRoles + (hasRole ? -1 : 1) } }
          : r
      ));
      // Sync table rows in background
      loadUsers();
    } catch (err: any) {
      setModalError(err?.message || "Failed to modify role assignment.");
    } finally {
      setModalLoading(false);
    }
  };


  // Handle Password Reset
  const handleResetPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) return;
    setModalLoading(true);
    setModalError(null);
    try {
      await resetUserPassword(selectedUser.id, formNewPassword);
      setIsPasswordOpen(false);
      resetForm();
      alert("Password reset successfully.");
    } catch (err: any) {
      setModalError(err?.message || "Failed to reset password.");
    } finally {
      setModalLoading(false);
    }
  };

  const resetForm = () => {
    setSelectedUser(null);
    setFormName("");
    setFormEmail("");
    setFormPassword("");
    setFormStatus("ACTIVE");
    setFormNewPassword("");
    setModalError(null);
  };

  const openCreateModal = () => {
    resetForm();
    setIsCreateOpen(true);
  };

  const openEditModal = (user: UserAccount) => {
    resetForm();
    setSelectedUser(user);
    setFormName(user.name);
    setFormEmail(user.email);
    setFormStatus(user.status);
    setIsEditOpen(true);
  };

  const openRolesModal = (user: UserAccount) => {
    resetForm();
    setSelectedUser(user);
    setIsRolesOpen(true);
    loadRoles(); // always fetch fresh when opening modal
  };


  const openPasswordModal = (user: UserAccount) => {
    resetForm();
    setSelectedUser(user);
    setIsPasswordOpen(true);
  };

  const getInitials = (name: string) => {
    return name.split(" ").map(n => n[0]).slice(0, 2).join("").toUpperCase();
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">User Accounts</h1>
          <p className="text-slate-500 text-sm mt-1">Manage system logins, credentials, and role assignments for all workspace staff.</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={loadUsers}
            disabled={isLoading}
            className="p-2.5 rounded-xl bg-white border border-slate-200 text-slate-500 hover:text-blue-900 hover:border-slate-300 transition-colors shadow-sm disabled:opacity-50"
            title="Refresh Users"
          >
            <RefreshCw size={15} className={isLoading ? "animate-spin" : ""} />
          </button>
          <button
            onClick={openCreateModal}
            className="inline-flex items-center gap-2 bg-[#00184d] hover:bg-blue-900 text-white font-semibold px-4 py-2.5 rounded-xl text-sm shadow-sm transition-colors"
          >
            <PlusCircle size={16} />
            Add User Account
          </button>
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-2.5 bg-rose-50 border border-rose-200 rounded-xl px-4 py-3 text-rose-800 text-sm">
          <AlertCircle size={16} className="text-rose-500 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Filter and Search controls */}
      <div className="flex flex-col md:flex-row gap-3">
        <div className="relative flex-1 max-w-md">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            placeholder="Search by name or email..."
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#00184d]/10 focus:border-[#00184d] transition-all"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
          className="px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#00184d]/10"
        >
          <option value="All">All Statuses</option>
          <option value="ACTIVE">Active</option>
          <option value="INACTIVE">Inactive</option>
          <option value="SUSPENDED">Suspended</option>
        </select>
      </div>

      {/* Users table */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 size={32} className="animate-spin text-slate-300" />
          </div>
        ) : users.length === 0 ? (
          <div className="text-center py-20 text-slate-400">
            <UserPlus size={48} className="mx-auto text-slate-200 mb-3" />
            <p className="font-semibold text-slate-700">No User Accounts Found</p>
            <p className="text-xs text-slate-400 mt-1">Try resetting filters or add a new account.</p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="border-b border-slate-100 bg-slate-50/50">
              <tr>
                <th className="px-5 py-3.5 text-left font-semibold text-slate-500 text-xs uppercase tracking-wide">User</th>
                <th className="px-5 py-3.5 text-left font-semibold text-slate-500 text-xs uppercase tracking-wide">Roles</th>
                <th className="px-5 py-3.5 text-left font-semibold text-slate-500 text-xs uppercase tracking-wide hidden md:table-cell">Created At</th>
                <th className="px-5 py-3.5 text-left font-semibold text-slate-500 text-xs uppercase tracking-wide">Status</th>
                <th className="px-5 py-3.5 text-right font-semibold text-slate-500 text-xs uppercase tracking-wide">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-[#00184d]/10 text-[#00184d] flex items-center justify-center font-bold text-xs shrink-0">
                        {getInitials(user.name)}
                      </div>
                      <div>
                        <p className="font-semibold text-slate-800">{user.name}</p>
                        <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                          <Mail size={10} />{user.email}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex flex-wrap gap-1 items-center">
                      {user.roles.length === 0 ? (
                        <span className="text-xs text-slate-400">No roles</span>
                      ) : (
                        user.roles.map(r => (
                          <span key={r.id} className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded bg-blue-50 text-blue-700">
                            <ShieldCheck size={10} />
                            {r.name}
                          </span>
                        ))
                      )}
                      <button
                        onClick={() => openRolesModal(user)}
                        className="p-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-700 transition-colors"
                        title="Manage Roles"
                      >
                        <ShieldPlus size={11} />
                      </button>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-xs text-slate-400 hidden md:table-cell">
                    {new Date(user.createdAt).toLocaleDateString("en-LK")}
                  </td>
                  <td className="px-5 py-4">
                    {user.status === "ACTIVE" ? (
                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full">
                        <CheckCircle size={11} /> Active
                      </span>
                    ) : user.status === "SUSPENDED" ? (
                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full">
                        <ShieldAlert size={11} /> Suspended
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full">
                        <XCircle size={11} /> Inactive
                      </span>
                    )}
                  </td>
                  <td className="px-5 py-4 text-right">
                    <div className="flex items-center gap-1 justify-end">
                      <button
                        onClick={() => openPasswordModal(user)}
                        className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors"
                        title="Reset Password"
                      >
                        <KeyRound size={14} />
                      </button>
                      <button
                        onClick={() => openEditModal(user)}
                        className="p-1.5 rounded-lg hover:bg-blue-50 text-slate-400 hover:text-blue-600 transition-colors"
                        title="Edit User"
                      >
                        <Pencil size={14} />
                      </button>
                      {user.status !== "INACTIVE" && (
                        <button
                          onClick={() => handleDeactivate(user.id, user.name)}
                          className="p-1.5 rounded-lg hover:bg-rose-50 text-slate-400 hover:text-rose-500 transition-colors"
                          title="Deactivate Account"
                        >
                          <Trash2 size={14} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-5 py-3 border-t border-slate-100 flex items-center justify-between bg-slate-50/50">
            <span className="text-xs text-slate-500">Page {page} of {totalPages}</span>
            <div className="flex items-center gap-1">
              <button
                disabled={page <= 1}
                onClick={() => setPage(p => Math.max(p - 1, 1))}
                className="p-1 rounded border border-slate-200 text-slate-600 hover:bg-white disabled:opacity-50"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                disabled={page >= totalPages}
                onClick={() => setPage(p => Math.min(p + 1, totalPages))}
                className="p-1 rounded border border-slate-200 text-slate-600 hover:bg-white disabled:opacity-50"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* CREATE MODAL */}
      {isCreateOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
          <form onSubmit={handleCreate} className="bg-white rounded-2xl shadow-xl max-w-sm w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="text-base font-bold text-slate-900">Add User Account</h2>
              <button type="button" onClick={() => setIsCreateOpen(false)} className="p-1 text-slate-400 hover:text-slate-600 rounded">
                <X size={18} />
              </button>
            </div>

            {modalError && (
              <div className="flex items-center gap-2 bg-rose-50 border border-rose-200 rounded-xl px-3 py-2 text-rose-800 text-xs">
                <AlertCircle size={14} className="text-rose-500 shrink-0" />
                <span>{modalError}</span>
              </div>
            )}

            <div className="space-y-3">
              <div>
                <label className="block text-slate-700 font-semibold mb-1 text-xs">Full Name</label>
                <input
                  type="text"
                  required
                  value={formName}
                  onChange={e => setFormName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:bg-white"
                  placeholder="e.g. Ruwan Silva"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1 text-xs">Email Address</label>
                <input
                  type="email"
                  required
                  value={formEmail}
                  onChange={e => setFormEmail(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:bg-white"
                  placeholder="e.g. ruwan@carservice.lk"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1 text-xs">Temporary Password</label>
                <input
                  type="password"
                  required
                  value={formPassword}
                  onChange={e => setFormPassword(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:bg-white"
                  placeholder="At least 8 chars, 1 letter & 1 digit"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1 text-xs">Status</label>
                <select
                  value={formStatus}
                  onChange={e => setFormStatus(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none"
                >
                  <option value="ACTIVE">Active</option>
                  <option value="INACTIVE">Inactive</option>
                </select>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setIsCreateOpen(false)}
                className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl text-xs font-semibold hover:bg-slate-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={modalLoading}
                className="px-4 py-2 bg-[#00184d] text-white rounded-xl text-xs font-semibold hover:bg-blue-900 flex items-center gap-1.5 disabled:opacity-70"
              >
                {modalLoading ? <Loader2 size={14} className="animate-spin" /> : null}
                Save User
              </button>
            </div>
          </form>
        </div>
      )}

      {/* EDIT MODAL */}
      {isEditOpen && selectedUser && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
          <form onSubmit={handleEdit} className="bg-white rounded-2xl shadow-xl max-w-sm w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="text-base font-bold text-slate-900">Edit User Details</h2>
              <button type="button" onClick={() => setIsEditOpen(false)} className="p-1 text-slate-400 hover:text-slate-600 rounded">
                <X size={18} />
              </button>
            </div>

            {modalError && (
              <div className="flex items-center gap-2 bg-rose-50 border border-rose-200 rounded-xl px-3 py-2 text-rose-800 text-xs">
                <AlertCircle size={14} className="text-rose-500 shrink-0" />
                <span>{modalError}</span>
              </div>
            )}

            <div className="space-y-3">
              <div>
                <label className="block text-slate-700 font-semibold mb-1 text-xs">Full Name</label>
                <input
                  type="text"
                  required
                  value={formName}
                  onChange={e => setFormName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1 text-xs">Email Address</label>
                <input
                  type="email"
                  required
                  value={formEmail}
                  onChange={e => setFormEmail(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1 text-xs">Status</label>
                <select
                  value={formStatus}
                  onChange={e => setFormStatus(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none"
                >
                  <option value="ACTIVE">Active</option>
                  <option value="INACTIVE">Inactive</option>
                  <option value="SUSPENDED">Suspended</option>
                </select>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setIsEditOpen(false)}
                className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl text-xs font-semibold hover:bg-slate-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={modalLoading}
                className="px-4 py-2 bg-[#00184d] text-white rounded-xl text-xs font-semibold hover:bg-blue-900 flex items-center gap-1.5 disabled:opacity-70"
              >
                {modalLoading ? <Loader2 size={14} className="animate-spin" /> : null}
                Save Changes
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ROLES MODAL */}
      {isRolesOpen && selectedUser && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 space-y-4">
            {/* Header */}
            <div className="flex items-start justify-between border-b border-slate-100 pb-3">
              <div>
                <h2 className="text-base font-bold text-slate-900">Assign Roles</h2>
                <p className="text-xs text-slate-400 mt-0.5">{selectedUser.name} · {selectedUser.email}</p>
              </div>
              <button onClick={() => setIsRolesOpen(false)} className="p-1 text-slate-400 hover:text-slate-600 rounded">
                <X size={18} />
              </button>
            </div>

            {/* Modal error */}
            {modalError && (
              <div className="flex items-center gap-2 bg-rose-50 border border-rose-200 rounded-xl px-3 py-2 text-rose-800 text-xs">
                <AlertCircle size={14} className="text-rose-500 shrink-0" />
                <span>{modalError}</span>
              </div>
            )}

            {/* Roles error */}
            {rolesError && (
              <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-xl px-3 py-2 text-amber-800 text-xs">
                <AlertCircle size={14} className="text-amber-500 shrink-0" />
                <span>{rolesError}</span>
                <button onClick={loadRoles} className="ml-auto underline font-semibold">Retry</button>
              </div>
            )}

            {/* Roles loading */}
            {rolesLoading && (
              <div className="flex items-center justify-center py-6">
                <Loader2 size={20} className="animate-spin text-slate-300" />
              </div>
            )}

            {/* Roles list */}
            {!rolesLoading && (
              <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                {roles.length === 0 ? (
                  <div className="text-center py-8">
                    <Key size={28} className="mx-auto text-slate-200 mb-2" />
                    <p className="text-xs text-slate-400">No roles found.</p>
                    <p className="text-[11px] text-slate-400 mt-1">Create roles under Settings → Roles first.</p>
                  </div>
                ) : (
                  roles.map(role => {
                    const hasRole = selectedUser.roles.some(r => r.id === role.id);
                    const isSystem = role.name.toLowerCase() === "super admin";
                    return (
                      <div
                        key={role.id}
                        className={`flex items-center justify-between p-3 rounded-xl border transition-colors ${
                          hasRole ? "bg-blue-50/50 border-blue-200" : "border-slate-100 hover:bg-slate-50"
                        }`}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className={`p-1.5 rounded-lg ${
                            isSystem ? "bg-rose-100 text-rose-600" : "bg-slate-100 text-slate-500"
                          }`}>
                            <ShieldCheck size={13} />
                          </div>
                          <div className="min-w-0">
                            <p className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                              {role.name}
                              {hasRole && (
                                <span className="text-[9px] font-semibold bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded-full">Assigned</span>
                              )}
                            </p>
                            <p className="text-[10px] text-slate-400 mt-0.5 flex items-center gap-2">
                              <span>{role._count.rolePermissions} permissions</span>
                              <span>·</span>
                              <span>{role._count.userRoles} {role._count.userRoles === 1 ? 'user' : 'users'}</span>
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => handleToggleRole(role.id, hasRole)}
                          disabled={modalLoading}
                          className={`shrink-0 text-xs font-bold px-3 py-1.5 rounded-lg transition-colors disabled:opacity-50 ${
                            hasRole
                              ? "bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200"
                              : "bg-[#00184d] hover:bg-[#002470] text-white"
                          }`}
                        >
                          {modalLoading ? <Loader2 size={12} className="animate-spin" /> : hasRole ? "Revoke" : "Assign"}
                        </button>
                      </div>
                    );
                  })
                )}
              </div>
            )}

            <div className="flex justify-end pt-1">
              <button
                onClick={() => setIsRolesOpen(false)}
                className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl text-xs font-semibold hover:bg-slate-200"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PASSWORD MODAL */}
      {isPasswordOpen && selectedUser && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
          <form onSubmit={handleResetPasswordSubmit} className="bg-white rounded-2xl shadow-xl max-w-sm w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="text-base font-bold text-slate-900">Reset User Password</h2>
              <button type="button" onClick={() => setIsPasswordOpen(false)} className="p-1 text-slate-400 hover:text-slate-600 rounded">
                <X size={18} />
              </button>
            </div>

            {modalError && (
              <div className="flex items-center gap-2 bg-rose-50 border border-rose-200 rounded-xl px-3 py-2 text-rose-800 text-xs">
                <AlertCircle size={14} className="text-rose-500 shrink-0" />
                <span>{modalError}</span>
              </div>
            )}

            <div>
              <label className="block text-slate-700 font-semibold mb-1 text-xs">New Password for {selectedUser.name}</label>
              <input
                type="password"
                required
                value={formNewPassword}
                onChange={e => setFormNewPassword(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:bg-white"
                placeholder="At least 8 chars, 1 letter & 1 digit"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setIsPasswordOpen(false)}
                className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl text-xs font-semibold hover:bg-slate-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={modalLoading}
                className="px-4 py-2 bg-rose-600 text-white rounded-xl text-xs font-semibold hover:bg-rose-700 flex items-center gap-1.5 disabled:opacity-70"
              >
                {modalLoading ? <Loader2 size={14} className="animate-spin" /> : null}
                Reset Password
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
