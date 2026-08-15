/**
 * utils/permissions.ts
 *
 * Client-side permission utilities.
 * Decodes the JWT access token to read the permissions[] and type embedded at login time.
 * Owners (type === 'owner') have access to everything.
 * Users (type === 'user') only see what their roles grant them.
 *
 * NOTE: Permissions are baked into the JWT at login. If a role is updated,
 * the user must re-login (or token must be refreshed) for changes to take effect.
 */

export interface DecodedJwt {
  sub: string;
  type: 'owner' | 'user';
  businessId?: string;
  roles?: string[];
  permissions?: string[]; // e.g. ['hr.view', 'stock.edit', ...]
  exp?: number;
  iat?: number;
}

/** Decode the JWT payload (base64url → JSON). Returns null on any error. */
export function decodeJwt(token: string): DecodedJwt | null {
  try {
    const base64Payload = token.split('.')[1];
    if (!base64Payload) return null;
    // Replace URL-safe base64 chars and pad
    const padded = base64Payload.replace(/-/g, '+').replace(/_/g, '/');
    const jsonStr = atob(padded);
    return JSON.parse(jsonStr) as DecodedJwt;
  } catch {
    return null;
  }
}

/** Read the access token from localStorage and decode it. */
export function getDecodedToken(): DecodedJwt | null {
  if (typeof window === 'undefined') return null;
  const token = localStorage.getItem('accessToken');
  if (!token) return null;
  return decodeJwt(token);
}

/**
 * Returns true if the current user is a business owner.
 * Owners have implicit access to all features.
 */
export function isOwner(): boolean {
  return getDecodedToken()?.type === 'owner';
}

/**
 * Returns the current user's permission codes.
 * Owners get a wildcard — all permission checks return true.
 */
export function getPermissions(): string[] {
  const decoded = getDecodedToken();
  if (!decoded) return [];
  if (decoded.type === 'owner') return ['*']; // owners have all permissions
  return decoded.permissions ?? [];
}

/**
 * Check if the current user has a specific permission code.
 * Owners always return true.
 *
 * @param code - Permission code, e.g. 'hr.view'
 */
export function hasPermission(code: string): boolean {
  const perms = getPermissions();
  return perms.includes('*') || perms.includes(code);
}

/**
 * Check if the current user has ANY of the given permission codes.
 * Owners always return true.
 */
export function hasAnyPermission(codes: string[]): boolean {
  const perms = getPermissions();
  if (perms.includes('*')) return true;
  return codes.some(c => perms.includes(c));
}
