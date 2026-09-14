import React, { useState } from "react";
import { Download, Smartphone, Laptop, ExternalLink, X, Check, Globe } from "lucide-react";
import { usePWAInstall } from "@/src/hooks/usePWAInstall.ts";

export const PWAInstallButton: React.FC = () => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showGuide, setShowGuide] = useState(false);

  // If already installed and running standalone, hide
  if (isInstalled) {
    return null;
  }

  const handleButtonClick = async () => {
    if (isInstallable) {
      const accepted = await install();
      if (!accepted) {
        setShowGuide(true);
      }
    } else {
      setShowGuide(true);
    }
  };

  const appUrl = typeof window !== "undefined" ? window.location.href : "https://ais-dev-kqf3p64fptlx2v2k2pu2dm-216646152070.asia-east1.run.app";

  return (
    <>
      <button
        type="button"
        onClick={handleButtonClick}
        className="inline-flex items-center gap-1.5 rounded-full border border-[#DFC17B]/60 bg-gradient-to-r from-[#AF842D] to-[#C89B3C] px-3.5 py-1.5 text-xs font-bold text-white shadow-soft transition hover:scale-105 hover:brightness-105 active:scale-95 cursor-pointer"
        title="Pasang Aplikasi Halwa Bakery ke HP / Desktop"
      >
        <Download size={13} className="animate-bounce" />
        <span>Install Aplikasi</span>
      </button>

      {/* Guide Modal */}
      {showGuide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4 animate-fade-in">
          <div className="w-full max-w-md rounded-3xl border border-border bg-card p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div className="flex items-center gap-2.5">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#AF842D] text-white font-serif font-bold text-lg shadow-sm">
                  H
                </div>
                <div>
                  <h3 className="font-serif text-base font-bold text-foreground">
                    Pasang Aplikasi Halwa Bakery (PWA)
                  </h3>
                  <p className="text-[11px] text-muted-foreground">Bisa di HP Android, iPhone, maupun Laptop</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowGuide(false)}
                className="rounded-full p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition"
              >
                <X size={16} />
              </button>
            </div>

            <div className="mt-4 space-y-3.5 text-xs text-foreground/90">
              {/* If preview iframe detected */}
              <div className="rounded-2xl border border-amber-500/30 bg-amber-500/10 p-3 text-amber-900 dark:text-amber-200">
                <p className="font-semibold flex items-center gap-1.5 mb-1">
                  <Globe size={14} className="text-amber-600 dark:text-amber-400 shrink-0" />
                  Penting: Buka di Tab Baru / Browser Asli
                </p>
                <p className="text-[11px] leading-relaxed">
                  Browser melarang instalasi otomatis di dalam layar preview (iframe). Silakan buka di tab baru atau salin link ke browser HP Anda:
                </p>
                <a
                  href={appUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 inline-flex items-center gap-1.5 rounded-xl bg-amber-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-amber-700 transition"
                >
                  <ExternalLink size={12} />
                  <span>Buka di Tab Baru Sekarang</span>
                </a>
              </div>

              {/* Android Guide */}
              <div className="rounded-2xl bg-muted/50 p-3">
                <div className="flex items-center gap-2 font-bold text-foreground mb-1.5">
                  <Smartphone size={14} className="text-primary" />
                  <span>Pengguna HP Android (Google Chrome):</span>
                </div>
                <p className="text-muted-foreground text-[11px] leading-relaxed">
                  1. Buka link web di browser Chrome.<br />
                  2. Tekan <strong>titik 3 di pojok kanan atas</strong>.<br />
                  3. Pilih <strong>"Pasang aplikasi"</strong> atau <strong>"Tambahkan ke Layar utama"</strong>.<br />
                  4. Aplikasi Halwa Bakery akan muncul di menu HP Anda!
                </p>
              </div>

              {/* iOS Guide */}
              <div className="rounded-2xl bg-muted/50 p-3">
                <div className="flex items-center gap-2 font-bold text-foreground mb-1.5">
                  <Smartphone size={14} className="text-primary" />
                  <span>Pengguna iPhone / iPad (Safari):</span>
                </div>
                <p className="text-muted-foreground text-[11px] leading-relaxed">
                  1. Buka link web menggunakan browser <strong>Safari</strong>.<br />
                  2. Tekan tombol <strong>Bagikan / Share</strong> (kotak panah ke atas di bawah).<br />
                  3. Gulir ke bawah, pilih <strong>"Tambah ke Layar Utama" (Add to Home Screen)</strong>.<br />
                  4. Tekan <strong>Tambah (Add)</strong> di pojok kanan atas.
                </p>
              </div>

              {/* PC / Laptop Guide */}
              <div className="rounded-2xl bg-muted/50 p-3">
                <div className="flex items-center gap-2 font-bold text-foreground mb-1.5">
                  <Laptop size={14} className="text-primary" />
                  <span>Pengguna Laptop / Komputer (Chrome / Edge):</span>
                </div>
                <p className="text-muted-foreground text-[11px] leading-relaxed">
                  Klik ikon <strong>Install / Download komputer kecil</strong> di ujung kanan kolom alamat website (address bar browser), lalu klik <strong>Pasang</strong>.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowGuide(false)}
              className="mt-5 flex w-full items-center justify-center gap-1.5 rounded-xl bg-primary py-2.5 text-xs font-bold text-primary-foreground shadow-soft hover:brightness-105 transition active:scale-95 cursor-pointer"
            >
              <Check size={14} />
              <span>Tutup & Mengerti</span>
            </button>
          </div>
        </div>
      )}
    </>
  );
};
