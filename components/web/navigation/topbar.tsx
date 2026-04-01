import { Phone, Mail, Clock, CalendarClock } from 'lucide-react';
import Link from 'next/link';

export default function TopBar() {
  return (
    <div className="bg-background text-primary py-2 text-[11px] sm:text-sm">
      <div className="container mx-auto px-2 sm:px-4">
        <div className="flex flex-col gap-2 sm:flex-row sm:justify-between sm:items-center">
          <div className="flex flex-col sm:flex-row sm:flex-wrap items-start sm:items-center gap-2 sm:gap-4">
            <div className="flex items-center gap-1.5">
              <Phone
                size={12}
                className="text-black dark:text-white/80 shrink-0"
              />
              <span className="wrap-break-words">
                +91 97190 29044 | +91 9760415467
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <Mail
                size={12}
                className="text-black dark:text-white/80 shrink-0"
              />
              <span className="wrap-break-word">meghdootpistons@gmail.com</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock
                size={12}
                className="text-black dark:text-white/80 shrink-0"
              />
              <span>Mon-Sat: 9:00 AM - 6:00 PM</span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 border-t sm:border-t-0 pt-2 sm:pt-0">
            <Link
              href="/events"
              className="flex items-center gap-1.5 transition-colors hover:text-primary/80"
            >
              <CalendarClock
                size={12}
                className="text-black dark:text-white/80 shrink-0"
              />
              <div className="flex flex-col sm:flex-row sm:items-center gap-0.5 sm:gap-1.5">
                <span className="font-medium">Latest Event: </span>
                <span className="animate-pulse text-[10px] sm:text-xs">
                  AutoMechanika 2026 New Delhi - Visit us at Hall 1, Stand No: 1
                  F-65
                </span>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
