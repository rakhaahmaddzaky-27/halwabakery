import React, { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { ShieldCheck, CheckCircle2, ExternalLink, X, FileText } from "lucide-react";

export const HALAL_CERTIFICATE_NUMBER = "ID64110055824640426";

interface HalalBadgeProps {
  variant?: "pill" | "card" | "compact" | "banner";
  className?: string;
  showModalOnClick?: boolean;
}

export const HalalLogoSvg: React.FC<{ className?: string }> = ({ className = "h-16 w-auto" }) => (
  <svg
    viewBox="0 0 160 230"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-label="Logo Halal Indonesia Resmi BPJPH"
  >
    {/* Outer Rounded Frame */}
    <rect
      x="5"
      y="5"
      width="150"
      height="220"
      rx="12"
      fill="#FFFFFF"
      stroke="#68217A"
      strokeWidth="5"
    />

    {/* Gunungan Wayang Halal Calligraphy Emblem */}
    <g fill="#68217A">
      {/* Outer Left Gunungan Contour */}
      <path d="M46 136 C36 132 28 122 28 108 C28 92 36 78 46 64 C56 50 71 36 80 20 C89 36 104 50 114 64 C124 78 132 92 132 108 C132 122 124 132 114 136 C111 137 108 135 108 131 C116 128 123 118 123 108 C123 95 116 82 107 70 C98 57 86 45 80 32 C74 45 62 57 53 70 C44 82 37 95 37 108 C37 118 44 128 52 131 C52 135 49 137 46 136 Z" />

      {/* Gunungan Base Bracket */}
      <path d="M42 142 H118 C120 142 121 144 121 146 C121 148 120 150 118 150 H42 C40 150 39 148 39 146 C39 144 40 142 42 142 Z" />

      {/* Gunungan Inner Slits / Calligraphic Pillars */}
      {/* Central Tall Spire */}
      <path d="M77 40 L83 40 L83 136 L77 136 Z" />
      {/* Left-center Pillar */}
      <path d="M66 58 L71 50 L71 136 L66 136 Z" />
      {/* Right-center Pillar */}
      <path d="M89 50 L94 58 L94 136 L89 136 Z" />
      {/* Left-outer Arch Spire */}
      <path d="M55 76 L60 70 L60 136 L55 136 Z" />
      {/* Right-outer Arch Spire */}
      <path d="M100 70 L105 76 L105 136 L100 136 Z" />
      
      {/* Base Pedestal Line */}
      <rect x="42" y="154" width="76" height="4.5" rx="2" />
    </g>

    {/* Text: HALAL */}
    <text
      x="80"
      y="180"
      textAnchor="middle"
      fill="#68217A"
      fontFamily="'Times New Roman', 'Playfair Display', Georgia, serif"
      fontWeight="900"
      fontSize="21"
      letterSpacing="1.2"
    >
      HALAL
    </text>

    {/* Text: INDONESIA */}
    <text
      x="80"
      y="196"
      textAnchor="middle"
      fill="#68217A"
      fontFamily="'Plus Jakarta Sans', Arial, sans-serif"
      fontWeight="800"
      fontSize="9.5"
      letterSpacing="3"
    >
      INDONESIA
    </text>

    {/* Text: ID Number */}
    <text
      x="80"
      y="214"
      textAnchor="middle"
      fill="#68217A"
      fontFamily="'Plus Jakarta Sans', Arial, monospace"
      fontWeight="700"
      fontSize="8.5"
      letterSpacing="0.4"
    >
      {HALAL_CERTIFICATE_NUMBER}
    </text>
  </svg>
);

export const HalalModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const backdropRef = useRef<HTMLDivElement>(null);

  // Lock body scroll, reset scroll position, and handle escape key
  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    if (backdropRef.current) {
      backdropRef.current.scrollTop = 0;
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  const modalContent = (
    <div
      ref={backdropRef}
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-[100] overflow-y-auto bg-black/75 backdrop-blur-xs p-3 sm:p-4 animate-fade-in"
      onClick={onClose}
    >
      <div className="flex min-h-full items-center justify-center p-0 text-center">
        <div
          onClick={(e) => e.stopPropagation()}
          className="relative w-full max-w-sm sm:max-w-md my-auto rounded-3xl border border-purple-200 bg-white p-5 sm:p-6 shadow-2xl text-left animate-rise"
        >
          {/* Close Button */}
          <button
            type="button"
            onClick={onClose}
            className="absolute top-3.5 right-3.5 z-10 grid h-8 w-8 place-items-center rounded-full bg-muted/80 text-muted-foreground transition hover:bg-border hover:text-foreground active:scale-95 cursor-pointer"
            aria-label="Tutup detail sertifikat"
          >
            <X size={16} />
          </button>

          {/* Content with Halal Logo */}
          <div className="flex flex-col items-center text-center">
            <div className="p-1.5 rounded-2xl bg-white border border-purple-200 shadow-2xs">
              <HalalLogoSvg className="h-16 sm:h-18 w-auto" />
            </div>

            <div className="mt-2.5 inline-flex items-center gap-1.5 rounded-full bg-purple-100 text-purple-900 px-3 py-0.5 text-xs font-extrabold">
              <ShieldCheck size={13} className="text-[#68217A]" />
              <span>Sertifikat Resmi Halal Indonesia</span>
            </div>

            <h3 className="font-display text-base sm:text-lg font-bold text-foreground mt-1.5">
              Halwa Bakery Terverifikasi Halal
            </h3>

            <div className="mt-2.5 w-full rounded-2xl border border-purple-200/80 bg-purple-50/50 p-3 sm:p-3.5 text-left space-y-1.5 text-xs">
              <div className="flex justify-between border-b border-purple-200/60 pb-1">
                <span className="text-muted-foreground">Nomor Sertifikat</span>
                <span className="font-mono font-black text-[#68217A]">
                  {HALAL_CERTIFICATE_NUMBER}
                </span>
              </div>
              <div className="flex justify-between border-b border-purple-200/60 pb-1">
                <span className="text-muted-foreground">Penerbit</span>
                <span className="font-semibold text-foreground">
                  BPJPH Kementerian Agama RI
                </span>
              </div>
              <div className="flex justify-between border-b border-purple-200/60 pb-1">
                <span className="text-muted-foreground">Status Jaminan</span>
                <span className="font-bold text-emerald-700 flex items-center gap-1">
                  <CheckCircle2 size={13} /> 100% Halal &amp; Higienis
                </span>
              </div>
              <div className="flex justify-between pt-0.5">
                <span className="text-muted-foreground">Cakupan Produk</span>
                <span className="font-semibold text-foreground text-right">
                  Seluruh Roti, Brownies &amp; Olahan Kue
                </span>
              </div>
            </div>

            <p className="mt-2.5 text-[11px] leading-relaxed text-foreground/75">
              Semua bahan baku (tepung, mentega, cokelat, keju, sosis, selai nanas &amp; srikaya) dipilih dengan standar kehalalan dan kebersihan ketat tanpa bahan kimia berbahaya.
            </p>

            <button
              type="button"
              onClick={onClose}
              className="mt-3.5 w-full rounded-xl bg-[#68217A] py-2.5 text-sm font-bold text-white shadow-soft hover:brightness-110 active:scale-98 transition cursor-pointer"
            >
              Tutup
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  if (typeof document === "undefined") {
    return null;
  }

  return createPortal(modalContent, document.body);
};

export const HalalCertificateBadge: React.FC<HalalBadgeProps> = ({
  variant = "card",
  className = "",
  showModalOnClick = true,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const triggerModal = () => {
    if (showModalOnClick) setIsOpen(true);
  };

  if (variant === "pill") {
    return (
      <>
        <button
          type="button"
          onClick={triggerModal}
          title="Klik untuk melihat detail Sertifikat Halal Indonesia"
          className={`inline-flex items-center gap-2 rounded-full border border-purple-200/90 bg-white/95 px-3.5 py-1.5 text-xs font-bold text-[#68217A] shadow-2xs transition hover:bg-purple-50 hover:border-purple-300 active:scale-95 cursor-pointer ${className}`}
        >
          <div className="flex h-5 w-5 items-center justify-center rounded-full bg-[#68217A] text-white">
            <ShieldCheck size={13} />
          </div>
          <span className="font-extrabold text-[#68217A]">100% Halal Indonesia</span>
          <span className="text-[10px] text-purple-700/80 font-mono font-medium hidden md:inline">
            • {HALAL_CERTIFICATE_NUMBER}
          </span>
        </button>

        {isOpen && <HalalModal onClose={() => setIsOpen(false)} />}
      </>
    );
  }

  if (variant === "compact") {
    return (
      <>
        <div
          onClick={triggerModal}
          className={`flex items-center gap-2.5 rounded-xl border border-purple-200/90 bg-white p-2.5 shadow-2xs transition hover:border-purple-300 hover:shadow-soft cursor-pointer ${className}`}
        >
          <HalalLogoSvg className="h-11 w-auto shrink-0" />
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-black text-[#68217A]">HALAL INDONESIA</span>
              <span className="rounded-full bg-emerald-100 text-emerald-800 text-[9px] font-bold px-1.5 py-0.2">
                Terverifikasi
              </span>
            </div>
            <p className="text-[11px] font-bold font-mono text-foreground/80 mt-0.5">
              No. {HALAL_CERTIFICATE_NUMBER}
            </p>
            <p className="text-[9.5px] text-muted-foreground mt-0.5">
              Badan Penyelenggara Jaminan Produk Halal (BPJPH)
            </p>
          </div>
        </div>

        {isOpen && <HalalModal onClose={() => setIsOpen(false)} />}
      </>
    );
  }

  if (variant === "banner") {
    return (
      <>
        <div
          onClick={triggerModal}
          className={`group flex flex-col sm:flex-row items-center justify-between gap-4 rounded-2xl border border-purple-200 bg-gradient-to-r from-purple-50/80 via-white to-purple-50/40 p-4 sm:p-5 shadow-soft transition hover:border-purple-300 cursor-pointer ${className}`}
        >
          <div className="flex items-center gap-4">
            <div className="p-1 rounded-xl bg-white border border-purple-200/80 shadow-2xs group-hover:scale-105 transition">
              <HalalLogoSvg className="h-16 w-auto" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-black text-[#68217A]">
                  Tersertifikasi Halal Resmi
                </span>
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 px-2 py-0.5 text-[10px] font-bold text-emerald-700">
                  <CheckCircle2 size={11} className="text-emerald-600" />
                  BPJPH Kemenag
                </span>
              </div>
              <p className="text-xs text-foreground/80 mt-1">
                Seluruh produk roti, brownies, kue, dan isian Halwa Bakery 100% halal dan higienis.
              </p>
              <p className="text-xs font-mono font-bold text-[#68217A] mt-1.5 flex items-center gap-1.5">
                <FileText size={13} />
                Nomor Sertifikat: {HALAL_CERTIFICATE_NUMBER}
              </p>
            </div>
          </div>
          <div className="shrink-0 flex items-center gap-1 text-xs font-bold text-[#68217A] bg-white border border-purple-200 rounded-xl px-3.5 py-2 shadow-2xs group-hover:bg-purple-50 transition">
            <span>Lihat Sertifikat</span>
            <ExternalLink size={13} />
          </div>
        </div>

        {isOpen && <HalalModal onClose={() => setIsOpen(false)} />}
      </>
    );
  }

  // Default: Card
  return (
    <>
      <div
        id="halal-official-badge"
        onClick={triggerModal}
        className={`group relative overflow-hidden rounded-2xl border border-purple-200/90 bg-white p-4 shadow-soft transition hover:border-purple-400 hover:shadow-lift cursor-pointer ${className}`}
      >
        <div className="flex items-center gap-3.5">
          <div className="p-1 rounded-xl bg-white border border-purple-200 shadow-2xs group-hover:scale-105 transition">
            <HalalLogoSvg className="h-18 w-auto" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-black uppercase tracking-wider text-purple-700 bg-purple-100 rounded-md px-1.5 py-0.5">
                Resmi BPJPH
              </span>
              <span className="text-[10px] font-semibold text-emerald-700 flex items-center gap-0.5">
                <CheckCircle2 size={11} /> Terdaftar
              </span>
            </div>
            <h4 className="font-display text-sm font-bold text-foreground mt-1">
              Sertifikasi Halal Indonesia
            </h4>
            <p className="text-xs font-mono font-bold text-[#68217A] mt-0.5">
              {HALAL_CERTIFICATE_NUMBER}
            </p>
            <p className="text-[11px] text-muted-foreground mt-1 line-clamp-1">
              Jaminan mutu, kebersihan, dan kehalalan bahan 100%.
            </p>
          </div>
        </div>
      </div>

      {isOpen && <HalalModal onClose={() => setIsOpen(false)} />}
    </>
  );
};
