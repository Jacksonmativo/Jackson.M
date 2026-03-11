import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

interface GalleryViewerProps {
  images: string[];
  title: string;
  isOpen: boolean;
  onClose: () => void;
  theme: "arch" | "cyber" | "soft";
}

const THEME_ACCENT: Record<string, string> = {
  arch:  "border-blue-400/60 text-blue-400",
  cyber: "border-green-400/60 text-green-400",
  soft:  "border-purple-400/60 text-purple-400",
};

const THEME_DOT_ACTIVE: Record<string, string> = {
  arch:  "bg-blue-400",
  cyber: "bg-green-400",
  soft:  "bg-purple-400",
};

export function GalleryViewer({ images, title, isOpen, onClose, theme }: GalleryViewerProps) {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(0); // -1 = left, 1 = right
  const touchStartX = useRef<number | null>(null);

  // Reset to first image whenever gallery opens
  useEffect(() => {
    if (isOpen) setIndex(0);
  }, [isOpen]);

  // Lock body scroll while open
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft")  goTo(index - 1);
      if (e.key === "ArrowRight") goTo(index + 1);
      if (e.key === "Escape")     onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [isOpen, index]);

  const goTo = useCallback((next: number) => {
    const clamped = (next + images.length) % images.length;
    setDirection(next > index ? 1 : -1);
    setIndex(clamped);
  }, [index, images.length]);

  // Touch / swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const delta = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(delta) > 50) goTo(index + (delta > 0 ? 1 : -1));
    touchStartX.current = null;
  };

  const slideVariants = {
    enter:  (d: number) => ({ x: d > 0 ? "100%" : "-100%", opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit:   (d: number) => ({ x: d > 0 ? "-100%" : "100%", opacity: 0 }),
  };

  const accent = THEME_ACCENT[theme];
  const dotActive = THEME_DOT_ACTIVE[theme];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="gallery-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black/95 backdrop-blur-md p-2 sm:p-4"
          onClick={onClose}
        >
          {/* Modal box */}
          <motion.div
            initial={{ scale: 0.93, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.93, opacity: 0 }}
            transition={{ type: "spring", stiffness: 320, damping: 30 }}
            onClick={e => e.stopPropagation()}
            className={`relative w-full max-w-6xl rounded-2xl overflow-hidden border ${accent.split(" ")[0]} bg-[#0a0a0a] shadow-2xl`}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-3 border-b border-white/10">
              <span className={`font-mono text-sm font-semibold ${accent.split(" ")[1]}`}>
                {title} — {index + 1} / {images.length}
              </span>
              <button
                onClick={onClose}
                className="p-1.5 rounded-full bg-white/5 hover:bg-white/15 transition-colors"
                aria-label="Close gallery"
              >
                <X className="w-5 h-5 text-white" />
              </button>
            </div>

            {/* Image area */}
            <div
              className="relative overflow-hidden bg-black"
              style={{ height: "clamp(300px, 72vh, 800px)" }}
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
            >
              <AnimatePresence custom={direction} mode="popLayout">
                <motion.img
                  key={index}
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ type: "spring", stiffness: 320, damping: 32, mass: 0.8 }}
                  src={images[index]}
                  alt={`${title} ${index + 1}`}
                  className="absolute inset-0 w-full h-full object-cover"
                  draggable={false}
                />
              </AnimatePresence>

              {/* Arrow buttons */}
              {images.length > 1 && (
                <>
                  <button
                    onClick={() => goTo(index - 1)}
                    className="absolute left-3 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-black/60 hover:bg-black/90 border border-white/10 transition-all hover:scale-110"
                    aria-label="Previous image"
                  >
                    <ChevronLeft className="w-6 h-6 text-white" />
                  </button>
                  <button
                    onClick={() => goTo(index + 1)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-black/60 hover:bg-black/90 border border-white/10 transition-all hover:scale-110"
                    aria-label="Next image"
                  >
                    <ChevronRight className="w-6 h-6 text-white" />
                  </button>
                </>
              )}
            </div>

            {/* Dot indicators */}
            {images.length > 1 && (
              <div className="flex justify-center gap-2 py-3 bg-[#0a0a0a]">
                {images.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => goTo(i)}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      i === index ? `w-6 ${dotActive}` : "w-1.5 bg-white/25 hover:bg-white/50"
                    }`}
                    aria-label={`Go to image ${i + 1}`}
                  />
                ))}
              </div>
            )}
          </motion.div>

          {/* Swipe hint on mobile */}
          <p className="mt-4 text-white/30 text-xs font-mono sm:hidden">swipe to navigate</p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
