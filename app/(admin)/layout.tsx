import { AdminHeader } from "@/components/admin/adminheader";
import { AdminSidebar } from "@/components/admin/adminSidebar";
import { getCurrentRole } from "@/lib/server-role";

export default async function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const role = await getCurrentRole();

  return (
    <div>
      <div className="flex h-screen overflow-hidden bg-background">
        <AdminSidebar role={role} />
        <div className="flex flex-1 flex-col overflow-hidden">
          <AdminHeader role={role} />
          <main className="flex-1 overflow-y-auto px-6 py-6">{children}</main>
        </div>
      </div>
    </div>
  );
}
