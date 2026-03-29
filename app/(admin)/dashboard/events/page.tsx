'use client';

import { usePaginatedQuery, useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { useState } from 'react';
import { toast } from 'sonner';
import { EventForm } from '@/components/admin/eventform';
import {
  Plus, Edit, Trash2, Eye, EyeOff, Calendar,
  ChevronLeft, ChevronRight, Loader2,
} from 'lucide-react';
import { formatDate } from '@/lib/utils';
import type { Event } from '@/types';
import type { Id } from '@/convex/_generated/dataModel';
import Image from 'next/image';

const PAGE_SIZE = 10;

export default function AdminEventsPage() {
  const { results, status, loadMore } = usePaginatedQuery(
    api.events.listAllPaginated,
    {},
    { initialNumItems: PAGE_SIZE }
  );

  const remove = useMutation(api.events.remove);
  const update = useMutation(api.events.update);

  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Event | null>(null);
  const [page, setPage] = useState(0); // client-side page index into results[]

  const isLoadingFirst = status === 'LoadingFirstPage';
  const canLoadMore = status === 'CanLoadMore';
  const isLoadingMore = status === 'LoadingMore';

  // Slice the accumulated results into "pages" of PAGE_SIZE
  const totalLoaded = results.length;
  const totalPages = Math.max(1, Math.ceil(totalLoaded / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages - 1);
  const pageStart = currentPage * PAGE_SIZE;
  const pageEvents = results.slice(pageStart, pageStart + PAGE_SIZE);

  const handleDelete = async (id: Id<'events'>) => {
    if (!confirm('Delete this event?')) return;
    try {
      await remove({ id });
      toast.success('Event deleted');
    } catch (e: any) {
      toast.error(e.message ?? 'Failed to delete');
    }
  };

  const handleToggle = async (event: Event) => {
    try {
      await update({ id: event._id, published: !event.published });
      toast.success(event.published ? 'Event unpublished' : 'Event published');
    } catch (e: any) {
      toast.error(e.message ?? 'Failed to update');
    }
  };

  const goNext = () => {
    const nextPage = currentPage + 1;
    // If we've reached the end of loaded results and there's more, fetch it
    if (nextPage * PAGE_SIZE >= totalLoaded && canLoadMore) {
      loadMore(PAGE_SIZE);
    }
    setPage(nextPage);
  };

  const goPrev = () => setPage((p) => Math.max(0, p - 1));

  if (showForm || editing) {
    return (
      <EventForm
        initialData={editing ?? undefined}
        onSuccess={() => {
          setShowForm(false);
          setEditing(null);
        }}
        onCancel={() => {
          setShowForm(false);
          setEditing(null);
        }}
      />
    );
  }

  return (
    <div className="space-y-6 fade-up">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold font-display">Events</h1>
          <p className="text-sm text-muted-foreground">
            {isLoadingFirst ? '—' : `${totalLoaded}${canLoadMore || isLoadingMore ? '+' : ''}`} events loaded
          </p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
        >
          <Plus className="h-4 w-4" /> New Event
        </button>
      </div>

      <div className="rounded-xl border border-border/50 overflow-hidden">
        {isLoadingFirst ? (
          <div className="flex items-center justify-center py-20 gap-3 text-muted-foreground">
            <Loader2 className="h-5 w-5 animate-spin" />
            <span className="text-sm">Loading events…</span>
          </div>
        ) : results.length === 0 ? (
          <div className="py-20 text-center">
            <Calendar className="mx-auto h-10 w-10 text-muted-foreground mb-3" />
            <p className="text-muted-foreground">No events yet</p>
            <button
              onClick={() => setShowForm(true)}
              className="mt-3 text-sm text-primary hover:underline"
            >
              Create your first event
            </button>
          </div>
        ) : (
          <>
            <table className="w-full">
              <thead className="bg-secondary/40 border-b border-border/50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Title
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground hidden sm:table-cell">
                    Location
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground hidden sm:table-cell">
                    Date
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Status
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/30">
                {pageEvents.map((event) => (
                  <tr
                    key={event._id}
                    className="hover:bg-secondary/20 transition-colors"
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        {event.bannerImageUrl ? (
                          <Image
                            src={event.bannerImageUrl}
                            alt=""
                            className="h-10 w-16 rounded object-cover shrink-0"
                            width={64}
                            height={40}
                          />
                        ) : (
                          <div className="h-10 w-16 rounded bg-secondary/60 shrink-0 flex items-center justify-center">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                          </div>
                        )}
                        <span className="font-medium text-sm">{event.title}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-muted-foreground hidden sm:table-cell">
                      {event.location}
                    </td>
                    <td className="px-4 py-3 text-xs text-muted-foreground hidden sm:table-cell">
                      {formatDate(event.eventDate)}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                          event.published
                            ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400'
                            : 'bg-secondary/60 border border-border/40 text-muted-foreground'
                        }`}
                      >
                        {event.published ? 'Live' : 'Draft'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => handleToggle(event as Event)}
                          className="h-7 w-7 flex items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-secondary/60 transition-colors"
                          title={event.published ? 'Unpublish' : 'Publish'}
                        >
                          {event.published ? (
                            <EyeOff className="h-3.5 w-3.5" />
                          ) : (
                            <Eye className="h-3.5 w-3.5" />
                          )}
                        </button>
                        <button
                          onClick={() => setEditing(event as Event)}
                          className="h-7 w-7 flex items-center justify-center rounded-md text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
                          title="Edit"
                        >
                          <Edit className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(event._id)}
                          className="h-7 w-7 flex items-center justify-center rounded-md text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Pagination Controls */}
            {(totalPages > 1 || canLoadMore || isLoadingMore) && (
              <div className="flex items-center justify-between px-4 py-3 border-t border-border/40 bg-secondary/20">
                <p className="text-xs text-muted-foreground">
                  Page {currentPage + 1} of {totalPages}{canLoadMore || isLoadingMore ? '+' : ''}
                  {' · '}showing {pageStart + 1}–{Math.min(pageStart + PAGE_SIZE, totalLoaded)}
                </p>
                <div className="flex items-center gap-1">
                  <button
                    onClick={goPrev}
                    disabled={currentPage === 0}
                    className="h-7 w-7 flex items-center justify-center rounded-md border border-border/50 text-muted-foreground hover:text-foreground hover:bg-secondary/60 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>

                  {/* Page number pills */}
                  {Array.from({ length: totalPages }).map((_, i) => (
                    <button
                      key={i}
                      onClick={() => {
                        if (i * PAGE_SIZE >= totalLoaded && canLoadMore) {
                          loadMore(PAGE_SIZE);
                        }
                        setPage(i);
                      }}
                      className={`h-7 w-7 flex items-center justify-center rounded-md text-xs font-medium transition-colors ${
                        i === currentPage
                          ? 'bg-primary text-primary-foreground'
                          : 'border border-border/50 text-muted-foreground hover:text-foreground hover:bg-secondary/60'
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}

                  {/* Show ellipsis + loader when more pages exist on server */}
                  {(canLoadMore || isLoadingMore) && (
                    <button
                      onClick={() => { loadMore(PAGE_SIZE); setPage(totalPages); }}
                      disabled={isLoadingMore}
                      className="h-7 px-2 flex items-center justify-center rounded-md border border-border/50 text-xs text-muted-foreground hover:text-foreground hover:bg-secondary/60 disabled:opacity-40 transition-colors"
                    >
                      {isLoadingMore ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      ) : (
                        '···'
                      )}
                    </button>
                  )}

                  <button
                    onClick={goNext}
                    disabled={
                      (currentPage >= totalPages - 1 && !canLoadMore) ||
                      isLoadingMore
                    }
                    className="h-7 w-7 flex items-center justify-center rounded-md border border-border/50 text-muted-foreground hover:text-foreground hover:bg-secondary/60 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
