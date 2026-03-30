'use client';

import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { useParams } from 'next/navigation';
import { formatDateTime } from '@/lib/utils';
import { ArrowLeft, Calendar, MapPin, Clock } from 'lucide-react';
import Link from 'next/link';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import type { Id } from '@/convex/_generated/dataModel';

export default function EventDetailPage() {
  const { id } = useParams<{ id: string }>();
  const event = useQuery(api.events.getById, { id: id as Id<'events'> });

  if (event === undefined) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
        <Skeleton className="h-8 w-32 mb-8" />
        <Skeleton className="aspect-video w-full rounded-xl mb-8" />
        <Skeleton className="h-12 w-3/4 mb-4" />
        <Skeleton className="h-4 w-64 mb-8" />
      </div>
    );
  }

  if (!event || !event.published) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-24 sm:px-6 text-center">
        <h1 className="text-2xl font-bold mb-4">Event Not Found</h1>
        <Link href="/events" className="text-primary hover:underline">
          ← Back to Events
        </Link>
      </div>
    );
  }

  const eventDate = new Date(event.eventDate);
  const month = eventDate.toLocaleString('default', { month: 'long' });
  const day = eventDate.getDate();
  const year = eventDate.getFullYear();
  const dayOfWeek = eventDate.toLocaleString('default', { weekday: 'long' });
  const time = formatDateTime(event.eventDate);

  const isPast = event.eventDate < Date.now();

  return (
    <article className="mx-auto max-w-4xl px-4 py-12 sm:px-6 fade-up">
      <Link
        href="/events"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-8"
      >
        <ArrowLeft className="h-4 w-4" /> Back to Events
      </Link>

      {/* Banner */}
      {event.bannerImageUrl && (
        <div className="mb-8 overflow-hidden rounded-xl aspect-video bg-secondary/40 relative">
          <img
            src={event.bannerImageUrl}
            alt={event.title}
            className="h-full w-full object-cover"
          />
          {/* Status Badge */}
          <div className="absolute top-4 right-4">
            <Badge
              className={`${
                isPast
                  ? 'bg-secondary/90 text-muted-foreground'
                  : 'bg-primary/90 text-primary-foreground'
              } backdrop-blur-sm text-sm px-4 py-2`}
            >
              {isPast ? 'Past Event' : 'Upcoming Event'}
            </Badge>
          </div>
        </div>
      )}

      {/* Header Section */}
      <div className="mb-8">
        {/* Date Display */}
        <div className="flex items-start gap-4 mb-6">
          <div
            className={`flex flex-col items-center justify-center rounded-xl px-4 py-3 ${
              isPast
                ? 'bg-secondary/50 text-muted-foreground'
                : 'bg-primary text-primary-foreground'
            }`}
          >
            <span className="text-sm font-medium uppercase">{month}</span>
            <span className="text-3xl font-bold leading-none">{day}</span>
            <span className="text-xs opacity-70">{year}</span>
          </div>
          <div className="flex-1 pt-1">
            <div className="text-sm text-muted-foreground mb-1">
              {dayOfWeek}
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span className="text-sm">{time}</span>
            </div>
          </div>
        </div>

        {/* Title and Location */}
        <h1 className="text-4xl font-bold leading-tight mb-4">{event.title}</h1>

        <div className="flex items-center gap-2 text-muted-foreground">
          <MapPin className="h-4 w-4" />
          <span className="text-base">{event.location}</span>
        </div>
      </div>

      {/* Description */}
      <div className="rounded-xl border border-border/40 bg-card/40 p-6">
        <h2 className="text-lg font-semibold mb-4">About This Event</h2>
        <div className="text-foreground leading-relaxed whitespace-pre-wrap">
          {event.description}
        </div>
      </div>
    </article>
  );
}
