import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import jacksonPhoto from "@assets/Adobe_Express_-_file_1775083799269.png";

export default function SplashScreen() {
  const [visible, setVisible] = useState(true);
  const [leaving, setLeaving] = useState(false);

  function dismiss() {
    if (leaving) return;
    setLeaving(true);
    setTimeout(() => setVisible(false), 600);
  }

  useEffect(() => {
    const onScroll = () => dismiss();
    const onKey = (e: KeyboardEvent) => { if (e.key !== "Tab") dismiss(); };
    window.addEventListener("scroll",  onScroll, { passive: true });
    window.addEventListener("wheel",   onScroll, { passive: true });
    window.addEventListener("keydown", onKey);
    return () => {
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
          initial={{ y: 0, opacity: 1 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: "-100%", opacity: 0 }}
          transition={{ duration: 0.55, ease: [0.4, 0, 0.2, 1] }}
          onClick={dismiss}
          onTouchStart={dismiss}
          className="fixed top-0 left-0 right-0 z-[9999] flex flex-row items-stretch overflow-hidden cursor-pointer select-none"
          style={{
            height: "33.33vh",
            background: "linear-gradient(135deg, rgba(186,230,255,0.72) 0%, rgba(160,215,255,0.60) 50%, rgba(210,240,255,0.75) 100%)",
            backdropFilter: "blur(32px)",
            WebkitBackdropFilter: "blur(32px)",
            borderBottom: "1px solid rgba(255,255,255,0.45)",
            boxShadow: "0 8px 40px rgba(0, 100, 200, 0.18)",
          }}
        >
          {/* Depth glow */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: "radial-gradient(ellipse 60% 100% at 20% 100%, rgba(0,140,255,0.15) 0%, transparent 70%)",
            }}
          />

          {/* ── LEFT: Photo ── */}
          <motion.div
            initial={{ x: -30, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="relative z-10 flex-shrink-0 flex items-end"
            style={{ width: "clamp(140px, 32vw, 320px)" }}
          >
            <img
              src={jacksonPhoto}
              alt="Jackson Mativo"
              className="w-full h-full object-contain object-bottom"
              style={{
                filter: "drop-shadow(4px 0 18px rgba(0,80,180,0.22))",
              }}
            />
          </motion.div>

          {/* ── CENTER: Text ── */}
          <motion.div
            initial={{ y: 16, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.25, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="relative z-10 flex-1 flex flex-col items-center justify-center text-center px-4"
          >
            {/* Name */}
            <h1
              className="text-[clamp(2.2rem,6vw,4rem)] text-[#092a48] leading-tight mb-2"
              style={{ fontFamily: "'Allura', cursive", fontWeight: 400 }}
            >
              Jackson Mativo
            </h1>

            {/* Quote */}
            <p
              className="text-[clamp(0.7rem,1.6vw,0.95rem)] text-[#1a4a6e]/75 italic max-w-xs leading-snug mb-3"
              style={{ fontFamily: "'Lora', serif" }}
            >
              "Architecture is the art of how to waste space beautifully — and fill it with meaning."
            </p>

            {/* Pulsing hint */}
            <motion.p
              animate={{ opacity: [0.35, 0.85, 0.35] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="text-[0.65rem] uppercase tracking-[0.2em] text-[#1a4a6e]/55 font-medium"
              style={{ fontFamily: "'Geist', sans-serif" }}
            >
              Tap anywhere to enter
            </motion.p>
          </motion.div>

          {/* ── RIGHT spacer (mirrors left for balance) ── */}
          <div style={{ width: "clamp(40px, 8vw, 80px)" }} />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
