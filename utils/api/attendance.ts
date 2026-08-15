/**
 * utils/api/attendance.ts
 *
 * API client functions for employee attendance management.
 * Calls the NestJS backend /api/attendance endpoints.
 */

import { fetchWithAuth, parseAuthResponse } from "./client";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export interface AttendanceRecord {
  id: string;
  businessId: string;
  employeeId: string;
  date: string;
  status: 'present' | 'absent' | 'half_day' | 'late' | 'leave';
  hoursWorked: number | string | null;
  notes: string | null;
  enteredById: string | null;
  createdAt: string;
  updatedAt: string;
  employee?: {
    fullName: string;
    employeeCode: string;
    designation: string;
    department: string;
  };
}

export interface PaginatedAttendance {
  data: AttendanceRecord[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface CreateAttendancePayload {
  employeeId: string;
  date: string; // ISO string YYYY-MM-DD
  status: 'present' | 'absent' | 'half_day' | 'late' | 'leave';
  hoursWorked?: number | null;
  notes?: string | null;
}

export interface UpdateAttendancePayload {
  status?: 'present' | 'absent' | 'half_day' | 'late' | 'leave';
  hoursWorked?: number | null;
  notes?: string | null;
}

/**
 * GET /api/attendance — Get paginated attendance logs
 */
export async function getAttendance(params?: {
  page?: number;
  limit?: number;
  employeeId?: string;
  startDate?: string;
  endDate?: string;
  status?: string;
}): Promise<PaginatedAttendance> {
  const query = new URLSearchParams();
  if (params) {
    Object.entries(params).forEach(([key, val]) => {
      if (val !== undefined && val !== "All") {
        query.append(key, String(val));
      }
    });
  }
  const res = await fetchWithAuth(`${API_URL}/attendance?${query.toString()}`);
  return parseAuthResponse<PaginatedAttendance>(res);
}

/**
 * POST /api/attendance — Record attendance for an employee
 */
export async function createAttendance(payload: CreateAttendancePayload): Promise<AttendanceRecord> {
  const res = await fetchWithAuth(`${API_URL}/attendance`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
  return parseAuthResponse<AttendanceRecord>(res);
}

/**
 * PATCH /api/attendance/:id — Update attendance record
 */
export async function updateAttendance(
  id: string,
  payload: UpdateAttendancePayload
): Promise<AttendanceRecord> {
  const res = await fetchWithAuth(`${API_URL}/attendance/${id}`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
  return parseAuthResponse<AttendanceRecord>(res);
}

/**
 * DELETE /api/attendance/:id — Delete attendance record
 */
export async function deleteAttendance(id: string): Promise<void> {
  const res = await fetchWithAuth(`${API_URL}/attendance/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) {
    throw new Error("Failed to delete attendance record");
  }
}
