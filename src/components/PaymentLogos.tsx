import React from "react";
import { CheckCircle2, ShieldCheck, QrCode } from "lucide-react";

interface PaymentLogosProps {
  variant?: "detailed" | "compact";
  className?: string;
}

export const PaymentLogos: React.FC<PaymentLogosProps> = ({
  variant = "detailed",
  className = "",
}) => {
  if (variant === "compact") {
    return (
      <div className={`mt-3 pt-2.5 border-t border-border/60 ${className}`}>
        <div className="flex items-center justify-center gap-1.5 text-[11px] font-semibold text-muted-foreground mb-2">
          <ShieldCheck size={14} className="text-emerald-600" />
          <span>Menerima Pembayaran QRIS & Transfer Bank</span>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-1.5 px-1">
          {/* QRIS Mini */}
          <div className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-white border border-rose-200 shadow-2xs">
            <span className="h-1.5 w-1.5 rounded-full bg-rose-600 animate-pulse"></span>
            <span className="font-extrabold text-[10px] tracking-wider text-rose-700">QRIS</span>
          </div>
          {/* BCA Mini */}
          <div className="px-1.5 py-0.5 rounded-md bg-[#003B70] text-white font-bold text-[9px] tracking-wide shadow-2xs">
            BCA
          </div>
          {/* Mandiri Mini */}
          <div className="px-1.5 py-0.5 rounded-md bg-[#002D62] text-[#F3A000] font-black text-[9px] tracking-wide shadow-2xs">
            mandiri
          </div>
          {/* BRI Mini */}
          <div className="px-1.5 py-0.5 rounded-md bg-[#00529C] text-white font-black text-[9px] tracking-wide shadow-2xs">
            BRI
          </div>
          {/* BNI Mini */}
          <div className="px-1.5 py-0.5 rounded-md bg-[#006666] text-white font-black text-[9px] tracking-wide shadow-2xs">
            BNI
          </div>
          {/* BSI Mini */}
          <div className="px-1.5 py-0.5 rounded-md bg-[#00A39D] text-white font-bold text-[9px] tracking-wide shadow-2xs">
            BSI
          </div>
          {/* GoPay */}
          <div className="px-1.5 py-0.5 rounded-md bg-[#00AED6] text-white font-bold text-[9px] tracking-wide shadow-2xs">
            gopay
          </div>
          {/* DANA */}
          <div className="px-1.5 py-0.5 rounded-md bg-[#118EEA] text-white font-bold text-[9px] tracking-wide shadow-2xs">
            DANA
          </div>
          {/* ShopeePay */}
          <div className="px-1.5 py-0.5 rounded-md bg-[#EE4D2D] text-white font-bold text-[9px] tracking-wide shadow-2xs">
            ShopeePay
          </div>
          {/* OVO */}
          <div className="px-1.5 py-0.5 rounded-md bg-[#4C2A86] text-white font-bold text-[9px] tracking-wide shadow-2xs">
            OVO
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      id="payment-trust-section"
      className={`rounded-2xl border border-primary/25 bg-gradient-to-b from-white via-primary-soft/30 to-primary-soft/50 p-4 shadow-xs transition-all ${className}`}
    >
      {/* Header with Security Guarantee */}
      <div className="flex items-start justify-between gap-2 border-b border-border/70 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="grid h-8 w-8 place-items-center rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-200/80 shadow-2xs">
            <ShieldCheck size={18} />
          </div>
          <div>
            <h4 className="text-xs font-bold text-foreground flex items-center gap-1.5">
              Pembayaran Aman & Praktis
              <span className="rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold px-1.5 py-0.2">
                Resmi
              </span>
            </h4>
            <p className="text-[11px] text-foreground/75 mt-0.5">
              Mendukung Scan QRIS & Transfer Bank Nasional
            </p>
          </div>
        </div>
      </div>

      {/* QRIS Highlighted Badge */}
      <div className="mt-3.5 rounded-xl border border-rose-200/90 bg-white p-2.5 shadow-2xs flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          {/* Authentic QRIS Badge */}
          <div className="flex flex-col items-center justify-center rounded-lg bg-white border border-rose-300 px-2.5 py-1 shadow-2xs">
            <div className="flex items-center gap-1">
              <QrCode size={14} className="text-rose-600" />
              <span className="font-black text-sm tracking-wider text-rose-700 leading-none">
                QRIS
              </span>
            </div>
            <span className="text-[7.5px] font-bold tracking-tight text-neutral-500 uppercase mt-0.5">
              Standar Nasional
            </span>
          </div>
          <div className="leading-tight">
            <span className="text-[11px] font-bold text-foreground block">
              1 QRIS untuk Semua Aplikasi
            </span>
            <span className="text-[10px] text-muted-foreground block mt-0.5">
              BCA, Mandiri, BRI, BNI, GoPay, OVO, DANA, ShopeePay, LinkAja
            </span>
          </div>
        </div>
        <span className="shrink-0 text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-full px-2 py-0.5">
          Bebas Biaya
        </span>
      </div>

      {/* Bank & E-Wallet Grid */}
      <div className="mt-3 space-y-2">
        <span className="text-[10.5px] font-bold uppercase tracking-wider text-muted-foreground block">
          Pilihan Bank & E-Wallet Terdaftar:
        </span>
        <div className="grid grid-cols-4 sm:grid-cols-5 gap-1.5">
          {/* BCA */}
          <div className="flex flex-col items-center justify-center rounded-xl border border-slate-200 bg-white py-2 px-1 shadow-2xs hover:border-[#003B70]/50 transition">
            <div className="h-5 flex items-center">
              <span className="font-black text-xs tracking-wider text-[#003B70]">
                BCA
              </span>
            </div>
            <span className="text-[8.5px] font-semibold text-slate-500 mt-0.5">
              Bank BCA
            </span>
          </div>

          {/* Mandiri */}
          <div className="flex flex-col items-center justify-center rounded-xl border border-slate-200 bg-white py-2 px-1 shadow-2xs hover:border-[#002D62]/50 transition">
            <div className="h-5 flex items-center gap-0.5">
              <span className="font-black text-xs text-[#002D62] tracking-tighter">
                mandırı
              </span>
              <span className="h-1.5 w-1.5 rounded-full bg-[#F3A000]"></span>
            </div>
            <span className="text-[8.5px] font-semibold text-slate-500 mt-0.5">
              Mandiri
            </span>
          </div>

          {/* BRI */}
          <div className="flex flex-col items-center justify-center rounded-xl border border-slate-200 bg-white py-2 px-1 shadow-2xs hover:border-[#00529C]/50 transition">
            <div className="h-5 flex items-center">
              <span className="font-black text-xs tracking-wider text-[#00529C]">
                BRI
              </span>
            </div>
            <span className="text-[8.5px] font-semibold text-slate-500 mt-0.5">
              Bank BRI
            </span>
          </div>

          {/* BNI */}
          <div className="flex flex-col items-center justify-center rounded-xl border border-slate-200 bg-white py-2 px-1 shadow-2xs hover:border-[#006666]/50 transition">
            <div className="h-5 flex items-center gap-0.5">
              <span className="font-black text-xs text-[#006666]">
                BNI
              </span>
              <span className="text-[9px] font-black text-[#F15A24]">46</span>
            </div>
            <span className="text-[8.5px] font-semibold text-slate-500 mt-0.5">
              Bank BNI
            </span>
          </div>

          {/* BSI */}
          <div className="flex flex-col items-center justify-center rounded-xl border border-slate-200 bg-white py-2 px-1 shadow-2xs hover:border-[#00A39D]/50 transition">
            <div className="h-5 flex items-center">
              <span className="font-black text-xs tracking-wide text-[#00A39D]">
                BSI
              </span>
            </div>
            <span className="text-[8.5px] font-semibold text-slate-500 mt-0.5">
              Syariah
            </span>
          </div>

          {/* GoPay */}
          <div className="flex flex-col items-center justify-center rounded-xl border border-slate-200 bg-white py-2 px-1 shadow-2xs hover:border-[#00AED6]/50 transition">
            <div className="h-5 flex items-center">
              <span className="font-black text-xs tracking-tight text-[#00AED6]">
                gopay
              </span>
            </div>
            <span className="text-[8.5px] font-semibold text-slate-500 mt-0.5">
              E-Wallet
            </span>
          </div>

          {/* DANA */}
          <div className="flex flex-col items-center justify-center rounded-xl border border-slate-200 bg-white py-2 px-1 shadow-2xs hover:border-[#118EEA]/50 transition">
            <div className="h-5 flex items-center">
              <span className="font-black text-xs tracking-wider text-[#118EEA]">
                DANA
              </span>
            </div>
            <span className="text-[8.5px] font-semibold text-slate-500 mt-0.5">
              E-Wallet
            </span>
          </div>

          {/* ShopeePay */}
          <div className="flex flex-col items-center justify-center rounded-xl border border-slate-200 bg-white py-2 px-1 shadow-2xs hover:border-[#EE4D2D]/50 transition">
            <div className="h-5 flex items-center">
              <span className="font-black text-[11px] tracking-tight text-[#EE4D2D]">
                ShopeePay
              </span>
            </div>
            <span className="text-[8.5px] font-semibold text-slate-500 mt-0.5">
              E-Wallet
            </span>
          </div>

          {/* OVO */}
          <div className="flex flex-col items-center justify-center rounded-xl border border-slate-200 bg-white py-2 px-1 shadow-2xs hover:border-[#4C2A86]/50 transition">
            <div className="h-5 flex items-center">
              <span className="font-black text-xs tracking-widest text-[#4C2A86]">
                OVO
              </span>
            </div>
            <span className="text-[8.5px] font-semibold text-slate-500 mt-0.5">
              E-Wallet
            </span>
          </div>

          {/* Cash / COD Pickup */}
          <div className="flex flex-col items-center justify-center rounded-xl border border-slate-200 bg-white py-2 px-1 shadow-2xs hover:border-amber-500/50 transition">
            <div className="h-5 flex items-center">
              <span className="font-black text-xs tracking-wide text-amber-700">
                TUNAI
              </span>
            </div>
            <span className="text-[8.5px] font-semibold text-slate-500 mt-0.5">
              Bayar di Toko
            </span>
          </div>
        </div>
      </div>

      {/* Trust Guarantee Points */}
      <div className="mt-3 pt-2.5 border-t border-border/60 flex flex-wrap items-center justify-between gap-2 text-[10.5px] font-semibold text-foreground/80">
        <div className="flex items-center gap-1.5">
          <CheckCircle2 size={13} className="text-emerald-600 shrink-0" />
          <span>QRIS langsung dikirim ke WhatsApp</span>
        </div>
        <div className="flex items-center gap-1.5">
          <CheckCircle2 size={13} className="text-emerald-600 shrink-0" />
          <span>Pesanan dibuat fresh setiap hari</span>
        </div>
      </div>
    </div>
  );
};
