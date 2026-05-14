"use client";

import { useState } from "react";
import Image from "next/image";
import { Play } from "lucide-react";
import thumbnailImage from "@/components/assets/thumbnail.png";

const YOUTUBE_ID = "34OSAHnDstY";

export default function VideoIntroPlayer() {
  const [playing, setPlaying] = useState(false);

  return (
    <div className="relative mx-auto max-w-5xl">
      <div className="relative aspect-video overflow-hidden rounded-3xl border border-border/60 bg-card shadow-[0_32px_120px_-40px_rgba(0,0,0,0.18)]">
        {playing ? (
          <iframe
            className="absolute inset-0 h-full w-full"
            src={`https://www.youtube.com/embed/${YOUTUBE_ID}?autoplay=1&rel=0&modestbranding=1`}
            title="Танилцуулга видео"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        ) : (
          <>
            <Image
              src={thumbnailImage}
              alt="Танилцуулга видеоны зураг"
              fill
              sizes="(min-width: 1024px) 1024px, 100vw"
              className="object-cover"
              priority={false}
              placeholder="blur"
            />
            <button
              type="button"
              onClick={() => setPlaying(true)}
              className="group absolute inset-0 flex items-center justify-center bg-black/25 transition hover:bg-black/35 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black/40"
              aria-label="Видео тоглуулах"
            >
              <span className="flex h-16 w-16 items-center justify-center rounded-full bg-background/95 text-[#1F4D3F] shadow-lg ring-1 ring-border transition group-hover:scale-105">
                <Play className="ml-1 h-7 w-7" fill="currentColor" aria-hidden />
              </span>
            </button>
          </>
        )}
      </div>
    </div>
  );
}
