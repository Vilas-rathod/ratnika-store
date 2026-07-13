import { useRef, useState } from 'react';
import type { ProductImage } from '@/types';
import { cn } from '@/lib/utils';

interface ProductGalleryProps {
  images: ProductImage[];
  name: string;
}

export function ProductGallery({ images, name }: ProductGalleryProps) {
  const [active, setActive] = useState(0);
  const [zoom, setZoom] = useState<{ x: number; y: number } | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMove = (e: React.MouseEvent) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setZoom({ x, y });
  };

  const current = images[active] ?? images[0];

  return (
    <div className="flex flex-col-reverse gap-3 sm:flex-row">
      {/* Thumbnails */}
      <div className="flex gap-3 sm:flex-col">
        {images.map((img, i) => (
          <button
            key={img.id}
            onMouseEnter={() => setActive(i)}
            onClick={() => setActive(i)}
            className={cn(
              'h-16 w-16 shrink-0 overflow-hidden rounded-md border-2 bg-muted transition-colors',
              i === active ? 'border-primary' : 'border-transparent hover:border-border',
            )}
          >
            <img src={img.url} alt={`${name} ${i + 1}`} className="h-full w-full object-cover" />
          </button>
        ))}
      </div>

      {/* Main image with zoom */}
      <div
        ref={containerRef}
        onMouseMove={handleMove}
        onMouseLeave={() => setZoom(null)}
        className="relative aspect-square flex-1 cursor-zoom-in overflow-hidden rounded-lg border border-border bg-muted"
      >
        <img
          src={current?.url}
          alt={current?.altText ?? name}
          className="h-full w-full object-cover transition-transform duration-200"
          style={
            zoom
              ? { transform: 'scale(1.8)', transformOrigin: `${zoom.x}% ${zoom.y}%` }
              : undefined
          }
        />
        <span className="pointer-events-none absolute bottom-2 right-2 rounded bg-background/80 px-2 py-1 text-[11px] text-muted-foreground backdrop-blur">
          Hover to zoom
        </span>
      </div>
    </div>
  );
}
