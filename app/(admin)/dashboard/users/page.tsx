import UsersPageClient from './users-page-client';
import { requireRole } from '@/lib/server-role';

export default async function UsersPage() {
  await requireRole(['admin'], '/dashboard');
  return <UsersPageClient />;
}
