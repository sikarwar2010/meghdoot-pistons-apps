'use client';

import { useQuery, useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { useParams, useRouter } from 'next/navigation';
import { toast } from 'sonner';
import {
  ArrowLeft,
  Edit,
  Trash2,
  Package,
  Ruler,
  Layers,
  Tag,
  Calendar,
  Printer,
} from 'lucide-react';
import { CatalogCoverImage } from '@/components/admin/catalog/CatalogCoverImage';
import type { Id } from '@/convex/_generated/dataModel';

export default function CatalogDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as Id<'catalog'>;

  const item = useQuery(api.catalog.getById, { id });
  const remove = useMutation(api.catalog.remove);

  const handleDelete = async () => {
    if (!item) return;
    if (
      !confirm(`Are you sure you want to delete ${item.brand} ${item.model}?`)
    )
      return;

    try {
      await remove({ id });
      toast.success('Catalog entry deleted successfully');
      router.push('/dashboard/catalog');
    } catch (error: any) {
      toast.error(error.message ?? 'Failed to delete catalog entry');
    }
  };

  const handleEdit = () => {
    router.push(`/dashboard/catalog/${id}/edit`);
  };

  const handlePrint = () => {
    window.print();
  };

  if (!item) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Package className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">
            Catalog Entry Not Found
          </h2>
          <p className="text-muted-foreground mb-4">
            This catalog entry doesn't exist or has been removed.
          </p>
          <button
            onClick={() => router.push('/dashboard/catalog')}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
          >
            Back to Catalog
          </button>
        </div>
      </div>
    );
  }

  const StatCard = ({
    icon: Icon,
    label,
    value,
    subValue,
  }: {
    icon: any;
    label: string;
    value: string | number;
    subValue?: string;
  }) => (
    <div className="catalog-print-card rounded-xl border border-border/50 bg-card/40 p-6">
      <div className="flex items-center gap-3 mb-3">
        <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
          <Icon className="h-5 w-5 text-primary" />
        </div>
        <span className="text-sm font-medium text-muted-foreground">
          {label}
        </span>
      </div>
      <div className="text-2xl font-bold font-display text-foreground mb-1">
        {value}
      </div>
      {subValue && (
        <div className="text-xs text-muted-foreground font-mono">
          {subValue}
        </div>
      )}
    </div>
  );

  const ringRows = [
    { label: 'Ring 1', value: item.ringSizes.ring1, position: 'Primary' },
    { label: 'Ring 2', value: item.ringSizes.ring2, position: 'Secondary' },
    { label: 'Ring 3', value: item.ringSizes.ring3, position: 'Tertiary' },
    { label: 'Ring 4', value: item.ringSizes.ring4, position: 'Quaternary' },
    { label: 'Ring 5', value: item.ringSizes.ring5, position: 'Quinary' },
  ];

  return (
    <>
      <style jsx global>{`
        @media print {
          @page {
            size: A4 portrait;
            margin: 12mm;
          }

          html,
          body {
            background: #fff !important;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }

          .catalog-print-root {
            width: 186mm !important;
            max-width: 186mm !important;
            margin: 0 !important;
            padding: 0 !important;
            gap: 0.6rem !important;
            font-size: 11px !important;
            line-height: 1.25 !important;
          }

          .catalog-print-root .catalog-print-header-title {
            font-size: 18px !important;
            line-height: 1.2 !important;
          }

          .catalog-print-root .catalog-print-top-grid {
            display: grid !important;
            grid-template-columns: 58mm 1fr !important;
            gap: 0.6rem !important;
          }

          .catalog-print-root .catalog-print-image-frame {
            aspect-ratio: auto !important;
            height: 56mm !important;
          }

          .catalog-print-root .catalog-print-spec-grid {
            grid-template-columns: repeat(5, minmax(0, 1fr)) !important;
            gap: 0.45rem !important;
          }

          .catalog-print-root .catalog-print-card {
            padding: 0.55rem !important;
            border-color: #d6d6d6 !important;
            page-break-inside: avoid !important;
            break-inside: avoid !important;
          }

          .catalog-print-root .catalog-print-table th,
          .catalog-print-root .catalog-print-table td {
            padding: 6px 8px !important;
            font-size: 10.5px !important;
          }

          .catalog-print-root * {
            break-inside: avoid;
          }
        }
      `}</style>
      <div className="catalog-print-root space-y-8 fade-up max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.back()}
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="h-4 w-4 " /> Back
            </button>
            <div>
              <h1 className="catalog-print-header-title text-3xl font-bold font-display">
                {item.brand} {item.model}
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                Catalog Entry Details
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 print:hidden">
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 rounded-lg border border-border/50 bg-secondary/40 px-4 py-2 text-sm font-semibold text-foreground hover:bg-secondary/60 transition-colors"
            >
              <Printer className="h-4 w-4" /> Print / Save PDF
            </button>
            <button
              onClick={handleEdit}
              className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              <Edit className="h-4 w-4" /> Edit
            </button>
            <button
              onClick={handleDelete}
              className="flex items-center gap-2 rounded-lg border border-destructive/50 bg-destructive/10 px-4 py-2 text-sm font-semibold text-destructive hover:bg-destructive/20 transition-colors"
            >
              <Trash2 className="h-4 w-4" /> Delete
            </button>
          </div>
        </div>

        {/* Product Image & Basic Info */}
        <div className="catalog-print-top-grid grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Image */}
          <div className="lg:col-span-1">
            <div className="catalog-print-card rounded-xl border border-border/50 bg-card/40 p-6 h-full">
              <h3 className="text-sm font-semibold mb-4 flex items-center gap-2">
                <Package className="h-4 w-4 text-primary" />
                Product Image
              </h3>
              <div className="catalog-print-image-frame aspect-square rounded-lg overflow-hidden border border-border/50 bg-secondary/30 flex items-center justify-center">
                {item.imageId || item.imageUrl ? (
                  <CatalogCoverImage
                    imageId={item.imageId}
                    imageUrl={item.imageUrl}
                    alt={`${item.brand} ${item.model}`}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="text-center p-8">
                    <Package className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">
                      No image available
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Basic Info */}
          <div className="lg:col-span-2">
            <div className="catalog-print-card rounded-xl border border-border/50 bg-card/40 p-6 h-full">
              <h3 className="text-sm font-semibold mb-4 flex items-center gap-2">
                <Tag className="h-4 w-4 text-primary" />
                Basic Information
              </h3>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-xs text-muted-foreground mb-1">
                      Brand
                    </div>
                    <div className="text-lg font-semibold font-display text-primary">
                      {item.brand}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground mb-1">
                      Model
                    </div>
                    <div className="text-lg font-semibold">{item.model}</div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <StatCard
                    icon={Ruler}
                    label="Bore Diameter"
                    value={`${item.boreDiameter.toFixed(2)} mm`}
                  />
                  <StatCard
                    icon={Tag}
                    label="Piston Type"
                    value={item.pistonType || 'Not specified'}
                  />
                </div>
                <div className="pt-4 border-t border-border/30">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                    <Calendar className="h-3 w-3" />
                    Metadata
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-xs font-mono">
                    <div>
                      <span className="text-muted-foreground">Created:</span>{' '}
                      {new Date(item.createdAt).toLocaleDateString()}
                    </div>
                    <div>
                      <span className="text-muted-foreground">Updated:</span>{' '}
                      {new Date(item.updatedAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Piston Specifications */}
        <div className="catalog-print-card rounded-xl border border-border/50 bg-card/40 p-6">
          <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
            <Layers className="h-5 w-5 text-primary" />
            Piston Specifications
          </h3>
          <div className="catalog-print-spec-grid grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            <StatCard
              icon={Ruler}
              label="TL (mm)"
              value={item.pistonSpecs.TL.toFixed(2)}
            />
            <StatCard
              icon={Ruler}
              label="KH (mm)"
              value={item.pistonSpecs.KH.toFixed(2)}
            />
            <StatCard icon={Tag} label="PIN" value={item.pistonSpecs.PIN} />
            <StatCard
              icon={Ruler}
              label="Bowl Dia Ø"
              value={
                item.pistonSpecs.bowlDia
                  ? `${item.pistonSpecs.bowlDia.toFixed(2)} mm`
                  : 'N/A'
              }
            />
            <StatCard
              icon={Ruler}
              label="Bowl Depth"
              value={
                item.pistonSpecs.bowlDepth
                  ? `${item.pistonSpecs.bowlDepth.toFixed(2)} mm`
                  : 'N/A'
              }
            />
          </div>
        </div>

        {/* Ring Sizes */}
        <div className="catalog-print-card rounded-xl border border-border/50 bg-card/40 p-6">
          <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
            <Layers className="h-5 w-5 text-primary" />
            Ring Sizes
          </h3>
          <div className="overflow-x-auto">
            <table className="catalog-print-table w-full text-sm">
              <thead className="bg-secondary/40">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Ring
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Size (mm)
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Position
                  </th>
                </tr>
              </thead>
              <tbody>
                {ringRows.map((ring, index) => (
                  <tr key={ring.label} className="border-t border-border/40">
                    <td className="px-4 py-3 font-medium">
                      <span
                        className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold ${
                          index === 0
                            ? 'bg-amber-400/15 text-amber-400'
                            : 'bg-secondary/60 text-foreground'
                        }`}
                      >
                        {ring.label}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-mono">
                      {ring.value != null ? ring.value.toFixed(2) : 'N/A'}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {ring.position}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {item.ringSizes.note && (
            <div className="mt-4">
              <span className="text-xs text-muted-foreground mr-2">Note:</span>
              <span className="inline-flex items-center rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
                {item.ringSizes.note}
              </span>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
