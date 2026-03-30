'use client';

import { useParams, useRouter } from 'next/navigation';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { CatalogForm } from '@/components/admin/catalog/catalogform';
import type { Id } from '@/convex/_generated/dataModel';

export default function CatalogEditPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as Id<'catalog'>;

  const item = useQuery(api.catalog.getById, { id });

  return (
    <CatalogForm
      initialData={item ?? undefined}
      onSuccess={() => {
        router.push(`/dashboard/catalog/${id}`);
      }}
      onCancel={() => {
        router.back();
      }}
    />
  );
}
