import React from "react";
import { WhatsAppIcon } from "./WhatsAppIcon.tsx";

interface FloatingWhatsAppProps {
  phoneNumber?: string;
  defaultMessage?: string;
  className?: string;
}

export function FloatingWhatsApp({
  phoneNumber = "6285822767417",
  defaultMessage = "Halo Halwa Bakery, saya ingin tanya seputar menu roti dan pemesanan.",
  className = "",
}: FloatingWhatsAppProps) {
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(defaultMessage)}`;

  return (
    <div
      className={`fixed bottom-6 right-6 z-40 flex items-center gap-3 ${className}`}
    >
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Hubungi Halwa Bakery via WhatsApp"
        className="group relative flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-tr from-[#AF842D] via-[#C89B3C] to-[#DFC17B] text-white border border-[#F4EBD8]/30 shadow-[0_8px_25px_rgba(200,155,60,0.45)] transition-all duration-300 hover:scale-110 hover:shadow-[0_12px_30px_rgba(200,155,60,0.65)] hover:brightness-105 active:scale-95 cursor-pointer"
      >
        {/* Subtle pulsing radar effect in Halwa Bakery brand gold */}
        <span className="absolute -inset-1 rounded-full bg-primary opacity-35 animate-ping pointer-events-none" />

        {/* WhatsApp Icon */}
        <WhatsAppIcon size={28} className="relative z-10 fill-current drop-shadow-sm" />

        {/* Tooltip on hover (desktop) */}
        <div className="pointer-events-none absolute right-full mr-3 hidden whitespace-nowrap rounded-xl bg-card border border-border px-3.5 py-1.5 text-xs font-bold text-foreground shadow-lift backdrop-blur-md transition-all duration-200 group-hover:flex items-center gap-1.5 animate-fade-in">
          <span className="inline-block h-2 w-2 rounded-full bg-primary" />
          <span>Chat WhatsApp</span>
        </div>
      </a>
    </div>
  );
}
