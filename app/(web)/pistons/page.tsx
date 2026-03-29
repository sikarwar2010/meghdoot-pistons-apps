import PistonsPage from '@/components/web/products/pistonpage';
import { Metadata } from 'next/types';

export const metadata: Metadata = {
  title: 'Pistons',
  description:
    'Meghdoot piston is a leading provider for pistons and parts for automobiles.',
};

export default function Pistons() {
  return (
    <div>
      <PistonsPage />
    </div>
  );
}
