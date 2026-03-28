import AboutPage from '@/components/web/about/aboutpage';
import { Metadata } from 'next/types';

export const metadata: Metadata = {
  title: 'About',
  description:
    'Meghdoot piston is a leading provider for pistons and parts for automobiles.',
};

export default function About() {
  return (
    <div>
      <AboutPage />
    </div>
  );
}
