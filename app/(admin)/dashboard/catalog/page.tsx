'use client';

import { useQuery, useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { useState } from 'react';
import { toast } from 'sonner';
import { CatalogTable } from '@/components/admin/catalog/catelogtable';
import { CatalogForm } from '@/components/admin/catalog/catalogform';
import { Plus, Package, Database } from 'lucide-react';
import type { CatalogEntry } from '@/types';
import { useRouter } from 'next/navigation';

export default function Catalog() {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [brand, setBrand] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<CatalogEntry | null>(null);

  const items = useQuery(api.catalog.list, {
    brand: brand || undefined,
    search: search || undefined,
  });

  const brands = useQuery(api.catalog.getBrands);
  const remove = useMutation(api.catalog.remove);
  const seed = useMutation(api.catalog.seed);

  const handleDelete = async (item: CatalogEntry) => {
    if (!confirm(`Delete ${item.brand} ${item.model}?`)) return;
    try {
      await remove({ id: item._id });
      toast.success('Entry deleted');
    } catch (e: any) {
      toast.error(e.message ?? 'Failed');
    }
  };

  const handleViewDetails = (item: CatalogEntry) => {
    router.push(`/dashboard/catalog/${item._id}`);
  };

  const handleSeed = async () => {
    if (
      !confirm(
        'Seed the database with sample data from the uploaded catalog image?'
      )
    )
      return;
    try {
      const result = await seed();
      toast.success(`Seeded ${(result as any).seeded} catalog entries`);
    } catch (e: any) {
      toast.error(e.message ?? 'Failed to seed');
    }
  };

  if (showForm || editing) {
    return (
      <CatalogForm
        initialData={editing ?? undefined}
        onSuccess={() => {
          setShowForm(false);
          setEditing(null);
        }}
        onCancel={() => {
          setShowForm(false);
          setEditing(null);
        }}
      />
    );
  }

  return (
    <div className="space-y-6 fade-up">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-display">Parts Catalog</h1>
          <p className="text-sm text-muted-foreground">
            {items?.length ?? 0} entries
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleSeed}
            className="flex items-center gap-2 rounded-lg border border-border/50 bg-secondary/40 px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary/80 transition-colors"
          >
            <Database className="h-4 w-4" /> Seed Data
          </button>
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            <Plus className="h-4 w-4" /> Add Entry
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <input
          type="text"
          placeholder="Search brand, model, bore…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 rounded-lg border border-border/60 bg-secondary/30 px-3 py-2.5 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/50 focus:border-primary/50 transition-colors"
        />
        <select
          value={brand}
          onChange={(e) => setBrand(e.target.value)}
          className="rounded-lg border border-border/60 bg-secondary/30 px-3 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary/50 min-w-40"
        >
          <option value="">All Brands</option>
          {brands?.map((b) => (
            <option key={b} value={b}>
              {b}
            </option>
          ))}
        </select>
      </div>

      {items === undefined ? (
        <div className="space-y-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-14 rounded-lg skeleton" />
          ))}
        </div>
      ) : items.length === 0 ? (
        <div className="rounded-xl border border-border/40 bg-card/30 py-20 text-center">
          <Package className="mx-auto h-10 w-10 text-muted-foreground mb-3" />
          <p className="text-muted-foreground mb-3">No catalog entries yet</p>
          <div className="flex items-center justify-center gap-3">
            <button
              onClick={handleSeed}
              className="text-sm text-primary hover:underline"
            >
              Seed sample data
            </button>
            <span className="text-muted-foreground">or</span>
            <button
              onClick={() => setShowForm(true)}
              className="text-sm text-primary hover:underline"
            >
              Add manually
            </button>
          </div>
        </div>
      ) : (
        <CatalogTable
          data={items as CatalogEntry[]}
          showActions
          onEdit={(item) => setEditing(item)}
          onDelete={handleDelete}
          onViewDetails={handleViewDetails}
        />
      )}
    </div>
  );
}
