import React, { useState, useRef, useEffect } from "react";
import {
  X,
  Plus,
  Camera,
  Upload,
  Sparkles,
  Trash2,
  AlertCircle,
  ShieldCheck,
  ShoppingBag,
  Check,
  Flame,
  Layers,
  FileText,
  DollarSign,
  Tag,
  Link as LinkIcon,
  RefreshCw,
} from "lucide-react";
import type { Product, Category } from "@/src/routes/index.tsx";
import { productFallbackImage } from "@/src/assets/fallbacks.ts";
import { uploadProductImageToFirebase } from "@/src/services/firebaseStorage.ts";

interface AddProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddProduct: (newProduct: Product, initialStock: number) => void;
  compressImageFile: (file: File, maxDim?: number, quality?: number) => Promise<string>;
  existingProductsCount: number;
}

export function AddProductModal({
  isOpen,
  onClose,
  onAddProduct,
  compressImageFile,
  existingProductsCount,
}: AddProductModalProps) {
  const [name, setName] = useState("");
  const [category, setCategory] = useState<Exclude<Category, "Semua">>("Roti");
  const [priceInput, setPriceInput] = useState<string>("6000");
  const [stockInput, setStockInput] = useState<string>("15");
  const [description, setDescription] = useState("");
  const [photoDataUrl, setPhotoDataUrl] = useState<string>("");
  const [useUrlMode, setUseUrlMode] = useState(false);
  const [urlInput, setUrlInput] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<string>("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const fileInputRef = useRef<HTMLInputElement>(null);
  const nameInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      // Focus the name input when modal opens
      setTimeout(() => {
        nameInputRef.current?.focus();
      }, 100);
      setErrors({});
      setIsSubmitting(false);
      setUploadStatus("");
    }
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen && !isSubmitting) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, isSubmitting, onClose]);

  if (!isOpen) return null;

  const numPrice = Math.max(0, parseInt(priceInput.replace(/\D/g, ""), 10) || 0);
  const numStock = Math.max(0, parseInt(stockInput.replace(/\D/g, ""), 10) || 0);

  const formatRupiah = (val: number) =>
    `Rp ${new Intl.NumberFormat("id-ID").format(val)}`;

  const currentPreviewPhoto =
    photoDataUrl || (useUrlMode && urlInput.trim() ? urlInput.trim() : "") || productFallbackImage(name, category);

  const handleFileProcess = async (file: File) => {
    if (!file || !file.type.startsWith("image/")) {
      setErrors((prev) => ({ ...prev, photo: "File yang dipilih harus berupa gambar (JPG, PNG, WebP)" }));
      return;
    }
    try {
      setUploadStatus("Mengoptimalkan foto...");
      const compressed = await compressImageFile(file, 900, 0.85);
      if (compressed) {
        setPhotoDataUrl(compressed);
        setErrors((prev) => {
          const next = { ...prev };
          delete next.photo;
          return next;
        });
      }
    } catch {
      setErrors((prev) => ({ ...prev, photo: "Gagal memproses gambar. Silakan coba lagi." }));
    } finally {
      setUploadStatus("");
    }
  };

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!name.trim()) {
      errs.name = "Nama produk/varian wajib diisi";
    } else if (name.trim().length < 2) {
      errs.name = "Nama produk minimal 2 karakter";
    }

    if (!numPrice || numPrice <= 0) {
      errs.price = "Harga harus lebih besar dari Rp 0";
    }

    if (!description.trim()) {
      errs.description = "Deskripsi produk wajib diisi";
    } else if (description.trim().length < 5) {
      errs.description = "Deskripsi produk minimal 5 karakter";
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    setUploadStatus("Menyimpan varian baru...");

    try {
      const newId = Date.now() + Math.floor(Math.random() * 1000);
      let finalImageUrl = photoDataUrl || (useUrlMode ? urlInput.trim() : "") || currentPreviewPhoto;

      // Try uploading to Firebase Storage if we have a base64 image
      if (photoDataUrl && photoDataUrl.startsWith("data:image/")) {
        try {
          setUploadStatus("Mengunggah foto ke Firebase Storage...");
          const res = await uploadProductImageToFirebase(newId, photoDataUrl);
          if (res?.url) {
            finalImageUrl = res.url;
          }
        } catch {
          // Fallback safely to base64 image
          finalImageUrl = photoDataUrl;
        }
      }

      const newProduct: Product = {
        id: newId,
        name: name.trim(),
        price: numPrice,
        category,
        description: description.trim(),
        image: finalImageUrl,
        fallback: productFallbackImage(name.trim(), category),
        stock: numStock,
      };

      onAddProduct(newProduct, numStock);

      // Reset form
      setName("");
      setDescription("");
      setPriceInput("6000");
      setStockInput("15");
      setPhotoDataUrl("");
      setUrlInput("");
      setErrors({});
      onClose();
    } catch {
      setErrors({ form: "Terjadi kesalahan saat menyimpan varian baru." });
    } finally {
      setIsSubmitting(false);
      setUploadStatus("");
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-label="Modal Tambah Varian Baru"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={() => {
          if (!isSubmitting) onClose();
        }}
      />

      {/* Modal Card */}
      <div className="relative z-10 my-auto flex h-full max-h-[92vh] w-full max-w-4xl flex-col rounded-3xl border border-border bg-card shadow-lift overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-border bg-gradient-to-r from-[#EDE1CD]/60 via-[#F5ECE0]/60 to-card px-5 py-4 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-primary-soft text-primary shadow-xs">
              <Sparkles size={22} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-display text-lg sm:text-xl font-bold text-foreground">
                  Tambah Varian Baru
                </h2>
                <span className="rounded-full bg-primary/15 px-2.5 py-0.5 text-[10px] font-extrabold uppercase text-primary tracking-wider">
                  Mode Pengelola
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                Tambahkan varian roti atau kue baru beserta foto, nama, deskripsi, dan harga.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="grid h-9 w-9 place-items-center rounded-xl text-muted-foreground hover:bg-muted hover:text-foreground transition cursor-pointer disabled:opacity-50"
            aria-label="Tutup form"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          {errors.form && (
            <div className="mb-4 flex items-center gap-2 rounded-2xl bg-destructive/15 border border-destructive/30 p-3.5 text-xs font-semibold text-destructive">
              <AlertCircle size={16} className="shrink-0" />
              <span>{errors.form}</span>
            </div>
          )}

          <form id="add-product-form" onSubmit={handleSubmit} className="grid gap-6 lg:grid-cols-12">
            {/* Left Column: Input Form (7 cols) */}
            <div className="space-y-4 lg:col-span-7">
              {/* 1. Nama Produk */}
              <div>
                <label
                  htmlFor="new-product-name"
                  className="mb-1.5 flex items-center justify-between text-xs font-bold text-foreground"
                >
                  <span className="flex items-center gap-1.5">
                    <Tag size={13} className="text-primary" />
                    <span>Nama Produk / Varian</span>
                    <span className="text-destructive">*</span>
                  </span>
                  <span className="text-[11px] text-muted-foreground font-normal">
                    Contoh: Roti Abon Spesial
                  </span>
                </label>
                <input
                  id="new-product-name"
                  ref={nameInputRef}
                  type="text"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (errors.name) {
                      setErrors((prev) => {
                        const next = { ...prev };
                        delete next.name;
                        return next;
                      });
                    }
                  }}
                  placeholder="Ketik nama varian baru..."
                  className={`h-11 w-full rounded-xl border bg-background px-3.5 text-sm font-medium text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 ${
                    errors.name ? "border-destructive ring-1 ring-destructive" : "border-border"
                  }`}
                />
                {errors.name && (
                  <p className="mt-1 flex items-center gap-1 text-[11px] font-semibold text-destructive">
                    <AlertCircle size={12} />
                    <span>{errors.name}</span>
                  </p>
                )}
              </div>

              {/* 2. Kategori & Harga Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {/* Kategori */}
                <div>
                  <label className="mb-1.5 flex items-center gap-1.5 text-xs font-bold text-foreground">
                    <Layers size={13} className="text-primary" />
                    <span>Kategori Menu</span>
                    <span className="text-destructive">*</span>
                  </label>
                  <div className="grid grid-cols-3 gap-1.5 rounded-xl border border-border bg-muted/30 p-1">
                    {(["Roti", "Brownies", "Kue"] as Array<Exclude<Category, "Semua">>).map((cat) => (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => setCategory(cat)}
                        className={`rounded-lg py-2 text-xs font-bold transition cursor-pointer ${
                          category === cat
                            ? "bg-card text-primary shadow-xs border border-border"
                            : "text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Harga */}
                <div>
                  <label
                    htmlFor="new-product-price"
                    className="mb-1.5 flex items-center justify-between text-xs font-bold text-foreground"
                  >
                    <span className="flex items-center gap-1.5">
                      <DollarSign size={13} className="text-primary" />
                      <span>Harga (Rp)</span>
                      <span className="text-destructive">*</span>
                    </span>
                    <span className="text-[11px] font-bold text-primary">
                      {formatRupiah(numPrice)}
                    </span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-muted-foreground">
                      Rp
                    </span>
                    <input
                      id="new-product-price"
                      type="number"
                      step={500}
                      min={1000}
                      value={priceInput}
                      onChange={(e) => {
                        setPriceInput(e.target.value);
                        if (errors.price) {
                          setErrors((prev) => {
                            const next = { ...prev };
                            delete next.price;
                            return next;
                          });
                        }
                      }}
                      placeholder="6000"
                      className={`h-11 w-full rounded-xl border bg-background pl-10 pr-3 text-sm font-bold text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 ${
                        errors.price ? "border-destructive ring-1 ring-destructive" : "border-border"
                      }`}
                    />
                  </div>
                  {errors.price && (
                    <p className="mt-1 flex items-center gap-1 text-[11px] font-semibold text-destructive">
                      <AlertCircle size={12} />
                      <span>{errors.price}</span>
                    </p>
                  )}
                </div>
              </div>

              {/* 3. Stok Awal */}
              <div>
                <label
                  htmlFor="new-product-stock"
                  className="mb-1.5 flex items-center justify-between text-xs font-bold text-foreground"
                >
                  <span className="flex items-center gap-1.5">
                    <Flame size={13} className="text-primary" />
                    <span>Stok Panggangan Awal (pcs)</span>
                  </span>
                  <span className="text-[11px] text-muted-foreground">
                    Dapat diubah kapan saja di Admin Stok
                  </span>
                </label>
                <div className="flex items-center gap-2">
                  <input
                    id="new-product-stock"
                    type="number"
                    min={0}
                    value={stockInput}
                    onChange={(e) => setStockInput(e.target.value)}
                    placeholder="15"
                    className="h-10 w-24 rounded-xl border border-border bg-background px-3 text-sm font-bold text-center text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                  />
                  <div className="flex items-center gap-1.5">
                    {[10, 15, 20, 30].map((preset) => (
                      <button
                        key={preset}
                        type="button"
                        onClick={() => setStockInput(String(preset))}
                        className={`rounded-lg border px-2.5 py-1.5 text-[11px] font-bold transition cursor-pointer ${
                          numStock === preset
                            ? "border-primary bg-primary-soft text-primary-strong"
                            : "border-border bg-card text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        {preset} pcs
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* 4. Deskripsi Produk */}
              <div>
                <label
                  htmlFor="new-product-desc"
                  className="mb-1.5 flex items-center justify-between text-xs font-bold text-foreground"
                >
                  <span className="flex items-center gap-1.5">
                    <FileText size={13} className="text-primary" />
                    <span>Deskripsi &amp; Rasa Produk</span>
                    <span className="text-destructive">*</span>
                  </span>
                  <span className="text-[11px] text-muted-foreground font-normal">
                    {description.length}/180 karakter
                  </span>
                </label>
                <textarea
                  id="new-product-desc"
                  rows={3}
                  maxLength={250}
                  value={description}
                  onChange={(e) => {
                    setDescription(e.target.value);
                    if (errors.description) {
                      setErrors((prev) => {
                        const next = { ...prev };
                        delete next.description;
                        return next;
                      });
                    }
                  }}
                  placeholder="Jelaskan tekstur, isian, aroma harum panggangan, dan kelezatan varian ini..."
                  className={`w-full rounded-xl border bg-background p-3 text-xs leading-relaxed text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 ${
                    errors.description ? "border-destructive ring-1 ring-destructive" : "border-border"
                  }`}
                />
                {errors.description ? (
                  <p className="mt-1 flex items-center gap-1 text-[11px] font-semibold text-destructive">
                    <AlertCircle size={12} />
                    <span>{errors.description}</span>
                  </p>
                ) : (
                  <p className="mt-1 text-[11px] text-muted-foreground">
                    Deskripsi yang menggugah selera membantu pelanggan memesan lebih banyak.
                  </p>
                )}
              </div>

              {/* 5. Foto Produk */}
              <div>
                <div className="mb-1.5 flex items-center justify-between">
                  <label className="flex items-center gap-1.5 text-xs font-bold text-foreground">
                    <Camera size={13} className="text-primary" />
                    <span>Foto Varian Produk</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => setUseUrlMode(!useUrlMode)}
                    className="text-[11px] font-bold text-primary hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <LinkIcon size={11} />
                    <span>{useUrlMode ? "Upload File Gambar" : "Gunakan URL Gambar"}</span>
                  </button>
                </div>

                {useUrlMode ? (
                  <div className="space-y-2">
                    <input
                      type="url"
                      value={urlInput}
                      onChange={(e) => setUrlInput(e.target.value)}
                      placeholder="https://... URL gambar roti"
                      className="h-11 w-full rounded-xl border border-border bg-background px-3.5 text-xs text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                    />
                    <p className="text-[11px] text-muted-foreground">
                      Masukkan URL gambar langsung yang dapat diakses publik.
                    </p>
                  </div>
                ) : (
                  <div>
                    {/* Hidden file input */}
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleFileProcess(file);
                      }}
                    />

                    {/* Drag and Drop Box */}
                    <div
                      onDragOver={(e) => {
                        e.preventDefault();
                        setIsDragging(true);
                      }}
                      onDragLeave={() => setIsDragging(false)}
                      onDrop={(e) => {
                        e.preventDefault();
                        setIsDragging(false);
                        const file = e.dataTransfer.files?.[0];
                        if (file) handleFileProcess(file);
                      }}
                      onClick={() => fileInputRef.current?.click()}
                      className={`relative flex flex-col items-center justify-center rounded-2xl border-2 border-dashed p-4 text-center transition cursor-pointer ${
                        isDragging
                          ? "border-primary bg-primary-soft/40 scale-[1.01]"
                          : photoDataUrl
                          ? "border-emerald-500/50 bg-emerald-500/5"
                          : "border-border/80 bg-muted/20 hover:border-primary/50 hover:bg-muted/30"
                      }`}
                    >
                      {photoDataUrl ? (
                        <div className="flex items-center gap-3 w-full">
                          <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl border border-border bg-muted">
                            <img
                              src={photoDataUrl}
                              alt="Pratinjau foto produk"
                              className="h-full w-full object-cover"
                            />
                          </div>
                          <div className="flex-1 text-left">
                            <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-700">
                              <Check size={14} />
                              <span>Foto Siap Disimpan</span>
                            </div>
                            <p className="text-[11px] text-muted-foreground mt-0.5">
                              Foto telah terkompresi dan siap dipublikasikan.
                            </p>
                            <div className="mt-1.5 flex items-center gap-2">
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  fileInputRef.current?.click();
                                }}
                                className="text-[11px] font-bold text-primary hover:underline"
                              >
                                Ganti Foto
                              </button>
                              <span className="text-muted-foreground">•</span>
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setPhotoDataUrl("");
                                }}
                                className="text-[11px] font-bold text-destructive hover:underline"
                              >
                                Hapus
                              </button>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <>
                          <div className="mb-2 grid h-10 w-10 place-items-center rounded-xl bg-primary-soft text-primary shadow-2xs">
                            <Upload size={18} />
                          </div>
                          <p className="text-xs font-bold text-foreground">
                            Klik untuk unggah foto atau tarik file ke sini
                          </p>
                          <p className="mt-1 text-[11px] text-muted-foreground">
                            Mendukung file JPG, PNG, WebP (otomatis dioptimalkan)
                          </p>
                        </>
                      )}
                    </div>

                    {uploadStatus && (
                      <div className="mt-2 flex items-center gap-2 text-xs font-semibold text-primary">
                        <RefreshCw size={13} className="animate-spin" />
                        <span>{uploadStatus}</span>
                      </div>
                    )}

                    {errors.photo && (
                      <p className="mt-1.5 flex items-center gap-1 text-[11px] font-semibold text-destructive">
                        <AlertCircle size={12} />
                        <span>{errors.photo}</span>
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Right Column: Live Customer Preview Card (5 cols) */}
            <div className="lg:col-span-5">
              <div className="sticky top-2 rounded-2xl border border-border bg-muted/30 p-4 sm:p-5">
                <div className="mb-3 flex items-center justify-between">
                  <span className="text-xs font-extrabold uppercase tracking-wider text-muted-foreground">
                    Tinjauan Kartu Pelanggan
                  </span>
                  <span className="rounded-full bg-primary-soft px-2 py-0.5 text-[10px] font-bold text-primary-strong">
                    Live Preview
                  </span>
                </div>

                {/* Simulated Product Card */}
                <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-soft">
                  <div className="relative aspect-square overflow-hidden bg-muted">
                    <img
                      src={currentPreviewPhoto}
                      alt={name || "Pratinjau Varian"}
                      className="h-full w-full object-cover"
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = productFallbackImage(name, category);
                      }}
                    />
                    <div className="absolute left-3 top-3 z-10 inline-flex items-center gap-1.5 rounded-full border border-border/50 bg-card/95 px-2.5 py-1 text-[10px] font-extrabold text-foreground shadow-xs backdrop-blur-xs">
                      <ShieldCheck className="text-primary" size={13} />
                      100% HALAL
                    </div>

                    {/* Varian Baru Badge */}
                    <div className="absolute bottom-3 left-3 z-10 inline-flex items-center gap-1 rounded-full bg-primary px-2.5 py-1 text-[10px] font-extrabold text-primary-foreground shadow-soft">
                      <Sparkles size={11} />
                      <span>Varian Baru</span>
                    </div>
                  </div>

                  <div className="p-4 sm:p-5">
                    <div className="mb-2 flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-[10px] font-extrabold uppercase tracking-widest text-primary">
                            {category}
                          </span>
                          <span className="rounded-full bg-emerald-500/15 px-2 py-0.5 text-[9px] font-bold text-emerald-700">
                            Sisa: {numStock} pcs
                          </span>
                        </div>
                        <h4 className="mt-1 font-display text-lg font-bold text-foreground line-clamp-1">
                          {name.trim() || "Nama Varian Baru"}
                        </h4>
                      </div>
                      <span className="shrink-0 rounded-lg bg-primary-soft px-2.5 py-1 text-xs font-extrabold text-primary-strong">
                        {formatRupiah(numPrice)}
                      </span>
                    </div>

                    <p className="min-h-10 text-xs leading-relaxed text-muted-foreground line-clamp-2">
                      {description.trim() ||
                        "Deskripsi lezat varian baru akan tampil di sini saat dibaca pelanggan..."}
                    </p>

                    <div className="mt-4 pt-3 border-t border-border/60">
                      <div className="flex h-10 w-full items-center justify-center gap-2 rounded-xl bg-primary text-xs font-bold text-primary-foreground shadow-gold opacity-90">
                        <ShoppingBag size={14} />
                        <span>Tambah ke Keranjang</span>
                      </div>
                    </div>
                  </div>
                </div>

                <p className="mt-3 text-center text-[11px] text-muted-foreground leading-relaxed">
                  Varian ini akan langsung muncul di halaman menu dan dapat segera dimasukkan ke keranjang oleh pembeli.
                </p>
              </div>
            </div>
          </form>
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between border-t border-border bg-gradient-to-r from-card via-[#F5ECE0]/40 to-card p-4 sm:p-5">
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="rounded-xl border border-border bg-card px-4 py-2.5 text-xs font-bold text-muted-foreground hover:bg-muted hover:text-foreground transition cursor-pointer disabled:opacity-50"
          >
            Batal
          </button>

          <div className="flex items-center gap-2.5">
            <button
              type="submit"
              form="add-product-form"
              disabled={isSubmitting || !name.trim() || !numPrice || !description.trim()}
              className="flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-xs font-bold text-primary-foreground shadow-gold hover:bg-primary-strong transition active:scale-98 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <RefreshCw size={14} className="animate-spin" />
                  <span>{uploadStatus || "Menyimpan..."}</span>
                </>
              ) : (
                <>
                  <Plus size={15} />
                  <span>Simpan &amp; Publikasikan Varian</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
