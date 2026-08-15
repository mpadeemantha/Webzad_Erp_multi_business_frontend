/**
 * utils/api/payroll.ts
 *
 * API client functions for Payroll & Payslips.
 * Calls the NestJS backend /api/payroll endpoints.
 */

import { fetchWithAuth, parseAuthResponse } from "./client";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

// ─── Types ────────────────────────────────────────────────────────────────────

export interface PayrollRunSummary {
  id: string;
  businessId: string;
  month: number;
  year: number;
  periodStart: string;  // ISO date string — inclusive start of pay period
  periodEnd: string;    // ISO date string — inclusive end of pay period
  status: "draft" | "finalized";
  runById: string;
  runAt: string;
  createdAt: string;
  updatedAt: string;
  runBy: { id: string; name: string; email: string };
  _count: { payslips: number };
}

export interface PayslipEmployee {
  id: string;
  employeeCode: string;
  fullName: string;
  designation: string;
  department: string;
  nic?: string;
  joiningDate?: string;
}

export interface Payslip {
  id: string;
  payrollRunId: string;
  employeeId: string;
  businessId: string;
  month: number;
  year: number;
  basicSalary: string;
  fixedAllowances: string;
  dailyAllowanceTotal: string;
  unpaidLeaveDeduction: string;
  grossPay: string;
  epfEmployeeDeduction: string;
  otherDeductions: string;
  totalDeductions: string;
  netPay: string;
  epfEmployerContribution: string;
  etfEmployerContribution: string;
  pdfUrl: string | null;
  generatedAt: string;
  employee: PayslipEmployee;
  payrollRun?: {
    id: string;
    month: number;
    year: number;
    status: string;
  };
}

export interface PayrollRunDetail extends PayrollRunSummary {
  payslips: Payslip[];
}

export interface PaginatedPayrollRuns {
  data: PayrollRunSummary[];
  meta: { total: number; page: number; limit: number; totalPages: number };
}

// ─── Helper ───────────────────────────────────────────────────────────────────

/**
 * Safely converts any value coming from the API (string, number, or a
 * Prisma Decimal object that wasn't coerced server-side) to a float.
 */
function toFloat(value: unknown): number {
  if (typeof value === "number") return value;
  if (typeof value === "string") return parseFloat(value);
  // Prisma Decimal object: has a toFixed() method
  if (value !== null && typeof value === "object") {
    if (typeof (value as { toFixed?: unknown }).toFixed === "function") {
      return parseFloat((value as { toFixed: () => string }).toFixed());
    }
    // Last resort: coerce via toString
    return parseFloat(String(value));
  }
  return 0;
}

export function formatMoney(value: unknown): string {
  const num = toFloat(value);
  if (isNaN(num)) return "Rs. 0.00";
  return `Rs. ${num.toLocaleString("en-LK", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export function monthLabel(month: number, year: number): string {
  return new Date(year, month - 1, 1).toLocaleString("en", { month: "long", year: "numeric" });
}

// ─── Payroll Runs ─────────────────────────────────────────────────────────────

export async function getPayrollRuns(query?: {
  year?: number;
  page?: number;
  limit?: number;
}): Promise<PaginatedPayrollRuns> {
  const params = new URLSearchParams();
  if (query?.year) params.append("year", String(query.year));
  if (query?.page) params.append("page", String(query.page));
  if (query?.limit) params.append("limit", String(query.limit));
  const url = `${API_URL}/payroll/runs${params.toString() ? `?${params}` : ""}`;
  const res = await fetchWithAuth(url);
  return parseAuthResponse<PaginatedPayrollRuns>(res);
}

export async function runPayroll(startDate: string, endDate: string): Promise<PayrollRunDetail> {
  const res = await fetchWithAuth(`${API_URL}/payroll/runs`, {
    method: "POST",
    body: JSON.stringify({ startDate, endDate }),
  });
  return parseAuthResponse<PayrollRunDetail>(res);
}

export async function getPayrollRunDetail(id: string): Promise<PayrollRunDetail> {
  const res = await fetchWithAuth(`${API_URL}/payroll/runs/${id}`);
  return parseAuthResponse<PayrollRunDetail>(res);
}

export async function finalizePayrollRun(id: string): Promise<PayrollRunSummary> {
  const res = await fetchWithAuth(`${API_URL}/payroll/runs/${id}/finalize`, {
    method: "PATCH",
  });
  return parseAuthResponse<PayrollRunSummary>(res);
}

export async function deletePayrollRun(id: string): Promise<{ deleted: boolean; id: string }> {
  const res = await fetchWithAuth(`${API_URL}/payroll/runs/${id}`, {
    method: "DELETE",
  });
  return parseAuthResponse<{ deleted: boolean; id: string }>(res);
}

// ─── Payslips ─────────────────────────────────────────────────────────────────

export async function getPayslip(id: string): Promise<Payslip> {
  const res = await fetchWithAuth(`${API_URL}/payroll/payslips/${id}`);
  return parseAuthResponse<Payslip>(res);
}

export async function updatePayslipDeductions(
  id: string,
  otherDeductions: number
): Promise<Payslip> {
  const res = await fetchWithAuth(`${API_URL}/payroll/payslips/${id}`, {
    method: "PATCH",
    body: JSON.stringify({ otherDeductions }),
  });
  return parseAuthResponse<Payslip>(res);
}
