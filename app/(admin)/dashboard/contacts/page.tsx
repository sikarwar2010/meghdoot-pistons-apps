'use client';

import { useQuery, useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { toast } from 'sonner';
import {
  CheckCircle,
  Trash2,
  MessageSquare,
  Phone,
  Mail,
  Clock,
} from 'lucide-react';
import { formatDateTime } from '@/lib/utils';
import type { Id } from '@/convex/_generated/dataModel';
import { useState } from 'react';

export default function AdminContactsPage() {
  const [filter, setFilter] = useState<boolean | undefined>(undefined);
  const contacts = useQuery(api.contacts.listAll, { resolved: filter });
  const markResolved = useMutation(api.contacts.markResolved);
  const remove = useMutation(api.contacts.remove);

  const handleResolve = async (id: Id<'contacts'>) => {
    try {
      await markResolved({ id });
      toast.success('Marked as resolved');
    } catch (e: any) {
      toast.error(e.message ?? 'Failed');
    }
  };

  const handleDelete = async (id: Id<'contacts'>) => {
    if (!confirm('Delete this contact query?')) return;
    try {
      await remove({ id });
      toast.success('Query deleted');
    } catch (e: any) {
      toast.error(e.message ?? 'Failed');
    }
  };

  const allContacts = useQuery(api.contacts.listAll, {});
  const openCount = allContacts?.filter((c) => !c.resolved).length ?? 0;
  const resolvedCount = allContacts?.filter((c) => c.resolved).length ?? 0;

  return (
    <div className="space-y-6 fade-up">
      <div>
        <h1 className="text-2xl font-bold font-display">Contact Queries</h1>
        <p className="text-sm text-muted-foreground">
          {openCount} open · {resolvedCount} resolved
        </p>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2">
        {[
          { label: 'All', value: undefined },
          { label: 'Open', value: false },
          { label: 'Resolved', value: true },
        ].map((tab) => (
          <button
            key={String(tab.value)}
            onClick={() => setFilter(tab.value)}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
              filter === tab.value
                ? 'bg-primary/15 border border-primary/30 text-primary'
                : 'border border-border/50 bg-secondary/30 text-muted-foreground hover:text-foreground'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {!contacts || contacts.length === 0 ? (
        <div className="rounded-xl border border-border/40 bg-card/30 py-20 text-center">
          <MessageSquare className="mx-auto h-10 w-10 text-muted-foreground mb-3" />
          <p className="text-muted-foreground">No contact queries found</p>
        </div>
      ) : (
        <div className="space-y-3">
          {contacts.map((contact) => (
            <div
              key={contact._id}
              className={`rounded-xl border bg-card/40 p-5 transition-all ${
                contact.resolved
                  ? 'border-border/30 opacity-70'
                  : 'border-amber-500/20 bg-amber-500/3'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2 flex-wrap">
                    <span className="font-semibold">{contact.name}</span>
                    {!contact.resolved && (
                      <span className="rounded-full border border-amber-500/30 bg-amber-500/10 px-2 py-0.5 text-xs font-medium text-amber-400">
                        Open
                      </span>
                    )}
                    {contact.resolved && (
                      <span className="rounded-full border border-border/40 bg-secondary/60 px-2 py-0.5 text-xs text-muted-foreground">
                        Resolved
                      </span>
                    )}
                  </div>
                  <div className="flex flex-wrap items-center gap-4 mb-3 text-xs text-muted-foreground">
                    <a
                      href={`mailto:${contact.email}`}
                      className="flex items-center gap-1.5 hover:text-primary transition-colors"
                    >
                      <Mail className="h-3.5 w-3.5" />
                      {contact.email}
                    </a>
                    {contact.phone && (
                      <a
                        href={`tel:${contact.phone}`}
                        className="flex items-center gap-1.5 hover:text-primary transition-colors"
                      >
                        <Phone className="h-3.5 w-3.5" />
                        {contact.phone}
                      </a>
                    )}
                    <span className="flex items-center gap-1.5">
                      <Clock className="h-3.5 w-3.5" />
                      {formatDateTime(contact.createdAt)}
                    </span>
                  </div>
                  <p className="text-sm text-foreground/80 leading-relaxed bg-secondary/30 rounded-lg p-3 border border-border/30">
                    {contact.message}
                  </p>
                </div>
                <div className="flex sm:flex-col gap-2 sm:ml-4">
                  {!contact.resolved && (
                    <button
                      onClick={() => handleResolve(contact._id)}
                      title="Mark resolved"
                      className="flex items-center gap-2 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-xs font-medium text-emerald-400 hover:bg-emerald-500/20 transition-colors"
                    >
                      <CheckCircle className="h-3.5 w-3.5" />
                      Resolve
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(contact._id)}
                    className="flex items-center gap-2 rounded-lg border border-border/40 bg-secondary/30 px-3 py-2 text-xs font-medium text-muted-foreground hover:text-destructive hover:border-destructive/30 hover:bg-destructive/10 transition-colors"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
