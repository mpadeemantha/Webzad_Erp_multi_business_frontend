/**
 * utils/api/client.ts
 *
 * Shared authenticated fetch utility.
 * Automatically refreshes the access token on 401 and retries the request once.
 * If refresh also fails, clears tokens and redirects to /login.
 */

const API_URL = process.env.NEXT_PUBLIC_API_URL;

/** Silently refreshes the access token using the stored refresh token. Returns true on success. */
async function silentRefresh(): Promise<boolean> {
  const refreshToken =
    typeof window !== "undefined" ? localStorage.getItem("refreshToken") : null;
  if (!refreshToken) return false;

  try {
    const res = await fetch(`${API_URL}/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken }),
    });
    if (!res.ok) return false;

    const data = await res.json();
    const tokens = data?.data ?? data;
    if (!tokens?.accessToken) return false;

    localStorage.setItem("accessToken", tokens.accessToken);
    if (tokens.refreshToken) {
      localStorage.setItem("refreshToken", tokens.refreshToken);
    }
    return true;
  } catch {
    return false;
  }
}

/** Redirect to login and clear all auth state. */
function redirectToLogin() {
  if (typeof window !== "undefined") {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("ownerProfile");
    window.location.href = "/login";
  }
}

/**
 * Performs an authenticated fetch request.
 * On 401, attempts a silent token refresh and retries once.
 * On second failure, redirects to /login.
 *
 * @param url        Full URL to fetch
 * @param init       Standard RequestInit (method, body, etc.) — do NOT set Authorization header, it's injected here
 * @param isFormData Set to true when body is FormData (skips Content-Type header)
 */
export async function fetchWithAuth(
  url: string,
  init: RequestInit = {},
  isFormData = false
): Promise<Response> {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;

  const activeBizId =
    typeof window !== "undefined" ? localStorage.getItem("activeBizId") : null;

  if (!token) {
    redirectToLogin();
    // Return a fake 401 so callers don't throw a different error
    return new Response(JSON.stringify({ message: "No access token" }), { status: 401 });
  }

  const headers: Record<string, string> = {
    Authorization: `Bearer ${token}`,
    ...(activeBizId ? { "x-business-id": activeBizId } : {}),
    ...(isFormData ? {} : { "Content-Type": "application/json" }),
    ...(init.headers as Record<string, string> ?? {}),
  };

  let res = await fetch(url, { ...init, headers });

  // 401 → try to silently refresh once
  if (res.status === 401) {
    const refreshed = await silentRefresh();
    if (!refreshed) {
      redirectToLogin();
      return res;
    }

    const newToken = localStorage.getItem("accessToken")!;
    headers["Authorization"] = `Bearer ${newToken}`;
    res = await fetch(url, { ...init, headers });

    // Still 401 after refresh → force re-login
    if (res.status === 401) {
      redirectToLogin();
    }
  }

  return res;
}

/** Parse a fetchWithAuth response, unwrap the NestJS ResponseTransformInterceptor envelope. */
export async function parseAuthResponse<T>(res: Response): Promise<T> {
  let data: any;
  try {
    data = await res.json();
  } catch {
    throw new Error("Unexpected response from server.");
  }
  if (!res.ok) {
    const msg = Array.isArray(data?.message)
      ? data.message.join(". ")
      : data?.message ?? "Request failed.";
    throw new Error(msg);
  }
  return (data?.data ?? data) as T;
}
