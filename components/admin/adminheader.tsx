'use client';

import { UserButton } from '@clerk/nextjs';
import { Bell } from 'lucide-react';
import { ThemeToggle } from '@/components/commons/ThemeToggle';
import { AdminMobileSidebar } from './adminSidebar';
import { type AppRole } from '@/lib/roles';

export function AdminHeader({ role }: { role: AppRole }) {
  return (
    <header className="flex items-center justify-between border-b border-border/50 bg-card/40 backdrop-blur-sm px-6 py-3">
      <div className="flex items-center gap-3">
        <AdminMobileSidebar role={role} />
        <h1 className="font-display text-sm font-semibold text-muted-foreground">
          Admin Dashboard
        </h1>
      </div>
      <div className="flex items-center gap-3">
        <ThemeToggle />
        <button className="flex h-8 w-8 items-center justify-center rounded-md border border-border/60 bg-secondary/40 text-muted-foreground hover:text-foreground transition-colors">
          <Bell className="h-4 w-4" />
        </button>
        <UserButton />
      </div>
    </header>
  );
}
