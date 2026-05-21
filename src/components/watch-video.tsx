"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { CloseIcon, PlayIcon } from "@/components/icons";
import { cn } from "@/lib/utils";

function VideoModal({
  videoId,
  start,
  title,
  onClose,
}: {
  videoId: string;
  start?: number;
  title: string;
  onClose: () => void;
}) {
  const [visible, setVisible] = useState(false);
  const closeBtnRef = useRef<HTMLButtonElement>(null);
  const closing = useRef(false);

  const close = () => {
    if (closing.current) return;
    closing.current = true;
    setVisible(false);
    // let the exit transition play before unmounting
    window.setTimeout(onClose, 220);
  };

  useEffect(() => {
    const raf = requestAnimationFrame(() => setVisible(true));
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeBtnRef.current?.focus();
    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const src =
    `https://www.youtube-nocookie.com/embed/${videoId}` +
    `?autoplay=1&rel=0&modestbranding=1&playsinline=1` +
    (start ? `&start=${start}` : "");

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`${title} — video`}
      className="fixed inset-0 z-[100] flex items-center justify-center p-0 md:p-6"
    >
      {/* Click / tap anywhere to close */}
      <button
        type="button"
        aria-label="Close video"
        onClick={close}
        className={cn(
          "absolute inset-0 cursor-default bg-black/90 backdrop-blur-md transition-opacity duration-200",
          visible ? "opacity-100" : "opacity-0",
        )}
      />

      {/* Player — fills the phone screen; theatre box on tablet/desktop.
          pointer-events-none on the wrapper lets taps in the letterbox reach
          the backdrop, while the video itself stays interactive. */}
      <div
        className={cn(
          "pointer-events-none relative flex h-full w-full items-center justify-center transition-all duration-200 ease-out md:h-auto md:w-[min(94vw,156vh,1320px)]",
          visible ? "opacity-100 md:scale-100" : "opacity-0 md:scale-[0.96]",
        )}
      >
        <div className="pointer-events-auto aspect-video w-full bg-black shadow-[0_24px_80px_rgba(0,0,0,0.7)]">
          <iframe
            src={src}
            title={title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            className="size-full border-0"
          />
        </div>
      </div>

      {/* Always-reachable close button */}
      <button
        ref={closeBtnRef}
        type="button"
        aria-label="Close video"
        onClick={close}
        className={cn(
          "absolute right-3 top-3 z-[2] flex size-12 items-center justify-center bg-white/10 text-white backdrop-blur transition-all duration-200 hover:bg-[#ff4400] hover:text-black md:right-5 md:top-5",
          visible ? "scale-100 opacity-100" : "scale-90 opacity-0",
        )}
      >
        <CloseIcon className="size-6" />
      </button>
    </div>,
    document.body,
  );
}

export function WatchVideo({
  videoId,
  start,
  companyName,
  className,
}: {
  videoId: string;
  start?: number;
  companyName: string;
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={`Watch video about ${companyName}`}
        className={cn(
          "pointer-events-auto relative z-[3] inline-flex items-center gap-2 bg-white/[0.14] px-4 py-2.5 text-[13px] font-semibold text-white backdrop-blur-md transition-colors duration-200 hover:bg-[#ff4400] hover:text-black md:text-[14px]",
          className,
        )}
      >
        <PlayIcon className="size-3.5" />
        Watch video
      </button>
      {open && (
        <VideoModal
          videoId={videoId}
          start={start}
          title={companyName}
          onClose={() => setOpen(false)}
        />
      )}
    </>
  );
}
