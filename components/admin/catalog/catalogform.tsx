'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { toast } from 'sonner';
import { ArrowLeft, Save } from 'lucide-react';
import type { CatalogEntry } from '@/types';
import type { Id } from '@/convex/_generated/dataModel';
import { ImageUpload } from '@/components/admin/ImageUpload';

interface CatalogFormData {
  brand: string;
  model: string;
  boreDiameter: number;
  pistonTL: number;
  pistonKH: number;
  pistonPIN: string;
  pistonBowlDia?: number;
  pistonBowlDepth?: number;
  ring1: number;
  ring2?: number;
  ring3?: number;
  ringNote?: string;
  pistonType?: string;
  imageId?: Id<'_storage'>;
  imageUrl?: string;
}

const catalogSchema = z.object({
  brand: z.string().min(1, 'Brand required'),
  model: z.string().min(1, 'Model required'),
  boreDiameter: z.coerce.number().positive('Must be positive'),
  pistonTL: z.coerce.number().positive('Required'),
  pistonKH: z.coerce.number().positive('Required'),
  pistonPIN: z.string().min(1, 'Required'),
  pistonBowlDia: z.coerce.number().optional(),
  pistonBowlDepth: z.coerce.number().optional(),
  ring1: z.coerce.number().positive('Required'),
  ring2: z.coerce.number().optional(),
  ring3: z.coerce.number().optional(),
  ringNote: z.string().optional(),
  pistonType: z.string().optional(),
});

interface Props {
  initialData?: CatalogEntry;
  onSuccess: () => void;
  onCancel: () => void;
}

export function CatalogForm({ initialData, onSuccess, onCancel }: Props) {
  const create = useMutation(api.catalog.create);
  const update = useMutation(api.catalog.update);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CatalogFormData>({
    resolver: zodResolver(catalogSchema) as any,
    defaultValues: {
      brand: initialData?.brand ?? '',
      model: initialData?.model ?? '',
      boreDiameter: initialData?.boreDiameter,
      pistonTL: initialData?.pistonSpecs.TL,
      pistonKH: initialData?.pistonSpecs.KH,
      pistonPIN: initialData?.pistonSpecs.PIN ?? '',
      pistonBowlDia: initialData?.pistonSpecs.bowlDia,
      pistonBowlDepth: initialData?.pistonSpecs.bowlDepth,
      ring1: initialData?.ringSizes.ring1,
      ring2: initialData?.ringSizes.ring2,
      ring3: initialData?.ringSizes.ring3,
      ringNote: initialData?.ringSizes.note ?? '',
      pistonType: initialData?.pistonType ?? '',
      imageId: initialData?.imageId,
      imageUrl: initialData?.imageUrl ?? '',
    },
  });

  useEffect(() => {
    if (!initialData) return;

    reset({
      brand: initialData.brand,
      model: initialData.model,
      boreDiameter: initialData.boreDiameter,
      pistonTL: initialData.pistonSpecs.TL,
      pistonKH: initialData.pistonSpecs.KH,
      pistonPIN: initialData.pistonSpecs.PIN,
      pistonBowlDia: initialData.pistonSpecs.bowlDia,
      pistonBowlDepth: initialData.pistonSpecs.bowlDepth,
      ring1: initialData.ringSizes.ring1,
      ring2: initialData.ringSizes.ring2,
      ring3: initialData.ringSizes.ring3,
      ringNote: initialData.ringSizes.note ?? '',
      pistonType: initialData.pistonType ?? '',
      imageId: initialData.imageId,
      imageUrl: initialData.imageUrl ?? '',
    });
  }, [initialData, reset]);

  const onSubmit = async (data: CatalogFormData) => {
    const payload = {
      brand: data.brand.toUpperCase(),
      model: data.model,
      boreDiameter: data.boreDiameter,
      pistonSpecs: {
        TL: data.pistonTL,
        KH: data.pistonKH,
        PIN: data.pistonPIN,
        bowlDia: data.pistonBowlDia || undefined,
        bowlDepth: data.pistonBowlDepth || undefined,
      },
      ringSizes: {
        ring1: data.ring1,
        ring2: data.ring2 || undefined,
        ring3: data.ring3 || undefined,
        note: data.ringNote || undefined,
      },
      pistonType: data.pistonType || undefined,
      imageId: data.imageId || undefined,
    };

    try {
      if (initialData) {
        await update({ id: initialData._id, ...payload });
        toast.success('Catalog entry updated!');
      } else {
        await create(payload);
        toast.success('Catalog entry created!');
      }
      onSuccess();
    } catch (e: any) {
      toast.error(e.message ?? 'Failed to save entry');
    }
  };

  const inputCls =
    'w-full rounded-lg border border-border/60 bg-secondary/30 px-3 py-2.5 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/50 focus:border-primary/50 transition-colors font-mono';

  const labelCls =
    'block text-xs font-medium text-muted-foreground mb-1.5 uppercase tracking-wider';

  return (
    <div className="space-y-6 fade-up max-w-3xl">
      <div className="flex items-center gap-4">
        <button
          onClick={onCancel}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" /> Back
        </button>
        <h1 className="text-2xl font-bold font-display">
          {initialData ? 'Edit Catalog Entry' : 'New Catalog Entry'}
        </h1>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* Product Image */}
        <div className="rounded-xl border border-border/50 bg-card/40 p-6">
          <ImageUpload
            value={watch('imageUrl')}
            imageId={watch('imageId')}
            onChange={(url, imageId) => {
              setValue('imageId', imageId);
              setValue('imageUrl', url ?? '');
            }}
            storageType="catalog"
            maxSizeMB={5}
          />
        </div>

        {/* Basic Info */}
        <div className="rounded-xl border border-border/50 bg-card/40 p-6">
          <h3 className="font-semibold mb-4 flex items-center gap-2 text-sm">
            <span className="h-5 w-5 flex items-center justify-center rounded-full bg-primary/20 text-primary text-xs font-bold">
              1
            </span>
            Basic Information
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className={labelCls}>Brand *</label>
              <input
                {...register('brand')}
                placeholder="ANDORIA"
                className={inputCls}
              />
              {errors.brand && (
                <p className="mt-1 text-xs text-destructive">
                  {errors.brand.message}
                </p>
              )}
            </div>
            <div>
              <label className={labelCls}>Model *</label>
              <input
                {...register('model')}
                placeholder="C330,S-231"
                className={inputCls}
              />
              {errors.model && (
                <p className="mt-1 text-xs text-destructive">
                  {errors.model.message}
                </p>
              )}
            </div>
            <div>
              <label className={labelCls}>Bore Ø (mm) *</label>
              <input
                {...register('boreDiameter')}
                type="number"
                step="0.01"
                placeholder="102.00"
                className={inputCls}
              />
              {errors.boreDiameter && (
                <p className="mt-1 text-xs text-destructive">
                  {errors.boreDiameter.message}
                </p>
              )}
            </div>
          </div>
          <div className="mt-4">
            <label className={labelCls}>Piston Type</label>
            <input
              {...register('pistonType')}
              placeholder="e.g. Flat, Bowl, Toroidal"
              className={inputCls}
            />
          </div>
        </div>

        {/* Piston Specs */}
        <div className="rounded-xl border border-border/50 bg-card/40 p-6">
          <h3 className="font-semibold mb-4 flex items-center gap-2 text-sm">
            <span className="h-5 w-5 flex items-center justify-center rounded-full bg-primary/20 text-primary text-xs font-bold">
              2
            </span>
            Piston Specifications
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            <div>
              <label className={labelCls}>TL (mm) *</label>
              <input
                {...register('pistonTL')}
                type="number"
                step="0.01"
                placeholder="130.00"
                className={inputCls}
              />
              {errors.pistonTL && (
                <p className="mt-1 text-xs text-destructive">
                  {errors.pistonTL.message}
                </p>
              )}
            </div>
            <div>
              <label className={labelCls}>KH (mm) *</label>
              <input
                {...register('pistonKH')}
                type="number"
                step="0.01"
                placeholder="75.30"
                className={inputCls}
              />
              {errors.pistonKH && (
                <p className="mt-1 text-xs text-destructive">
                  {errors.pistonKH.message}
                </p>
              )}
            </div>
            <div>
              <label className={labelCls}>PIN *</label>
              <input
                {...register('pistonPIN')}
                placeholder="38 x 84"
                className={inputCls}
              />
              {errors.pistonPIN && (
                <p className="mt-1 text-xs text-destructive">
                  {errors.pistonPIN.message}
                </p>
              )}
            </div>
            <div>
              <label className={labelCls}>Bowl Dia Ø (mm)</label>
              <input
                {...register('pistonBowlDia')}
                type="number"
                step="0.01"
                placeholder="29.00"
                className={inputCls}
              />
            </div>
            <div>
              <label className={labelCls}>Bowl Depth (mm)</label>
              <input
                {...register('pistonBowlDepth')}
                type="number"
                step="0.01"
                placeholder="33.50"
                className={inputCls}
              />
            </div>
          </div>
        </div>

        {/* Ring Sizes */}
        <div className="rounded-xl border border-border/50 bg-card/40 p-6">
          <h3 className="font-semibold mb-4 flex items-center gap-2 text-sm">
            <span className="h-5 w-5 flex items-center justify-center rounded-full bg-primary/20 text-primary text-xs font-bold">
              3
            </span>
            Ring Sizes
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div>
              <label className={labelCls}>Ring 1 (mm) *</label>
              <input
                {...register('ring1')}
                type="number"
                step="0.01"
                placeholder="2.50"
                className={inputCls}
              />
              {errors.ring1 && (
                <p className="mt-1 text-xs text-destructive">
                  {errors.ring1.message}
                </p>
              )}
            </div>
            <div>
              <label className={labelCls}>Ring 2 (mm)</label>
              <input
                {...register('ring2')}
                type="number"
                step="0.01"
                placeholder="4.50"
                className={inputCls}
              />
            </div>
            <div>
              <label className={labelCls}>Ring 3 (mm)</label>
              <input
                {...register('ring3')}
                type="number"
                step="0.01"
                placeholder="—"
                className={inputCls}
              />
            </div>
            <div>
              <label className={labelCls}>Note</label>
              <input
                {...register('ringNote')}
                placeholder="T15+"
                className={inputCls}
              />
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex items-center gap-2 rounded-lg bg-primary px-6 py-3 font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-60 transition-colors"
          >
            {isSubmitting ? (
              <div className="h-4 w-4 border-2 border-primary-foreground/40 border-t-primary-foreground rounded-full animate-spin" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            {initialData ? 'Update Entry' : 'Create Entry'}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="rounded-lg border border-border/50 bg-secondary/30 px-6 py-3 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
