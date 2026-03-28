import { requireRole } from '@/lib/server-role';

export default async function BlogsPage() {
  await requireRole(['admin', 'member', 'user']);

  return (
    <div>
      <h1>Blogs</h1>
    </div>
  );
}
