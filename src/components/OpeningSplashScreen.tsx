import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";

interface OpeningSplashScreenProps {
  onComplete?: () => void;
  forceShow?: boolean;
}

export function OpeningSplashScreen({ onComplete, forceShow = false }: OpeningSplashScreenProps) {
  const [isVisible, setIsVisible] = useState(() => {
    if (forceShow) return true;
    try {
      // Periksa apakah splash sudah pernah tampil di sesi saat ini
      const seen = sessionStorage.getItem("halwa_splash_seen");
      return !seen;
    } catch {
      return true;
    }
  });

  useEffect(() => {
    if (!isVisible) {
      onComplete?.();
      return;
    }

    // Durasi tampil opening screen sekitar 1.8 detik sebelum fade-out halus
    const timer = setTimeout(() => {
      handleDismiss();
    }, 1800);

    return () => clearTimeout(timer);
  }, [isVisible]);

  const handleDismiss = () => {
    try {
      sessionStorage.setItem("halwa_splash_seen", "true");
    } catch {}
    setIsVisible(false);
    onComplete?.();
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          key="halwa-opening-splash"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.02 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          onClick={handleDismiss}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center select-none cursor-pointer overflow-hidden bg-[#FAF6EF]"
          aria-label="Opening Halwa Bakery"
        >
          {/* Subtle Ambient Background Warm Glow */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#FFFDF9] via-[#FAF6EF] to-[#F1E7D6] opacity-90 pointer-events-none" />

          {/* Skip Button Top Right */}
          <motion.button
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.4 }}
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleDismiss();
            }}
            className="absolute top-6 right-6 z-10 rounded-full border border-[#C89B3C]/30 bg-[#FAF6EF]/80 px-3 py-1 text-[11px] font-semibold tracking-wider text-[#5A3623] backdrop-blur-xs transition hover:bg-[#F2ECE0] cursor-pointer"
          >
            Lewati
          </motion.button>

          {/* Central Logo Container (Sesuai Foto 2) */}
          <div className="relative z-10 flex flex-col items-center text-center px-6 max-w-sm">
            {/* Logo Group Animation */}
            <motion.div
              initial={{ scale: 0.88, opacity: 0, y: 14 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="relative flex flex-col items-center"
            >
              {/* SVG Vector Logo Resmi Halwa Bakery (Foto 2) */}
              <svg
                viewBox="95 65 310 295"
                className="w-52 sm:w-60 h-auto overflow-visible drop-shadow-[0_8px_16px_rgba(90,54,35,0.08)]"
              >
                {/* Lengkungan Emas & Tangkai Gandum */}
                <g transform="translate(250, 190)">
                  {/* Busur Emas Atas */}
                  <motion.path
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 1 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    d="M-82,25 C-76,-62 -30,-112 0,-112 C34,-112 74,-66 84,28"
                    fill="none"
                    stroke="#C89B3C"
                    strokeWidth="5.5"
                    strokeLinecap="round"
                  />

                  {/* Tangkai Gandum Tengah */}
                  <motion.g
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.25, duration: 0.5 }}
                    transform="translate(0, -68)"
                  >
                    <line
                      x1="0"
                      y1="36"
                      x2="0"
                      y2="-28"
                      stroke="#C89B3C"
                      strokeWidth="4"
                      strokeLinecap="round"
                    />
                    <path d="M0,-28 C-3,-36 0,-43 0,-44 C0,-43 3,-36 0,-28 Z" fill="#C89B3C" />
                    <path d="M0,-20 C-9,-27 -14,-18 -7,-12 C-3,-9 0,-13 0,-20 Z" fill="#C89B3C" />
                    <path d="M0,-20 C9,-27 14,-18 7,-12 C3,-9 0,-13 0,-20 Z" fill="#C89B3C" />
                    <path d="M0,-8 C-11,-16 -16,-7 -9,0 C-4,3 0,-1 0,-8 Z" fill="#C89B3C" />
                    <path d="M0,-8 C11,-16 16,-7 9,0 C4,3 0,-1 0,-8 Z" fill="#C89B3C" />
                    <path d="M0,5 C-12,-3 -17,6 -10,12 C-5,15 0,11 0,5 Z" fill="#C89B3C" />
                    <path d="M0,5 C12,-3 17,6 10,12 C5,15 0,11 0,5 Z" fill="#C89B3C" />
                    <path d="M0,18 C-12,11 -16,19 -9,25 C-5,28 0,24 0,18 Z" fill="#C89B3C" />
                    <path d="M0,18 C12,11 16,19 9,25 C5,28 0,24 0,18 Z" fill="#C89B3C" />
                  </motion.g>
                </g>

                {/* Tulisan Brand 'Halwa' (Serif Cokelat Hangat) */}
                <motion.text
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.35, duration: 0.55 }}
                  x="250"
                  y="295"
                  fontFamily="'Playfair Display', Georgia, 'Times New Roman', serif"
                  fontSize="98"
                  fontWeight="700"
                  fill="#542817"
                  textAnchor="middle"
                  letterSpacing="-1"
                >
                  Halwa
                </motion.text>

                {/* Tulisan Subtitle 'BAKERY' (Emas Hangat Renggang) */}
                <motion.text
                  initial={{ opacity: 0, letterSpacing: "14px" }}
                  animate={{ opacity: 1, letterSpacing: "9px" }}
                  transition={{ delay: 0.45, duration: 0.55 }}
                  x="250"
                  y="342"
                  fontFamily="'Plus Jakarta Sans', ui-sans-serif, system-ui, sans-serif"
                  fontSize="22"
                  fontWeight="800"
                  fill="#C89B3C"
                  textAnchor="middle"
                >
                  BAKERY
                </motion.text>
              </svg>
            </motion.div>

            {/* Slogan & Identitas Hangat */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.65, duration: 0.5 }}
              className="mt-6 flex flex-col items-center gap-2"
            >
              <div className="h-0.5 w-12 bg-gradient-to-r from-transparent via-[#C89B3C]/50 to-transparent" />
              <p className="text-xs sm:text-sm font-medium tracking-wide text-[#5A3623]/80">
                Dipanggang Hangat Setiap Hari
              </p>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-[#C89B3C]/30 bg-[#FFFDF9]/80 px-2.5 py-0.5 text-[10px] font-bold text-[#8A5A18]">
                ✓ 100% Halal Indonesia
              </span>
            </motion.div>
          </div>

          {/* Bottom subtle golden indicator */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-28 overflow-hidden rounded-full bg-[#E5D8C3] h-1">
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: "100%" }}
              transition={{ repeat: Infinity, duration: 1.1, ease: "easeInOut" }}
              className="h-full w-1/2 rounded-full bg-gradient-to-r from-[#C89B3C]/40 via-[#C89B3C] to-[#C89B3C]/40"
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
