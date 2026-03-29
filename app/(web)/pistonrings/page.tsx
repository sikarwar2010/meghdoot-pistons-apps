import PistonRingsPage from '@/components/web/products/pistonringspage';
import { Metadata } from 'next/types';

export const metadata: Metadata = {
  title: 'Piston Rings',
  description:
    'Meghdoot piston is a leading provider for pistons and parts for automobiles.',
};

export default function PistonPins() {
  return (
    <div>
      <PistonRingsPage />
    </div>
  );
}
