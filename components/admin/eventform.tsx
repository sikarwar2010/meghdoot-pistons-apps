'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { toast } from 'sonner';
import { ArrowLeft, Save, X, ImageIcon } from 'lucide-react';
import { useState, useRef } from 'react';
import type { Event } from '@/types';
import Image from 'next/image';

const eventSchema = z.object({
  title: z.string().min(3, 'Title required'),
  description: z.string().min(10, 'Description required'),
  eventDate: z.string().min(1, 'Event date required'),
  location: z.string().min(2, 'Location required'),
  bannerImageUrl: z
    .string()
    .url('Must be a valid URL')
    .optional()
    .or(z.literal('')),
  published: z.boolean(),
});
type EventFormData = z.infer<typeof eventSchema>;

interface Props {
  initialData?: Event;
  onSuccess: () => void;
  onCancel: () => void;
}

export function EventForm({ initialData, onSuccess, onCancel }: Props) {
  const create = useMutation(api.events.create);
  const update = useMutation(api.events.update);
  const generateUploadUrl = useMutation(api.events.generateUploadUrl);

  const [imagePreview, setImagePreview] = useState<string | null>(
    initialData?.bannerImageUrl ?? null
  );
  const [uploading, setUploading] = useState(false);
  const [uploadedStorageId, setUploadedStorageId] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<EventFormData>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      title: initialData?.title ?? '',
      description: initialData?.description ?? '',
      eventDate: initialData
        ? new Date(initialData.eventDate).toISOString().slice(0, 16)
        : '',
      location: initialData?.location ?? '',
      bannerImageUrl: initialData?.bannerImageUrl ?? '',
      published: initialData?.published ?? false,
    },
  });

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    // Local preview
    const reader = new FileReader();
    reader.onload = (ev) => setImagePreview(ev.target?.result as string);
    reader.readAsDataURL(file);

    // Upload to Convex storage
    setUploading(true);
    try {
      const uploadUrl = await generateUploadUrl();
      const result = await fetch(uploadUrl, {
        method: 'POST',
        headers: { 'Content-Type': file.type },
        body: file,
      });
      const { storageId } = await result.json();
      // Store the storageId so we can pass it to the mutation
      setUploadedStorageId(storageId);
      // Clear any manual URL so the storageId takes precedence
      setValue('bannerImageUrl', '');
      toast.success('Image uploaded');
    } catch {
      toast.error('Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  const onSubmit = async (data: EventFormData) => {
    try {
      const payload = {
        title: data.title,
        description: data.description,
        eventDate: new Date(data.eventDate).getTime(),
        location: data.location,
        // If user uploaded a file, pass the storageId; otherwise use the pasted URL
        bannerImageId: uploadedStorageId as any ?? undefined,
        bannerImageUrl: !uploadedStorageId && data.bannerImageUrl ? data.bannerImageUrl : undefined,
        published: data.published,
      };

      if (initialData) {
        await update({ id: initialData._id, ...payload });
        toast.success('Event updated!');
      } else {
        await create(payload);
        toast.success('Event created!');
      }
      onSuccess();
    } catch (e: any) {
      toast.error(e.message ?? 'Failed to save event');
    }
  };

  const inputCls =
    'w-full rounded-lg border border-border/60 bg-secondary/30 px-3 py-2.5 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/50 focus:border-primary/50 transition-colors';

  return (
    <div className="space-y-6 fade-up">
      <div className="flex items-center gap-4">
        <button
          onClick={onCancel}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" /> Back
        </button>
        <h1 className="text-2xl font-bold font-display">
          {initialData ? 'Edit Event' : 'New Event'}
        </h1>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid grid-cols-1 gap-6 lg:grid-cols-3"
      >
        <div className="lg:col-span-2 space-y-5">
          <div className="rounded-xl border border-border/50 bg-card/40 p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1.5">
                Title *
              </label>
              <input
                {...register('title')}
                placeholder="Event name"
                className={inputCls}
              />
              {errors.title && (
                <p className="mt-1 text-xs text-destructive">
                  {errors.title.message}
                </p>
              )}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1.5">
                  Date & Time *
                </label>
                <input
                  {...register('eventDate')}
                  type="datetime-local"
                  className={inputCls}
                />
                {errors.eventDate && (
                  <p className="mt-1 text-xs text-destructive">
                    {errors.eventDate.message}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">
                  Location *
                </label>
                <input
                  {...register('location')}
                  placeholder="City, Venue"
                  className={inputCls}
                />
                {errors.location && (
                  <p className="mt-1 text-xs text-destructive">
                    {errors.location.message}
                  </p>
                )}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">
                Description *
              </label>
              <textarea
                {...register('description')}
                rows={8}
                placeholder="Describe the event…"
                className={`${inputCls} resize-none`}
              />
              {errors.description && (
                <p className="mt-1 text-xs text-destructive">
                  {errors.description.message}
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {/* Image Upload */}
          <div className="rounded-xl border border-border/50 bg-card/40 p-5 space-y-3">
            <h3 className="font-semibold text-sm">Banner Image</h3>

            {imagePreview ? (
              <div className="relative rounded-lg overflow-hidden aspect-video bg-secondary/40">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <Image
                  src={imagePreview}
                  alt="Preview"
                  className="h-full w-full object-cover"
                  width={100}
                  height={100}
                />
                <button
                  type="button"
                  onClick={() => {
                    setImagePreview(null);
                    setUploadedStorageId(null);
                    setValue('bannerImageUrl', '');
                  }}
                  className="absolute top-2 right-2 h-6 w-6 flex items-center justify-center rounded-full bg-background/80 text-muted-foreground hover:text-destructive"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                disabled={uploading}
                className="w-full aspect-video rounded-lg border-2 border-dashed border-border/50 flex flex-col items-center justify-center gap-2 text-muted-foreground hover:border-primary/40 hover:text-primary/70 transition-colors"
              >
                {uploading ? (
                  <div className="h-6 w-6 border-2 border-primary/40 border-t-primary rounded-full animate-spin" />
                ) : (
                  <>
                    <ImageIcon className="h-8 w-8" />
                    <span className="text-xs">Click to upload banner</span>
                  </>
                )}
              </button>
            )}
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border/40" />
              </div>
              <div className="relative flex justify-center">
                <span className="bg-card/40 px-2 text-xs text-muted-foreground">
                  or paste URL
                </span>
              </div>
            </div>
            <input
              {...register('bannerImageUrl')}
              placeholder="https://..."
              className={inputCls}
            />
          </div>

          {/* Publish */}
          <div className="rounded-xl border border-border/50 bg-card/40 p-5">
            <h3 className="font-semibold text-sm mb-3">Publish</h3>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                {...register('published')}
                className="h-4 w-4 rounded accent-primary"
              />
              <span className="text-sm">Publish immediately</span>
            </label>
          </div>

          <button
            type="submit"
            disabled={isSubmitting || uploading}
            className="w-full flex items-center justify-center gap-2 rounded-lg bg-primary py-3 font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-60 transition-colors"
          >
            <Save className="h-4 w-4" />
            {initialData ? 'Update Event' : 'Create Event'}
          </button>
        </div>
      </form>
    </div>
  );
}
