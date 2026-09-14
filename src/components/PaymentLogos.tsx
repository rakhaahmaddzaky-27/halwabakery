import React from "react";
import { QrCode, Banknote } from "lucide-react";

interface PaymentLogosProps {
  className?: string;
  selectedMethod?: "QRIS" | "Tunai";
  onSelectMethod?: (method: "QRIS" | "Tunai") => void;
  selectable?: boolean;
}

export const PaymentLogos: React.FC<PaymentLogosProps> = ({
  className = "",
  selectedMethod = "QRIS",
  onSelectMethod,
  selectable = true,
}) => {
  return (
    <div id="payment-selection-section" className={`space-y-2.5 ${className}`}>
      <span className="block text-sm font-bold text-foreground">
        Metode Pembayaran
      </span>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        {/* Opsi 1: QRIS */}
        <label
          onClick={() => selectable && onSelectMethod?.("QRIS")}
          className={`flex items-center justify-between gap-3 rounded-2xl border p-3.5 transition cursor-pointer ${
            selectedMethod === "QRIS"
              ? "border-primary bg-primary-soft text-foreground font-bold shadow-xs"
              : "border-border bg-card text-foreground/80 hover:bg-muted"
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center rounded-xl bg-white border border-rose-200 px-2.5 py-1.5 shadow-2xs">
              <div className="flex items-center gap-1">
                <QrCode size={16} className="text-rose-600" />
                <span className="font-black text-xs tracking-wider text-rose-700 leading-none">
                  QRIS
                </span>
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-bold leading-tight">
                QRIS
              </span>
              <span className="text-[11px] font-semibold text-emerald-700">
                Bebas Biaya
              </span>
            </div>
          </div>
          <input
            type="radio"
            name="paymentMethod"
            value="QRIS"
            checked={selectedMethod === "QRIS"}
            onChange={() => onSelectMethod?.("QRIS")}
            className="h-4 w-4 accent-primary cursor-pointer"
          />
        </label>

        {/* Opsi 2: Tunai */}
        <label
          onClick={() => selectable && onSelectMethod?.("Tunai")}
          className={`flex items-center justify-between gap-3 rounded-2xl border p-3.5 transition cursor-pointer ${
            selectedMethod === "Tunai"
              ? "border-primary bg-primary-soft text-foreground font-bold shadow-xs"
              : "border-border bg-card text-foreground/80 hover:bg-muted"
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="grid h-8 w-8 place-items-center rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-2xs">
              <Banknote size={18} />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-bold leading-tight">
                Tunai (Cash)
              </span>
              <span className="text-[11px] font-semibold text-muted-foreground">
                Bayar di Tempat
              </span>
            </div>
          </div>
          <input
            type="radio"
            name="paymentMethod"
            value="Tunai"
            checked={selectedMethod === "Tunai"}
            onChange={() => onSelectMethod?.("Tunai")}
            className="h-4 w-4 accent-primary cursor-pointer"
          />
        </label>
      </div>
    </div>
  );
};
