'use client';

import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import Link from 'next/link';
import { formatDate } from '@/lib/utils';
import {
  Calendar,
  MapPin,
  ArrowRight,
  Clock,
  CheckCircle2,
} from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';

export default function EventsPage() {
  const allEvents = useQuery(api.events.listPublished);

  // Separate upcoming and past events based on eventDate
  const now = Date.now();
  const upcomingEvents =
    allEvents
      ?.filter((e) => e.eventDate >= now)
      .sort((a, b) => a.eventDate - b.eventDate) || [];
  const pastEvents =
    allEvents
      ?.filter((e) => e.eventDate < now)
      .sort((a, b) => b.eventDate - a.eventDate) || [];

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 fade-up">
      {/* Header */}
      <div className="mb-12">
        <div className="flex items-center gap-2 mb-3">
          <Calendar className="h-5 w-5 text-primary" />
          <span className="text-sm font-medium text-primary uppercase tracking-wider">
            Events & Activities
          </span>
        </div>
        <h1 className="text-4xl font-bold tracking-tight mb-3">
          Events Calendar
        </h1>
        <p className="text-muted-foreground">
          Trade shows, technical training sessions, product launches, and
          company activities.
        </p>
      </div>

      {allEvents === undefined ? (
        <div className="space-y-6">
          <Skeleton className="h-10 w-48" />
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-44 w-full rounded-xl" />
          ))}
        </div>
      ) : (
        <div className="space-y-12">
          {/* Upcoming Events Section */}
          <section>
            <div className="flex items-center gap-3 mb-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <Clock className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">Upcoming Events</h2>
                <p className="text-sm text-muted-foreground">
                  Don't miss out on these exciting opportunities
                </p>
              </div>
            </div>

            {upcomingEvents.length === 0 ? (
              <div className="rounded-xl border border-border/40 bg-card/30 py-16 text-center">
                <Calendar className="mx-auto h-10 w-10 text-muted-foreground mb-3" />
                <p className="text-muted-foreground">
                  No upcoming events scheduled.
                </p>
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {upcomingEvents.map((event) => (
                  <EventCard key={event._id} event={event} variant="upcoming" />
                ))}
              </div>
            )}
          </section>

          {/* Past Events Section */}
          {pastEvents.length > 0 && (
            <section>
              <div className="flex items-center gap-3 mb-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary/50">
                  <CheckCircle2 className="h-5 w-5 text-muted-foreground" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">Past Events</h2>
                  <p className="text-sm text-muted-foreground">
                    Explore our previous events and highlights
                  </p>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {pastEvents.map((event) => (
                  <EventCard key={event._id} event={event} variant="past" />
                ))}
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  );
}

interface EventCardProps {
  event: {
    _id: string;
    title: string;
    description: string;
    eventDate: number;
    location: string;
    bannerImageUrl?: string;
  };
  variant: 'upcoming' | 'past';
}

function EventCard({ event, variant }: EventCardProps) {
  const isPast = variant === 'past';
  const eventDate = new Date(event.eventDate);
  const month = eventDate.toLocaleString('default', { month: 'short' });
  const day = eventDate.getDate();
  const year = eventDate.getFullYear();

  return (
    <Link
      href={`/events/${event._id}`}
      className="group gradient-border flex flex-col overflow-hidden rounded-xl border border-border/50 bg-card/60 hover:bg-card/90 transition-all hover:-translate-y-1 hover:shadow-lg hover:shadow-primary/5"
    >
      {/* Banner */}
      <div className="relative aspect-video overflow-hidden bg-secondary/40">
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

        {/* Date Badge */}
        <div className="absolute top-3 left-3">
          <div
            className={`flex flex-col items-center justify-center rounded-lg px-3 py-1.5 backdrop-blur-sm ${
              isPast
                ? 'bg-secondary/80 text-muted-foreground'
                : 'bg-primary/90 text-primary-foreground'
            }`}
          >
            <span className="text-xs font-medium uppercase">{month}</span>
            <span className="text-xl font-bold leading-none">{day}</span>
            <span className="text-xs opacity-70">{year}</span>
          </div>
        </div>

        {/* Status Badge */}
        {!isPast && (
          <div className="absolute top-3 right-3">
            <Badge className="bg-primary/90 text-primary-foreground backdrop-blur-sm hover:bg-primary">
              Upcoming
            </Badge>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 p-4 flex flex-col">
        <h3 className="font-bold text-lg mb-2 line-clamp-2 group-hover:text-primary transition-colors">
          {event.title}
        </h3>

        <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2 mb-4 flex-1">
          {event.description}
        </p>

        <div className="space-y-2 pt-3 border-t border-border/40">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <MapPin className="h-3.5 w-3.5 text-primary shrink-0" />
            <span className="line-clamp-1">{event.location}</span>
          </div>

          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center gap-1 text-xs font-medium text-primary">
              View Details
              <ArrowRight className="h-3 w-3 group-hover:translate-x-1 transition-transform" />
            </div>
            {isPast && (
              <Badge variant="secondary" className="text-xs">
                Completed
              </Badge>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
