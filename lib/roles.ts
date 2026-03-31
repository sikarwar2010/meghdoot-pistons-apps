export type AppRole = 'admin' | 'member' | 'user';
export type StoredRole = AppRole | null | undefined;

export function normalizeRole(role: StoredRole): AppRole {
  if (role === 'admin') return 'admin';
  if (role === 'member') return 'member';
  return 'user';
}

export function canAccessUsersPanel(role: StoredRole): boolean {
  return normalizeRole(role) === 'admin';
}

export function canAccessDashboardHome(role: StoredRole): boolean {
  const normalizedRole = normalizeRole(role);
  return normalizedRole === 'admin' || normalizedRole === 'member';
}
