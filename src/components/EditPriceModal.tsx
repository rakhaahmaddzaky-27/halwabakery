import React, { useState, useEffect, useRef } from "react";
import {
  X,
  Tag,
  Check,
  RotateCcw,
  AlertCircle,
  Sparkles,
  ArrowRight,
  TrendingUp,
} from "lucide-react";
import type { Product } from "@/src/routes/index.tsx";
import { defaultProductImages } from "@/src/assets/productImages.ts";
import { productFallbackImage } from "@/src/assets/fallbacks.ts";

interface EditPriceModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
  defaultPrice: number;
  currentPrice: number;
  onSavePrice: (productId: number, newPrice: number) => void;
  onResetPrice: (productId: number) => void;
  isCustomized: boolean;
}

export function EditPriceModal({
  isOpen,
  onClose,
  product,
  defaultPrice,
  currentPrice,
  onSavePrice,
  onResetPrice,
  isCustomized,
}: EditPriceModalProps) {
  const [priceInput, setPriceInput] = useState<string>("");
  const [error, setError] = useState<string>("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen && product) {
      setPriceInput(String(currentPrice));
      setError("");
      setTimeout(() => {
        inputRef.current?.focus();
        inputRef.current?.select();
      }, 100);
    }
  }, [isOpen, product, currentPrice]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !product) return null;

  const numPrice = Math.max(0, parseInt(priceInput.replace(/\D/g, ""), 10) || 0);

  const formatRupiah = (val: number) =>
    `Rp ${new Intl.NumberFormat("id-ID").format(val)}`;

  const handleAdjust = (delta: number) => {
    const next = Math.max(500, numPrice + delta);
    setPriceInput(String(next));
    setError("");
  };

  const handlePreset = (val: number) => {
    setPriceInput(String(val));
    setError("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (numPrice <= 0) {
      setError("Harga jual harus lebih besar dari Rp 0");
      return;
    }
    onSavePrice(product.id, numPrice);
    onClose();
  };

  const priceDiff = numPrice - defaultPrice;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-label="Modal Ubah Harga Produk"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative z-10 w-full max-w-lg rounded-3xl border border-border bg-card shadow-lift overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border bg-gradient-to-r from-[#EDE1CD]/60 via-[#F5ECE0]/60 to-card px-5 py-4 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-primary-soft text-primary shadow-xs">
              <Tag size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-display text-base sm:text-lg font-bold text-foreground">
                  Ubah Harga Produk
                </h3>
                <span className="rounded-full bg-primary/15 px-2 py-0.5 text-[9px] font-extrabold uppercase text-primary tracking-wider">
                  Mode Pengelola
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                Perubahan langsung berlaku di katalog &amp; nota pesanan WhatsApp
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="grid h-8 w-8 place-items-center rounded-xl text-muted-foreground hover:bg-muted hover:text-foreground transition cursor-pointer"
            aria-label="Tutup"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-5">
          {/* Product Summary Card */}
          <div className="flex items-center gap-3.5 rounded-2xl border border-border bg-muted/30 p-3.5">
            <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl border border-border bg-muted">
              <img
                src={product.image}
                alt={product.name}
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src =
                    defaultProductImages[product.id] ||
                    productFallbackImage(product.name, product.category);
                }}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-primary">
                  {product.category}
                </span>
                {isCustomized && (
                  <span className="rounded-full bg-amber-500/15 px-2 py-0.5 text-[9px] font-bold text-amber-700">
                    Harga Telah Disesuaikan
                  </span>
                )}
              </div>
              <h4 className="font-display text-base font-bold text-foreground truncate">
                {product.name}
              </h4>
              <div className="flex items-center gap-2 mt-0.5 text-xs text-muted-foreground">
                <span>Harga Standar:</span>
                <span className="font-semibold text-foreground">
                  {formatRupiah(defaultPrice)}
                </span>
              </div>
            </div>
          </div>

          {/* Price Input Section */}
          <div>
            <label
              htmlFor="edit-price-input"
              className="mb-1.5 flex items-center justify-between text-xs font-bold text-foreground"
            >
              <span>Harga Jual Baru (Rupiah)</span>
              <span className="text-sm font-extrabold text-primary">
                {formatRupiah(numPrice)}
              </span>
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-bold text-muted-foreground">
                Rp
              </span>
              <input
                id="edit-price-input"
                ref={inputRef}
                type="number"
                step={500}
                min={500}
                value={priceInput}
                onChange={(e) => {
                  setPriceInput(e.target.value);
                  setError("");
                }}
                className="h-12 w-full rounded-2xl border border-border bg-background pl-12 pr-4 text-base font-bold text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                placeholder="Contoh: 6500"
              />
            </div>
            {error && (
              <p className="mt-1.5 flex items-center gap-1 text-xs font-semibold text-destructive">
                <AlertCircle size={13} />
                <span>{error}</span>
              </p>
            )}
          </div>

          {/* Quick Increment/Decrement Buttons */}
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground block mb-2">
              Penyesuaian Cepat:
            </span>
            <div className="grid grid-cols-5 gap-1.5">
              {[
                { label: "-1.000", delta: -1000 },
                { label: "-500", delta: -500 },
                { label: "+500", delta: 500 },
                { label: "+1.000", delta: 1000 },
                { label: "+2.000", delta: 2000 },
              ].map((item) => (
                <button
                  key={item.label}
                  type="button"
                  onClick={() => handleAdjust(item.delta)}
                  className="rounded-xl border border-border bg-background py-2 text-xs font-bold text-foreground hover:border-primary hover:bg-primary-soft transition cursor-pointer active:scale-95"
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Price Difference Indicator */}
          {priceDiff !== 0 && (
            <div className="flex items-center justify-between rounded-xl bg-primary-soft/40 border border-primary/20 px-3.5 py-2.5 text-xs">
              <div className="flex items-center gap-1.5 text-primary-strong font-semibold">
                <TrendingUp size={14} />
                <span>
                  Selisih dari harga standar ({formatRupiah(defaultPrice)}):
                </span>
              </div>
              <span
                className={`font-extrabold ${
                  priceDiff > 0 ? "text-emerald-700" : "text-amber-700"
                }`}
              >
                {priceDiff > 0 ? `+${formatRupiah(priceDiff)}` : formatRupiah(priceDiff)}
              </span>
            </div>
          )}

          {/* Action Footer */}
          <div className="pt-2 flex items-center justify-between gap-3 border-t border-border">
            {isCustomized ? (
              <button
                type="button"
                onClick={() => {
                  onResetPrice(product.id);
                  onClose();
                }}
                className="flex items-center gap-1.5 rounded-xl border border-border px-3 py-2 text-xs font-bold text-muted-foreground hover:bg-muted hover:text-foreground transition cursor-pointer"
                title="Kembalikan harga ke nilai default"
              >
                <RotateCcw size={13} />
                <span>Reset ke Standar</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={onClose}
                className="rounded-xl border border-border px-3 py-2 text-xs font-bold text-muted-foreground hover:bg-muted hover:text-foreground transition cursor-pointer"
              >
                Batal
              </button>
            )}

            <button
              type="submit"
              disabled={numPrice <= 0}
              className="flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-xs font-bold text-primary-foreground shadow-gold hover:bg-primary-strong transition active:scale-95 cursor-pointer disabled:opacity-50"
            >
              <Check size={15} />
              <span>Simpan Harga ({formatRupiah(numPrice)})</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
