'use client';

import { useState } from 'react';

type Props = {
  src?: string;
  name: string;
  size?: number;
  bg?: string;
  className?: string;
};

export default function Avatar({
  src,
  name,
  size = 56,
  bg = 'bg-coy-lilac',
  className = 'rounded-full',
}: Props) {
  const [failed, setFailed] = useState(false);
  const style = { width: size, height: size };

  if (!src || failed) {
    return (
      <div
        style={style}
        role="img"
        aria-label={name}
        className={`flex shrink-0 items-end justify-center overflow-hidden ${bg} ${className}`}
      >
        <svg viewBox="0 0 100 100" width={size * 0.85} height={size * 0.85} aria-hidden="true">
          <circle cx="50" cy="36" r="17" fill="#17121F" />
          <path d="M12 100c0-24 17-38 38-38s38 14 38 38z" fill="#17121F" />
        </svg>
      </div>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={name}
      style={style}
      onError={() => setFailed(true)}
      className={`shrink-0 object-cover ${className}`}
    />
  );
}
