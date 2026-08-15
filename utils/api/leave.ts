/**
 * utils/api/leave.ts
 *
 * API client functions for employee leave management.
 * Calls the NestJS backend /api/leave endpoints.
 */

import { fetchWithAuth, parseAuthResponse } from "./client";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export interface LeaveType {
  id: string;
  businessId: string;
  name: string;
  defaultDaysPerYear: number;
  createdAt: string;
  updatedAt: string;
}

export interface LeaveBalance {
  id: string;
  employeeId: string;
  leaveTypeId: string;
  year: number;
  allocatedDays: string | number;
  usedDays: string | number;
  createdAt: string;
  updatedAt: string;
  leaveType?: LeaveType;
}

export interface LeaveRequest {
  id: string;
  businessId: string;
  employeeId: string;
  leaveTypeId: string;
  startDate: string;
  endDate: string;
  totalDays: string | number;
  reason: string | null;
  status: 'pending' | 'approved' | 'rejected';
  enteredById: string;
  approvedById: string | null;
  approvedAt: string | null;
  createdAt: string;
  updatedAt: string;
  employee?: {
    fullName: string;
    employeeCode: string;
    designation: string;
    department: string;
  };
  leaveType?: LeaveType;
}

export interface PaginatedLeaveRequests {
  data: LeaveRequest[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

// ─── Leave Types ─────────────────────────────────────────────────────────────

export async function getLeaveTypes(): Promise<LeaveType[]> {
  const res = await fetchWithAuth(`${API_URL}/leave-types`);
  return parseAuthResponse<LeaveType[]>(res);
}

export async function createLeaveType(payload: { name: string; defaultDaysPerYear: number }): Promise<LeaveType> {
  const res = await fetchWithAuth(`${API_URL}/leave-types`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
  return parseAuthResponse<LeaveType>(res);
}

export async function updateLeaveType(id: string, payload: { name?: string; defaultDaysPerYear?: number }): Promise<LeaveType> {
  const res = await fetchWithAuth(`${API_URL}/leave-types/${id}`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
  return parseAuthResponse<LeaveType>(res);
}

// ─── Leave Balances ──────────────────────────────────────────────────────────

export async function allocateLeaveBalances(year: number): Promise<{ message: string; allocatedRecordsCount: number }> {
  const res = await fetchWithAuth(`${API_URL}/leave-balances/allocate`, {
    method: "POST",
    body: JSON.stringify({ year }),
  });
  return parseAuthResponse<{ message: string; allocatedRecordsCount: number }>(res);
}

export async function getEmployeeLeaveBalances(employeeId: string, year: number): Promise<LeaveBalance[]> {
  const res = await fetchWithAuth(`${API_URL}/leave-balances/employee/${employeeId}?year=${year}`);
  return parseAuthResponse<LeaveBalance[]>(res);
}

export async function updateLeaveBalance(id: string, allocatedDays: number): Promise<LeaveBalance> {
  const res = await fetchWithAuth(`${API_URL}/leave-balances/${id}`, {
    method: "PATCH",
    body: JSON.stringify({ allocatedDays }),
  });
  return parseAuthResponse<LeaveBalance>(res);
}

// ─── Leave Requests ──────────────────────────────────────────────────────────

export interface GetLeaveRequestsFilter {
  employeeId?: string;
  status?: string;
  leaveTypeId?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
}

export async function getLeaveRequests(query?: GetLeaveRequestsFilter): Promise<PaginatedLeaveRequests> {
  const params = new URLSearchParams();
  if (query) {
    if (query.employeeId) params.append("employeeId", query.employeeId);
    if (query.status && query.status !== "All") params.append("status", query.status.toLowerCase());
    if (query.leaveTypeId) params.append("leaveTypeId", query.leaveTypeId);
    if (query.startDate) params.append("startDate", query.startDate);
    if (query.endDate) params.append("endDate", query.endDate);
    if (query.page) params.append("page", String(query.page));
    if (query.limit) params.append("limit", String(query.limit));
  }

  const url = `${API_URL}/leave-requests${params.toString() ? `?${params.toString()}` : ""}`;
  const res = await fetchWithAuth(url);
  return parseAuthResponse<PaginatedLeaveRequests>(res);
}

export async function createLeaveRequest(payload: {
  employeeId: string;
  leaveTypeId: string;
  startDate: string;
  endDate: string;
  reason?: string;
  allowBackdated?: boolean;
}): Promise<{ request: LeaveRequest; warning: string | null }> {
  const res = await fetchWithAuth(`${API_URL}/leave-requests`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
  return parseAuthResponse<{ request: LeaveRequest; warning: string | null }>(res);
}

export async function approveLeaveRequest(id: string): Promise<LeaveRequest> {
  const res = await fetchWithAuth(`${API_URL}/leave-requests/${id}/approve`, {
    method: "PATCH",
  });
  return parseAuthResponse<LeaveRequest>(res);
}

export async function rejectLeaveRequest(id: string): Promise<LeaveRequest> {
  const res = await fetchWithAuth(`${API_URL}/leave-requests/${id}/reject`, {
    method: "PATCH",
  });
  return parseAuthResponse<LeaveRequest>(res);
}

export async function deleteLeaveRequest(id: string): Promise<void> {
  const res = await fetchWithAuth(`${API_URL}/leave-requests/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to delete leave request.");
  }
}
