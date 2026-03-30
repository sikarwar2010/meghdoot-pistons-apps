'use client';

import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { ImageIcon } from 'lucide-react';
import type { Id } from '@/convex/_generated/dataModel';

interface BlogCoverImageProps {
  imageId?: Id<'_storage'>;
  imageUrl?: string;
  alt: string;
  className?: string;
}

export function BlogCoverImage({
  imageId,
  imageUrl,
  alt,
  className = 'h-full w-full object-cover',
}: BlogCoverImageProps) {
  // Fetch storage URL if imageId is provided
  const storageUrl = useQuery(
    api.blog.getCoverImageUrl,
    imageId ? { imageId } : 'skip'
  );

  // Determine which URL to use (only use storage URL if imageId exists)
  const displayUrl = imageId ? (storageUrl ?? imageUrl) : imageUrl;

  if (!displayUrl) {
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
      src={displayUrl}
      alt={alt}
      className={className}
      onError={(e) => {
        const img = e.target as HTMLImageElement;
        img.style.display = 'none';
        const placeholder = document.createElement('div');
        placeholder.className =
          'h-full w-full bg-secondary/30 flex items-center justify-center';
        placeholder.innerHTML =
          '<svg class="h-6 w-6 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>';
        img.parentNode?.appendChild(placeholder);
      }}
    />
  );
}
