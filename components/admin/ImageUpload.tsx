'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { toast } from 'sonner';
import { Upload, Loader2 } from 'lucide-react';
import type { Id } from '@/convex/_generated/dataModel';

interface ImageUploadProps {
  value?: string;
  imageId?: Id<'_storage'>;
  onChange: (url: string | undefined, imageId?: Id<'_storage'>) => void;
  accept?: string;
  maxSizeMB?: number;
  className?: string;
  storageType?: 'blog' | 'catalog' | 'events';
}

export function ImageUpload({
  value,
  imageId,
  onChange,
  accept = 'image/*',
  maxSizeMB = 5,
  className = '',
  storageType = 'blog',
}: ImageUploadProps) {
  const [previewUrl, setPreviewUrl] = useState<string>(value ?? '');
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (value) {
      setPreviewUrl(value);
      return;
    }
    if (!imageId) {
      setPreviewUrl('');
    }
  }, [value, imageId]);

  useEffect(() => {
    return () => {
      if (previewUrl.startsWith('blob:')) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const generateUploadUrl = useMutation(
    storageType === 'catalog'
      ? api.catalog.generateUploadUrl
      : api.blog.generateUploadUrl
  );

  const handleUpload = useCallback(
    async (file: File) => {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast.error('Please upload an image file');
        return;
      }

      // Validate file size
      const fileSizeMB = file.size / (1024 * 1024);
      if (fileSizeMB > maxSizeMB) {
        toast.error(`Image must be less than ${maxSizeMB}MB`);
        return;
      }

      try {
        setIsUploading(true);

        // Get upload URL from Convex
        const uploadUrl = await generateUploadUrl();

        // Upload file to Convex storage
        const response = await fetch(uploadUrl, {
          method: 'POST',
          headers: { 'Content-Type': file.type },
          body: file,
        });

        if (!response.ok) {
          throw new Error('Upload failed');
        }

        // Get the storage ID from the response
        const result = await response.json();
        const storageId = result.storageId as Id<'_storage'>;

        // Create a local preview URL while form stores only storage ID.
        if (previewUrl.startsWith('blob:')) {
          URL.revokeObjectURL(previewUrl);
        }
        const objectUrl = URL.createObjectURL(file);
        setPreviewUrl(objectUrl);

        // Notify parent with both URL and ID
        onChange(undefined, storageId);

        toast.success('Image uploaded successfully!');
      } catch (error) {
        console.error('Upload error:', error);
        toast.error('Failed to upload image');
      } finally {
        setIsUploading(false);
      }
    },
    [generateUploadUrl, onChange, maxSizeMB]
  );

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        handleUpload(file);
      }
      // Reset input so same file can be selected again
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    },
    [handleUpload]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);

      const file = e.dataTransfer.files?.[0];
      if (file) {
        handleUpload(file);
      }
    },
    [handleUpload]
  );

  const handleRemove = useCallback(() => {
    setPreviewUrl('');
    onChange(undefined, undefined);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    toast.info('Image removed');
  }, [onChange]);

  return (
    <div className={`space-y-2 ${className}`}>
      <label className="block text-sm font-medium">Cover Image</label>

      {previewUrl ? (
        <div className="relative group rounded-lg overflow-hidden border border-border/50 bg-secondary/30">
          <img
            src={previewUrl}
            alt="Cover preview"
            className="w-full h-48 object-cover"
          />

          {/* Overlay with actions */}
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="px-3 py-1.5 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
            >
              {isUploading ? 'Uploading...' : 'Replace'}
            </button>
            <button
              type="button"
              onClick={handleRemove}
              disabled={isUploading}
              className="px-3 py-1.5 bg-destructive text-destructive-foreground rounded-md text-sm font-medium hover:bg-destructive/90 transition-colors disabled:opacity-50"
            >
              Remove
            </button>
          </div>

          {/* Upload indicator */}
          {isUploading && (
            <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
              <div className="text-center text-white">
                <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2" />
                <p className="text-sm font-medium">Uploading...</p>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`
            relative border-2 border-dashed rounded-lg p-8 
            flex flex-col items-center justify-center gap-3
            cursor-pointer transition-all duration-200
            ${
              isDragging
                ? 'border-primary bg-primary/5'
                : 'border-border/50 hover:border-primary/70 hover:bg-secondary/40'
            }
            ${isUploading ? 'opacity-50 pointer-events-none' : ''}
          `}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept={accept}
            onChange={handleFileSelect}
            className="hidden"
            disabled={isUploading}
          />

          {isUploading ? (
            <>
              <Loader2 className="h-10 w-10 text-muted-foreground animate-spin" />
              <p className="text-sm text-muted-foreground">Uploading...</p>
            </>
          ) : (
            <>
              <div className="h-12 w-12 rounded-full bg-secondary/60 flex items-center justify-center">
                <Upload className="h-6 w-6 text-muted-foreground" />
              </div>
              <div className="text-center">
                <p className="text-sm font-medium">
                  Click to upload or drag and drop
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  PNG, JPG, WEBP up to {maxSizeMB}MB
                </p>
              </div>
            </>
          )}
        </div>
      )}

      {/* Helper text */}
      <p className="text-xs text-muted-foreground">
        Recommended: 1200x630px or higher for best quality
      </p>
    </div>
  );
}
