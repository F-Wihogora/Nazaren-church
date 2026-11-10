"use client";

import { useState } from "react";
import { publicAssetPath } from "@/lib/media-path";
import { cn } from "@/lib/utils";

type ChurchImageProps = {
  src: string;
  alt: string;
  className?: string;
  fallbackClassName?: string;
};

export default function ChurchImage({ src, alt, className, fallbackClassName }: ChurchImageProps) {
  const [failed, setFailed] = useState(false);
  const resolved = publicAssetPath(src);

  if (failed) {
    return (
      <div
        className={cn(
          "grid place-items-center rounded-lg bg-muted text-muted-foreground text-xs text-center p-4",
          fallbackClassName ?? className
        )}
        aria-label={alt}
      >
        {alt}
      </div>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={resolved}
      alt={alt}
      className={className}
      loading="lazy"
      decoding="async"
      onError={() => setFailed(true)}
    />
  );
}
