import { requireRole } from '@/lib/server-role';

export default async function DashboardPage() {
  await requireRole(['admin', 'member'], '/dashboard/blogs');

  return (
    <div>
      <h1>Dashboard</h1>
    </div>
  );
}
