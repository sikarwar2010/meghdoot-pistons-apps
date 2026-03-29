import EventsPage from '@/components/web/events/eventpage';
import { Metadata } from 'next/types';

export const metadata: Metadata = {
  title: 'Events',
  description:
    'Meghdoot piston is a leading provider for pistons and parts for automobiles.',
};

export default function Events() {
  return (
    <div>
      <EventsPage />
    </div>
  );
}
