import FrontPage from '@/components/web/home/frontpage';
import { Metadata } from 'next/types';

export const metadata: Metadata = {
  title: 'Home',
  description:
    'Meghdoot piston is a leading provider for pistons and parts for automobiles.',
};

export default function Home() {
  return (
    <main>
      <FrontPage />
    </main>
  );
}
