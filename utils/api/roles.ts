/**
 * utils/api/roles.ts
 *
 * API client functions for Roles & Permissions management.
 * Matches backend endpoints: GET/POST/PATCH/DELETE /api/roles,
 *   PUT /api/roles/:id/permissions, GET /api/roles/permissions
 */

import { fetchWithAuth, parseAuthResponse } from "./client";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

// ─── Types ───────────────────────────────────────────────────────────────────

export interface Permission {
  id: string;
  moduleCode: string;
  code: string;
  label: string;
  createdAt: string;
}

/** GET /api/roles/permissions — grouped by moduleCode */
export type PermissionsGrouped = Record<string, Permission[]>;

export interface RoleSummary {
  id: string;
  businessId: string;
  name: string;
  description: string | null;
  createdAt: string;
  updatedAt: string;
  _count: {
    rolePermissions: number;
    userRoles: number;
  };
}

export interface RoleUser {
  id: string;
  name: string;
  email: string;
  status: string;
}

export interface RoleDetail {
  id: string;
  businessId: string;
  name: string;
  description: string | null;
  createdAt: string;
  updatedAt: string;
  permissionsGrouped: Record<string, Permission[]>;
  users: RoleUser[];
  userCount: number;
}

export interface RoleWithPermissions {
  id: string;
  businessId: string;
  name: string;
  description: string | null;
  createdAt: string;
  updatedAt: string;
  rolePermissions: Array<{ permission: Permission }>;
}

// ─── API Functions ────────────────────────────────────────────────────────────

/** GET /api/roles/permissions — all system permissions grouped by module */
export async function getPermissionsGrouped(): Promise<PermissionsGrouped> {
  const res = await fetchWithAuth(`${API_URL}/roles/permissions`);
  return parseAuthResponse<PermissionsGrouped>(res);
}

/** GET /api/roles — list all roles in the current business */
export async function getRoles(): Promise<RoleSummary[]> {
  const res = await fetchWithAuth(`${API_URL}/roles`);
  return parseAuthResponse<RoleSummary[]>(res);
}

/** GET /api/roles/:id — get role details including permissions & users */
export async function getRoleById(id: string): Promise<RoleDetail> {
  const res = await fetchWithAuth(`${API_URL}/roles/${id}`);
  return parseAuthResponse<RoleDetail>(res);
}

/** POST /api/roles — create a new role.
 * businessId is required when the caller is an Owner (not a business user).
 */
export async function createRole(payload: {
  name: string;
  description?: string;
  permissionIds?: string[];
  businessId?: string;
}): Promise<RoleWithPermissions> {
  const res = await fetchWithAuth(`${API_URL}/roles`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
  return parseAuthResponse<RoleWithPermissions>(res);
}

/** PATCH /api/roles/:id — update role name/description */
export async function updateRole(
  id: string,
  payload: { name?: string; description?: string }
): Promise<RoleSummary> {
  const res = await fetchWithAuth(`${API_URL}/roles/${id}`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
  return parseAuthResponse<RoleSummary>(res);
}

/** DELETE /api/roles/:id — delete a role */
export async function deleteRole(id: string): Promise<{ success: boolean; message: string }> {
  const res = await fetchWithAuth(`${API_URL}/roles/${id}`, {
    method: "DELETE",
  });
  return parseAuthResponse<{ success: boolean; message: string }>(res);
}

/** PUT /api/roles/:id/permissions — replace the full permission set on a role */
export async function setRolePermissions(
  roleId: string,
  permissionIds: string[]
): Promise<RoleWithPermissions> {
  const res = await fetchWithAuth(`${API_URL}/roles/${roleId}/permissions`, {
    method: "PUT",
    body: JSON.stringify({ permissionIds }),
  });
  return parseAuthResponse<RoleWithPermissions>(res);
}
