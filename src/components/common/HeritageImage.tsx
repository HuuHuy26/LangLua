import { useState } from 'react';

interface HeritageImageProps {
  src: string;
  alt: string;
  caption?: string;
  className?: string;
  aspectClass?: string;
  zoomOnHover?: boolean;
}

export function HeritageImage({
  src,
  alt,
  caption,
  className = '',
  aspectClass = 'aspect-[4/3]',
  zoomOnHover = true,
}: HeritageImageProps) {
  const [failed, setFailed] = useState(false);
  const [loaded, setLoaded] = useState(false);

  return (
    <figure className="group w-full">
      <div
        className={`relative w-full overflow-hidden rounded-2xl border border-slate-200 bg-slate-100 shadow-xs transition-all duration-300 group-hover:border-[#F59E0B] group-hover:shadow-lg ${aspectClass} ${className}`}
      >
        {!loaded && !failed && (
          <div className="absolute inset-0 animate-pulse bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200" />
        )}

        {!failed && src ? (
          <img
            src={src}
            alt={alt}
            referrerPolicy="no-referrer"
            loading="lazy"
            onLoad={() => setLoaded(true)}
            onError={() => setFailed(true)}
            className={`h-full w-full object-cover transition-transform duration-700 ease-out ${
              zoomOnHover ? 'group-hover:scale-105' : ''
            } ${loaded ? 'opacity-100' : 'opacity-0'}`}
          />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center bg-gradient-to-br from-slate-100 via-white to-slate-100 p-6 text-center">
            <svg
              width="44"
              height="44"
              viewBox="0 0 44 44"
              fill="none"
              aria-hidden="true"
              className="mb-3 text-[#F59E0B]"
            >
              <rect x="5" y="7" width="34" height="30" rx="4" stroke="currentColor" strokeWidth="1.8" />
              <line x1="13" y1="7" x2="13" y2="37" stroke="currentColor" strokeWidth="1" strokeDasharray="2 2" />
              <line x1="22" y1="7" x2="22" y2="37" stroke="currentColor" strokeWidth="1" strokeDasharray="2 2" />
              <line x1="31" y1="7" x2="31" y2="37" stroke="currentColor" strokeWidth="1" strokeDasharray="2 2" />
              <line x1="5" y1="17" x2="39" y2="17" stroke="#E11D48" strokeWidth="1.8" />
              <line x1="5" y1="27" x2="39" y2="27" stroke="#E11D48" strokeWidth="1.8" />
            </svg>
            <p className="font-serif text-base font-bold text-[#0F172A]">{alt}</p>
          </div>
        )}

        {/* Subtle silk luster overlay */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      </div>

      {caption && (
        <figcaption className="mt-2.5 flex items-center gap-2 font-sans text-xs text-[#64748B]">
          <span className="h-2 w-2 rounded-full bg-[#E11D48] shrink-0 shadow-2xs" />
          <span className="italic font-medium line-clamp-1">{caption}</span>
        </figcaption>
      )}
    </figure>
  );
}
