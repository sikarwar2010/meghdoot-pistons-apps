import CylinderLinersPage from '@/components/web/products/cylinder-liner';
import { Metadata } from 'next/types';

export const metadata: Metadata = {
  title: 'Pistons',
  description:
    'Meghdoot piston is a leading provider for pistons and parts for automobiles.',
};

export default function CylinderLiners() {
  return (
    <div>
      <CylinderLinersPage />
    </div>
  );
}
