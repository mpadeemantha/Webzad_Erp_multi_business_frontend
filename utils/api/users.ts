/**
 * utils/api/users.ts
 *
 * API client functions for User management.
 * Calls the NestJS backend /api/users and /api/roles endpoints.
 */

import { fetchWithAuth, parseAuthResponse } from "./client";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export interface UserRoleSummary {
  id: string;
  name: string;
}

export interface UserAccount {
  id: string;
  businessId: string;
  name: string;
  email: string;
  status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';
  createdAt: string;
  updatedAt: string;
  roles: UserRoleSummary[];
}

export interface PaginatedUsers {
  data: UserAccount[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface Role {
  id: string;
  businessId: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

// ─── Users API ───────────────────────────────────────────────────────────────

export async function getUsers(params?: {
  status?: string;
  search?: string;
  page?: number;
  limit?: number;
}): Promise<PaginatedUsers> {
  const query = new URLSearchParams();
  if (params) {
    Object.entries(params).forEach(([key, val]) => {
      if (val !== undefined && val !== "All" && val !== "") {
        query.append(key, String(val));
      }
    });
  }
  const res = await fetchWithAuth(`${API_URL}/users?${query.toString()}`);
  return parseAuthResponse<PaginatedUsers>(res);
}

export async function getUserById(id: string): Promise<UserAccount> {
  const res = await fetchWithAuth(`${API_URL}/users/${id}`);
  return parseAuthResponse<UserAccount>(res);
}

export async function createUser(payload: {
  name: string;
  email: string;
  password?: string;
  status?: string;
}): Promise<UserAccount> {
  const res = await fetchWithAuth(`${API_URL}/users`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
  return parseAuthResponse<UserAccount>(res);
}

export async function updateUser(
  id: string,
  payload: {
    name?: string;
    email?: string;
    status?: string;
  }
): Promise<UserAccount> {
  const res = await fetchWithAuth(`${API_URL}/users/${id}`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
  return parseAuthResponse<UserAccount>(res);
}

export async function deactivateUser(id: string): Promise<{ success: boolean; message: string }> {
  const res = await fetchWithAuth(`${API_URL}/users/${id}`, {
    method: "DELETE",
  });
  return parseAuthResponse<{ success: boolean; message: string }>(res);
}

export async function assignRoleToUser(userId: string, roleId: string): Promise<any> {
  const res = await fetchWithAuth(`${API_URL}/users/${userId}/roles`, {
    method: "POST",
    body: JSON.stringify({ roleId }),
  });
  return parseAuthResponse<any>(res);
}

export async function removeRoleFromUser(userId: string, roleId: string): Promise<any> {
  const res = await fetchWithAuth(`${API_URL}/users/${userId}/roles/${roleId}`, {
    method: "DELETE",
  });
  return parseAuthResponse<any>(res);
}

export async function resetUserPassword(userId: string, newPassword: string): Promise<any> {
  const res = await fetchWithAuth(`${API_URL}/users/${userId}/reset-password`, {
    method: "PATCH",
    body: JSON.stringify({ newPassword }),
  });
  return parseAuthResponse<any>(res);
}

// ─── Roles API ───────────────────────────────────────────────────────────────

export async function getRoles(): Promise<Role[]> {
  const res = await fetchWithAuth(`${API_URL}/roles`);
  return parseAuthResponse<Role[]>(res);
}
