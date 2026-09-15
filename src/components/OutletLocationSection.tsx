import React, { useState } from "react";
import {
  MapPin,
  Clock,
  Navigation,
  ExternalLink,
  Copy,
  Check,
  Store,
  Phone,
  Sparkles,
} from "lucide-react";

export const OUTLET_ADDRESS =
  "PERUM PT HER II, Jl. Markisa Blok M.2 No.05, Sepinggan Baru, Balikpapan Selatan, Kota Balikpapan";
export const GOOGLE_MAPS_SHORT_URL = "https://maps.app.goo.gl/z3ae7pzT36oL9cue9";
export const GOOGLE_MAPS_EMBED_URL =
  "https://www.google.com/maps/embed?origin=mfe&pb=!1m3!2m1!1sHalwa+Bakery,+PERUM+PT+HER+II,+Jl.+Markisa+Jl.+Sepinggan+Baru+Blok+M.2+No.05,+Kota+Balikpapan!6i16";

export const OutletLocationSection: React.FC = () => {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopyAddress = async () => {
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(OUTLET_ADDRESS);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2500);
      }
    } catch {
      // Fallback
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2500);
    }
  };

  return (
    <section
      id="lokasi"
      className="scroll-mt-20 border-b border-border/70 bg-card/60 py-16 sm:py-20 lg:py-24"
    >
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <div className="mb-10 text-center sm:mb-12">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary-soft px-3.5 py-1.5 text-xs font-bold text-foreground shadow-2xs">
            <MapPin className="text-primary" size={14} />
            <span>Lokasi Outlet Resmi</span>
          </div>
          <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
            Kunjungi Outlet Halwa Bakery
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
            Nikmati aroma harum roti dan brownies segar yang baru keluar dari oven.
            Datang langsung ke toko kami atau pesan untuk diambil di tempat.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1.1fr_1.3fr] lg:items-stretch">
          {/* Outlet Details Card */}
          <div className="flex flex-col justify-between rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-soft">
            <div className="space-y-6">
              <div>
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-primary">
                  <Store size={15} />
                  <span>Toko &amp; Dapur Produksi</span>
                </div>
                <h3 className="font-display text-2xl font-bold text-foreground mt-1">
                  Halwa Bakery Balikpapan
                </h3>
              </div>

              {/* Alamat Lengkap */}
              <div className="rounded-2xl border border-border/80 bg-background/80 p-4 sm:p-5">
                <div className="flex items-start gap-3.5">
                  <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-primary-soft text-primary shadow-2xs">
                    <MapPin size={20} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      Alamat Outlet
                    </p>
                    <p className="mt-1 text-sm font-semibold leading-relaxed text-foreground">
                      {OUTLET_ADDRESS}
                    </p>
                    <div className="mt-3 flex flex-wrap items-center gap-2">
                      <button
                        type="button"
                        onClick={handleCopyAddress}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-1.5 text-xs font-bold text-foreground shadow-2xs transition hover:bg-muted active:scale-95 cursor-pointer"
                        title="Salin alamat lengkap"
                      >
                        {isCopied ? (
                          <>
                            <Check size={14} className="text-emerald-600" />
                            <span className="text-emerald-700">Alamat Tersalin!</span>
                          </>
                        ) : (
                          <>
                            <Copy size={13} className="text-muted-foreground" />
                            <span>Salin Alamat</span>
                          </>
                        )}
                      </button>

                      <span className="text-xs text-muted-foreground">
                        Sepinggan Baru, Balikpapan Selatan
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Info Operasional */}
              <div className="grid gap-3 sm:grid-cols-2 text-xs">
                <div className="flex items-start gap-3 rounded-xl border border-border/70 bg-background/60 p-3.5">
                  <div className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-primary-soft text-primary">
                    <Clock size={16} />
                  </div>
                  <div>
                    <span className="font-bold text-foreground block">Jam Operasional</span>
                    <span className="text-muted-foreground mt-0.5 block">
                      Setiap Hari: 08.00 - 20.00 WITA
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-3 rounded-xl border border-border/70 bg-background/60 p-3.5">
                  <div className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-emerald-100 text-emerald-700">
                    <Sparkles size={16} />
                  </div>
                  <div>
                    <span className="font-bold text-foreground block">Layanan Toko</span>
                    <span className="text-muted-foreground mt-0.5 block">
                      Ambil di Tempat &amp; Kurir Pribadi
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Action CTAs */}
            <div className="mt-6 pt-6 border-t border-border flex flex-col sm:flex-row gap-3">
              <a
                href={GOOGLE_MAPS_SHORT_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-primary px-5 text-sm font-bold text-primary-foreground shadow-gold transition hover:bg-primary-strong active:scale-98"
              >
                <Navigation size={16} />
                <span>Petunjuk Arah (Maps)</span>
                <ExternalLink size={14} className="opacity-80" />
              </a>

              <a
                href="https://wa.me/6285822767417?text=Halo%20Halwa%20Bakery,%20saya%20mau%20tanya%20arah%20lokasi%20outlet%20atau%20ambil%20pesanan%20di%20toko."
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-border bg-card px-5 text-sm font-bold text-foreground shadow-2xs transition hover:bg-muted active:scale-98"
              >
                <Phone size={15} className="text-primary" />
                <span>Hubungi Toko</span>
              </a>
            </div>
          </div>

          {/* Interactive Google Maps Embed Card */}
          <div className="flex flex-col overflow-hidden rounded-3xl border border-border bg-card shadow-soft">
            <div className="flex items-center justify-between border-b border-border/80 bg-muted/40 px-5 py-3.5">
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs font-bold text-foreground">
                  Google Maps Live Embed
                </span>
              </div>
              <a
                href={GOOGLE_MAPS_SHORT_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs font-bold text-primary hover:underline"
              >
                <span>Buka Layar Penuh</span>
                <ExternalLink size={12} />
              </a>
            </div>

            <div className="relative flex-1 min-h-[360px] sm:min-h-[420px] w-full bg-muted/20">
              <iframe
                title="Peta Lokasi Halwa Bakery Balikpapan"
                src={GOOGLE_MAPS_EMBED_URL}
                className="absolute inset-0 h-full w-full border-0"
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>

            <div className="bg-background/90 px-4 py-2.5 text-center text-xs text-muted-foreground border-t border-border/60">
              <span>📍 {OUTLET_ADDRESS}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
