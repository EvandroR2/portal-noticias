"use client";

/* eslint-disable @next/next/no-img-element */

import { useState } from "react";

type ExternalImageProps = {
  className: string;
  src: string;
  alt: string;
  width: number;
  height: number;
  priority?: boolean;
};

export default function ExternalImage({
  className,
  src,
  alt,
  width,
  height,
  priority = false,
}: ExternalImageProps) {
  const [falhou, setFalhou] = useState(false);

  if (falhou) {
    return (
      <div
        className={`${className} external-image--fallback`}
        role="img"
        aria-label={alt || "Imagem indisponível"}
      >
        <span>Imagem indisponível</span>
      </div>
    );
  }

  return (
    <img
      className={className}
      src={src}
      alt={alt}
      width={width}
      height={height}
      loading={priority ? "eager" : "lazy"}
      fetchPriority={priority ? "high" : "auto"}
      decoding="async"
      referrerPolicy="no-referrer"
      onError={() => setFalhou(true)}
    />
  );
}
