/**
 * utils/api/hr-settings.ts
 *
 * API client functions for HR Settings.
 * Calls the NestJS backend /api/hr-settings endpoints.
 */

import { fetchWithAuth, parseAuthResponse } from "./client";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export interface HrSettings {
  id: string;
  businessId: string;
  epfEmployeeRate: string | number;
  epfEmployerRate: string | number;
  etfEmployerRate: string | number;
  workingDaysPerMonth: number;
  currencyCode: string;
  payslipFooterNote: string | null;
  createdAt: string;
  updatedAt: string;
}

export async function getHrSettings(): Promise<HrSettings> {
  const res = await fetchWithAuth(`${API_URL}/hr-settings`);
  return parseAuthResponse<HrSettings>(res);
}

export async function updateHrSettings(data: Partial<HrSettings>): Promise<HrSettings> {
  const res = await fetchWithAuth(`${API_URL}/hr-settings`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
  return parseAuthResponse<HrSettings>(res);
}
