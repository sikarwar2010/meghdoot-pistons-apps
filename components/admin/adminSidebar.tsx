'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  BookOpen,
  Calendar,
  Package,
  MessageSquare,
  Users,
  Cog,
  ChevronRight,
  Menu,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { normalizeRole, type AppRole } from '@/lib/roles';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from '@/components/ui/sheet';

const nav = [
  { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { label: 'Blog Posts', href: '/dashboard/blogs', icon: BookOpen },
  { label: 'Events', href: '/dashboard/events', icon: Calendar },
  { label: 'Catalog', href: '/dashboard/catalog', icon: Package },
  { label: 'Contacts', href: '/dashboard/contacts', icon: MessageSquare },
  { label: 'Users', href: '/dashboard/users', icon: Users },
];

function getVisibleNavItems(role: AppRole) {
  const normalizedRole = normalizeRole(role);
  if (normalizedRole === 'admin') return nav;
  if (normalizedRole === 'member') {
    return nav.filter((item) => item.href !== '/dashboard/users');
  }
  return nav.filter(
    (item) => item.href === '/dashboard' || item.href === '/dashboard/blogs'
  );
}

function SidebarContent({ role }: { role: AppRole }) {
  const pathname = usePathname();
  const visibleNav = getVisibleNavItems(role);

  return (
    <>
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-5 py-4 border-b border-border/50">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/20 border border-primary/30">
          <Cog className="h-4 w-4 text-primary" />
        </div>
        <div>
          <div className="text-sm font-bold font-display">
            <span className="text-primary">Meghdoot</span>Pistons
          </div>
          <div className="text-[10px] text-muted-foreground uppercase tracking-widest">
            Admin Panel
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        <p className="px-3 mb-2 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60">
          Management
        </p>
        {visibleNav.map((item) => {
          const active =
            item.href === '/dashboard'
              ? pathname === '/dashboard'
              : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all',
                active
                  ? 'bg-primary/15 border border-primary/25 text-primary'
                  : 'text-muted-foreground hover:text-foreground hover:bg-secondary/60'
              )}
            >
              <item.icon
                className={cn('h-4 w-4 shrink-0', active ? 'text-primary' : '')}
              />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-3 py-4 border-t border-border/40">
        <Link
          href="/"
          className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-muted-foreground hover:text-foreground hover:bg-secondary/60 transition-colors"
        >
          <ChevronRight className="h-4 w-4 rotate-180" />
          View Public Site
        </Link>
      </div>
    </>
  );
}

export function AdminSidebar({ role }: { role: AppRole }) {
  return (
    <aside
      className="hidden lg:flex flex-col border-r border-border/50 bg-card/60 backdrop-blur-sm"
      style={{ width: 'var(--sidebar-width)' }}
    >
      <SidebarContent role={role} />
    </aside>
  );
}

export function AdminMobileSidebar({ role }: { role: AppRole }) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <button className="flex lg:hidden h-8 w-8 items-center justify-center rounded-md border border-border/60 bg-secondary/40 text-muted-foreground hover:text-foreground transition-colors">
          <Menu className="h-4 w-4" />
        </button>
      </SheetTrigger>
      <SheetContent
        side="left"
        className="p-0 w-28 flex flex-col bg-card/95 backdrop-blur-sm border-r border-border/50"
      >
        <SheetTitle className="sr-only">Menu</SheetTitle>
        <SidebarContent role={role} />
      </SheetContent>
    </Sheet>
  );
}
