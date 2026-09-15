import React, { useState, useEffect } from "react";
import { Star, ChevronLeft, ChevronRight, Quote, CheckCircle2, MessageCircle, Heart, Sparkles } from "lucide-react";

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  avatarText: string;
  avatarBg: string;
  rating: number;
  date: string;
  comment: string;
  favoriteItem: string;
  verified: boolean;
  category: "semua" | "roti" | "brownies" | "kue";
}

const TESTIMONIALS_DATA: Testimonial[] = [
  {
    id: "testi-1",
    name: "Hj. Nurul Anisa",
    role: "Koordinator Pengajian & Arisan",
    avatarText: "NA",
    avatarBg: "bg-emerald-700",
    rating: 5,
    date: "1 minggu lalu",
    comment:
      "Pesan buat snack box pengajian keluarga kemarin. Rotinya beneran empuk pas nyampe, sosisnya gurih dan isian srikayanya wangi manisnya pas. Tamu-tamu pada suka, praktis tinggal bagiin.",
    favoriteItem: "Roti Sosis & Roti Srikaya",
    verified: true,
    category: "roti",
  },
  {
    id: "testi-2",
    name: "Siti Rahmawati",
    role: "Ibu Rumah Tangga, Sukoharjo",
    avatarText: "SR",
    avatarBg: "bg-amber-600",
    rating: 5,
    date: "2 hari lalu",
    comment:
      "Roti coklatnya lumer pas digigit, yang keju juga gurihnya pas. Cocok banget buat bekal anak sekolah karena ukurannya pas dan harganya ramah di kantong.",
    favoriteItem: "Roti Coklat & Roti Keju",
    verified: true,
    category: "roti",
  },
  {
    id: "testi-3",
    name: "Dimas Prasetyo",
    role: "Pecinta Cokelat, Kartasura",
    avatarText: "DP",
    avatarBg: "bg-amber-800",
    rating: 5,
    date: "4 hari lalu",
    comment:
      "Brownies-nya mantap buat teman ngopi. Bagian atasnya garing, dalamnya legit dan cokelatnya pekat tapi nggak bikin seret atau kemanisan.",
    favoriteItem: "Dark Choco Brownies",
    verified: true,
    category: "brownies",
  },
  {
    id: "testi-4",
    name: "Budi Santoso",
    role: "Pegawai Swasta",
    avatarText: "BS",
    avatarBg: "bg-amber-700",
    rating: 5,
    date: "1 minggu lalu",
    comment:
      "Roti Sosis Halwa Bakery jadi menu sarapan favorit sebelum ngantor. Topping sosisnya lezat dipadu parutan keju melimpah, rotinya tebal dan mengenyangkan dengan harga cuma 5 ribu.",
    favoriteItem: "Roti Sosis",
    verified: true,
    category: "roti",
  },
  {
    id: "testi-5",
    name: "dr. Amanda Putri",
    role: "Langganan Halwa",
    avatarText: "AP",
    avatarBg: "bg-rose-700",
    rating: 5,
    date: "2 minggu lalu",
    comment:
      "Suka banget bentuk keong emas khas Roti Nanas Halwa Bakery. Isian selai nanasnya segar manis alami, higienis, halal, dan tekstur rotinya lembut tanpa pengawet berbahaya.",
    favoriteItem: "Roti Nanas Signature",
    verified: true,
    category: "roti",
  },
  {
    id: "testi-6",
    name: "Reza Firmansyah",
    role: "Pelanggan Setia",
    avatarText: "RF",
    avatarBg: "bg-blue-800",
    rating: 5,
    date: "3 minggu lalu",
    comment:
      "Kue kacang bentuk hatinya renyah gurih lumer di lidah, kemasannya juga rapi dan estetik. Cocok banget buat cemilan keluarga atau suguhan tamu bareng Dark Choco Brownies.",
    favoriteItem: "Kue Kacang & Dark Choco Brownies",
    verified: true,
    category: "kue",
  },
];

export const TestimonialsSection: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<"semua" | "roti" | "brownies" | "kue">("semua");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(true);

  const filteredTestimonials = TESTIMONIALS_DATA.filter((item) =>
    activeCategory === "semua" ? true : item.category === activeCategory
  );

  // Auto slide carousel every 6 seconds if autoplay is active
  useEffect(() => {
    if (!isAutoPlay || filteredTestimonials.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % filteredTestimonials.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [isAutoPlay, filteredTestimonials.length]);

  // Reset index if category changes
  useEffect(() => {
    setCurrentIndex(0);
  }, [activeCategory]);

  const handlePrev = () => {
    setIsAutoPlay(false);
    setCurrentIndex((prev) => (prev === 0 ? filteredTestimonials.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setIsAutoPlay(false);
    setCurrentIndex((prev) => (prev + 1) % filteredTestimonials.length);
  };

  const activeItem = filteredTestimonials[currentIndex] || filteredTestimonials[0];

  return (
    <section
      id="testimoni"
      className="scroll-mt-20 border-b border-border/70 bg-gradient-to-b from-[#F7F2E8] via-[#FAF6EF] to-[#F7F2E8] py-20 lg:py-24"
      aria-label="Ulasan dan Testimoni Pelanggan"
    >
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary-soft px-3.5 py-1.5 text-xs font-extrabold uppercase tracking-[0.16em] text-foreground">
            <Heart size={13} className="text-primary fill-primary" />
            <span>Kata Mereka yang Mencoba</span>
          </div>
          <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
            Cerita Kehangatan Pelanggan
          </h2>
          <p className="mt-3.5 text-base text-muted-foreground leading-relaxed">
            Kepuasan pelanggan adalah bumbu terpenting di setiap loyang panggangan kami. Simak pengalaman manis mereka bersama Halwa Bakery.
          </p>

          {/* Social Proof Badges */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-6 pt-2 text-xs font-semibold text-foreground/90">
            <div className="flex items-center gap-1.5 bg-card px-3.5 py-2 rounded-xl border border-border/80 shadow-soft">
              <div className="flex text-amber-500">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={14} className="fill-amber-400 text-amber-400" />
                ))}
              </div>
              <span className="font-bold text-foreground">4.9 / 5.0</span>
              <span className="text-muted-foreground text-[11px]">(320+ Ulasan Puas)</span>
            </div>

            <div className="flex items-center gap-2 bg-card px-3.5 py-2 rounded-xl border border-border/80 shadow-soft">
              <Sparkles size={14} className="text-primary" />
              <span>1.500+ Roti Terjual Tiap Bulan</span>
            </div>

            <div className="flex items-center gap-2 bg-card px-3.5 py-2 rounded-xl border border-border/80 shadow-soft">
              <CheckCircle2 size={14} className="text-emerald-600" />
              <span>100% Halal Resmi (ID64110055824640426)</span>
            </div>
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="mt-10 flex flex-wrap justify-center gap-2">
          {[
            { id: "semua", label: "Semua Ulasan" },
            { id: "roti", label: "Roti Lembut" },
            { id: "brownies", label: "Brownies Fudgy" },
            { id: "acara", label: "Snack Box & Acara" },
          ].map((tab) => {
            const isActive = activeCategory === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveCategory(tab.id as any)}
                className={`rounded-full px-4 py-1.5 text-xs font-bold transition-all cursor-pointer ${
                  isActive
                    ? "bg-primary text-primary-foreground shadow-gold"
                    : "bg-card text-muted-foreground border border-border hover:bg-muted/70 hover:text-foreground"
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Featured Interactive Carousel Card */}
        {activeItem && (
          <div
            className="mt-10 max-w-4xl mx-auto"
            onMouseEnter={() => setIsAutoPlay(false)}
            onMouseLeave={() => setIsAutoPlay(true)}
          >
            <div className="relative overflow-hidden rounded-3xl border border-border/80 bg-card p-7 sm:p-10 shadow-lift transition-all">
              {/* Decorative Large Watermark Quote */}
              <Quote
                size={90}
                className="absolute right-6 -bottom-4 text-primary/10 pointer-events-none"
              />

              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-border/60 pb-6">
                <div className="flex items-center gap-3.5">
                  <div
                    className={`flex h-13 w-13 shrink-0 items-center justify-center rounded-2xl text-white font-bold text-base shadow-sm ${activeItem.avatarBg}`}
                  >
                    {activeItem.avatarText}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-serif text-lg font-bold text-foreground">
                        {activeItem.name}
                      </h3>
                      {activeItem.verified && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 px-2 py-0.5 text-[10px] font-bold text-emerald-700">
                          <CheckCircle2 size={11} className="text-emerald-600" />
                          <span>Terverifikasi</span>
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">{activeItem.role}</p>
                  </div>
                </div>

                <div className="flex flex-col items-start sm:items-end gap-1">
                  <div className="flex items-center gap-1 text-amber-500">
                    {[...Array(activeItem.rating)].map((_, idx) => (
                      <Star key={idx} size={16} className="fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <span className="text-[11px] text-muted-foreground">{activeItem.date}</span>
                </div>
              </div>

              {/* Review Comment */}
              <div className="py-6">
                <p className="font-serif text-lg sm:text-xl leading-relaxed text-foreground/90 italic">
                  "{activeItem.comment}"
                </p>

                <div className="mt-5 inline-flex items-center gap-2 rounded-xl bg-primary-soft/80 px-3 py-1.5 text-xs text-primary-strong font-medium">
                  <span className="font-bold">Menu Favorit:</span>
                  <span>{activeItem.favoriteItem}</span>
                </div>
              </div>

              {/* Navigation Controls */}
              <div className="flex items-center justify-between border-t border-border/60 pt-5">
                <div className="flex items-center gap-1.5">
                  {filteredTestimonials.map((_, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        setIsAutoPlay(false);
                        setCurrentIndex(idx);
                      }}
                      className={`h-2 rounded-full transition-all cursor-pointer ${
                        idx === currentIndex ? "w-6 bg-primary" : "w-2 bg-border hover:bg-primary/50"
                      }`}
                      aria-label={`Lihat testimoni ke-${idx + 1}`}
                    />
                  ))}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handlePrev}
                    className="flex h-9 w-9 items-center justify-center rounded-xl border border-border bg-card text-foreground hover:bg-muted hover:border-primary/40 transition active:scale-95 cursor-pointer shadow-soft"
                    aria-label="Testimoni sebelumnya"
                  >
                    <ChevronLeft size={18} />
                  </button>
                  <button
                    type="button"
                    onClick={handleNext}
                    className="flex h-9 w-9 items-center justify-center rounded-xl border border-border bg-card text-foreground hover:bg-muted hover:border-primary/40 transition active:scale-95 cursor-pointer shadow-soft"
                    aria-label="Testimoni berikutnya"
                  >
                    <ChevronRight size={18} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 3-Column Quick Grid View for Instant Social Proof */}
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {TESTIMONIALS_DATA.slice(0, 3).map((item) => (
            <div
              key={item.id}
              className="flex flex-col justify-between rounded-2xl border border-border/70 bg-card p-6 shadow-soft transition hover:border-primary/40 hover:shadow-lift"
            >
              <div>
                <div className="flex items-center justify-between">
                  <div className="flex text-amber-500">
                    {[...Array(item.rating)].map((_, i) => (
                      <Star key={i} size={14} className="fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <span className="text-[11px] text-muted-foreground">{item.date}</span>
                </div>
                <p className="mt-3 text-sm leading-6 text-foreground/85 italic">
                  "{item.comment}"
                </p>
              </div>

              <div className="mt-5 flex items-center gap-3 border-t border-border/50 pt-4">
                <div
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-white text-xs font-bold ${item.avatarBg}`}
                >
                  {item.avatarText}
                </div>
                <div className="min-w-0 flex-1">
                  <h4 className="truncate text-xs font-bold text-foreground">{item.name}</h4>
                  <p className="truncate text-[11px] text-muted-foreground">{item.favoriteItem}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* WhatsApp Review Invitation CTA */}
        <div className="mt-12 text-center">
          <a
            href="https://wa.me/6285822767417?text=Halo%20Halwa%20Bakery,%20saya%20sudah%20mencoba%20rotinya%20dan%20ingin%20memberikan%20ulasan%20pesanan%20saya"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-card px-5 py-2.5 text-xs font-bold text-foreground shadow-soft transition hover:border-primary hover:bg-primary-soft/50 hover:text-primary-strong active:scale-95"
          >
            <MessageCircle size={15} className="text-[#25D366]" />
            <span>Pernah memesan? Kirim ulasan Anda via WhatsApp</span>
          </a>
        </div>
      </div>
    </section>
  );
};
