import QualityPage from '@/components/web/quality/page';
import { Metadata } from 'next/types';

export const metadata: Metadata = {
  title: 'Quality',
  description:
    'Meghdoot piston is a leading provider for pistons and parts for automobiles.',
};

export default function Quality() {
  return (
    <div>
      <QualityPage />
    </div>
  );
}
