import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import splashVideo from "@assets/Untitled_1775128160534.mp4";

export default function SplashScreen() {
  const [visible, setVisible] = useState(true);
  const [leaving, setLeaving] = useState(false);

  function dismiss() {
    if (leaving) return;
    setLeaving(true);
    setTimeout(() => setVisible(false), 700);
  }

  useEffect(() => {
    const timer = setTimeout(() => dismiss(), 8000);
    const onScroll = () => dismiss();
    const onKey = (e: KeyboardEvent) => { if (e.key !== "Tab") dismiss(); };
    window.addEventListener("scroll",  onScroll, { passive: true });
    window.addEventListener("wheel",   onScroll, { passive: true });
    window.addEventListener("keydown", onKey);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("scroll",  onScroll);
      window.removeEventListener("wheel",   onScroll);
      window.removeEventListener("keydown", onKey);
    };
  }, [leaving]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="splash"
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.7, ease: "easeInOut" }}
          onClick={dismiss}
          onTouchStart={dismiss}
          className="fixed inset-0 z-[9999] overflow-hidden cursor-pointer select-none bg-black"
        >
          <video
            src={splashVideo}
            autoPlay
            muted
            playsInline
            className="absolute inset-0 w-full h-full object-cover"
          />

          {/* Tap hint — bottom center */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.7, 0.35, 0.7] }}
            transition={{ delay: 1.5, duration: 3, repeat: Infinity, ease: "easeInOut" }}
            className="absolute bottom-8 left-0 right-0 text-center text-xs uppercase tracking-[0.22em] text-white/60 font-medium"
            style={{ fontFamily: "'Geist', sans-serif" }}
          >
            Tap anywhere to skip
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
