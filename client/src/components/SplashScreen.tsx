import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import jacksonPhoto from "@assets/Adobe_Express_-_file_1775083799269.png";

export default function SplashScreen() {
  const [visible, setVisible] = useState(true);
  const [leaving, setLeaving] = useState(false);

  function dismiss() {
    if (leaving) return;
    setLeaving(true);
    setTimeout(() => setVisible(false), 700);
  }

  useEffect(() => {
    const onScroll = () => dismiss();
    const onKey   = (e: KeyboardEvent) => { if (e.key !== "Tab") dismiss(); };
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
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.04 }}
          transition={{ duration: 0.65, ease: "easeInOut" }}
          onClick={dismiss}
          onTouchStart={dismiss}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-end overflow-hidden cursor-pointer select-none"
          style={{
            background: "linear-gradient(160deg, rgba(186,230,255,0.55) 0%, rgba(147,210,255,0.45) 40%, rgba(200,240,255,0.6) 100%)",
            backdropFilter: "blur(28px)",
            WebkitBackdropFilter: "blur(28px)",
          }}
        >
          {/* Subtle noise / depth layer */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: "radial-gradient(ellipse 80% 60% at 50% 110%, rgba(0,120,220,0.18) 0%, transparent 70%)",
            }}
          />

          {/* Photo — grows from bottom, slight right offset for visual balance */}
          <motion.div
            initial={{ y: 60, opacity: 0 }}
            animate={{ y: 0,  opacity: 1 }}
            transition={{ delay: 0.15, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="relative z-10 flex-shrink-0"
            style={{ width: "min(360px, 75vw)", marginBottom: "-2px" }}
          >
            <img
              src={jacksonPhoto}
              alt="Jackson Mativo"
              className="w-full h-auto object-contain drop-shadow-2xl"
              style={{ filter: "drop-shadow(0 20px 40px rgba(0,80,180,0.25))" }}
            />
          </motion.div>

          {/* Text card — sits just above the bottom edge */}
          <motion.div
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0,  opacity: 1 }}
            transition={{ delay: 0.35, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="absolute z-20 bottom-0 left-0 right-0 px-6 pb-10 pt-8 text-center"
            style={{
              background: "linear-gradient(to top, rgba(200,235,255,0.75) 0%, transparent 100%)",
            }}
          >
            {/* Name */}
            <h1
              className="text-5xl sm:text-6xl text-[#0a2a4a] mb-3 leading-tight"
              style={{ fontFamily: "'Allura', cursive", fontWeight: 400 }}
            >
              Jackson Mativo
            </h1>

            {/* Quote */}
            <p
              className="text-sm sm:text-base text-[#1a4a6e]/80 italic max-w-sm mx-auto leading-relaxed mb-6"
              style={{ fontFamily: "'Lora', serif" }}
            >
              "Architecture is the art of how to waste space beautifully — and fill it with meaning."
            </p>

            {/* Tap hint */}
            <motion.p
              animate={{ opacity: [0.4, 0.9, 0.4] }}
              transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
              className="text-xs tracking-widest uppercase text-[#1a4a6e]/60 font-medium"
              style={{ fontFamily: "'Geist', sans-serif", letterSpacing: "0.18em" }}
            >
              Tap anywhere to enter
            </motion.p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
