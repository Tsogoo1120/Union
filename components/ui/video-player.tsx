"use client";

type VideoSource = "youtube" | "vimeo" | "file" | "iframe" | "unknown";

function parseSource(rawUrl: string): { kind: VideoSource; embedUrl: string } {
  const url = rawUrl.trim();
  if (!url) return { kind: "unknown", embedUrl: "" };

  // youtu.be/<id>
  const ytShort = url.match(/^https?:\/\/youtu\.be\/([\w-]{6,})/i);
  if (ytShort) {
    return {
      kind: "youtube",
      embedUrl: `https://www.youtube.com/embed/${ytShort[1]}?rel=0&modestbranding=1`,
    };
  }

  // youtube.com/watch?v=<id>  or  youtube.com/shorts/<id>  or already /embed/<id>
  const yt = url.match(
    /^https?:\/\/(?:www\.|m\.)?youtube\.com\/(?:watch\?v=|embed\/|shorts\/|v\/)([\w-]{6,})/i,
  );
  if (yt) {
    return {
      kind: "youtube",
      embedUrl: `https://www.youtube.com/embed/${yt[1]}?rel=0&modestbranding=1`,
    };
  }

  // youtube-nocookie variant (unlisted-friendly)
  const ytNoCookie = url.match(
    /^https?:\/\/(?:www\.)?youtube-nocookie\.com\/embed\/([\w-]{6,})/i,
  );
  if (ytNoCookie) {
    return {
      kind: "youtube",
      embedUrl: `https://www.youtube-nocookie.com/embed/${ytNoCookie[1]}?rel=0&modestbranding=1`,
    };
  }

  // vimeo.com/<id>
  const vimeo = url.match(/^https?:\/\/(?:www\.)?vimeo\.com\/(\d+)/i);
  if (vimeo) {
    return {
      kind: "vimeo",
      embedUrl: `https://player.vimeo.com/video/${vimeo[1]}`,
    };
  }

  // Direct file (mp4 / webm / etc.) — served by <video>
  if (/\.(mp4|webm|ogg|mov|m4v)(\?.*)?$/i.test(url)) {
    return { kind: "file", embedUrl: url };
  }

  // Anything else: treat as an iframe-embeddable URL (e.g. self-hosted player).
  return { kind: "iframe", embedUrl: url };
}

export function VideoPlayer({
  url,
  title,
  className,
}: {
  url: string;
  title?: string;
  className?: string;
}) {
  const { kind, embedUrl } = parseSource(url);

  if (!embedUrl) return null;

  const wrapperClass =
    className ??
    "overflow-hidden rounded-3xl border border-border bg-muted shadow-soft";

  if (kind === "file") {
    return (
      <div className={wrapperClass}>
        <div className="aspect-video w-full bg-black">
          <video
            src={embedUrl}
            controls
            playsInline
            preload="metadata"
            className="h-full w-full"
          >
            Таны хөтөч видео тоглуулахгүй байна.
          </video>
        </div>
      </div>
    );
  }

  return (
    <div className={wrapperClass}>
      <div className="aspect-video w-full">
        <iframe
          src={embedUrl}
          title={title ?? "Video"}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          loading="lazy"
          referrerPolicy="strict-origin-when-cross-origin"
          className="h-full w-full border-0"
        />
      </div>
    </div>
  );
}
