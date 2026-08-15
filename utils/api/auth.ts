/**
 * utils/api/auth.ts
 *
 * API client functions for owner authentication.
 * Calls the NestJS backend auth endpoints.
 */

import { fetchWithAuth, parseAuthResponse } from "./client";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export interface OwnerLoginResponse {
  accessToken: string;
  refreshToken: string;
  owner: {
    id: string;
    name: string;
    email: string;
    createdAt: string;
  };
}

/**
 * Authenticates a business owner against the backend.
 * Throws an error with the server's message on failure.
 */
export async function ownerLogin(
  email: string,
  password: string
): Promise<OwnerLoginResponse> {
  const res = await fetch(`${API_URL}/auth/owner/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  // Parse response JSON regardless of status code
  let data: any;
  try {
    data = await res.json();
  } catch {
    throw new Error("Unexpected response from server. Please try again.");
  }

  if (!res.ok) {
    // Backend returns { statusCode, message, error }
    const msg = Array.isArray(data?.message)
      ? data.message.join(". ")
      : data?.message ?? "Login failed. Please check your credentials.";
    throw new Error(msg);
  }

  // Success envelope: { success: true, data: { accessToken, refreshToken, owner }, timestamp }
  // The backend wraps responses via ResponseTransformInterceptor
  return (data?.data ?? data) as OwnerLoginResponse;
}

export interface OwnerProfile {
  id: string;
  name: string;
  email: string;
  firstName?: string; // Standardize for layout context
  lastName?: string;  // Standardize for layout context
  phone?: string;     // Standardize for layout context
  avatarUrl?: string; // Profile picture URL from Supabase storage
}

/**
 * Fetches the currently authenticated owner profile using GET /auth/me
 */
export async function getMeProfile(): Promise<OwnerProfile> {
  const res = await fetchWithAuth(`${API_URL}/auth/me`);
  const data = await parseAuthResponse<{ owner?: OwnerProfile; user?: OwnerProfile }>(res);
  const ownerData = data?.owner ?? data?.user ?? (data as any);
  if (!ownerData) throw new Error("Profile data missing in response");
  return ownerData;
}

/**
 * Updates the current profile (owner or user) on the backend database.
 */
export async function updateMeProfile(profile: Partial<OwnerProfile>): Promise<OwnerProfile> {
  const res = await fetchWithAuth(`${API_URL}/auth/profile`, {
    method: "POST",
    body: JSON.stringify(profile),
  });
  const data = await parseAuthResponse<{ owner?: OwnerProfile; user?: OwnerProfile }>(res);
  return data?.owner ?? data?.user ?? (data as any);
}

/**
 * Uploads a profile avatar photo using PUT /auth/avatar
 */
export async function uploadMeAvatar(file: File): Promise<OwnerProfile> {
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetchWithAuth(
    `${API_URL}/auth/avatar`,
    { method: "PUT", body: formData },
    true // isFormData
  );
  const data = await parseAuthResponse<{ owner?: OwnerProfile; user?: OwnerProfile }>(res);
  return data?.owner ?? data?.user ?? (data as any);
}

export interface UserLoginResponse {
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    name: string;
    email: string;
    businessId: string;
    status: string;
    createdAt: string;
  };
}

/**
 * Authenticates a staff user against the backend.
 * businessId is optional — if omitted, the backend attempts lookup by email.
 */
export async function userLogin(
  businessId: string | undefined,
  email: string,
  password: string
): Promise<UserLoginResponse> {
  const payload: any = { email, password };
  if (businessId) {
    payload.businessId = businessId;
  }

  const res = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });


  let data: any;
  try {
    data = await res.json();
  } catch {
    throw new Error("Unexpected response from server. Please try again.");
  }

  if (!res.ok) {
    const msg = Array.isArray(data?.message)
      ? data.message.join(". ")
      : data?.message ?? "Login failed. Please check your credentials.";
    throw new Error(msg);
  }

  return (data?.data ?? data) as UserLoginResponse;
}

/**
 * Initiates the forgot password flow.
 */
export async function forgotPassword(email: string): Promise<{ success: boolean; message: string }> {
  const res = await fetch(`${API_URL}/auth/forgot-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });

  let data: any;
  try {
    data = await res.json();
  } catch {
    throw new Error("Unexpected response from server. Please try again.");
  }

  if (!res.ok) {
    const msg = Array.isArray(data?.message)
      ? data.message.join(". ")
      : data?.message ?? "Failed to request password reset.";
    throw new Error(msg);
  }

  return data?.data ?? data;
}

/**
 * Resets a password using a reset token.
 */
export async function resetPassword(resetToken: string, newPassword: string): Promise<{ success: boolean; message: string }> {
  const res = await fetch(`${API_URL}/auth/reset-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ resetToken, newPassword }),
  });

  let data: any;
  try {
    data = await res.json();
  } catch {
    throw new Error("Unexpected response from server. Please try again.");
  }

  if (!res.ok) {
    const msg = Array.isArray(data?.message)
      ? data.message.join(". ")
      : data?.message ?? "Failed to reset password.";
    throw new Error(msg);
  }

  return data?.data ?? data;
}
