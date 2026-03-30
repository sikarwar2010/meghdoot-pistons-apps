'use client';

import { useEffect, useState } from 'react';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import type { Id } from '@/convex/_generated/dataModel';
import { Image as ImageIcon } from 'lucide-react';

interface CatalogCoverImageProps {
  imageId?: Id<'_storage'>;
  imageUrl?: string;
  alt: string;
  className?: string;
}

export function CatalogCoverImage({
  imageId,
  imageUrl,
  alt,
  className = 'w-full h-48 object-cover rounded-lg',
}: CatalogCoverImageProps) {
  const storageUrl = useQuery(
    api.catalog.getImageUrl,
    imageId ? { imageId } : 'skip'
  );

  const [hasError, setHasError] = useState(false);
  const src = imageId ? (storageUrl ?? imageUrl) : imageUrl;

  useEffect(() => {
    setHasError(false);
  }, [src]);

  if (!src || hasError) {
    return (
      <div
        className={`bg-secondary/30 flex items-center justify-center ${className}`}
      >
        <ImageIcon className="h-6 w-6 text-muted-foreground" />
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      onError={() => setHasError(true)}
    />
  );
}
