/**
 * utils/api/employees.ts
 *
 * API client functions for employee management.
 * Calls the NestJS backend /api/employees endpoints.
 */

import { fetchWithAuth, parseAuthResponse } from "./client";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export interface Employee {
  id: string;
  businessId: string;
  employeeCode: string;
  fullName: string;
  nic: string;
  phone: string;
  email: string | null;
  address: string;
  designation: string;
  department: string;
  joiningDate: string;
  basicSalary: number | string;
  fixedAllowances: number | string;
  dailyAllowance: number | string;
  hourlyRate?: number | string;
  status: 'active' | 'inactive' | 'suspended';
  userId: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface PaginatedEmployees {
  data: Employee[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface CreateEmployeePayload {
  fullName: string;
  nic: string;
  phone: string;
  email?: string;
  address: string;
  designation: string;
  department: string;
  joiningDate: string;
  basicSalary?: number;
  fixedAllowances?: number;
  dailyAllowance?: number;
  hourlyRate?: number;
}

/**
 * GET /api/employees — Get paginated employee list with filters
 */
export async function getEmployees(params?: {
  page?: number;
  limit?: number;
  department?: string;
  designation?: string;
  status?: string;
  search?: string;
}): Promise<PaginatedEmployees> {
  const query = new URLSearchParams();
  if (params) {
    Object.entries(params).forEach(([key, val]) => {
      if (val !== undefined && val !== "All") {
        query.append(key, String(val));
      }
    });
  }
  const res = await fetchWithAuth(`${API_URL}/employees?${query.toString()}`);
  return parseAuthResponse<PaginatedEmployees>(res);
}

/**
 * POST /api/employees — Create a new employee
 */
export async function createEmployee(payload: CreateEmployeePayload): Promise<Employee> {
  const res = await fetchWithAuth(`${API_URL}/employees`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
  return parseAuthResponse<Employee>(res);
}

/**
 * GET /api/employees/:id — Fetch a single employee
 */
export async function getEmployee(id: string): Promise<Employee> {
  const res = await fetchWithAuth(`${API_URL}/employees/${id}`);
  return parseAuthResponse<Employee>(res);
}

/**
 * PATCH /api/employees/:id — Update an employee
 */
export async function updateEmployee(id: string, payload: Partial<CreateEmployeePayload> & { status?: string }): Promise<Employee> {
  const res = await fetchWithAuth(`${API_URL}/employees/${id}`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
  return parseAuthResponse<Employee>(res);
}
