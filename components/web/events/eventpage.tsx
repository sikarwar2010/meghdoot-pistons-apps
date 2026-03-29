'use client';

import { usePaginatedQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import Link from 'next/link';
import { formatDate } from '@/lib/utils';
import { Calendar, MapPin, ArrowRight, Loader2 } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

const PAGE_SIZE = 6;

export default function EventsPage() {
  const { results, status, loadMore } = usePaginatedQuery(
    api.events.listPublishedPaginated,
    {},
    { initialNumItems: PAGE_SIZE }
  );

  const isLoading = status === 'LoadingFirstPage';
  const canLoadMore = status === 'CanLoadMore';
  const isLoadingMore = status === 'LoadingMore';

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 fade-up">
      <div className="mb-10">
        <div className="flex items-center gap-2 mb-3">
          <Calendar className="h-5 w-5 text-primary" />
          <span className="text-sm font-medium text-primary uppercase tracking-wider">
            Events
          </span>
        </div>
        <h1 className="text-4xl font-bold tracking-tight mb-3">
          Upcoming Events
        </h1>
        <p className="text-muted-foreground">
          Trade shows, technical training sessions, and product launches.
        </p>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-44 w-full rounded-xl" />
          ))}
        </div>
      ) : results.length === 0 ? (
        <div className="rounded-xl border border-border/40 bg-card/30 py-20 text-center">
          <Calendar className="mx-auto h-10 w-10 text-muted-foreground mb-3" />
          <p className="text-muted-foreground">No upcoming events scheduled.</p>
        </div>
      ) : (
        <>
          <div className="space-y-4">
            {results.map((event) => (
              <Link
                key={event._id}
                href={`/events/${event._id}`}
                className="group gradient-border flex flex-col sm:flex-row overflow-hidden rounded-xl border border-border/50 bg-card/60 hover:bg-card/90 transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-primary/5"
              >
                {/* Banner */}
                <div className="sm:w-64 sm:shrink-0 aspect-video sm:aspect-auto overflow-hidden bg-secondary/40">
                  {event.bannerImageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={event.bannerImageUrl}
                      alt={event.title}
                      className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center bg-linear-to-br from-secondary/80 to-primary/10">
                      <Calendar className="h-12 w-12 text-primary/30" />
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 p-6 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-4 mb-3 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1.5">
                        <Calendar className="h-3.5 w-3.5 text-primary" />
                        {formatDate(event.eventDate)}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <MapPin className="h-3.5 w-3.5 text-primary" />
                        {event.location}
                      </span>
                    </div>
                    <h2 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
                      {event.title}
                    </h2>
                    <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">
                      {event.description}
                    </p>
                  </div>
                  <div className="mt-4 flex items-center gap-1 text-xs font-medium text-primary">
                    View Details{' '}
                    <ArrowRight className="h-3 w-3 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Load More */}
          {(canLoadMore || isLoadingMore) && (
            <div className="mt-8 flex justify-center">
              <button
                onClick={() => loadMore(PAGE_SIZE)}
                disabled={isLoadingMore}
                className="flex items-center gap-2 rounded-lg border border-border/60 bg-card/60 px-6 py-2.5 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-card/90 hover:border-primary/30 transition-all disabled:opacity-60"
              >
                {isLoadingMore ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Loading…
                  </>
                ) : (
                  <>
                    Load More Events
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
