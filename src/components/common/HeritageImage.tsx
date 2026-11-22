import { useState } from 'react';

interface HeritageImageProps {
  src: string;
  alt: string;
  caption?: string;
  className?: string;
  aspectClass?: string;
}

export function HeritageImage({
  src,
  alt,
  caption,
  className = '',
  aspectClass = 'aspect-[4/3]',
}: HeritageImageProps) {
  const [failed, setFailed] = useState(false);

  return (
    <figure className="w-full">
      <div className={`relative w-full overflow-hidden bg-[#EFEAE1] border border-[#DED6C8] ${aspectClass} ${className}`}>
        {!failed && src ? (
          <img
            src={src}
            alt={alt}
            referrerPolicy="no-referrer"
            onError={() => setFailed(true)}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center bg-gradient-to-br from-[#EFEAE1] via-[#FBF9F5] to-[#E5DEC9] p-6 text-center">
            <svg
              width="40"
              height="40"
              viewBox="0 0 40 40"
              fill="none"
              aria-hidden="true"
              className="mb-3 text-[#8C6239]"
            >
              <rect x="4" y="6" width="32" height="28" stroke="currentColor" strokeWidth="1.5" />
              <line x1="12" y1="6" x2="12" y2="34" stroke="currentColor" strokeWidth="1" />
              <line x1="20" y1="6" x2="20" y2="34" stroke="currentColor" strokeWidth="1" />
              <line x1="28" y1="6" x2="28" y2="34" stroke="currentColor" strokeWidth="1" />
              <line x1="4" y1="15" x2="36" y2="15" stroke="#9B231D" strokeWidth="1.5" />
              <line x1="4" y1="25" x2="36" y2="25" stroke="#9B231D" strokeWidth="1.5" />
            </svg>
            <p className="font-display text-lg font-medium text-[#1C1917]">{alt}</p>
          </div>
        )}
      </div>
      {caption && (
        <figcaption className="mt-2 font-display text-xs italic text-[#57534E]">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
