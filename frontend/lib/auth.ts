import Cookies from 'js-cookie';
import { authApi } from './api';

export interface AuthUser {
  id: number;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  role: string;
  roles: string[];
  is_active: boolean;
  language: string;
}

export function setAuthTokens(accessToken: string, tenantId: string): void {
  Cookies.set('access_token', accessToken, { expires: 1, secure: true, sameSite: 'strict' });
  Cookies.set('tenant_id', tenantId,       { expires: 30, secure: true, sameSite: 'strict' });
}

export function clearAuthTokens(): void {
  Cookies.remove('access_token');
  Cookies.remove('tenant_id');
}

export function getAccessToken(): string | undefined {
  return Cookies.get('access_token');
}

export function getTenantId(): string | undefined {
  return Cookies.get('tenant_id');
}

export async function fetchCurrentUser(): Promise<AuthUser | null> {
  try {
    const { data } = await authApi.me();
    return data.user as AuthUser;
  } catch {
    return null;
  }
}

export function hasRole(user: AuthUser | null, ...roles: string[]): boolean {
  if (!user) return false;
  return roles.some((r) => user.roles.includes(r));
}
