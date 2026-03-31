import 'server-only';

import { auth } from '@clerk/nextjs/server';
import { fetchQuery } from 'convex/nextjs';
import { redirect } from 'next/navigation';
import { cache } from 'react';
import { api } from '@/convex/_generated/api';
import { normalizeRole, type AppRole } from '@/lib/roles';

export const getCurrentRole = cache(async (): Promise<AppRole> => {
  const authState = await auth();

  if (!authState.userId) {
    return authState.redirectToSignIn();
  }

  const token = await authState.getToken({ template: 'convex' });
  if (!token) return 'user';

  try {
    const role = await fetchQuery(api.users.getCurrentUserRole, {}, { token });
    return normalizeRole(role);
  } catch {
    // If token exchange/query fails, fall back to least-privileged role.
    return 'user';
  }
});

export async function requireRole(
  allowedRoles: AppRole[],
  redirectPath = '/dashboard/blogs'
): Promise<AppRole> {
  const role = await getCurrentRole();
  if (!allowedRoles.includes(role)) {
    redirect(redirectPath);
  }
  return role;
}
