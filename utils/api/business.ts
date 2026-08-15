/**
 * utils/api/business.ts
 *
 * API client functions for business management.
 * Calls the NestJS backend /api/businesses endpoints.
 * Uses fetchWithAuth for automatic token refresh on 401.
 */

import { fetchWithAuth, parseAuthResponse } from "./client";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

// ─── Types ───────────────────────────────────────────────────────────────────

export interface BusinessModule {
  id: string;
  moduleId: string;
  isActive: boolean;
  module: {
    id: string;
    name: string;
    code: string;
    description?: string;
  };
}

export interface Business {
  id: string;
  name: string;
  address?: string;
  zipCode?: string;
  country?: string;
  state?: string;
  phone?: string;
  mobile?: string;
  web?: string;
  email?: string;
  vatId?: string;
  status?: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';
  logoUrl?: string;
  deletedAt?: string;
  ownerId: string;
  createdAt: string;
  updatedAt: string;
  _count?: {
    users: number;
    businessModules: number;
  };
  businessModules?: BusinessModule[];
}

export interface Module {
  id: string;
  name: string;
  code: string;
  description?: string;
}

// ─── API Helpers ─────────────────────────────────────────────────────────────

/**
 * GET /api/businesses/:id — Fetch a single business
 */
export async function getBusiness(businessId: string): Promise<Business> {
  const res = await fetchWithAuth(`${API_URL}/businesses/${businessId}`);
  return parseAuthResponse<Business>(res);
}

export type BusinessUpdatePayload = Partial<Omit<Business, 'id' | 'ownerId' | 'createdAt' | 'updatedAt' | 'deletedAt' | '_count' | 'businessModules' | 'logoUrl'>>;

/**
 * PATCH /api/businesses/:id — Update business details
 */
export async function updateBusiness(
  businessId: string,
  payload: BusinessUpdatePayload
): Promise<Business> {
  const res = await fetchWithAuth(
    `${API_URL}/businesses/${businessId}`,
    { method: 'PATCH', body: JSON.stringify(payload) }
  );
  return parseAuthResponse<Business>(res);
}

/**
 * DELETE /api/businesses/:id — Delete a business
 */
export async function deleteBusiness(id: string): Promise<void> {
  await fetchWithAuth(`${API_URL}/businesses/${id}`, { method: "DELETE" });
}

/**
 * POST /api/businesses/:id/restore — Restore a soft-deleted business
 */
export async function restoreBusiness(id: string): Promise<void> {
  await fetchWithAuth(`${API_URL}/businesses/${id}/restore`, { method: "POST" });
}

/**
 * POST /api/businesses — Create a new business
 */
export async function createBusiness(
  payload: {
    name: string;
    address?: string;
    zipCode?: string;
    country?: string;
    state?: string;
    phone?: string;
    mobile?: string;
    web?: string;
    email?: string;
    vatId?: string;
    status?: string;
  }
): Promise<Business> {
  const res = await fetchWithAuth(`${API_URL}/businesses`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
  return parseAuthResponse<Business>(res);
}

/**
 * GET /api/businesses — List all businesses belonging to the owner
 */
export async function listBusinesses(): Promise<Business[]> {
  const res = await fetchWithAuth(`${API_URL}/businesses`);
  return parseAuthResponse<Business[]>(res);
}

/**
 * GET /api/businesses/modules — List all available modules (seeded)
 */
export async function listAvailableModules(): Promise<Module[]> {
  const res = await fetchWithAuth(`${API_URL}/businesses/modules`);
  return parseAuthResponse<Module[]>(res);
}

/**
 * POST /api/businesses/:id/modules/install — Install a module by its DB id
 */
export async function installModule(
  businessId: string,
  moduleId: string
): Promise<BusinessModule> {
  const res = await fetchWithAuth(
    `${API_URL}/businesses/${businessId}/modules/install`,
    { method: "POST", body: JSON.stringify({ moduleId }) }
  );
  return parseAuthResponse<BusinessModule>(res);
}

/**
 * PUT /api/businesses/:id/logo — Upload/replace the business logo
 */
export async function uploadBusinessLogo(
  businessId: string,
  file: File
): Promise<Business> {
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetchWithAuth(
    `${API_URL}/businesses/${businessId}/logo`,
    { method: "PUT", body: formData },
    true // isFormData — skip Content-Type header so browser sets multipart boundary
  );
  return parseAuthResponse<Business>(res);
}
