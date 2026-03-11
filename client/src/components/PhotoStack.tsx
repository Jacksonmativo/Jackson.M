import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Images } from "lucide-react";

interface PhotoStackProps {
  images: string[];
  alt: string;
  onOpenGallery: () => void;
  isGalleryOpen: boolean;
  theme: "arch" | "cyber" | "soft";
}

// Visual config per depth position in the stack (0 = top card)
const STACK_CONFIGS = [
  { rotate:  0,  x:  0, y:  0,  scale: 1.00, zIndex: 10, opacity: 1.00 },
  { rotate: -5,  x: -7, y:  9,  scale: 0.95, zIndex:  9, opacity: 0.85 },
  { rotate:  7,  x:  9, y: 16,  scale: 0.90, zIndex:  8, opacity: 0.70 },
  { rotate: -3,  x: -4, y: 22,  scale: 0.85, zIndex:  7, opacity: 0.55 },
];

const THEME_BADGE: Record<string, string> = {
  arch:  "bg-blue-400/20 text-blue-300 border-blue-400/40",
  cyber: "bg-green-400/20 text-green-300 border-green-400/40",
  soft:  "bg-purple-400/20 text-purple-300 border-purple-400/40",
};

export function PhotoStack({ images, alt, onOpenGallery, isGalleryOpen, theme }: PhotoStackProps) {
  const [isHovered, setIsHovered] = useState(false);
  // order[i] = index of image at stack position i (0 = top)
  const [order, setOrder] = useState<number[]>(() => images.map((_, i) => i));

  const shuffle = useCallback(() => {
    setOrder(prev => {
      // Fisher-Yates shuffle for true randomness each cycle
      const next = [...prev];
      for (let i = next.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [next[i], next[j]] = [next[j], next[i]];
      }
      return next;
    });
  }, []);

  // Auto-shuffle every 2 seconds; pause while gallery is open
  useEffect(() => {
    if (isGalleryOpen || images.length <= 1) return;
    const id = setInterval(shuffle, 2000);
    return () => clearInterval(id);
  }, [isGalleryOpen, shuffle, images.length]);

  if (images.length === 0) return null;

  const visible = images.slice(0, STACK_CONFIGS.length);

  return (
    <div
      className="relative cursor-pointer select-none"
      style={{ height: 180 }}
      onClick={onOpenGallery}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Render each card keyed by its imageIdx so Framer Motion can animate the transition */}
      {visible.map((image, imageIdx) => {
        const stackPos = order.indexOf(imageIdx);
        if (stackPos === -1 || stackPos >= STACK_CONFIGS.length) return null;

        const cfg = STACK_CONFIGS[stackPos];
        const isTop = stackPos === 0;

        return (
          <motion.div
            key={imageIdx}
            animate={{
              rotate: isTop && isHovered ? cfg.rotate + 1.5 : cfg.rotate,
              x: cfg.x,
              y: isTop && isHovered ? cfg.y - 10 : cfg.y,
              scale: isTop && isHovered ? cfg.scale + 0.025 : cfg.scale,
              opacity: cfg.opacity,
            }}
            transition={{ type: "spring", stiffness: 280, damping: 28 }}
            style={{ zIndex: cfg.zIndex }}
            className="absolute inset-0 rounded-xl overflow-hidden border-[3px] border-white/25 shadow-2xl bg-black"
          >
            <img
              src={image}
              alt={`${alt} ${imageIdx + 1}`}
              className="w-full h-full object-cover"
              draggable={false}
            />
            {/* Subtle shine on top card */}
            {isTop && (
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
            )}
          </motion.div>
        );
      })}

      {/* Photo count badge */}
      {images.length > 1 && (
        <div
          className={`absolute top-2 right-2 z-20 flex items-center gap-1 px-2 py-0.5 rounded-full border text-xs font-mono backdrop-blur-sm ${THEME_BADGE[theme]}`}
          style={{ zIndex: 20 }}
        >
          <Images className="w-3 h-3" />
          {images.length}
        </div>
      )}

      {/* Tap hint on hover */}
      {isHovered && (
        <motion.div
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute inset-0 z-30 flex items-center justify-center pointer-events-none"
          style={{ zIndex: 30 }}
        >
          <span className="px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-sm text-white text-xs font-mono border border-white/20">
            View gallery
          </span>
        </motion.div>
      )}
    </div>
  );
}
