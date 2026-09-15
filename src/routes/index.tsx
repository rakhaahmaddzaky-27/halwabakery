import { useEffect, useMemo, useRef, useState, type ButtonHTMLAttributes, type FormEvent } from "react";
import {
  AlertCircle,
  Award,
  Boxes,
  Camera,
  Check,
  CheckCircle,
  CheckCircle2,
  ChevronRight,
  Cloud,
  CloudUpload,
  Copy,
  DollarSign,
  Edit3,
  ExternalLink,
  FileSpreadsheet,
  Flame,
  Heart,
  Image as ImageIcon,
  Instagram,
  Link as LinkIcon,
  Lock,
  LogOut,
  MapPin,
  Menu,
  Minus,
  Plus,
  RefreshCw,
  RotateCcw,
  Save,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Store,
  Tag,
  Trash2,
  Upload,
  X,
} from "lucide-react";
import { AddProductModal } from "@/src/components/AddProductModal.tsx";
import { EditPriceModal } from "@/src/components/EditPriceModal.tsx";
import { halwaMark, heroFallback, productFallbackImage } from "@/src/assets/fallbacks.ts";
import { defaultProductImages, officialProductImages } from "@/src/assets/productImages.ts";
import { REAL_HERO_IMAGE, REAL_PRODUCT_IMAGES } from "@/src/assets/realPhotos.ts";
import { WhatsAppIcon } from "@/src/components/WhatsAppIcon.tsx";
import { FloatingWhatsApp } from "@/src/components/FloatingWhatsApp.tsx";
import { PWAInstallButton } from "@/src/components/PWAInstallButton.tsx";
import { OfflineIndicator } from "@/src/components/OfflineIndicator.tsx";
import { TestimonialsSection } from "@/src/components/TestimonialsSection.tsx";
import { PaymentLogos } from "@/src/components/PaymentLogos.tsx";
import { OpeningSplashScreen } from "@/src/components/OpeningSplashScreen.tsx";
import {
  OutletLocationSection,
  OUTLET_ADDRESS,
  GOOGLE_MAPS_SHORT_URL,
} from "@/src/components/OutletLocationSection.tsx";
import {
  HalalCertificateBadge,
  HalalLogoSvg,
  HALAL_CERTIFICATE_NUMBER,
  HalalModal,
} from "@/src/components/HalalCertificateBadge.tsx";
import {
  initAuth,
  googleSignIn,
  googleSignOut,
  createHalwaSpreadsheet,
  updateStockInGoogleSheets,
  fetchStockFromGoogleSheets,
  isRunningInIframe,
} from "@/src/services/googleSheets.ts";
import {
  uploadProductImageToFirebase,
  uploadHeroImageToFirebase,
  isFirebaseImageUrl,
  storageBucket,
} from "@/src/services/firebaseStorage.ts";
import type { User } from "firebase/auth";

export type Category = "Semua" | "Roti" | "Brownies" | "Kue";

export type Product = {
  id: number;
  name: string;
  price: number;
  category: Exclude<Category, "Semua">;
  description: string;
  image: string;
  fallback?: string;
  stock: number;
};

export const defaultProducts: Product[] = [
  {
    id: 1,
    name: "Roti Sosis",
    price: 6000,
    category: "Roti",
    description: "Roti lembut topping sosis sapi bertabur oregano dengan perpaduan saos bolognese dan mayones",
    image: officialProductImages[1],
    fallback: defaultProductImages[1],
    stock: 15,
  },
  {
    id: 2,
    name: "Roti Keju",
    price: 6000,
    category: "Roti",
    description: "Roti tekstur kepang cantik dengan isian keju gurih melimpah.",
    image: officialProductImages[2],
    fallback: defaultProductImages[2],
    stock: 12,
  },
  {
    id: 3,
    name: "Roti Coklat",
    price: 6000,
    category: "Roti",
    description: "Roti lembut klasik dengan isian cokelat lumer manis pas.",
    image: officialProductImages[3],
    fallback: defaultProductImages[3],
    stock: 10,
  },
  {
    id: 4,
    name: "Roti Nanas",
    price: 6000,
    category: "Roti",
    description: "Roti signature bentuk keong emas dengan isian selai nanas segar.",
    image: officialProductImages[4],
    fallback: defaultProductImages[4],
    stock: 8,
  },
  {
    id: 5,
    name: "Roti Srikaya",
    price: 6000,
    category: "Roti",
    description: "Roti lembut isi selai srikaya harum dan rasanya otentik.",
    image: officialProductImages[5],
    fallback: defaultProductImages[5],
    stock: 4,
  },
  {
    id: 6,
    name: "Dark Choco Brownies",
    price: 5000,
    category: "Brownies",
    description: "Brownies cokelat pekat dengan taburan almond slice & chocochips renyah.",
    image: officialProductImages[6],
    fallback: defaultProductImages[6],
    stock: 15,
  },
  {
    id: 7,
    name: "Kue Kacang",
    price: 2000,
    category: "Kue",
    description: "Kue kacang renyah berbentuk hati dengan kemasan estetik.",
    image: officialProductImages[7],
    fallback: defaultProductImages[7],
    stock: 20,
  },
];

export const products: Product[] = defaultProducts;

export const trustBadges = [
  {
    icon: ShieldCheck,
    title: "100% Halal Resmi",
    subtitle: "BPJPH Kemenag",
    isHalal: true,
  },
  { icon: Flame, title: "Freshly Baked", subtitle: "Setiap hari" },
  { icon: Award, title: "Bahan Premium", subtitle: "Kualitas terbaik" },
  { icon: Heart, title: "Tanpa Pengawet", subtitle: "Lebih alami" },
];

export const formatPrice = (value: number) =>
  `Rp ${new Intl.NumberFormat("id-ID").format(value)}`;

export function Button({
  className = "",
  type = "button",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type={type}
      className={`inline-flex min-h-11 cursor-pointer items-center justify-center gap-2 rounded-xl font-bold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
      {...props}
    />
  );
}

export function Quantity({
  quantity,
  onMinus,
  onPlus,
  compact = false,
  disablePlus = false,
}: {
  quantity: number;
  onMinus: () => void;
  onPlus: () => void;
  compact?: boolean;
  disablePlus?: boolean;
}) {
  return (
    <div
      className={`grid grid-cols-3 items-center overflow-hidden rounded-2xl border border-border bg-card shadow-xs ${
        compact ? "h-9 w-28" : "h-12 w-full"
      }`}
    >
      <Button
        aria-label="Kurangi jumlah"
        className="h-full min-h-0 rounded-none text-foreground hover:bg-muted"
        onClick={onMinus}
      >
        <Minus size={16} />
      </Button>
      <span className="text-center text-sm font-bold text-foreground" aria-live="polite">
        {quantity}
      </span>
      <Button
        aria-label="Tambah jumlah"
        disabled={disablePlus}
        className="h-full min-h-0 rounded-none text-foreground hover:bg-muted disabled:opacity-35 disabled:cursor-not-allowed"
        title={disablePlus ? "Maksimal stok tercapai" : "Tambah jumlah"}
        onClick={onPlus}
      >
        <Plus size={16} />
      </Button>
    </div>
  );
}

export function compressImageFile(file: File, maxDim = 800, quality = 0.85): Promise<string> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const src = event.target?.result as string;
      if (!src) {
        resolve("");
        return;
      }
      const img = new Image();
      img.onload = () => {
        let { width, height } = img;
        if (width > maxDim || height > maxDim) {
          if (width > height) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          resolve(src);
          return;
        }
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL("image/jpeg", quality));
      };
      img.onerror = () => resolve(src);
      img.src = src;
    };
    reader.onerror = () => resolve("");
    reader.readAsDataURL(file);
  });
}

export default function Index() {
  const [category, setCategory] = useState<Category>("Semua");
  const [cart, setCart] = useState<Record<number, number>>({});
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [mobileNav, setMobileNav] = useState(false);
  const [name, setName] = useState("");
  const [delivery, setDelivery] = useState<
    "Ambil Langsung di Toko" | "Pengiriman Kurir Pribadi Halwa"
  >("Ambil Langsung di Toko");
  const [paymentMethod, setPaymentMethod] = useState<"QRIS" | "Tunai">("QRIS");
  const [address, setAddress] = useState("");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState("");

  // Custom Products (Varian Baru yang ditambahkan Pengelola)
  const [customProducts, setCustomProducts] = useState<Product[]>(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem("halwa_custom_products");
        if (saved) return JSON.parse(saved);
      } catch {}
    }
    return [];
  });

  // Custom Prices State (Perubahan harga oleh pengelola)
  const [customPrices, setCustomPrices] = useState<Record<number, number>>(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem("halwa_custom_prices");
        if (saved) return JSON.parse(saved);
      } catch {}
    }
    return {};
  });

  const saveCustomPrices = (newPrices: Record<number, number>) => {
    setCustomPrices(newPrices);
    try {
      localStorage.setItem("halwa_custom_prices", JSON.stringify(newPrices));
    } catch (e) {
      console.warn("Storage quota exceeded", e);
    }
    // Broadcast & persist to backend server
    fetch("/api/store/prices", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prices: newPrices }),
    }).catch(() => {});
  };

  // Helper untuk mendapatkan harga default bawaan
  const getDefaultPrice = (productId: number): number => {
    const def = defaultProducts.find((p) => p.id === productId);
    if (def) return def.price;
    const cust = customProducts.find((p) => p.id === productId);
    if (cust) return cust.price;
    return 6000;
  };

  // Gabungan semua varian roti (bawaan + kustom) dengan harga terkini
  const products: Product[] = useMemo(() => {
    return [...defaultProducts, ...customProducts].map((p) => ({
      ...p,
      price: customPrices[p.id] ?? p.price,
    }));
  }, [customProducts, customPrices]);

  const [isAddProductModalOpen, setIsAddProductModalOpen] = useState(false);
  const [editingPriceProduct, setEditingPriceProduct] = useState<Product | null>(null);
  const [productToast, setProductToast] = useState<string | null>(null);

  const handleUpdateProductPrice = (productId: number, newPrice: number) => {
    const updated = { ...customPrices, [productId]: newPrice };
    saveCustomPrices(updated);
    setProductToast(`Harga produk berhasil diperbarui menjadi ${formatPrice(newPrice)}`);
    setTimeout(() => setProductToast(null), 3000);
  };

  const handleResetProductPrice = (productId: number) => {
    const updated = { ...customPrices };
    delete updated[productId];
    saveCustomPrices(updated);
    setProductToast("Harga produk dikembalikan ke harga standar.");
    setTimeout(() => setProductToast(null), 3000);
  };

  // Stock State (saved in localStorage)
  const [stock, setStock] = useState<Record<number, number>>(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem("halwa_product_stock");
        if (saved) {
          const parsed = JSON.parse(saved);
          const initialMap: Record<number, number> = {};
          defaultProducts.forEach((p) => {
            initialMap[p.id] = typeof parsed[p.id] === "number" ? parsed[p.id] : p.stock;
          });
          try {
            const savedCustom = JSON.parse(localStorage.getItem("halwa_custom_products") || "[]");
            if (Array.isArray(savedCustom)) {
              savedCustom.forEach((p: Product) => {
                initialMap[p.id] = typeof parsed[p.id] === "number" ? parsed[p.id] : p.stock;
              });
            }
          } catch {}
          return initialMap;
        }
      } catch {
        // ignore
      }
    }
    const initialMap: Record<number, number> = {};
    defaultProducts.forEach((p) => {
      initialMap[p.id] = p.stock;
    });
    return initialMap;
  });

  const saveStock = (newStock: Record<number, number>) => {
    setStock(newStock);
    try {
      localStorage.setItem("halwa_product_stock", JSON.stringify(newStock));
    } catch (e) {
      console.warn("Storage quota exceeded", e);
    }
    // Broadcast & persist to backend server so all devices stay in sync
    fetch("/api/store/stock", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ stock: newStock }),
    }).catch(() => {});
  };

  const handleAddProduct = (newProduct: Product, initialStock: number) => {
    const updated = [...customProducts, newProduct];
    setCustomProducts(updated);
    try {
      localStorage.setItem("halwa_custom_products", JSON.stringify(updated));
    } catch (e) {
      console.warn("Storage quota exceeded", e);
    }

    const newStock = { ...stock, [newProduct.id]: initialStock };
    saveStock(newStock);

    if (newProduct.image) {
      saveProductImage(newProduct.id, newProduct.image);
    }

    // Broadcast & persist to backend server
    fetch("/api/store/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ customProducts: updated }),
    }).catch(() => {});

    setProductToast(`Varian baru "${newProduct.name}" berhasil ditambahkan ke menu!`);
    setTimeout(() => setProductToast(null), 4000);

    // Smooth scroll to new product
    setTimeout(() => {
      const el = document.getElementById(`product-card-${newProduct.id}`);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }, 400);
  };

  const handleDeleteProduct = (productId: number, productName: string) => {
    const ok = window.confirm(`Apakah Anda yakin ingin menghapus varian "${productName}" dari katalog Halwa Bakery?`);
    if (!ok) return;

    const updated = customProducts.filter((p) => p.id !== productId);
    setCustomProducts(updated);
    try {
      localStorage.setItem("halwa_custom_products", JSON.stringify(updated));
    } catch {}

    // Remove from cart if customer had added it
    setCart((prev) => {
      const next = { ...prev };
      delete next[productId];
      return next;
    });

    // Broadcast & persist to backend server
    fetch("/api/store/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ customProducts: updated }),
    }).catch(() => {});

    setProductToast(`Varian "${productName}" telah dihapus.`);
    setTimeout(() => setProductToast(null), 3500);
  };

  // Admin Stock Modal state
  const [isAdminStockModalOpen, setIsAdminStockModalOpen] = useState(false);
  const [adminStockInputs, setAdminStockInputs] = useState<Record<number, number>>({});
  const [adminSavedToast, setAdminSavedToast] = useState(false);

  // Email akun Google resmi pengelola Halwa Bakery
  const PRIMARY_OWNER_EMAIL = "rakha.ahmad.dzaky@gmail.com";

  // Verifikasi apakah email adalah pengelola resmi
  const isEmailAuthorizedAdmin = (email?: string | null): boolean => {
    if (!email) return false;
    const normalized = email.trim().toLowerCase();
    if (normalized === PRIMARY_OWNER_EMAIL.toLowerCase()) return true;
    try {
      const customAdmins = JSON.parse(localStorage.getItem("halwa_custom_admins") || "[]");
      if (Array.isArray(customAdmins) && customAdmins.map((e: string) => e.toLowerCase()).includes(normalized)) {
        return true;
      }
    } catch {}
    return false;
  };

  // Admin Authentication State (Khusus Pengelola Toko via Akun Google)
  const [isAdmin, setIsAdmin] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("halwa_is_admin");
      if (saved !== null) return saved === "true";
      // In AI Studio preview / local development, default to active admin for seamless management
      if (
        window.location.hostname.includes("ais-dev") ||
        window.location.hostname.includes("localhost") ||
        window.location.hostname.includes("127.0.0.1")
      ) {
        return true;
      }
    }
    return false;
  });
  const [isAdminAuthModalOpen, setIsAdminAuthModalOpen] = useState(false);
  const [adminAuthError, setAdminAuthError] = useState("");
  const [isAdminLoggingIn, setIsAdminLoggingIn] = useState(false);
  const [isHalalDetailModalOpen, setIsHalalDetailModalOpen] = useState(false);

  // Mode Autentikasi Pengelola: Khusus Akun Google Terdaftar
  const [unauthorizedDomain, setUnauthorizedDomain] = useState<string | null>(null);
  const [copiedDomain, setCopiedDomain] = useState(false);

  // Buka dialog login pengelola jika ada parameter ?admin=true di link web
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      if (params.get("admin") === "true" || params.get("admin") === "1") {
        setIsAdminAuthModalOpen(true);
      }
    } catch {}
  }, []);

  const handleAdminGoogleLogin = async () => {
    try {
      setIsAdminLoggingIn(true);
      setAdminAuthError("");
      const res = await googleSignIn();
      const email = res.user.email;
      if (isEmailAuthorizedAdmin(email)) {
        setGoogleUser(res.user);
        setGoogleAccessToken(res.accessToken);
        setIsAdmin(true);
        try {
          localStorage.setItem("halwa_is_admin", "true");
        } catch {}
        setIsAdminAuthModalOpen(false);
        setProductToast(`Berhasil masuk sebagai Pengelola: ${email || ""}`);
        setTimeout(() => setProductToast(null), 3500);
        openAdminStockModal();
      } else {
        setIsAdmin(false);
        try {
          localStorage.removeItem("halwa_is_admin");
        } catch {}
        setAdminAuthError(
          `Akses ditolak: Akun Google "${email || "ini"}" tidak terdaftar sebagai pengelola resmi Halwa Bakery. Silakan gunakan akun Google pemilik toko (${PRIMARY_OWNER_EMAIL}).`
        );
      }
    } catch (e: any) {
      const code = e?.code || "";
      const msg = e?.message || "";
      if (code === "auth/popup-closed-by-user") {
        // User closed the popup intentionally, no error needed
        return;
      }
      if (code === "auth/unauthorized-domain" || msg.includes("unauthorized-domain")) {
        const domain = typeof window !== "undefined" ? window.location.hostname : "halwabakery.my.id";
        setUnauthorizedDomain(domain);
        setAdminAuthError(
          `Domain "${domain}" belum diotorisasi di Firebase Authentication. Tambahkan domain ini di Firebase Console (Authentication > Settings > Authorized domains).`
        );
      } else if (code === "auth/popup-blocked") {
        setAdminAuthError(
          "Jendela pop-up login terblokir oleh peramban. Silakan izinkan pop-up atau buka aplikasi di tab baru agar pop-up diizinkan."
        );
      } else {
        setAdminAuthError(e?.message || "Gagal masuk dengan Google. Silakan coba lagi.");
      }
    } finally {
      setIsAdminLoggingIn(false);
    }
  };

  const handleAdminLogout = async () => {
    setIsAdmin(false);
    try {
      localStorage.removeItem("halwa_is_admin");
    } catch {}
    setIsAdminStockModalOpen(false);
    setIsPhotoManagerOpen(false);
    try {
      await googleSignOut();
      setGoogleUser(null);
      setGoogleAccessToken(null);
    } catch {}
  };

  // Google Sheets Integration & Admin Tabs State
  const [adminTab, setAdminTab] = useState<"manual" | "prices" | "sheets">("manual");
  const [adminPriceInputs, setAdminPriceInputs] = useState<Record<number, number>>({});
  const [adminPriceCategoryFilter, setAdminPriceCategoryFilter] = useState<Category>("Semua");

  const openAdminStockModal = (tab: "manual" | "prices" | "sheets" = "manual") => {
    if (!isAdmin) {
      setIsAdminAuthModalOpen(true);
      return;
    }
    setAdminStockInputs({ ...stock });
    const currentPricesMap: Record<number, number> = {};
    products.forEach((p) => {
      currentPricesMap[p.id] = p.price;
    });
    setAdminPriceInputs(currentPricesMap);
    setAdminTab(tab);
    setIsAdminStockModalOpen(true);
    setAdminSavedToast(false);
  };

  const openPhotoManagerModal = () => {
    if (!isAdmin) {
      setIsAdminAuthModalOpen(true);
      return;
    }
    setIsPhotoManagerOpen(true);
  };

  const handleSaveAdminPrices = () => {
    const updatedPrices = { ...customPrices };
    products.forEach((p) => {
      const val = Math.max(500, Math.floor(Number(adminPriceInputs[p.id]) || p.price));
      const defPrice = getDefaultPrice(p.id);
      if (val !== defPrice) {
        updatedPrices[p.id] = val;
      } else {
        delete updatedPrices[p.id];
      }
    });
    saveCustomPrices(updatedPrices);
    setAdminSavedToast(true);
    setTimeout(() => {
      setAdminSavedToast(false);
      setIsAdminStockModalOpen(false);
    }, 1000);
  };

  const handleResetAllAdminPrices = () => {
    const ok = window.confirm("Kembalikan harga semua produk ke harga standar Halwa Bakery?");
    if (!ok) return;
    saveCustomPrices({});
    const resetMap: Record<number, number> = {};
    products.forEach((p) => {
      resetMap[p.id] = getDefaultPrice(p.id);
    });
    setAdminPriceInputs(resetMap);
    setAdminSavedToast(true);
    setTimeout(() => setAdminSavedToast(false), 2000);
  };

  const handleSaveAdminStock = () => {
    const sanitized: Record<number, number> = {};
    products.forEach((p) => {
      const val = Math.max(0, Math.floor(Number(adminStockInputs[p.id]) || 0));
      sanitized[p.id] = val;
    });
    saveStock(sanitized);

    // Sesuaikan kuantitas keranjang jika melebihi stok baru
    setCart((prev) => {
      const next = { ...prev };
      for (const idStr of Object.keys(next)) {
        const id = Number(idStr);
        const maxAvailable = sanitized[id] ?? 0;
        if (maxAvailable <= 0) {
          delete next[id];
        } else if (next[id] > maxAvailable) {
          next[id] = maxAvailable;
        }
      }
      return next;
    });

    setAdminSavedToast(true);
    if (spreadsheetId && googleAccessToken) {
      updateStockInGoogleSheets(spreadsheetId, sanitized, googleAccessToken).catch((e) => {
        console.warn("Gagal sinkron ke Google Sheets:", e);
      });
    }
    setTimeout(() => {
      setAdminSavedToast(false);
      setIsAdminStockModalOpen(false);
    }, 1000);
  };

  // Google Sheets Integration State
  const [googleUser, setGoogleUser] = useState<User | null>(null);
  const [googleAccessToken, setGoogleAccessToken] = useState<string | null>(null);
  const [spreadsheetId, setSpreadsheetId] = useState<string>(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("halwa_spreadsheet_id") || "";
    }
    return "";
  });
  const [spreadsheetUrl, setSpreadsheetUrl] = useState<string>(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("halwa_spreadsheet_url") || "";
    }
    return "";
  });
  const [customSheetInput, setCustomSheetInput] = useState("");
  const [isSyncingSheets, setIsSyncingSheets] = useState(false);
  const [isCreatingSheet, setIsCreatingSheet] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState<string | null>(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("halwa_last_sheet_sync") || null;
    }
    return null;
  });
  const [sheetStatusMsg, setSheetStatusMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Initialize Firebase Auth listener for Google Workspace OAuth
  useEffect(() => {
    const unsubscribe = initAuth(
      (user, token) => {
        setGoogleUser(user);
        if (token) setGoogleAccessToken(token);
        if (user && isEmailAuthorizedAdmin(user.email)) {
          setIsAdmin(true);
          try {
            localStorage.setItem("halwa_is_admin", "true");
          } catch {}
        } else if (user) {
          setIsAdmin(false);
          try {
            localStorage.removeItem("halwa_is_admin");
          } catch {}
        }
      },
      () => {
        setGoogleUser(null);
        setGoogleAccessToken(null);
        setIsAdmin(false);
        try {
          localStorage.removeItem("halwa_is_admin");
        } catch {}
      }
    );
    return () => unsubscribe?.();
  }, []);

  // Real-time synchronization with server-side store (so HP, Laptop & Customers share the exact same stock, photos, and spreadsheet ID)
  useEffect(() => {
    let isMounted = true;

    const syncWithServer = async () => {
      try {
        const res = await fetch("/api/store");
        if (!res.ok) return;
        const data = await res.json();
        if (!isMounted) return;

        if (data.stock && typeof data.stock === "object" && Object.keys(data.stock).length > 0) {
          setStock((prev) => ({ ...prev, ...data.stock }));
          try {
            localStorage.setItem("halwa_product_stock", JSON.stringify(data.stock));
          } catch {}
        }

        if (data.prices && typeof data.prices === "object" && Object.keys(data.prices).length > 0) {
          setCustomPrices((prev) => ({ ...prev, ...data.prices }));
          try {
            localStorage.setItem("halwa_custom_prices", JSON.stringify(data.prices));
          } catch {}
        }

        if (Array.isArray(data.customProducts) && data.customProducts.length > 0) {
          setCustomProducts(data.customProducts);
          try {
            localStorage.setItem("halwa_custom_products", JSON.stringify(data.customProducts));
          } catch {}
        }

        const serverHasPhotos = data.productImages && typeof data.productImages === "object" && Object.keys(data.productImages).length > 0;
        if (serverHasPhotos) {
          setProductImages((prev) => ({ ...prev, ...data.productImages }));
          try {
            localStorage.setItem("halwa_product_images", JSON.stringify(data.productImages));
          } catch {}
        }

        if (data.heroImage && data.heroImage.trim() !== "") {
          setHeroImage(data.heroImage);
          try {
            localStorage.setItem("halwa_hero_image", data.heroImage);
          } catch {}
        }

        if (data.spreadsheetId) {
          setSpreadsheetId(data.spreadsheetId);
          try {
            localStorage.setItem("halwa_spreadsheet_id", data.spreadsheetId);
          } catch {}
        }

        if (data.spreadsheetUrl) {
          setSpreadsheetUrl(data.spreadsheetUrl);
          try {
            localStorage.setItem("halwa_spreadsheet_url", data.spreadsheetUrl);
          } catch {}
        }

        // Auto-migration: If server is missing spreadsheetId or photos, but this browser (e.g. laptop) has them locally, push them to server!
        const localSheetId = localStorage.getItem("halwa_spreadsheet_id");
        const localSheetUrl = localStorage.getItem("halwa_spreadsheet_url");
        const localPhotosStr = localStorage.getItem("halwa_product_images");
        const localHero = localStorage.getItem("halwa_hero_image");

        if (!data.spreadsheetId && localSheetId) {
          fetch("/api/store/config", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ spreadsheetId: localSheetId, spreadsheetUrl: localSheetUrl || "" }),
          }).catch(() => {});
        }

        // Auto-migration: Jika di laptop tersimpan foto banner utama, sinkronkan ke server agar HP & pengunjung langsung menerima foto yang sama
        if (localHero && localHero.trim() !== "" && (!data.heroImage || data.heroImage.trim() === "")) {
          fetch("/api/store/images", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ heroImage: localHero }),
          }).catch(() => {});
        }

        // Auto-migration: Jika di laptop tersimpan foto produk asli, dorong ke server agar semua perangkat/teman mendapatkan foto yang sama
        if (localPhotosStr && !serverHasPhotos) {
          try {
            const parsedPhotos = JSON.parse(localPhotosStr);
            if (parsedPhotos && Object.keys(parsedPhotos).length > 0) {
              setProductImages((prev) => ({ ...prev, ...parsedPhotos }));
              fetch("/api/store/images", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ productImages: parsedPhotos }),
              }).catch(() => {});
            }
          } catch {}
        }

        // Auto-migration: Jika tersimpan penyesuaian harga di perangkat, sinkronkan ke server
        const localPricesStr = localStorage.getItem("halwa_custom_prices");
        if (localPricesStr && (!data.prices || Object.keys(data.prices).length === 0)) {
          try {
            const parsedPrices = JSON.parse(localPricesStr);
            if (parsedPrices && Object.keys(parsedPrices).length > 0) {
              setCustomPrices((prev) => ({ ...prev, ...parsedPrices }));
              fetch("/api/store/prices", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ prices: parsedPrices }),
              }).catch(() => {});
            }
          } catch {}
        }
      } catch (err) {
        // network / offline fallback
      }
    };

    syncWithServer();
    const interval = setInterval(syncWithServer, 5000);
    window.addEventListener("focus", syncWithServer);
    return () => {
      isMounted = false;
      clearInterval(interval);
      window.removeEventListener("focus", syncWithServer);
    };
  }, []);

  const handleFetchStockFromSheets = async (showFeedback = true, targetId = spreadsheetId) => {
    if (!targetId) return;

    try {
      setIsSyncingSheets(true);
      const remoteStock = await fetchStockFromGoogleSheets(targetId, googleAccessToken);
      if (Object.keys(remoteStock).length > 0) {
        saveStock(remoteStock);
        // Adjust cart if stock depleted
        setCart((prev) => {
          const next = { ...prev };
          for (const idStr of Object.keys(next)) {
            const id = Number(idStr);
            const max = remoteStock[id] ?? 0;
            if (max <= 0) {
              delete next[id];
            } else if (next[id] > max) {
              next[id] = max;
            }
          }
          return next;
        });

        const nowStr = new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" });
        setLastSyncTime(nowStr);
        try {
          localStorage.setItem("halwa_last_sheet_sync", nowStr);
        } catch {}

        if (showFeedback) {
          setSheetStatusMsg({
            type: "success",
            text: `Data stok berhasil disinkronkan dari Google Sheets (${nowStr})!`,
          });
        }
      } else if (showFeedback) {
        setSheetStatusMsg({
          type: "error",
          text: "Tidak dapat membaca data dari Google Sheets. Pastikan akses dibagikan ke 'Siapa saja yang memiliki link' atau Masuk dengan Akun Google pemilik.",
        });
      }
    } catch (e: any) {
      console.error(e);
      if (showFeedback) {
        setSheetStatusMsg({
          type: "error",
          text: "Gagal menarik data dari Google Sheets.",
        });
      }
    } finally {
      setIsSyncingSheets(false);
    }
  };

  // Initial fetch from Google Sheets if spreadsheetId is configured
  useEffect(() => {
    if (spreadsheetId) {
      handleFetchStockFromSheets(false);
    }
  }, [spreadsheetId]);

  const handleGoogleLogin = async () => {
    try {
      setSheetStatusMsg(null);
      const res = await googleSignIn();
      setGoogleUser(res.user);
      setGoogleAccessToken(res.accessToken);
      setSheetStatusMsg({
        type: "success",
        text: `Berhasil terhubung dengan Google (${res.user.email})!`,
      });
    } catch (e: any) {
      const code = e?.code;
      if (code === "auth/popup-closed-by-user") {
        return;
      }
      setSheetStatusMsg({
        type: "error",
        text:
          code === "auth/popup-blocked"
            ? "Pop-up login diblokir oleh browser di dalam preview. Silakan buka aplikasi di tab baru atau izinkan pop-up."
            : e?.message || "Gagal masuk dengan akun Google.",
      });
    }
  };

  const handleGoogleLogout = async () => {
    await googleSignOut();
    setGoogleUser(null);
    setGoogleAccessToken(null);
    setSheetStatusMsg(null);
  };

  const handleCreateNewSheet = async () => {
    if (!googleAccessToken) {
      setSheetStatusMsg({
        type: "error",
        text: "Silakan Masuk dengan Google terlebih dahulu.",
      });
      return;
    }

    try {
      setIsCreatingSheet(true);
      setSheetStatusMsg(null);
      const { id, url } = await createHalwaSpreadsheet(googleAccessToken, stock);
      setSpreadsheetId(id);
      setSpreadsheetUrl(url);
      try {
        localStorage.setItem("halwa_spreadsheet_id", id);
        localStorage.setItem("halwa_spreadsheet_url", url);
        const nowStr = new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" });
        localStorage.setItem("halwa_last_sheet_sync", nowStr);
        setLastSyncTime(nowStr);
      } catch {}

      // Persist to server store so HP and other devices connect to this spreadsheet immediately
      fetch("/api/store/config", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ spreadsheetId: id, spreadsheetUrl: url }),
      }).catch(() => {});

      setSheetStatusMsg({
        type: "success",
        text: "Spreadsheet Halwa Bakery berhasil dibuat di Google Drive dan langsung terhubung!",
      });
    } catch (e: any) {
      console.error(e);
      setSheetStatusMsg({
        type: "error",
        text: e?.message || "Gagal membuat Google Spreadsheet.",
      });
    } finally {
      setIsCreatingSheet(false);
    }
  };

  const handleSaveCustomSheetId = () => {
    const input = customSheetInput.trim();
    if (!input) return;

    let extractedId = input;
    const match = input.match(/\/d\/([a-zA-Z0-9-_]+)/);
    if (match && match[1]) {
      extractedId = match[1];
    }

    setSpreadsheetId(extractedId);
    const url = `https://docs.google.com/spreadsheets/d/${extractedId}/edit`;
    setSpreadsheetUrl(url);
    try {
      localStorage.setItem("halwa_spreadsheet_id", extractedId);
      localStorage.setItem("halwa_spreadsheet_url", url);
    } catch {}

    // Persist to server store so HP and other devices connect to this spreadsheet immediately
    fetch("/api/store/config", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ spreadsheetId: extractedId, spreadsheetUrl: url }),
    }).catch(() => {});

    setCustomSheetInput("");
    setSheetStatusMsg({
      type: "success",
      text: "ID Spreadsheet berhasil disimpan! Sedang memuat data...",
    });
    handleFetchStockFromSheets(true, extractedId);
  };

  const handlePushStockToSheets = async () => {
    if (!spreadsheetId) {
      setSheetStatusMsg({ type: "error", text: "Spreadsheet belum terhubung." });
      return;
    }
    if (!googleAccessToken) {
      setSheetStatusMsg({ type: "error", text: "Silakan Masuk dengan Google untuk mengupdate spreadsheet." });
      return;
    }

    try {
      setIsSyncingSheets(true);
      await updateStockInGoogleSheets(spreadsheetId, stock, googleAccessToken);
      const nowStr = new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" });
      setLastSyncTime(nowStr);
      setSheetStatusMsg({
        type: "success",
        text: `Stok saat ini berhasil diunggah ke Google Sheets (${nowStr})!`,
      });
    } catch (e: any) {
      console.error(e);
      setSheetStatusMsg({
        type: "error",
        text: e?.message || "Gagal mengunggah stok ke Google Sheets.",
      });
    } finally {
      setIsSyncingSheets(false);
    }
  };

  const handleDisconnectSheet = () => {
    setSpreadsheetId("");
    setSpreadsheetUrl("");
    setLastSyncTime(null);
    try {
      localStorage.removeItem("halwa_spreadsheet_id");
      localStorage.removeItem("halwa_spreadsheet_url");
      localStorage.removeItem("halwa_last_sheet_sync");
    } catch {}
    setSheetStatusMsg({
      type: "success",
      text: "Tautan ke Google Sheets telah dilepas.",
    });
  };

  // Hero Image
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [heroImage, setHeroImage] = useState<string>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("halwa_hero_image");
      if (saved && saved.trim() !== "" && saved !== "/assets/hero.jpg") {
        return saved;
      }
    }
    return REAL_HERO_IMAGE;
  });
  const [isDragging, setIsDragging] = useState(false);

  // Product Images State (saved in localStorage, defaulting to authentic bakery photos)
  const [productImages, setProductImages] = useState<Record<number, string>>(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem("halwa_product_images");
        if (saved) {
          const parsed = JSON.parse(saved);
          if (parsed && typeof parsed === "object" && Object.keys(parsed).length > 0) {
            return { ...REAL_PRODUCT_IMAGES, ...parsed };
          }
        }
      } catch {
        // ignore
      }
    }
    return { ...REAL_PRODUCT_IMAGES };
  });

  const [isPhotoManagerOpen, setIsPhotoManagerOpen] = useState(false);
  const [activeUploadProductId, setActiveUploadProductId] = useState<number | null>(null);
  const [urlInputProductId, setUrlInputProductId] = useState<number | null>(null);
  const [customUrlInput, setCustomUrlInput] = useState("");
  const [dragOverCardId, setDragOverCardId] = useState<number | null>(null);
  const [isPublishingPhotos, setIsPublishingPhotos] = useState(false);
  const [publishToastMsg, setPublishToastMsg] = useState<string | null>(null);
  const [uploadingProductIds, setUploadingProductIds] = useState<Record<number, boolean>>({});
  const [isUploadingHero, setIsUploadingHero] = useState(false);
  const [isUploadingAllToFirebase, setIsUploadingAllToFirebase] = useState(false);
  const [firebaseUploadProgress, setFirebaseUploadProgress] = useState<{
    current: number;
    total: number;
    name?: string;
  } | null>(null);
  const [firebaseStatusMsg, setFirebaseStatusMsg] = useState<{
    type: "success" | "error" | "info";
    text: string;
  } | null>(null);
  const productFileInputRef = useRef<HTMLInputElement>(null);

  const pushAllPhotosToServer = async () => {
    setIsPublishingPhotos(true);
    setPublishToastMsg(null);
    try {
      const photosToPush = { ...productImages };
      // Fallback check from localStorage
      if (Object.keys(photosToPush).length === 0) {
        const local = localStorage.getItem("halwa_product_images");
        if (local) {
          try {
            Object.assign(photosToPush, JSON.parse(local));
          } catch {}
        }
      }

      const heroToPush = heroImage || localStorage.getItem("halwa_hero_image") || "";

      const res = await fetch("/api/store/images", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productImages: photosToPush,
          heroImage: heroToPush,
        }),
      });

      if (res.ok) {
        setPublishToastMsg("Semua foto berhasil disimpan permanen ke server! Teman, pelanggan, dan semua pengunjung kini dapat melihat foto asli Halwa Bakery Anda.");
      } else {
        setPublishToastMsg("Gagal menyimpan ke server. Mohon periksa koneksi dan coba lagi.");
      }
    } catch (e) {
      setPublishToastMsg("Gagal menyimpan ke server. Mohon periksa koneksi dan coba lagi.");
    } finally {
      setIsPublishingPhotos(false);
      setTimeout(() => {
        setPublishToastMsg(null);
      }, 7000);
    }
  };

  const uploadSingleProductToFirebase = async (productId: number) => {
    const dataUrl = productImages[productId];
    if (!dataUrl) return;
    if (isFirebaseImageUrl(dataUrl)) {
      setFirebaseStatusMsg({
        type: "info",
        text: `Foto ${products.find((p) => p.id === productId)?.name || "produk"} sudah tersimpan di Firebase Cloud Storage.`,
      });
      setTimeout(() => setFirebaseStatusMsg(null), 5000);
      return;
    }

    setUploadingProductIds((prev) => ({ ...prev, [productId]: true }));
    setFirebaseStatusMsg(null);
    try {
      const { url } = await uploadProductImageToFirebase(productId, dataUrl);
      saveProductImage(productId, url);
      setFirebaseStatusMsg({
        type: "success",
        text: `Foto ${products.find((p) => p.id === productId)?.name || "produk"} berhasil disimpan ke Firebase Cloud Storage!`,
      });
    } catch (err: any) {
      console.warn("Upload ke Firebase Storage gagal:", err);
      setFirebaseStatusMsg({
        type: "info",
        text: `Gagal upload ke Firebase: ${err?.message || "Periksa izin penyimpanan"}. Foto tetap tersimpan di server lokal.`,
      });
    } finally {
      setUploadingProductIds((prev) => ({ ...prev, [productId]: false }));
      setTimeout(() => setFirebaseStatusMsg(null), 8000);
    }
  };

  const uploadAllPhotosToFirebaseStorage = async () => {
    setIsUploadingAllToFirebase(true);
    setFirebaseStatusMsg(null);

    const itemsToUpload = products.filter((p) => {
      const img = productImages[p.id];
      return img && !isFirebaseImageUrl(img);
    });

    const needsHero = heroImage && !isFirebaseImageUrl(heroImage) && heroImage.startsWith("data:image/");
    const totalToUpload = itemsToUpload.length + (needsHero ? 1 : 0);

    if (totalToUpload === 0) {
      setFirebaseStatusMsg({
        type: "info",
        text: "Semua foto roti dan banner sudah tersimpan di Firebase Cloud Storage!",
      });
      setIsUploadingAllToFirebase(false);
      setTimeout(() => setFirebaseStatusMsg(null), 6000);
      return;
    }

    setFirebaseUploadProgress({ current: 0, total: totalToUpload });
    let successCount = 0;
    const updatedImages = { ...productImages };

    for (let i = 0; i < itemsToUpload.length; i++) {
      const prod = itemsToUpload[i];
      setFirebaseUploadProgress({
        current: i + 1,
        total: totalToUpload,
        name: prod.name,
      });

      const currentData = productImages[prod.id];
      if (currentData) {
        try {
          const { url } = await uploadProductImageToFirebase(prod.id, currentData);
          updatedImages[prod.id] = url;
          successCount++;
        } catch (err: any) {
          console.error(`Gagal upload produk ${prod.name} ke Firebase Storage:`, err);
        }
      }
    }

    if (needsHero) {
      setFirebaseUploadProgress({
        current: totalToUpload,
        total: totalToUpload,
        name: "Banner Utama",
      });
      try {
        const { url } = await uploadHeroImageToFirebase(heroImage);
        setHeroImage(url);
        try {
          localStorage.setItem("halwa_hero_image", url);
        } catch {}
        await fetch("/api/store/images", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ heroImage: url }),
        });
        successCount++;
      } catch (err) {
        console.error("Gagal upload hero banner ke Firebase Storage:", err);
      }
    }

    // Persist all updated Firebase Storage URLs to state, localStorage & backend
    setProductImages(updatedImages);
    try {
      localStorage.setItem("halwa_product_images", JSON.stringify(updatedImages));
    } catch {}
    await fetch("/api/store/images", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productImages: updatedImages }),
    });

    setFirebaseStatusMsg({
      type: "success",
      text: `Selesai! ${successCount} dari ${totalToUpload} foto roti berhasil disimpan ke Firebase Cloud Storage (${storageBucket}). Seluruh pengunjung sekarang mengakses foto dari Google Cloud CDN.`,
    });
    setIsUploadingAllToFirebase(false);
    setFirebaseUploadProgress(null);
    setTimeout(() => setFirebaseStatusMsg(null), 10000);
  };

  const saveProductImage = (productId: number, dataUrl: string) => {
    setProductImages((prev) => {
      const next = { ...prev, [productId]: dataUrl };
      try {
        localStorage.setItem("halwa_product_images", JSON.stringify(next));
      } catch (e) {
        console.warn("Storage quota exceeded", e);
      }
      return next;
    });
    // Persist to server so phone receives it immediately
    fetch("/api/store/images", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productImages: { [productId]: dataUrl } }),
    }).catch(() => {});
  };

  const removeProductImage = (productId: number) => {
    setProductImages((prev) => {
      const next = { ...prev };
      delete next[productId];
      try {
        localStorage.setItem("halwa_product_images", JSON.stringify(next));
      } catch (e) {
        console.warn(e);
      }
      return next;
    });
    fetch("/api/store/images", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productImages: { [productId]: "" } }),
    }).catch(() => {});
  };

  const resetAllProductImages = () => {
    setProductImages({});
    try {
      localStorage.removeItem("halwa_product_images");
    } catch (e) {
      console.warn(e);
    }
    fetch("/api/store/images", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ resetAll: true }),
    }).catch(() => {});
  };

  const triggerUploadForProduct = (productId: number) => {
    setActiveUploadProductId(productId);
    if (productFileInputRef.current) {
      productFileInputRef.current.value = "";
      productFileInputRef.current.click();
    }
  };

  const handleProductFileInput = async (file: File) => {
    const targetId = activeUploadProductId;
    if (!targetId || !file.type.startsWith("image/")) return;
    const compressed = await compressImageFile(file, 800, 0.85);
    if (!compressed) return;

    // 1. Simpan langsung secara lokal & server agar cepat terlihat
    saveProductImage(targetId, compressed);

    // 2. Unggah otomatis ke Firebase Cloud Storage
    setUploadingProductIds((prev) => ({ ...prev, [targetId]: true }));
    try {
      const { url } = await uploadProductImageToFirebase(targetId, compressed);
      saveProductImage(targetId, url);
      setFirebaseStatusMsg({
        type: "success",
        text: `Foto ${products.find((p) => p.id === targetId)?.name || "produk"} berhasil disimpan ke Firebase Cloud Storage!`,
      });
    } catch (err: any) {
      console.warn("Upload ke Firebase Storage gagal, menggunakan server lokal:", err);
      setFirebaseStatusMsg({
        type: "info",
        text: `Foto tersimpan di server lokal. (Catatan Firebase: ${err?.message || "Storage disiapkan"})`,
      });
    } finally {
      setUploadingProductIds((prev) => ({ ...prev, [targetId]: false }));
      setTimeout(() => setFirebaseStatusMsg(null), 8000);
    }
  };

  const handleHeroFile = async (file: File) => {
    if (!file.type.startsWith("image/")) return;
    const compressed = await compressImageFile(file, 1200, 0.85);
    if (!compressed) return;

    setHeroImage(compressed);
    try {
      localStorage.setItem("halwa_hero_image", compressed);
    } catch {}
    fetch("/api/store/images", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ heroImage: compressed }),
    }).catch(() => {});

    setIsUploadingHero(true);
    try {
      const { url } = await uploadHeroImageToFirebase(compressed);
      setHeroImage(url);
      try {
        localStorage.setItem("halwa_hero_image", url);
      } catch {}
      fetch("/api/store/images", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ heroImage: url }),
      }).catch(() => {});
      setFirebaseStatusMsg({
        type: "success",
        text: "Banner utama berhasil disimpan ke Firebase Cloud Storage!",
      });
    } catch (err: any) {
      console.warn("Firebase Storage hero notice:", err);
      setFirebaseStatusMsg({
        type: "info",
        text: "Banner utama tersimpan di server lokal.",
      });
    } finally {
      setIsUploadingHero(false);
      setTimeout(() => setFirebaseStatusMsg(null), 8000);
    }
  };

  const visibleProducts =
    category === "Semua"
      ? products
      : products.filter((product) => product.category === category);

  const cartItems = products.filter((product) => (cart[product.id] ?? 0) > 0);

  const totalItems: number = (Object.values(cart) as number[]).reduce(
    (sum, quantity) => sum + quantity,
    0
  );

  const total = useMemo(
    () =>
      cartItems.reduce(
        (sum, item) => sum + item.price * (cart[item.id] ?? 0),
        0
      ),
    [cart, cartItems]
  );

  const updateQuantity = (id: number, delta: number) => {
    const currentStock = stock[id] ?? 0;
    setCart((current) => {
      const currentQty = current[id] ?? 0;
      const updated = currentQty + delta;
      if (updated <= 0) {
        const next = { ...current };
        delete next[id];
        return next;
      }
      if (updated > currentStock) {
        return {
          ...current,
          [id]: currentStock,
        };
      }
      return {
        ...current,
        [id]: updated,
      };
    });
  };

  useEffect(() => {
    document.body.style.overflow = drawerOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [drawerOpen]);

  const checkout = () => {
    if (!totalItems) {
      setError("Keranjang masih kosong. Pilih produk favorit Anda dulu.");
      return;
    }
    if (!name.trim()) {
      setError("Nama pemesan wajib diisi.");
      return;
    }
    if (delivery === "Pengiriman Kurir Pribadi Halwa" && !address.trim()) {
      setError("Mohon isi alamat pengiriman lengkap untuk pengiriman kurir.");
      return;
    }

    // Validasi stok sebelum checkout
    for (const item of cartItems) {
      const availableStock = stock[item.id] ?? 0;
      const requestedQty = cart[item.id] ?? 0;
      if (availableStock <= 0) {
        setError(`Maaf, stok ${item.name} saat ini sudah habis.`);
        return;
      }
      if (requestedQty > availableStock) {
        setError(
          `Maaf, stok ${item.name} hanya tersisa ${availableStock} pcs (pesanan Anda: ${requestedQty} pcs).`
        );
        return;
      }
    }

    setError("");

    const lines = cartItems
      .map(
        (item) =>
          `- ${cart[item.id]}x ${item.name} (${formatPrice(item.price * (cart[item.id] ?? 1))})`
      )
      .join("\n");

    const paymentText = paymentMethod === "QRIS" ? "QRIS (Scan Barcode)" : "Tunai / Cash";

    const message =
      delivery === "Pengiriman Kurir Pribadi Halwa"
        ? `Halo Halwa Bakery, saya mau pesan:\n${lines}\n\n*Total:* ${formatPrice(
            total
          )}\n*Metode:* Pengiriman Kurir Pribadi Halwa\n*Pembayaran:* ${paymentText}\n*Nama:* ${name.trim()}\n*Alamat Pengiriman:* ${address.trim()}${
            notes.trim() ? `\n*Catatan Kurir:* ${notes.trim()}` : ""
          }`
        : `Halo Halwa Bakery, saya mau pesan:\n${lines}\n\n*Total:* ${formatPrice(
            total
          )}\n*Metode:* Ambil Langsung di Toko\n*Pembayaran:* ${paymentText}\n*Nama:* ${name.trim()}${
            notes.trim() ? `\n*Catatan Tambahan:* ${notes.trim()}` : ""
          }`;

    // 1. Pengurangan stok otomatis saat checkout
    const updatedStock = { ...stock };
    const orderItems: Record<number, number> = {};
    cartItems.forEach((item) => {
      const qty = cart[item.id] ?? 0;
      orderItems[item.id] = qty;
      updatedStock[item.id] = Math.max(0, (updatedStock[item.id] ?? item.stock) - qty);
    });
    saveStock(updatedStock);

    // Kirim pengurangan stok ke backend server agar semua perangkat langsung terupdate seketika
    fetch("/api/store/order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ items: orderItems }),
    }).catch(() => {});

    // Sync otomatis ke Google Sheets jika terhubung
    if (spreadsheetId && googleAccessToken) {
      updateStockInGoogleSheets(spreadsheetId, updatedStock, googleAccessToken).catch((e) => {
        console.warn("Gagal auto-update ke Google Sheets saat checkout:", e);
      });
    }

    // 2. Arahkan ke WhatsApp
    window.open(
      `https://wa.me/6285822767417?text=${encodeURIComponent(message)}`,
      "_blank",
      "noopener,noreferrer"
    );

    // 3. Kosongkan keranjang belanja setelah checkout
    setCart({});
    setDrawerOpen(false);
  };

  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary-soft selection:text-primary-strong">
      {/* Opening Splash Screen (Logo Halwa Bakery Sesuai Foto) */}
      <OpeningSplashScreen />

      {/* Admin Top Notification Bar (Khusus Pengelola) */}
      {isAdmin && (
        <div className="fixed top-0 left-0 right-0 z-50 flex flex-wrap items-center justify-between border-b border-primary/40 bg-[#2A160E] px-4 py-1.5 text-xs text-[#F7F2E8] shadow-md">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-bold text-primary">Mode Pengelola (Admin) Aktif</span>
            <span className="hidden md:inline text-[#F7F2E8]/70">
              • Tombol ubah stok &amp; ganti foto terbuka khusus untuk Anda
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsAddProductModalOpen(true)}
              className="rounded-md bg-primary px-2.5 py-1 text-[11px] font-bold text-primary-foreground shadow-2xs hover:bg-primary-strong transition cursor-pointer flex items-center gap-1"
              title="Tambah varian produk roti atau kue baru"
            >
              <Plus size={12} />
              <span>+ Tambah Varian</span>
            </button>
            <button
              type="button"
              onClick={() => openAdminStockModal("manual")}
              className="rounded-md bg-white/10 px-2.5 py-1 text-[11px] font-bold text-primary hover:bg-white/20 transition cursor-pointer flex items-center gap-1"
              title="Kelola ketersediaan stok roti"
            >
              <Boxes size={12} />
              <span>Admin Stok</span>
            </button>
            <button
              type="button"
              onClick={() => openAdminStockModal("prices")}
              className="rounded-md bg-white/10 px-2.5 py-1 text-[11px] font-bold text-primary hover:bg-white/20 transition cursor-pointer flex items-center gap-1"
              title="Atur harga jual setiap produk Halwa Bakery"
            >
              <Tag size={12} />
              <span>Ubah Harga</span>
              {Object.keys(customPrices).length > 0 && (
                <span className="ml-0.5 rounded-full bg-primary text-primary-foreground px-1 py-0.2 text-[9px] font-extrabold">
                  {Object.keys(customPrices).length}
                </span>
              )}
            </button>
            <button
              type="button"
              onClick={openPhotoManagerModal}
              className="rounded-md bg-white/10 px-2.5 py-1 text-[11px] font-bold text-primary hover:bg-white/20 transition cursor-pointer flex items-center gap-1"
            >
              <Camera size={12} />
              <span>Kelola Foto</span>
            </button>
            <button
              type="button"
              onClick={handleAdminLogout}
              className="text-[11px] text-red-300 hover:text-red-100 transition cursor-pointer flex items-center gap-1 ml-1.5 px-1 py-0.5"
              title="Keluar ke tampilan pembeli biasa"
            >
              <LogOut size={12} />
              <span>Keluar</span>
            </button>
          </div>
        </div>
      )}

      {/* Header (Status Paten - Fixed & Persistent on scroll with subtle bakery gradient) */}
      <header className={`fixed ${isAdmin ? "top-8" : "top-0"} left-0 right-0 z-40 w-full border-b border-border/70 bg-gradient-to-b from-[#EDE1CD]/95 via-[#F5ECE0]/95 to-[#F7F2E8]/95 backdrop-blur-md shadow-[0_4px_20px_-4px_rgba(90,54,35,0.06)] transition-all`}>
        <div className="mx-auto flex h-20 sm:h-24 max-w-7xl items-center justify-between px-5 lg:px-8">
          <a
            href="#beranda"
            className="flex items-center transition hover:opacity-90 py-1"
            aria-label="Halwa Bakery beranda"
            id="header-brand-logo"
          >
            <img
              src="/assets/halwa-logo.svg"
              onError={(event) => {
                event.currentTarget.onerror = null;
                event.currentTarget.src = halwaMark;
              }}
              width={200}
              height={75}
              alt="Logo Halwa Bakery"
              className="h-16 sm:h-20 w-auto object-contain transition-transform duration-300 hover:scale-105"
            />
          </a>

          <nav
            className="hidden items-center gap-8 text-sm font-semibold md:flex"
            aria-label="Navigasi utama"
          >
            {[
              ["Beranda", "#beranda"],
              ["Menu Roti", "#menu"],
              ["Keunggulan", "#keunggulan"],
              ["Cara Pesan", "#cara-pesan"],
              ["Lokasi Outlet", "#lokasi"],
              ["Testimoni", "#testimoni"],
            ].map(([label, href]) => (
              <a
                key={href}
                href={href}
                className="text-foreground/85 transition hover:text-primary"
              >
                {label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            {/* In-App PWA Install Button */}
            <PWAInstallButton />

            {isAdmin && spreadsheetId && (
              <button
                type="button"
                onClick={() => handleFetchStockFromSheets(true)}
                disabled={isSyncingSheets}
                className="hidden lg:inline-flex items-center gap-1.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-xs font-semibold text-emerald-800 hover:bg-emerald-500/20 transition cursor-pointer"
                title={`Terhubung ke Google Sheets. Terakhir sinkron: ${lastSyncTime || "Baru saja"}. Klik untuk perbarui.`}
              >
                <RefreshCw size={13} className={isSyncingSheets ? "animate-spin text-emerald-600" : "text-emerald-600"} />
                <span className="text-[11px] font-bold">Sheets Live</span>
              </button>
            )}

            {isAdmin && (
              <button
                type="button"
                onClick={openAdminStockModal}
                className="hidden sm:inline-flex items-center gap-1.5 rounded-xl border border-border/80 bg-card px-3 py-2 text-xs font-bold text-foreground shadow-xs hover:border-primary/50 hover:text-primary transition cursor-pointer"
                title="Buka Mode Pengelola / Admin Stok Roti"
              >
                <Boxes size={15} className="text-primary" />
                <span>Admin Stok</span>
              </button>
            )}

            <Button
              id="cart-drawer-trigger"
              aria-label={`Buka keranjang, ${totalItems} item`}
              onClick={() => setDrawerOpen(true)}
              className="relative h-11 w-11 rounded-xl bg-foreground text-primary-foreground transition hover:bg-primary"
            >
              <ShoppingBag size={19} />
              {totalItems > 0 && (
                <span className="absolute -right-1.5 -top-1.5 grid h-5 min-w-5 place-items-center rounded-full bg-primary px-1 text-[11px] font-extrabold text-primary-foreground shadow-xs">
                  {totalItems}
                </span>
              )}
            </Button>

            <Button
              id="mobile-menu-trigger"
              aria-label="Buka menu navigasi"
              onClick={() => setMobileNav((value) => !value)}
              className="h-11 w-11 border border-border bg-card text-foreground md:hidden"
            >
              {mobileNav ? <X size={20} /> : <Menu size={20} />}
            </Button>
          </div>
        </div>

        {mobileNav && (
          <nav className="grid gap-1 border-t border-border/70 bg-card/98 p-4 md:hidden shadow-lift animate-rise backdrop-blur-md">
            {[
              ["Beranda", "#beranda"],
              ["Menu Roti", "#menu"],
              ["Keunggulan", "#keunggulan"],
              ["Cara Pesan", "#cara-pesan"],
              ["Lokasi Outlet", "#lokasi"],
              ["Testimoni", "#testimoni"],
            ].map(([label, href]) => (
              <a
                key={href}
                href={href}
                onClick={() => setMobileNav(false)}
                className="rounded-xl px-4 py-3 text-sm font-semibold text-foreground/85 transition hover:bg-primary-soft hover:text-primary"
              >
                {label}
              </a>
            ))}
            {/* In-App PWA Install Button Mobile */}
            <div className="px-4 py-2">
              <PWAInstallButton />
            </div>

            {isAdmin && (
              <button
                type="button"
                onClick={() => {
                  setMobileNav(false);
                  openAdminStockModal();
                }}
                className="flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-bold text-primary hover:bg-primary-soft transition text-left cursor-pointer"
              >
                <Boxes size={16} />
                <span>Mode Pengelola (Admin Stok)</span>
              </button>
            )}
          </nav>
        )}
      </header>

      <div className="animate-rise">
        <main className="pt-20 sm:pt-24">
        {/* Hero Section */}
        <section
          id="beranda"
          className="relative scroll-mt-20 border-b border-border/60 overflow-hidden"
        >
          <div className="mx-auto grid max-w-7xl items-center gap-10 px-5 pt-6 pb-12 sm:pt-8 sm:pb-16 lg:grid-cols-[0.95fr_1.05fr] lg:px-8 lg:pt-10 lg:pb-20">
            <div className="relative z-10 max-w-2xl animate-rise">
              <div className="mb-5 flex flex-wrap items-center gap-2.5">
                <HalalCertificateBadge variant="pill" />
                <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary-soft px-3.5 py-1.5 text-xs font-bold text-foreground shadow-2xs">
                  <Flame className="text-primary" size={13} />
                  Dipanggang Hari Ini
                </span>
              </div>
              <h1 className="font-display text-5xl leading-[1.08] font-bold tracking-tight text-foreground sm:text-6xl lg:text-7xl">
                Kehangatan Roti Segar &amp;{" "}
                <span className="text-primary italic">Brownies</span> Setiap Hari
              </h1>
              <p className="mt-6 max-w-xl text-base leading-8 text-muted-foreground sm:text-lg">
                Dibuat dari bahan premium, 100% halal, dan selalu segar setiap
                hari. Hadirkan rasa rumahan yang istimewa di setiap gigitan.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-4">
                <a
                  href="#menu"
                  id="hero-order-cta"
                  className="inline-flex min-h-13 items-center justify-center gap-2 rounded-xl bg-primary px-7 text-base font-extrabold text-primary-foreground shadow-gold transition hover:-translate-y-0.5 hover:bg-primary-strong active:translate-y-0"
                >
                  Lihat Menu &amp; Pesan <ChevronRight size={18} />
                </a>
                <span className="text-sm font-semibold text-muted-foreground">
                  Mulai dari{" "}
                  <strong className="text-foreground font-bold">Rp 2.000</strong>
                </span>
              </div>
            </div>

            <div className="relative">
              <div
                onDragOver={(e) => {
                  if (!isAdmin) return;
                  e.preventDefault();
                  setIsDragging(true);
                }}
                onDragLeave={() => {
                  if (!isAdmin) return;
                  setIsDragging(false);
                }}
                onDrop={(e) => {
                  if (!isAdmin) return;
                  e.preventDefault();
                  setIsDragging(false);
                  const file = e.dataTransfer.files?.[0];
                  if (file) handleHeroFile(file);
                }}
                className={`group relative overflow-hidden rounded-2xl border bg-card shadow-soft transition-all duration-300 ${
                  isAdmin && isDragging
                    ? "border-primary ring-4 ring-primary/20 scale-[1.01]"
                    : "border-border"
                }`}
              >
                {isAdmin && (
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleHeroFile(file);
                    }}
                  />
                )}

                <img
                  src={heroImage}
                  onError={(event) => {
                    event.currentTarget.onerror = null;
                    event.currentTarget.src = heroFallback;
                  }}
                  width={1536}
                  height={1024}
                  alt="Aneka roti dan brownies segar Halwa Bakery"
                  className="aspect-[4/3] h-full w-full object-cover transition duration-700 hover:scale-102"
                />

                {/* Tombol Upload & Ganti Foto (Khusus Pengelola) */}
                {isAdmin && (
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute top-3.5 right-3.5 z-10 flex items-center gap-1.5 rounded-full bg-card/90 px-3.5 py-2 text-xs font-bold text-foreground shadow-soft backdrop-blur-md transition hover:bg-card hover:scale-105 active:scale-95 cursor-pointer"
                    title="Klik untuk memilih foto produk roti Halwa Bakery"
                  >
                    <Camera size={15} className="text-primary" />
                    <span>Ganti / Masukkan Foto</span>
                  </button>
                )}

                {isAdmin && isDragging && (
                  <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-foreground/80 text-primary-foreground backdrop-blur-xs p-6 text-center">
                    <Upload size={40} className="text-primary animate-bounce mb-3" />
                    <p className="font-display text-lg font-bold">Lepaskan Foto Roti di Sini</p>
                    <p className="text-xs text-primary-foreground/80 mt-1 max-w-xs">
                      Foto roti Halwa Bakery akan langsung dipasang di sini secara otomatis.
                    </p>
                  </div>
                )}
              </div>
              <div className="absolute -bottom-5 left-4 flex items-center gap-3.5 rounded-2xl border border-border bg-card px-5 py-3.5 shadow-soft sm:left-8">
                <div className="grid h-11 w-11 place-items-center rounded-xl bg-primary-soft text-primary shadow-xs">
                  <Flame size={22} />
                </div>
                <div>
                  <p className="text-xs font-semibold text-muted-foreground">
                    Dibuat setiap hari
                  </p>
                  <p className="font-display text-base font-bold text-foreground">
                    Fresh from the oven
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Keunggulan (Trust Badges) */}
        <section
          id="keunggulan"
          className="scroll-mt-20 bg-foreground text-primary-foreground"
        >
          <div className="mx-auto grid max-w-7xl grid-cols-2 divide-x divide-y divide-primary-foreground/10 px-3 sm:px-6 sm:grid-cols-4 sm:divide-y-0 lg:px-8">
            {trustBadges.map(({ icon: Icon, title, subtitle, isHalal }) => (
              <div
                key={title}
                onClick={isHalal ? () => setIsHalalDetailModalOpen(true) : undefined}
                className={`flex items-center gap-2.5 sm:gap-3.5 px-3.5 py-4 sm:px-5 sm:py-6 min-w-0 overflow-hidden ${
                  isHalal
                    ? "cursor-pointer hover:bg-white/5 active:bg-white/10 transition group select-none"
                    : ""
                }`}
                title={
                  isHalal
                    ? "Klik untuk melihat detail Sertifikat Halal resmi BPJPH Kemenag RI"
                    : undefined
                }
              >
                <div className="grid h-10 w-10 sm:h-11 sm:w-11 shrink-0 place-items-center rounded-xl bg-primary-foreground/10 text-primary transition group-hover:scale-105">
                  <Icon size={20} className="sm:w-[22px] sm:h-[22px]" />
                </div>
                <div className="min-w-0 flex-1 overflow-hidden">
                  <p className="text-xs sm:text-sm font-bold text-primary-foreground truncate leading-snug">
                    {title}
                  </p>
                  <p className="text-[11px] sm:text-xs text-primary-foreground/75 truncate mt-0.5 leading-snug">
                    {subtitle}
                  </p>
                  {isHalal && (
                    <span className="inline-flex items-center gap-1 text-[9px] sm:text-[10px] font-bold text-primary mt-0.5 group-hover:underline">
                      <span>Cek Sertifikat</span>
                      <span className="text-[8px]">↗</span>
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Halal Indonesia Official Banner */}
        <div className="px-5 pt-10 sm:pt-14 max-w-7xl mx-auto">
          <HalalCertificateBadge variant="banner" />
        </div>

        {/* Menu Section */}
        <section id="menu" className="scroll-mt-20 px-5 py-20 lg:px-8 lg:py-28">
          <div className="mx-auto max-w-7xl">
            <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
              <div>
                <p className="mb-2 text-xs font-extrabold uppercase tracking-[0.2em] text-primary">
                  Pilihan favorit
                </p>
                <h2 className="font-display text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
                  Menu yang baru dipanggang
                </h2>
                <p className="mt-3 max-w-xl text-base leading-7 text-muted-foreground">
                  Pilih teman terbaik untuk sarapan, waktu santai, atau buah
                  tangan bagi orang tersayang.
                </p>
              </div>

              {/* Category filter tabs & Photo Manager Button */}
              <div className="flex flex-wrap items-center gap-3">
                <div
                  className="flex overflow-x-auto rounded-2xl border border-border bg-card p-1.5 shadow-xs"
                  role="tablist"
                  aria-label="Filter kategori produk"
                >
                  {(["Semua", "Roti", "Brownies", "Kue"] as Category[]).map(
                    (item) => (
                      <button
                        key={item}
                        role="tab"
                        id={`tab-category-${item.toLowerCase()}`}
                        aria-selected={category === item}
                        onClick={() => setCategory(item)}
                        className={`min-h-10 shrink-0 rounded-xl px-5 text-sm font-bold transition cursor-pointer ${
                          category === item
                            ? "bg-foreground text-primary-foreground shadow-xs"
                            : "text-muted-foreground hover:bg-muted hover:text-foreground"
                        }`}
                      >
                        {item}
                      </button>
                    )
                  )}
                </div>

                {isAdmin && (
                  <button
                    type="button"
                    onClick={() => setIsAddProductModalOpen(true)}
                    className="inline-flex min-h-11 items-center gap-2 rounded-2xl bg-primary px-4.5 text-xs font-bold text-primary-foreground shadow-gold transition hover:bg-primary-strong active:scale-95 cursor-pointer"
                    title="Tambah varian produk roti atau kue baru"
                  >
                    <Plus size={16} />
                    <span>Tambah Varian Baru</span>
                  </button>
                )}

                {isAdmin && (
                  <button
                    type="button"
                    onClick={openPhotoManagerModal}
                    className="inline-flex min-h-11 items-center gap-2 rounded-2xl border border-primary/40 bg-primary-soft px-4 text-xs font-bold text-primary-strong shadow-xs transition hover:bg-primary-soft/80 active:scale-95 cursor-pointer"
                    title="Buka panel kelola foto untuk setiap roti"
                  >
                    <Camera size={16} />
                    <span>Kelola Foto Menu</span>
                    {Object.keys(productImages).length > 0 && (
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-extrabold text-primary-foreground">
                        {Object.keys(productImages).length}
                      </span>
                    )}
                  </button>
                )}

                {isAdmin && (
                  <button
                    type="button"
                    onClick={() => openAdminStockModal("manual")}
                    className="inline-flex min-h-11 items-center gap-2 rounded-2xl border border-border bg-card px-4 text-xs font-bold text-foreground shadow-xs transition hover:bg-muted hover:border-primary/50 active:scale-95 cursor-pointer"
                    title="Buka panel manajemen stok roti"
                  >
                    <Boxes size={16} className="text-primary" />
                    <span>Admin Stok</span>
                  </button>
                )}

                {isAdmin && (
                  <button
                    type="button"
                    onClick={() => openAdminStockModal("prices")}
                    className="inline-flex min-h-11 items-center gap-2 rounded-2xl border border-border bg-card px-4 text-xs font-bold text-foreground shadow-xs transition hover:bg-muted hover:border-primary/50 active:scale-95 cursor-pointer"
                    title="Buka panel penyesuaian harga jual produk"
                  >
                    <Tag size={16} className="text-primary" />
                    <span>Ubah Harga</span>
                    {Object.keys(customPrices).length > 0 && (
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-extrabold text-primary-foreground">
                        {Object.keys(customPrices).length}
                      </span>
                    )}
                  </button>
                )}
              </div>
            </div>

            {/* Product Cards Grid */}
            <div className="mt-12 grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
              {visibleProducts.map((product) => {
                const quantity = cart[product.id] ?? 0;
                const currentStock = stock[product.id] ?? product.stock ?? 0;
                const isOutOfStock = currentStock <= 0;
                const isLowStock = currentStock > 0 && currentStock <= 5;
                const isCartMax = quantity >= currentStock;
                const currentImage = productImages[product.id] || product.image;
                const hasCustomPhoto = Boolean(productImages[product.id]);
                const isDraggingThis = dragOverCardId === product.id;

                return (
                  <article
                    key={product.id}
                    id={`product-card-${product.id}`}
                    className={`group flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-soft transition duration-300 hover:-translate-y-1 hover:shadow-lift ${
                      isOutOfStock ? "opacity-80 grayscale-[30%] border-border/80" : ""
                    }`}
                  >
                    <div
                      onDragOver={(e) => {
                        if (!isAdmin) return;
                        e.preventDefault();
                        setDragOverCardId(product.id);
                      }}
                      onDragLeave={() => {
                        if (!isAdmin) return;
                        setDragOverCardId(null);
                      }}
                      onDrop={async (e) => {
                        if (!isAdmin) return;
                        e.preventDefault();
                        setDragOverCardId(null);
                        const file = e.dataTransfer.files?.[0];
                        if (file && file.type.startsWith("image/")) {
                          const compressed = await compressImageFile(file, 800, 0.85);
                          if (compressed) {
                            saveProductImage(product.id, compressed);
                            setUploadingProductIds((prev) => ({ ...prev, [product.id]: true }));
                            try {
                              const { url } = await uploadProductImageToFirebase(product.id, compressed);
                              saveProductImage(product.id, url);
                              setFirebaseStatusMsg({
                                type: "success",
                                text: `Foto ${product.name} berhasil disimpan ke Firebase Cloud Storage!`,
                              });
                            } catch (err) {
                              console.warn("Firebase Storage direct drop notice:", err);
                            } finally {
                              setUploadingProductIds((prev) => ({ ...prev, [product.id]: false }));
                            }
                          }
                        }
                      }}
                      className={`relative overflow-hidden bg-muted aspect-square transition-all duration-300 ${
                        isAdmin && isDraggingThis ? "ring-4 ring-primary scale-[1.01]" : ""
                      }`}
                    >
                      <img
                        src={currentImage}
                        onError={(event) => {
                          event.currentTarget.onerror = null;
                          event.currentTarget.src =
                            defaultProductImages[product.id] ||
                            productFallbackImage(
                              product.name,
                              product.category
                            );
                        }}
                        alt={product.name}
                        loading="lazy"
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                      />
                      <div className="absolute left-3.5 top-3.5 z-10 inline-flex items-center gap-1.5 rounded-full border border-border/50 bg-card/95 px-3 py-1.5 text-[11px] font-extrabold text-foreground shadow-xs backdrop-blur-xs">
                        <ShieldCheck className="text-primary" size={14} />
                        100% HALAL
                      </div>

                      {/* Firebase Storage Badge (Admin Info) */}
                      {isAdmin && hasCustomPhoto && isFirebaseImageUrl(currentImage) && (
                        <div className="absolute bottom-3 left-3 z-10 inline-flex items-center gap-1 rounded-full bg-emerald-700/90 text-white px-2.5 py-1 text-[10px] font-bold shadow-xs backdrop-blur-xs">
                          <Cloud size={11} />
                          <span>Firebase</span>
                        </div>
                      )}

                      {/* Out of Stock Overlay */}
                      {isOutOfStock && (
                        <div className="absolute inset-0 z-20 flex items-center justify-center bg-foreground/40 backdrop-blur-[2px]">
                          <div className="rounded-2xl border border-white/20 bg-destructive/95 px-4 py-2 text-center text-xs font-black uppercase tracking-wider text-destructive-foreground shadow-lift">
                            Stok Kosong / Habis
                          </div>
                        </div>
                      )}

                      {/* Tombol Upload / Ganti Foto Roti (Khusus Pengelola) */}
                      {isAdmin && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            triggerUploadForProduct(product.id);
                          }}
                          disabled={uploadingProductIds[product.id]}
                          className="absolute top-3.5 right-3.5 z-10 flex items-center gap-1.5 rounded-full bg-card/90 px-3 py-1.5 text-xs font-bold text-foreground shadow-soft backdrop-blur-md transition hover:bg-card hover:scale-105 active:scale-95 cursor-pointer disabled:opacity-75"
                          title={`Upload / ganti foto untuk ${product.name}`}
                        >
                          {uploadingProductIds[product.id] ? (
                            <>
                              <RefreshCw size={13} className="animate-spin text-primary" />
                              <span>Mengunggah...</span>
                            </>
                          ) : (
                            <>
                              <Camera size={13} className="text-primary" />
                              <span>{hasCustomPhoto ? "Ganti Foto" : "Isi Foto"}</span>
                            </>
                          )}
                        </button>
                      )}

                      {isAdmin && isDraggingThis && (
                        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-foreground/80 p-4 text-center text-primary-foreground backdrop-blur-xs">
                          <Upload size={32} className="mb-2 animate-bounce text-primary" />
                          <p className="font-display text-sm font-bold">Lepaskan Foto Roti</p>
                          <p className="mt-1 text-xs text-primary-foreground/80">
                            Pasang foto untuk {product.name}
                          </p>
                        </div>
                      )}
                    </div>

                    <div className="flex flex-1 flex-col p-6">
                      <div className="mb-3 flex items-start justify-between gap-3">
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-[11px] font-extrabold uppercase tracking-[0.18em] text-primary">
                              {product.category}
                            </span>

                            {customProducts.some((cp) => cp.id === product.id) && (
                              <span className="inline-flex items-center gap-1 rounded-full bg-primary/15 px-2 py-0.5 text-[10px] font-extrabold text-primary">
                                <Sparkles size={10} />
                                <span>Varian Baru</span>
                              </span>
                            )}

                            {isAdmin && customProducts.some((cp) => cp.id === product.id) && (
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeleteProduct(product.id, product.name);
                                }}
                                className="inline-flex items-center gap-1 rounded-lg border border-destructive/30 bg-destructive/10 px-2 py-0.5 text-[10px] font-bold text-destructive hover:bg-destructive hover:text-white transition cursor-pointer"
                                title={`Hapus varian ${product.name}`}
                              >
                                <Trash2 size={11} />
                                <span>Hapus</span>
                              </button>
                            )}

                            {/* Badge Sisa Stok */}
                            {isOutOfStock ? (
                              <span className="inline-flex items-center gap-1 rounded-full bg-destructive/15 px-2.5 py-0.5 text-[10px] font-bold text-destructive">
                                <AlertCircle size={11} />
                                <span>Habis</span>
                              </span>
                            ) : isLowStock ? (
                              <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/15 px-2.5 py-0.5 text-[10px] font-bold text-amber-700">
                                <Flame size={11} className="text-amber-600" />
                                <span>Sisa sedikit: {currentStock} pcs</span>
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 px-2.5 py-0.5 text-[10px] font-bold text-emerald-700">
                                <Check size={11} className="text-emerald-600" />
                                <span>Sisa: {currentStock} pcs</span>
                              </span>
                            )}
                          </div>

                          <h3 className="mt-1 font-display text-2xl font-bold tracking-tight text-foreground">
                            {product.name}
                          </h3>
                        </div>
                        <div className="flex items-center gap-1.5 shrink-0">
                          <span
                            className={`rounded-xl px-3 py-1.5 text-sm font-extrabold transition ${
                              customPrices[product.id]
                                ? "bg-primary text-primary-foreground shadow-2xs"
                                : "bg-primary-soft text-primary-strong"
                            }`}
                            title={
                              customPrices[product.id]
                                ? `Harga diatur khusus oleh pengelola (Harga standar: ${formatPrice(getDefaultPrice(product.id))})`
                                : undefined
                            }
                          >
                            {formatPrice(product.price)}
                          </span>
                          {isAdmin && (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setEditingPriceProduct(product);
                              }}
                              className="grid h-8 w-8 place-items-center rounded-xl border border-primary/30 bg-background text-primary shadow-2xs hover:bg-primary hover:text-white transition cursor-pointer"
                              title={`Ubah harga jual ${product.name}`}
                              aria-label={`Ubah harga jual ${product.name}`}
                            >
                              <Edit3 size={13} />
                            </button>
                          )}
                        </div>
                      </div>

                      <p className="min-h-12 flex-1 text-sm leading-6 text-muted-foreground">
                        {product.description}
                      </p>

                      <div className="mt-6 pt-4 border-t border-border/60">
                        {isOutOfStock ? (
                          <Button
                            disabled
                            className="w-full bg-muted text-muted-foreground border border-border cursor-not-allowed shadow-none"
                          >
                            <AlertCircle size={17} />
                            Stok Kosong
                          </Button>
                        ) : quantity === 0 ? (
                          <Button
                            id={`add-to-cart-${product.id}`}
                            onClick={() => updateQuantity(product.id, 1)}
                            className="w-full bg-primary text-primary-foreground shadow-gold hover:bg-primary-strong active:scale-98"
                          >
                            <ShoppingBag size={17} />
                            Tambah ke Keranjang
                          </Button>
                        ) : (
                          <div className="space-y-1.5">
                            <Quantity
                              quantity={quantity}
                              disablePlus={isCartMax}
                              onMinus={() => updateQuantity(product.id, -1)}
                              onPlus={() => updateQuantity(product.id, 1)}
                            />
                            {isCartMax && (
                              <p className="text-center text-[11px] font-semibold text-amber-700">
                                Maksimal stok tercapai ({currentStock} pcs)
                              </p>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        {/* Cara Pesan (3 Simple Steps) */}
        <section
          id="cara-pesan"
          className="scroll-mt-20 border-y border-border bg-card py-20"
        >
          <div className="mx-auto max-w-7xl px-5 lg:px-8">
            <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
              <div>
                <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-primary">
                  Mudah &amp; cepat
                </p>
                <h2 className="mt-2 font-display text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
                  Tiga langkah menuju camilan favorit
                </h2>
                <p className="mt-4 text-base text-muted-foreground leading-relaxed">
                  Nikmati pengalaman memesan roti hangat tanpa ribet, langsung
                  terhubung dengan tim kami via WhatsApp.
                </p>
              </div>

              <ol className="grid gap-6 sm:grid-cols-3">
                {[
                  [
                    "01",
                    "Pilih menu",
                    "Masukkan roti dan kue favorit ke keranjang belanja.",
                  ],
                  [
                    "02",
                    "Lengkapi pesanan",
                    "Isi nama pemesan serta pilih metode ambil di toko atau kurir.",
                  ],
                  [
                    "03",
                    "Kirim WhatsApp",
                    "Konfirmasi pesanan langsung dengan layanan ramah Halwa.",
                  ],
                ].map(([number, title, text]) => (
                  <li
                    key={number}
                    className="rounded-2xl border border-border bg-card p-6 shadow-soft transition hover:border-primary/50"
                  >
                    <span className="font-display text-3xl font-bold text-primary">
                      {number}
                    </span>
                    <h3 className="mt-3 text-lg font-bold text-foreground">{title}</h3>
                    <p className="mt-1.5 text-sm leading-6 text-muted-foreground">
                      {text}
                    </p>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </section>

        {/* Outlet Location & Google Maps Embed */}
        <OutletLocationSection />

        {/* Customer Reviews & Testimonials Section */}
        <TestimonialsSection />
      </main>

      {/* Single, Clean Footer */}
      <footer className="bg-foreground text-primary-foreground">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 py-14 sm:grid-cols-2 lg:grid-cols-[1.2fr_1.1fr_1fr_1fr] lg:px-8">
          <div>
            <div className="flex items-center">
              <img
                src="/assets/halwa-logo-light.svg"
                onError={(event) => {
                  event.currentTarget.onerror = null;
                  event.currentTarget.src = halwaMark;
                }}
                width={220}
                height={80}
                loading="lazy"
                alt="Logo Halwa Bakery"
                className="h-18 sm:h-22 w-auto object-contain"
              />
            </div>
            <p className="mt-4 max-w-sm text-sm leading-6 text-primary-foreground/70">
              Roti artisan dan camilan penuh kehangatan, dibuat segar setiap hari
              untuk melengkapi momen istimewa Anda dan keluarga.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-extrabold uppercase tracking-wider text-primary">
              Sertifikasi Halal Resmi
            </h3>
            <div className="mt-4">
              <HalalCertificateBadge variant="compact" />
            </div>
            <p className="mt-2.5 text-xs leading-relaxed text-primary-foreground/70">
              Terdaftar resmi di BPJPH Kementerian Agama RI. Jaminan 100% halal dan higienis.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-extrabold uppercase tracking-wider text-primary">
              Outlet &amp; Lokasi
            </h3>
            <p className="mt-4 flex items-start gap-2.5 text-xs sm:text-sm text-primary-foreground/80 leading-relaxed">
              <MapPin size={18} className="shrink-0 text-primary mt-0.5" />
              <span>{OUTLET_ADDRESS}</span>
            </p>
            <div className="mt-2.5 pl-7">
              <a
                href={GOOGLE_MAPS_SHORT_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:underline"
              >
                <span>Buka di Google Maps</span>
                <ExternalLink size={12} />
              </a>
            </div>
            <div className="mt-5 flex items-center gap-2.5 text-xs sm:text-sm text-primary-foreground/85">
              <Store size={18} className="shrink-0 text-primary" />
              <span>
                <span className="font-semibold text-primary-foreground">Setiap Hari:</span>{" "}
                <span className="text-primary-foreground/80">08.00 – 20.00 WITA</span>
              </span>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-extrabold uppercase tracking-wider text-primary">
              Hubungi Kami
            </h3>
            <a
              href="https://wa.me/6285822767417"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex items-center gap-2.5 text-sm text-primary-foreground/80 transition hover:text-primary"
              aria-label="WhatsApp 0858 2276 7417"
            >
              <WhatsAppIcon size={18} className="text-primary shrink-0" />
              <span>0858 2276 7417</span>
            </a>
            <a
              href="https://instagram.com/halwa.bakery__"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 flex items-center gap-2.5 text-sm text-primary-foreground/80 transition hover:text-primary"
            >
              <Instagram size={18} className="text-primary" />
              <span>@halwa.bakery__</span>
            </a>
          </div>
        </div>

        <div className="border-t border-primary-foreground/10 py-6 px-5 max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-primary-foreground/50">
          <span>© 2026 Halwa Bakery. Dibuat hangat, dinikmati bersama.</span>
          {isAdmin ? (
            <div className="flex items-center gap-2">
              <span className="text-emerald-400 font-semibold flex items-center gap-1 text-[11px]">
                <ShieldCheck size={13} /> Pengelola Aktif
              </span>
              <button
                type="button"
                onClick={openAdminStockModal}
                className="inline-flex items-center gap-1.5 rounded-lg border border-primary/40 bg-primary/10 px-2.5 py-1 text-primary hover:bg-primary/20 transition cursor-pointer text-xs"
              >
                <Boxes size={13} />
                <span>Admin Stok</span>
              </button>
              <button
                type="button"
                onClick={handleAdminLogout}
                className="text-primary-foreground/40 hover:text-red-300 transition cursor-pointer text-xs ml-1"
                title="Keluar ke tampilan pembeli biasa"
              >
                Keluar
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setIsAdminAuthModalOpen(true)}
              className="inline-flex items-center gap-1.5 text-[11px] text-primary-foreground/30 hover:text-primary-foreground/80 transition cursor-pointer"
              title="Akses khusus pemilik Halwa Bakery"
            >
              <Lock size={12} />
              <span>Akses Pengelola</span>
            </button>
          )}
        </div>
      </footer>
      </div>

      {/* Floating Cart Button (Mobile) - terletak rapi di atas shortcut WhatsApp jika ada item belanja */}
      {totalItems > 0 && (
        <Button
          id="floating-cart-btn"
          onClick={() => setDrawerOpen(true)}
          aria-label={`Buka keranjang, ${totalItems} item`}
          className="fixed bottom-23 right-6 z-40 h-14 w-14 rounded-full bg-primary text-primary-foreground shadow-lift hover:bg-primary-strong md:hidden animate-fade-in"
        >
          <ShoppingBag size={22} />
          <span className="absolute -right-1 -top-1 grid h-6 min-w-6 place-items-center rounded-full bg-foreground px-1 text-xs font-bold text-primary-foreground shadow-md">
            {totalItems}
          </span>
        </Button>
      )}

      {/* PWA Offline Connectivity Indicator */}
      <OfflineIndicator />

      {/* Floating WhatsApp Shortcut Button (Pojok Kanan Bawah) */}
      <FloatingWhatsApp />

      {/* Cart Drawer Modal */}
      {drawerOpen && (
        <div
          className="fixed inset-0 z-50 flex justify-end"
          role="dialog"
          aria-modal="true"
          aria-label="Keranjang belanja"
        >
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-overlay backdrop-blur-xs transition-opacity"
            aria-label="Tutup keranjang"
            onClick={() => setDrawerOpen(false)}
          />

          {/* Drawer Sidebar / Modal */}
          <aside
            id="cart-drawer"
            className="relative z-10 flex h-full w-full max-w-md animate-slide-left flex-col bg-card shadow-soft sm:m-4 sm:h-[calc(100svh-2rem)] sm:rounded-2xl sm:border sm:border-border"
          >
            {/* Drawer Header */}
            <div className="flex items-center justify-between border-b border-border px-6 py-5">
              <div>
                <h2 className="font-display text-2xl font-bold text-foreground">
                  Keranjang Anda
                </h2>
                <p className="text-xs font-semibold text-muted-foreground">
                  {totalItems} item dipilih
                </p>
              </div>
              <Button
                id="close-cart-btn"
                aria-label="Tutup keranjang"
                onClick={() => setDrawerOpen(false)}
                className="h-10 w-10 min-h-0 rounded-xl bg-muted text-foreground hover:bg-border"
              >
                <X size={20} />
              </Button>
            </div>

            {/* Drawer Body */}
            <div className="flex-1 overflow-y-auto px-6 py-6">
              {cartItems.length === 0 ? (
                <div className="grid min-h-80 place-items-center text-center">
                  <div className="max-w-xs">
                    <div className="mx-auto grid h-18 w-18 place-items-center rounded-2xl bg-primary-soft text-primary shadow-xs">
                      <ShoppingBag size={30} />
                    </div>
                    <h3 className="mt-5 font-display text-2xl font-bold text-foreground">
                      Keranjang masih kosong
                    </h3>
                    <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                      Pilih aneka roti dan brownies hangat favorit Anda dari menu.
                    </p>
                    <Button
                      onClick={() => setDrawerOpen(false)}
                      className="mt-6 bg-primary px-6 text-primary-foreground shadow-gold hover:bg-primary-strong"
                    >
                      Lihat Menu Roti
                    </Button>
                  </div>
                </div>
              ) : (
                <>
                  {/* Cart Item List */}
                  <div className="space-y-4">
                    {cartItems.map((item) => {
                      const itemStock = stock[item.id] ?? item.stock ?? 0;
                      const itemQty = cart[item.id] ?? 0;
                      const isItemMax = itemQty >= itemStock;

                      return (
                        <div
                          key={item.id}
                          id={`cart-item-${item.id}`}
                          className="grid grid-cols-[72px_1fr_auto] gap-3.5 rounded-2xl border border-border bg-card p-3.5 shadow-soft"
                        >
                          <img
                            src={productImages[item.id] || item.image}
                            onError={(event) => {
                              event.currentTarget.onerror = null;
                              event.currentTarget.src =
                                defaultProductImages[item.id] ||
                                productFallbackImage(
                                  item.name,
                                  item.category
                                );
                            }}
                            alt={item.name}
                            className="h-18 w-18 rounded-xl object-cover"
                          />
                          <div className="flex flex-col justify-between">
                            <div>
                              <h3 className="text-sm font-bold text-foreground leading-snug">
                                {item.name}
                              </h3>
                              <p className="mt-0.5 text-xs font-extrabold text-primary">
                                {formatPrice(item.price * itemQty)}
                              </p>
                              <p className="text-[10px] text-muted-foreground mt-0.5">
                                {isItemMax ? (
                                  <span className="font-bold text-amber-700">Maks. stok tercapai ({itemStock} pcs)</span>
                                ) : (
                                  <span>Tersedia: {itemStock} pcs</span>
                                )}
                              </p>
                            </div>
                            <div className="mt-2">
                              <Quantity
                                compact
                                quantity={itemQty}
                                disablePlus={isItemMax}
                                onMinus={() => updateQuantity(item.id, -1)}
                                onPlus={() => updateQuantity(item.id, 1)}
                              />
                            </div>
                          </div>

                          <div className="flex items-start">
                            <Button
                              id={`remove-item-${item.id}`}
                              aria-label={`Hapus ${item.name}`}
                              onClick={() =>
                                setCart((current) => {
                                  const next = { ...current };
                                  delete next[item.id];
                                  return next;
                                })
                              }
                              className="h-9 w-9 min-h-0 rounded-xl bg-muted text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                            >
                              <Trash2 size={16} />
                            </Button>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Summary */}
                  <div className="mt-6 rounded-2xl border border-border bg-card p-5 shadow-soft">
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>Subtotal</span>
                      <span className="font-semibold text-foreground">{formatPrice(total)}</span>
                    </div>
                    <div className="mt-3 flex justify-between border-t border-border pt-3 font-display text-lg font-bold text-foreground">
                      <span>Total Pembayaran</span>
                      <span className="text-primary-strong">{formatPrice(total)}</span>
                    </div>
                  </div>

                  {/* Checkout Form */}
                  <div className="mt-6 space-y-5">
                    <label className="block">
                      <span className="mb-2 block text-sm font-bold text-foreground">
                        Nama Pemesan <span className="text-destructive">*</span>
                      </span>
                      <input
                        id="checkout-name"
                        value={name}
                        onChange={(event) => setName(event.target.value)}
                        placeholder="Contoh: Budi Santoso"
                        className="h-12 w-full rounded-2xl border border-border bg-background px-4 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                      />
                    </label>

                    <fieldset>
                      <legend className="mb-2.5 text-sm font-bold text-foreground">
                        Metode Pengambilan / Pengiriman
                      </legend>
                      <div className="space-y-2.5">
                        {[
                          "Ambil Langsung di Toko",
                          "Pengiriman Kurir Pribadi Halwa",
                        ].map((option) => (
                          <label
                            key={option}
                            className={`flex cursor-pointer items-center gap-3.5 rounded-2xl border p-3.5 transition ${
                              delivery === option
                                ? "border-primary bg-primary-soft text-foreground font-bold shadow-xs"
                                : "border-border bg-card text-foreground/80 hover:bg-muted"
                            }`}
                          >
                            <input
                              type="radio"
                              name="delivery"
                              value={option}
                              checked={delivery === option}
                              onChange={() =>
                                setDelivery(option as typeof delivery)
                              }
                              className="h-4 w-4 accent-primary"
                            />
                            <span className="text-sm font-semibold">
                              {option}
                            </span>
                          </label>
                        ))}
                      </div>
                    </fieldset>

                    {delivery === "Ambil Langsung di Toko" ? (
                      <div className="space-y-4">
                        <div className="flex items-start gap-3 rounded-2xl border border-primary/20 bg-primary-soft/60 p-4">
                          <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-card text-primary shadow-xs">
                            <Store size={18} />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-bold text-foreground">
                              Ambil Langsung di Toko (Pickup)
                            </p>
                            <p className="mt-1 text-xs leading-relaxed text-foreground/80">
                              Pesanan akan disiapkan di toko Halwa Bakery dan siap diambil saat selesai dipanggang.
                            </p>
                            <div className="mt-2.5 rounded-xl bg-background/90 p-3 text-xs border border-border/80">
                              <span className="font-bold text-primary block">Alamat Pengambilan:</span>
                              <span className="text-foreground font-medium block mt-0.5">{OUTLET_ADDRESS}</span>
                              <a
                                href={GOOGLE_MAPS_SHORT_URL}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 text-primary font-bold hover:underline mt-1.5"
                              >
                                <MapPin size={12} />
                                <span>Petunjuk Arah Google Maps</span>
                                <ExternalLink size={11} />
                              </a>
                            </div>
                          </div>
                        </div>

                        <label className="block">
                          <span className="mb-2 block text-sm font-semibold text-foreground">
                            Catatan Tambahan (Opsional)
                          </span>
                          <input
                            id="checkout-pickup-notes"
                            value={notes}
                            onChange={(event) => setNotes(event.target.value)}
                            placeholder="Contoh: Perkiraan jam pengambilan / permintaan khusus..."
                            className="h-12 w-full rounded-2xl border border-border bg-background px-4 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                          />
                        </label>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <label className="block">
                          <span className="mb-2 block text-sm font-bold text-foreground">
                            Alamat Pengiriman Lengkap{" "}
                            <span className="text-destructive">*</span>
                          </span>
                          <textarea
                            id="checkout-address"
                            value={address}
                            onChange={(event) => setAddress(event.target.value)}
                            rows={3}
                            placeholder="Tuliskan alamat lengkap beserta nomor rumah / patokan pengiriman..."
                            className="w-full resize-none rounded-2xl border border-border bg-background p-4 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                          />
                        </label>

                        <label className="block">
                          <span className="mb-2 block text-sm font-semibold text-foreground">
                            Catatan untuk Kurir (Opsional)
                          </span>
                          <input
                            id="checkout-courier-notes"
                            value={notes}
                            onChange={(event) => setNotes(event.target.value)}
                            placeholder="Contoh: Titip di satpam / pagar rumah hitam..."
                            className="h-12 w-full rounded-2xl border border-border bg-background px-4 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                          />
                        </label>
                      </div>
                    )}

                    {/* Pilihan Metode Pembayaran Bersih (QRIS & Tunai) */}
                    <PaymentLogos
                      className="mt-5"
                      selectedMethod={paymentMethod}
                      onSelectMethod={setPaymentMethod}
                    />
                  </div>
                </>
              )}
            </div>

            {/* Drawer Footer with Checkout CTA */}
            {cartItems.length > 0 && (
              <div className="border-t border-border bg-card p-5">
                {error && (
                  <p
                    role="alert"
                    className="mb-3 rounded-2xl bg-destructive-soft px-4 py-2.5 text-xs font-semibold text-destructive animate-rise"
                  >
                    {error}
                  </p>
                )}
                <Button
                  id="submit-order-whatsapp"
                  onClick={checkout}
                  className="w-full rounded-2xl bg-whatsapp px-5 text-whatsapp-foreground shadow-soft hover:brightness-95 active:scale-[0.99]"
                >
                  Lanjut Pemesanan via WhatsApp <ChevronRight size={18} />
                </Button>
                <p className="mt-2 text-center text-[11px] text-muted-foreground">
                  Format pesanan akan otomatis terbuat di chat WhatsApp
                </p>
              </div>
            )}
          </aside>
        </div>
      )}

      {/* Hidden file input for product photo upload */}
      <input
        type="file"
        ref={productFileInputRef}
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleProductFileInput(file);
        }}
      />

      {/* Modal Kelola Foto Menu Roti */}
      {isPhotoManagerOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="photo-manager-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-foreground/50 backdrop-blur-xs animate-fade-in"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-3xl border border-border bg-card shadow-lift"
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-border p-5 sm:p-6">
              <div className="flex items-center gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-2xl bg-primary-soft text-primary shadow-xs">
                  <Camera size={20} />
                </div>
                <div>
                  <h2 id="photo-manager-title" className="font-display text-xl font-bold text-foreground">
                    Kelola Foto Menu Roti
                  </h2>
                  <p className="text-xs text-muted-foreground">
                    Upload foto asli roti Anda dari perangkat atau gunakan link gambar
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setIsPhotoManagerOpen(false);
                  setUrlInputProductId(null);
                }}
                className="grid h-9 w-9 place-items-center rounded-xl text-muted-foreground hover:bg-muted hover:text-foreground transition cursor-pointer"
                aria-label="Tutup"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4">
              {/* Card Firebase Cloud Storage */}
              <div className="rounded-2xl border border-primary/40 bg-gradient-to-br from-primary-soft/60 to-background p-4 sm:p-5 shadow-xs space-y-3.5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <Cloud className="text-primary shrink-0" size={18} />
                      <span className="font-display text-sm font-bold text-foreground">
                        Firebase Cloud Storage
                      </span>
                      <span className="rounded-full bg-emerald-500/15 px-2.5 py-0.5 text-[10px] font-extrabold text-emerald-700 dark:text-emerald-400">
                        CDN Cloud Aktif
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed max-w-xl">
                      Foto roti Anda disimpan di Google Firebase Storage ({storageBucket}) sehingga dapat diakses secara publik dan cepat oleh teman dan pelanggan di domain website Anda.
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={uploadAllPhotosToFirebaseStorage}
                      disabled={isUploadingAllToFirebase || isPublishingPhotos}
                      className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-xs font-bold text-primary-foreground shadow-gold hover:bg-primary-strong active:scale-95 transition cursor-pointer disabled:opacity-60 shrink-0 min-h-10"
                    >
                      {isUploadingAllToFirebase ? (
                        <RefreshCw size={14} className="animate-spin" />
                      ) : (
                        <CloudUpload size={15} />
                      )}
                      <span>
                        {isUploadingAllToFirebase
                          ? "Menyimpan ke Firebase..."
                          : "Unggah Semua ke Firebase Storage"}
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={pushAllPhotosToServer}
                      disabled={isPublishingPhotos || isUploadingAllToFirebase}
                      className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-border bg-card px-3.5 py-2.5 text-xs font-semibold text-foreground hover:bg-muted active:scale-95 transition cursor-pointer disabled:opacity-60 shrink-0 min-h-10"
                      title="Sinkronkan foto ke server toko"
                    >
                      <RefreshCw size={13} className={isPublishingPhotos ? "animate-spin" : ""} />
                      <span>{isPublishingPhotos ? "Sinkron..." : "Sinkron Server"}</span>
                    </button>
                  </div>
                </div>

                {/* Progress Bar Upload Firebase */}
                {isUploadingAllToFirebase && firebaseUploadProgress && (
                  <div className="rounded-xl bg-card border border-primary/30 p-3 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-foreground flex items-center gap-1.5">
                        <RefreshCw size={12} className="animate-spin text-primary" />
                        Mengunggah: {firebaseUploadProgress.name || "Foto"}
                      </span>
                      <span className="font-mono text-[11px] font-bold text-primary">
                        {firebaseUploadProgress.current} / {firebaseUploadProgress.total} foto
                      </span>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                      <div
                        className="h-full bg-primary transition-all duration-300"
                        style={{
                          width: `${(firebaseUploadProgress.current / firebaseUploadProgress.total) * 100}%`,
                        }}
                      />
                    </div>
                  </div>
                )}

                {/* Status / Notifikasi Firebase */}
                {firebaseStatusMsg && (
                  <div
                    className={`flex items-center gap-2.5 rounded-2xl px-4 py-3 text-xs font-bold shadow-soft transition-all ${
                      firebaseStatusMsg.type === "success"
                        ? "bg-emerald-600 text-white"
                        : firebaseStatusMsg.type === "error"
                        ? "bg-destructive text-destructive-foreground"
                        : "bg-primary text-primary-foreground"
                    }`}
                  >
                    {firebaseStatusMsg.type === "success" ? (
                      <CheckCircle2 size={18} className="shrink-0" />
                    ) : (
                      <AlertCircle size={18} className="shrink-0" />
                    )}
                    <span>{firebaseStatusMsg.text}</span>
                  </div>
                )}

                {publishToastMsg && !firebaseStatusMsg && (
                  <div className="flex items-center gap-2.5 rounded-2xl bg-emerald-600 px-4 py-3 text-xs font-bold text-white shadow-soft transition-all">
                    <CheckCircle2 size={18} className="shrink-0" />
                    <span>{publishToastMsg}</span>
                  </div>
                )}

                {/* Ringkasan Status Gambar */}
                <div className="flex items-center gap-3 pt-1 text-[11px] text-muted-foreground flex-wrap">
                  <div className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-emerald-500" />
                    <span>
                      Server Website (Publik):{" "}
                      <strong className="text-foreground">8 foto asli</strong> (Dapat Dilihat Semua Pengunjung)
                    </span>
                  </div>
                  {products.some((p) => isFirebaseImageUrl(productImages[p.id])) && (
                    <>
                      <span className="text-border">•</span>
                      <div className="flex items-center gap-1.5">
                        <span className="h-2 w-2 rounded-full bg-blue-500" />
                        <span>
                          Firebase Storage CDN:{" "}
                          <strong className="text-foreground">
                            {
                              products.filter((p) => isFirebaseImageUrl(productImages[p.id]))
                                .length + (isFirebaseImageUrl(heroImage) ? 1 : 0)
                            }
                          </strong>{" "}
                          aset
                        </span>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Banner Penjelasan Foto Asli Publik */}
              <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-3.5 text-xs text-foreground/90 flex items-start gap-3">
                <ShieldCheck size={18} className="text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-emerald-900 dark:text-emerald-200">
                    Foto Roti Asli Halwa Bakery Otomatis Tampil untuk Semua Pengunjung
                  </p>
                  <p className="mt-0.5 text-foreground/80 leading-relaxed">
                    Ke-8 foto (Foto Banner + 7 Produk Roti Asli) telah tersimpan permanen sebagai aset resmi website Halwa Bakery. Siapapun yang membuka link website Anda di HP, tablet, atau laptop manapun <strong>langsung melihat foto asli ini</strong> tanpa perlu konfigurasi Firebase.
                  </p>
                </div>
              </div>

              {/* Foto Banner Utama (Hero Banner di Halaman Depan) */}
              <div className="rounded-2xl border border-primary/30 bg-primary-soft/30 p-4 sm:p-5 shadow-xs">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-3.5">
                    <div className="relative h-16 w-24 shrink-0 overflow-hidden rounded-xl border border-border bg-muted shadow-xs">
                      <img
                        src={heroImage}
                        alt="Banner Utama Halwa Bakery"
                        onError={(event) => {
                          event.currentTarget.onerror = null;
                          event.currentTarget.src = heroFallback;
                        }}
                        className="h-full w-full object-cover"
                      />
                      {isFirebaseImageUrl(heroImage) && (
                        <span className="absolute bottom-0 inset-x-0 bg-emerald-700 text-[9px] font-bold text-white text-center py-0.5 flex items-center justify-center gap-0.5">
                          <Cloud size={9} /> Firebase
                        </span>
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-display text-sm font-bold text-foreground">
                          Banner Utama (Halaman Depan)
                        </span>
                        {isFirebaseImageUrl(heroImage) ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-blue-500/15 px-2 py-0.5 text-[10px] font-bold text-blue-700 dark:text-blue-400">
                            <Cloud size={10} /> Firebase Storage
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 px-2 py-0.5 text-[10px] font-bold text-emerald-700 dark:text-emerald-400">
                            <CheckCircle2 size={10} /> Foto Asli Banner (Publik)
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Foto roti di bagian paling atas website (otomatis tampil untuk semua pengunjung)
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-wrap">
                    <input
                      type="file"
                      id="hero-modal-upload-input"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleHeroFile(file);
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => document.getElementById("hero-modal-upload-input")?.click()}
                      disabled={isUploadingHero}
                      className="flex items-center gap-1.5 rounded-xl bg-foreground px-3.5 py-2 text-xs font-bold text-primary-foreground hover:bg-foreground/90 transition active:scale-95 cursor-pointer shadow-xs disabled:opacity-70"
                    >
                      {isUploadingHero ? (
                        <RefreshCw size={14} className="animate-spin text-primary" />
                      ) : (
                        <Camera size={14} />
                      )}
                      <span>{isUploadingHero ? "Mengunggah..." : "Pilih Foto Banner"}</span>
                    </button>

                    {heroImage && !isFirebaseImageUrl(heroImage) && heroImage !== "/assets/hero.jpg" && (
                      <button
                        type="button"
                        onClick={async () => {
                          setIsUploadingHero(true);
                          try {
                            const { url } = await uploadHeroImageToFirebase(heroImage);
                            setHeroImage(url);
                            try {
                              localStorage.setItem("halwa_hero_image", url);
                            } catch {}
                            await fetch("/api/store/images", {
                              method: "POST",
                              headers: { "Content-Type": "application/json" },
                              body: JSON.stringify({ heroImage: url }),
                            });
                            setFirebaseStatusMsg({
                              type: "success",
                              text: "Banner utama berhasil disimpan ke Firebase Cloud Storage!",
                            });
                          } catch (err: any) {
                            setFirebaseStatusMsg({
                              type: "error",
                              text: `Gagal upload banner: ${err?.message}`,
                            });
                          } finally {
                            setIsUploadingHero(false);
                            setTimeout(() => setFirebaseStatusMsg(null), 7000);
                          }
                        }}
                        disabled={isUploadingHero}
                        className="flex items-center gap-1.5 rounded-xl bg-primary/20 text-primary-strong px-3 py-2 text-xs font-bold hover:bg-primary/30 transition cursor-pointer"
                        title="Simpan banner ke Firebase Cloud Storage"
                      >
                        <CloudUpload size={13} />
                        <span>Ke Firebase</span>
                      </button>
                    )}

                    {heroImage && heroImage !== "/assets/hero.jpg" && (
                      <button
                        type="button"
                        onClick={() => {
                          setHeroImage("/assets/hero.jpg");
                          localStorage.removeItem("halwa_hero_image");
                          fetch("/api/store/images", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ heroImage: "" }),
                          }).catch(() => {});
                        }}
                        className="flex items-center gap-1 rounded-xl border border-border bg-card px-2.5 py-2 text-xs font-bold text-muted-foreground hover:text-destructive hover:bg-muted transition cursor-pointer"
                        title="Kembalikan banner ke gambar ilustrasi bawaan"
                      >
                        <RotateCcw size={12} />
                        <span>Reset</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>

              <div className="divide-y divide-border/60 rounded-2xl border border-border bg-background">
                {products.map((p) => {
                  const hasCustom = Boolean(productImages[p.id]);
                  const currentSrc = productImages[p.id] || p.image;
                  const isEditingUrl = urlInputProductId === p.id;
                  const isFirebaseStored = isFirebaseImageUrl(currentSrc);
                  const isUploadingThis = uploadingProductIds[p.id];

                  return (
                    <div
                      key={p.id}
                      className="p-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"
                    >
                      <div className="flex items-center gap-3.5">
                        <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl border border-border bg-muted">
                          <img
                            src={currentSrc}
                            alt={p.name}
                            onError={(event) => {
                              event.currentTarget.onerror = null;
                              event.currentTarget.src =
                                defaultProductImages[p.id] ||
                                productFallbackImage(
                                  p.name,
                                  p.category
                                );
                            }}
                            className="h-full w-full object-cover"
                          />
                          {hasCustom && (
                            <span
                              className={`absolute bottom-0 inset-x-0 text-[9px] font-bold text-center py-0.5 flex items-center justify-center gap-0.5 ${
                                isFirebaseStored
                                  ? "bg-emerald-700 text-white"
                                  : "bg-primary text-primary-foreground"
                              }`}
                            >
                              {isFirebaseStored ? (
                                <>
                                  <Cloud size={9} /> Firebase
                                </>
                              ) : (
                                "Foto Asli"
                              )}
                            </span>
                          )}
                        </div>
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-[10px] font-extrabold uppercase tracking-wider text-primary">
                              {p.category}
                            </span>
                            {isFirebaseStored ? (
                              <span className="inline-flex items-center gap-1 rounded-full bg-blue-500/15 px-2 py-0.5 text-[9px] font-bold text-blue-700 dark:text-blue-400">
                                <Cloud size={9} /> Firebase Cloud
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 px-2 py-0.5 text-[9px] font-bold text-emerald-700 dark:text-emerald-400">
                                <CheckCircle2 size={9} /> Foto Asli (Publik)
                              </span>
                            )}
                            {isUploadingThis && (
                              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-primary animate-pulse">
                                <RefreshCw size={10} className="animate-spin" /> Uploading ke Firebase...
                              </span>
                            )}
                          </div>
                          <h3 className="text-sm font-bold text-foreground">{p.name}</h3>
                          <p className="text-xs font-semibold text-primary-strong">
                            {formatPrice(p.price)}
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-2">
                        <button
                          type="button"
                          onClick={() => triggerUploadForProduct(p.id)}
                          disabled={isUploadingThis}
                          className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-3 py-1.5 text-xs font-bold text-primary-foreground shadow-xs hover:bg-primary-strong transition cursor-pointer active:scale-95 disabled:opacity-70"
                        >
                          {isUploadingThis ? (
                            <RefreshCw size={13} className="animate-spin" />
                          ) : (
                            <Upload size={13} />
                          )}
                          <span>{isUploadingThis ? "Mengunggah..." : "Pilih Foto"}</span>
                        </button>

                        {hasCustom && !isFirebaseStored && (
                          <button
                            type="button"
                            onClick={() => uploadSingleProductToFirebase(p.id)}
                            disabled={isUploadingThis}
                            className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600/15 text-emerald-800 dark:text-emerald-300 border border-emerald-500/30 px-2.5 py-1.5 text-xs font-bold hover:bg-emerald-600/25 transition cursor-pointer disabled:opacity-70"
                            title="Simpan foto ini ke Firebase Cloud Storage"
                          >
                            <CloudUpload size={13} />
                            <span>Ke Firebase</span>
                          </button>
                        )}

                        <button
                          type="button"
                          onClick={() => {
                            setUrlInputProductId(isEditingUrl ? null : p.id);
                            setCustomUrlInput(productImages[p.id] || "");
                          }}
                          className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-card px-2.5 py-1.5 text-xs font-semibold text-foreground hover:bg-muted transition cursor-pointer"
                        >
                          <LinkIcon size={13} />
                          <span>Link URL</span>
                        </button>

                        {hasCustom && (
                          <button
                            type="button"
                            onClick={() => removeProductImage(p.id)}
                            className="inline-flex items-center gap-1 rounded-xl bg-destructive-soft px-2.5 py-1.5 text-xs font-semibold text-destructive hover:bg-destructive/20 transition cursor-pointer"
                            title="Kembalikan ke foto bawaan"
                          >
                            <RotateCcw size={12} />
                            <span>Reset</span>
                          </button>
                        )}
                      </div>

                      {isEditingUrl && (
                        <div className="w-full flex items-center gap-2 pt-2 border-t border-border/60">
                          <input
                            type="url"
                            placeholder="Masukkan link gambar (https://...)"
                            value={customUrlInput}
                            onChange={(e) => setCustomUrlInput(e.target.value)}
                            className="h-9 flex-1 rounded-xl border border-border bg-card px-3 text-xs text-foreground outline-none focus:border-primary"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              if (customUrlInput.trim()) {
                                saveProductImage(p.id, customUrlInput.trim());
                              }
                              setUrlInputProductId(null);
                            }}
                            className="h-9 rounded-xl bg-foreground px-3 text-xs font-bold text-primary-foreground hover:bg-foreground/90 transition cursor-pointer"
                          >
                            Simpan
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-between border-t border-border bg-muted/30 p-4 sm:p-5">
              {Object.keys(productImages).length > 0 ? (
                <button
                  type="button"
                  onClick={resetAllProductImages}
                  className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-destructive transition cursor-pointer"
                >
                  <RotateCcw size={13} />
                  <span>Reset Semua Foto ke Bawaan</span>
                </button>
              ) : (
                <span className="text-xs text-muted-foreground">Belum ada foto yang diubah</span>
              )}
              <Button
                onClick={() => {
                  setIsPhotoManagerOpen(false);
                  setUrlInputProductId(null);
                }}
                className="rounded-xl bg-foreground px-5 text-xs font-bold text-primary-foreground hover:bg-foreground/90 min-h-9"
              >
                Selesai
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Admin / Pengelola Stok Modal */}
      {isAdminStockModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
          role="dialog"
          aria-modal="true"
          aria-label="Panel Admin Pengelola Stok Roti"
        >
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-overlay backdrop-blur-xs transition-opacity"
            onClick={() => setIsAdminStockModalOpen(false)}
          />

          {/* Modal Container */}
          <div className="relative z-10 flex h-full max-h-[90vh] w-full max-w-2xl flex-col rounded-3xl border border-border bg-card shadow-lift animate-rise overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-border p-5 sm:p-6 bg-muted/20">
              <div className="flex items-center gap-3">
                <div className="grid h-11 w-11 place-items-center rounded-2xl bg-primary-soft text-primary shadow-xs">
                  <Boxes size={22} />
                </div>
                <div>
                  <h2 className="font-display text-xl sm:text-2xl font-bold text-foreground">
                    Kelola Stok Roti (Inventory)
                  </h2>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Atur ketersediaan stok roti harian. Tersimpan di localStorage.
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsAdminStockModalOpen(false);
                    setIsAddProductModalOpen(true);
                  }}
                  className="hidden sm:flex items-center gap-1.5 rounded-xl border border-primary/40 bg-primary-soft px-3 py-1.5 text-xs font-bold text-primary-strong hover:bg-primary-soft/80 transition cursor-pointer"
                  title="Tambah varian produk baru"
                >
                  <Plus size={13} />
                  <span>+ Tambah Varian</span>
                </button>
                <button
                  type="button"
                  onClick={() => setIsAdminStockModalOpen(false)}
                  className="grid h-9 w-9 place-items-center rounded-xl text-muted-foreground hover:bg-muted hover:text-foreground transition cursor-pointer"
                  aria-label="Tutup panel stok"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Modal Tabs */}
            <div className="flex border-b border-border bg-muted/40 px-5 pt-3 gap-2 overflow-x-auto">
              <button
                type="button"
                onClick={() => setAdminTab("manual")}
                className={`flex items-center gap-2 rounded-t-xl px-4 py-2.5 text-xs font-bold transition border-b-2 cursor-pointer shrink-0 ${
                  adminTab === "manual"
                    ? "border-primary bg-card text-primary shadow-xs"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                <Boxes size={15} />
                <span>Stok Manual & Cepat</span>
              </button>
              <button
                type="button"
                onClick={() => setAdminTab("prices")}
                className={`flex items-center gap-2 rounded-t-xl px-4 py-2.5 text-xs font-bold transition border-b-2 cursor-pointer shrink-0 ${
                  adminTab === "prices"
                    ? "border-primary bg-card text-primary shadow-xs"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                <Tag size={15} />
                <span>Ubah Harga Produk</span>
                {Object.keys(customPrices).length > 0 && (
                  <span className="ml-1 rounded-full bg-primary text-primary-foreground px-1.5 py-0.2 text-[9px] font-extrabold">
                    {Object.keys(customPrices).length}
                  </span>
                )}
              </button>
              <button
                type="button"
                onClick={() => setAdminTab("sheets")}
                className={`flex items-center gap-2 rounded-t-xl px-4 py-2.5 text-xs font-bold transition border-b-2 cursor-pointer shrink-0 ${
                  adminTab === "sheets"
                    ? "border-primary bg-card text-primary shadow-xs"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                <FileSpreadsheet size={15} />
                <span>Google Sheets Live</span>
                {spreadsheetId && (
                  <span className="h-2 w-2 rounded-full bg-emerald-500 ring-2 ring-emerald-500/30" />
                )}
              </button>
            </div>

            {adminTab === "manual" ? (
              <>
                {/* Quick Summary & Bulk Control */}
                <div className="border-b border-border/70 bg-primary-soft/30 px-5 py-3.5 text-xs">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-foreground">Status Ringkas:</span>
                      <span className="rounded-full bg-emerald-500/15 px-2.5 py-0.5 font-bold text-emerald-700">
                        {products.filter((p) => (adminStockInputs[p.id] ?? stock[p.id] ?? 0) > 5).length} Aman
                      </span>
                      <span className="rounded-full bg-amber-500/15 px-2.5 py-0.5 font-bold text-amber-700">
                        {products.filter((p) => {
                          const val = adminStockInputs[p.id] ?? stock[p.id] ?? 0;
                          return val > 0 && val <= 5;
                        }).length} Sisa Sedikit
                      </span>
                      <span className="rounded-full bg-destructive/15 px-2.5 py-0.5 font-bold text-destructive">
                        {products.filter((p) => (adminStockInputs[p.id] ?? stock[p.id] ?? 0) === 0).length} Habis
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          const next: Record<number, number> = {};
                          products.forEach((p) => {
                            next[p.id] = 15;
                          });
                          setAdminStockInputs(next);
                        }}
                        className="rounded-lg border border-border bg-card px-2.5 py-1 text-[11px] font-bold text-foreground hover:border-primary hover:text-primary transition cursor-pointer"
                      >
                        Set Semua = 15 pcs
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          const next: Record<number, number> = {};
                          products.forEach((p) => {
                            next[p.id] = (adminStockInputs[p.id] ?? stock[p.id] ?? 0) + 5;
                          });
                          setAdminStockInputs(next);
                        }}
                        className="rounded-lg border border-border bg-card px-2.5 py-1 text-[11px] font-bold text-foreground hover:border-primary hover:text-primary transition cursor-pointer"
                      >
                        +5 ke Semua
                      </button>
                    </div>
                  </div>
                </div>

                {/* Modal Body: Product List */}
                <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-3">
                  {adminSavedToast && (
                    <div className="flex items-center gap-2.5 rounded-2xl bg-emerald-600 px-4 py-3 text-xs font-bold text-white shadow-soft transition-all">
                      <CheckCircle2 size={18} className="shrink-0" />
                      <span>Perubahan stok berhasil disimpan ke penyimpanan lokal {spreadsheetId ? "dan Google Sheets" : ""}!</span>
                    </div>
                  )}

                  <div className="divide-y divide-border/60 rounded-2xl border border-border bg-background">
                    {products.map((p) => {
                      const currentImage = productImages[p.id] || p.image;
                      const currentVal = adminStockInputs[p.id] ?? stock[p.id] ?? 0;
                      const isZero = currentVal === 0;
                      const isLow = currentVal > 0 && currentVal <= 5;

                      return (
                        <div
                          key={p.id}
                          className="p-3.5 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                        >
                          {/* Product details */}
                          <div className="flex items-center gap-3">
                            <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl border border-border bg-muted">
                              <img
                                src={currentImage}
                                alt={p.name}
                                onError={(e) => {
                                  e.currentTarget.onerror = null;
                                  e.currentTarget.src =
                                    defaultProductImages[p.id] ||
                                    productFallbackImage(p.name, p.category);
                                }}
                                className="h-full w-full object-cover"
                              />
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <h4 className="text-sm font-bold text-foreground">{p.name}</h4>
                                <span className="text-[10px] font-extrabold uppercase text-primary">
                                  {p.category}
                                </span>
                              </div>
                              <div className="flex items-center gap-2 mt-0.5">
                                <p className="text-xs font-semibold text-muted-foreground">{formatPrice(p.price)}</p>
                                <button
                                  type="button"
                                  onClick={() => setEditingPriceProduct(p)}
                                  className="inline-flex items-center gap-1 rounded-md bg-primary-soft px-1.5 py-0.5 text-[10px] font-bold text-primary-strong hover:bg-primary/20 transition cursor-pointer"
                                  title="Ubah harga produk ini"
                                >
                                  <Edit3 size={10} />
                                  <span>Ubah Harga</span>
                                </button>
                              </div>
                              <div className="mt-1">
                                {isZero ? (
                                  <span className="inline-flex items-center gap-1 rounded-full bg-destructive/15 px-2 py-0.5 text-[10px] font-bold text-destructive">
                                    <AlertCircle size={10} />
                                    Habis / Kosong
                                  </span>
                                ) : isLow ? (
                                  <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/15 px-2 py-0.5 text-[10px] font-bold text-amber-700">
                                    <Flame size={10} className="text-amber-600" />
                                    Sisa sedikit: {currentVal} pcs
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 px-2 py-0.5 text-[10px] font-bold text-emerald-700">
                                    <Check size={10} className="text-emerald-600" />
                                    Tersedia: {currentVal} pcs
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Stock controls */}
                          <div className="flex flex-wrap items-center gap-2 self-end sm:self-center">
                            {/* Stepper & Number Input */}
                            <div className="flex items-center rounded-xl border border-border bg-card p-1 shadow-2xs">
                              <button
                                type="button"
                                onClick={() => {
                                  setAdminStockInputs((prev) => ({
                                    ...prev,
                                    [p.id]: Math.max(0, currentVal - 1),
                                  }));
                                }}
                                disabled={currentVal <= 0}
                                className="grid h-8 w-8 place-items-center rounded-lg text-foreground hover:bg-muted disabled:opacity-40 disabled:hover:bg-transparent transition cursor-pointer"
                                aria-label="Kurang 1"
                              >
                                <Minus size={14} />
                              </button>

                              <input
                                type="number"
                                min={0}
                                value={currentVal}
                                onChange={(e) => {
                                  const val = Math.max(0, parseInt(e.target.value, 10) || 0);
                                  setAdminStockInputs((prev) => ({
                                    ...prev,
                                    [p.id]: val,
                                  }));
                                }}
                                className="h-8 w-14 text-center text-sm font-extrabold text-foreground outline-none bg-transparent"
                                aria-label={`Jumlah stok ${p.name}`}
                              />

                              <button
                                type="button"
                                onClick={() => {
                                  setAdminStockInputs((prev) => ({
                                    ...prev,
                                    [p.id]: currentVal + 1,
                                  }));
                                }}
                                className="grid h-8 w-8 place-items-center rounded-lg text-foreground hover:bg-muted transition cursor-pointer"
                                aria-label="Tambah 1"
                              >
                                <Plus size={14} />
                              </button>
                            </div>

                            {/* Quick pills */}
                            <div className="flex items-center gap-1">
                              <button
                                type="button"
                                onClick={() => {
                                  setAdminStockInputs((prev) => ({
                                    ...prev,
                                    [p.id]: currentVal + 5,
                                  }));
                                }}
                                className="rounded-lg border border-border bg-card px-2 py-1.5 text-[11px] font-bold text-foreground hover:border-primary hover:text-primary transition cursor-pointer"
                                title="Tambah 5 stok panggangan baru"
                              >
                                +5
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  setAdminStockInputs((prev) => ({
                                    ...prev,
                                    [p.id]: currentVal + 10,
                                  }));
                                }}
                                className="rounded-lg border border-border bg-card px-2 py-1.5 text-[11px] font-bold text-foreground hover:border-primary hover:text-primary transition cursor-pointer"
                                title="Tambah 10 stok panggangan baru"
                              >
                                +10
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  setAdminStockInputs((prev) => ({
                                    ...prev,
                                    [p.id]: 0,
                                  }));
                                }}
                                className="rounded-lg border border-destructive/30 bg-destructive/5 px-2 py-1.5 text-[11px] font-bold text-destructive hover:bg-destructive/15 transition cursor-pointer"
                                title="Tandai stok habis"
                              >
                                Set 0
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Modal Footer */}
                <div className="flex items-center justify-between border-t border-border bg-muted/30 p-4 sm:p-5">
                  <button
                    type="button"
                    onClick={() => {
                      const resetMap: Record<number, number> = {};
                      products.forEach((p) => {
                        resetMap[p.id] = p.stock;
                      });
                      setAdminStockInputs(resetMap);
                    }}
                    className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition cursor-pointer"
                  >
                    <RotateCcw size={13} />
                    <span>Reset ke Nilai Awal Produk</span>
                  </button>

                  <div className="flex items-center gap-2.5">
                    <Button
                      onClick={() => setIsAdminStockModalOpen(false)}
                      className="rounded-xl border border-border bg-card px-4 text-xs font-bold text-foreground hover:bg-muted min-h-10"
                    >
                      Batal
                    </Button>
                    <Button
                      onClick={handleSaveAdminStock}
                      className="rounded-xl bg-primary px-5 text-xs font-bold text-primary-foreground hover:bg-primary-strong shadow-gold min-h-10 flex items-center gap-2"
                    >
                      <Save size={15} />
                      <span>Simpan Perubahan Stok</span>
                    </Button>
                  </div>
                </div>
              </>
            ) : adminTab === "prices" ? (
              <>
                {/* Quick Category Filter & Actions */}
                <div className="border-b border-border/70 bg-primary-soft/30 px-5 py-3.5 text-xs">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="font-bold text-foreground mr-1">Kategori:</span>
                      {(["Semua", "Roti", "Brownies", "Kue"] as Category[]).map((cat) => (
                        <button
                          key={cat}
                          type="button"
                          onClick={() => setAdminPriceCategoryFilter(cat)}
                          className={`rounded-lg px-2.5 py-1 text-xs font-bold transition cursor-pointer ${
                            adminPriceCategoryFilter === cat
                              ? "bg-foreground text-primary-foreground shadow-2xs"
                              : "bg-card border border-border text-muted-foreground hover:text-foreground"
                          }`}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground text-[11px]">
                        {Object.keys(customPrices).length > 0 ? (
                          <span className="font-semibold text-primary">
                            {Object.keys(customPrices).length} produk dengan harga kustom
                          </span>
                        ) : (
                          "Semua produk memakai harga standar"
                        )}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Price Edit List */}
                <div className="flex-1 overflow-y-auto p-4 sm:p-5">
                  <div className="space-y-3">
                    {products
                      .filter(
                        (p) =>
                          adminPriceCategoryFilter === "Semua" ||
                          p.category === adminPriceCategoryFilter
                      )
                      .map((p) => {
                        const currentVal =
                          adminPriceInputs[p.id] !== undefined
                            ? adminPriceInputs[p.id]
                            : p.price;
                        const defaultPrice = getDefaultPrice(p.id);
                        const isModified = currentVal !== defaultPrice;
                        const currentImage = productImages[p.id] || p.image;

                        return (
                          <div
                            key={p.id}
                            className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-2xl border p-3.5 transition ${
                              isModified
                                ? "border-primary/50 bg-primary-soft/20 shadow-2xs"
                                : "border-border bg-card"
                            }`}
                          >
                            {/* Product Info */}
                            <div className="flex items-center gap-3 min-w-0">
                              <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl border border-border bg-muted">
                                <img
                                  src={currentImage}
                                  alt={p.name}
                                  onError={(e) => {
                                    e.currentTarget.onerror = null;
                                    e.currentTarget.src =
                                      defaultProductImages[p.id] ||
                                      productFallbackImage(p.name, p.category);
                                  }}
                                  className="h-full w-full object-cover"
                                />
                              </div>
                              <div className="min-w-0">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <h4 className="text-sm font-bold text-foreground truncate">
                                    {p.name}
                                  </h4>
                                  <span className="text-[10px] font-extrabold uppercase text-primary">
                                    {p.category}
                                  </span>
                                  {isModified && (
                                    <span className="rounded-full bg-primary text-primary-foreground px-2 py-0.5 text-[9px] font-extrabold shadow-2xs">
                                      Harga Khusus
                                    </span>
                                  )}
                                </div>
                                <div className="flex items-center gap-2 mt-0.5 text-xs">
                                  <span className="text-muted-foreground">
                                    Standar: {formatPrice(defaultPrice)}
                                  </span>
                                  {isModified && (
                                    <span className="font-bold text-primary">
                                      → Saat ini: {formatPrice(currentVal)}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>

                            {/* Price Stepper & Quick Adjustment Controls */}
                            <div className="flex flex-wrap items-center gap-2 shrink-0 sm:self-center">
                              {/* Rp Input Box */}
                              <div className="flex items-center rounded-xl border border-border bg-background px-2.5 py-1 focus-within:border-primary shadow-xs">
                                <span className="text-xs font-bold text-muted-foreground mr-1 select-none">
                                  Rp
                                </span>
                                <input
                                  type="number"
                                  min={500}
                                  step={500}
                                  value={currentVal}
                                  onChange={(e) => {
                                    const val = Math.max(0, Math.floor(Number(e.target.value) || 0));
                                    setAdminPriceInputs((prev) => ({
                                      ...prev,
                                      [p.id]: val,
                                    }));
                                  }}
                                  className="w-24 text-sm font-extrabold text-foreground bg-transparent text-right outline-none"
                                />
                              </div>

                              {/* Quick Adjustment Pills */}
                              <div className="flex items-center gap-1">
                                <button
                                  type="button"
                                  onClick={() => {
                                    setAdminPriceInputs((prev) => ({
                                      ...prev,
                                      [p.id]: Math.max(500, currentVal - 1000),
                                    }));
                                  }}
                                  className="rounded-lg border border-border bg-card px-2 py-1.5 text-[11px] font-bold text-foreground hover:border-primary hover:text-primary transition cursor-pointer"
                                  title="Kurangi Rp 1.000"
                                >
                                  -1rb
                                </button>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setAdminPriceInputs((prev) => ({
                                      ...prev,
                                      [p.id]: currentVal + 1000,
                                    }));
                                  }}
                                  className="rounded-lg border border-border bg-card px-2 py-1.5 text-[11px] font-bold text-foreground hover:border-primary hover:text-primary transition cursor-pointer"
                                  title="Tambah Rp 1.000"
                                >
                                  +1rb
                                </button>
                                {isModified && (
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setAdminPriceInputs((prev) => ({
                                        ...prev,
                                        [p.id]: defaultPrice,
                                      }));
                                    }}
                                    className="rounded-lg border border-amber-500/30 bg-amber-500/10 px-2 py-1.5 text-[11px] font-bold text-amber-700 hover:bg-amber-500/20 transition cursor-pointer"
                                    title="Kembalikan harga produk ini ke standar"
                                  >
                                    Reset
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                  </div>
                </div>

                {/* Modal Footer */}
                <div className="flex items-center justify-between border-t border-border bg-muted/30 p-4 sm:p-5">
                  <button
                    type="button"
                    onClick={handleResetAllAdminPrices}
                    className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-destructive transition cursor-pointer"
                    title="Kembalikan semua harga produk ke harga standar"
                  >
                    <RotateCcw size={13} />
                    <span>Reset Semua Harga ke Standar</span>
                  </button>

                  <div className="flex items-center gap-2.5">
                    <Button
                      onClick={() => setIsAdminStockModalOpen(false)}
                      className="rounded-xl border border-border bg-card px-4 text-xs font-bold text-foreground hover:bg-muted min-h-10"
                    >
                      Batal
                    </Button>
                    <Button
                      onClick={handleSaveAdminPrices}
                      className="rounded-xl bg-primary px-5 text-xs font-bold text-primary-foreground hover:bg-primary-strong shadow-gold min-h-10 flex items-center gap-2 cursor-pointer"
                    >
                      <Save size={15} />
                      <span>Simpan Perubahan Harga</span>
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              /* Google Sheets Tab */
              <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
                {/* Feedback message banner */}
                {sheetStatusMsg && (
                  <div
                    className={`flex items-center gap-2.5 rounded-2xl px-4 py-3 text-xs font-semibold shadow-xs ${
                      sheetStatusMsg.type === "success"
                        ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                        : "bg-destructive/10 text-destructive border border-destructive/20"
                    }`}
                  >
                    {sheetStatusMsg.type === "success" ? (
                      <CheckCircle2 size={16} className="shrink-0 text-emerald-600" />
                    ) : (
                      <AlertCircle size={16} className="shrink-0 text-destructive" />
                    )}
                    <span>{sheetStatusMsg.text}</span>
                  </div>
                )}

                {/* Section 1: Google Account Connection */}
                <div className="rounded-2xl border border-border bg-card p-4 sm:p-5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <h3 className="text-sm font-bold text-foreground">Akun Google Pemilik Toko</h3>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Diperlukan untuk membuat dan mengupdate spreadsheet stok Halwa Bakery di Google Drive Anda.
                      </p>
                    </div>

                    <div>
                      {googleUser ? (
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-2 text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-xl">
                            <span className="h-2 w-2 rounded-full bg-emerald-500" />
                            <span>{googleUser.email}</span>
                          </div>
                          <button
                            type="button"
                            onClick={handleGoogleLogout}
                            className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-destructive transition cursor-pointer p-1"
                            title="Keluar dari akun Google"
                          >
                            <LogOut size={14} />
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={handleGoogleLogin}
                          className="inline-flex items-center gap-2.5 rounded-xl border border-border bg-white px-4 py-2 text-xs font-bold text-gray-700 shadow-xs hover:bg-gray-50 transition cursor-pointer"
                        >
                          <svg className="h-4 w-4" viewBox="0 0 48 48">
                            <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
                            <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
                            <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
                            <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
                          </svg>
                          <span>Masuk dengan Google</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Section 2: Spreadsheet Connection */}
                <div className="rounded-2xl border border-border bg-card p-4 sm:p-5 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-bold text-foreground">File Google Spreadsheet</h3>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {spreadsheetId
                          ? "Website terhubung dengan spreadsheet stok berikut:"
                          : "Pilih untuk membuat file baru atau hubungkan file yang sudah ada."}
                      </p>
                    </div>

                    {spreadsheetId && (
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/15 px-3 py-1 text-xs font-bold text-emerald-700">
                        <span className="h-2 w-2 rounded-full bg-emerald-500" />
                        Terhubung
                      </span>
                    )}
                  </div>

                  {spreadsheetId ? (
                    <div className="space-y-3">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 rounded-xl border border-emerald-500/20 bg-emerald-50/50 p-3.5">
                        <div className="space-y-0.5">
                          <p className="text-xs font-bold text-emerald-950 flex items-center gap-2">
                            <FileSpreadsheet size={15} className="text-emerald-600" />
                            <span>Halwa Bakery - Stok Roti Harian</span>
                          </p>
                          <p className="text-[11px] text-emerald-800/80">
                            ID: <span className="font-mono">{spreadsheetId.slice(0, 14)}...{spreadsheetId.slice(-6)}</span>
                            {lastSyncTime && ` • Sinkron: ${lastSyncTime}`}
                          </p>
                        </div>

                        {spreadsheetUrl && (
                          <a
                            href={spreadsheetUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 rounded-lg border border-emerald-600/30 bg-white px-3 py-1.5 text-xs font-bold text-emerald-700 hover:bg-emerald-50 transition cursor-pointer shrink-0"
                          >
                            <span>Buka di Google Sheets</span>
                            <ExternalLink size={12} />
                          </a>
                        )}
                      </div>

                      {/* Sync Controls */}
                      <div className="flex flex-wrap items-center gap-2 pt-1">
                        <Button
                          type="button"
                          onClick={() => handleFetchStockFromSheets(true)}
                          disabled={isSyncingSheets}
                          className="rounded-xl bg-primary px-4 text-xs font-bold text-primary-foreground hover:bg-primary-strong shadow-gold flex items-center gap-2 min-h-9"
                        >
                          <RefreshCw size={13} className={isSyncingSheets ? "animate-spin" : ""} />
                          <span>{isSyncingSheets ? "Menyinkronkan..." : "Tarik Stok dari Sheets Sekarang"}</span>
                        </Button>

                        {googleUser && (
                          <Button
                            type="button"
                            onClick={handlePushStockToSheets}
                            disabled={isSyncingSheets}
                            className="rounded-xl border border-border bg-card px-4 text-xs font-bold text-foreground hover:bg-muted flex items-center gap-2 min-h-9"
                          >
                            <Upload size={13} />
                            <span>Unggah Stok Web ke Sheets</span>
                          </Button>
                        )}

                        <button
                          type="button"
                          onClick={handleDisconnectSheet}
                          className="text-xs text-muted-foreground hover:text-destructive transition cursor-pointer px-2 py-1 ml-auto"
                        >
                          Putus Tautan
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4 pt-1">
                      {/* Option A: Create Auto */}
                      <div className="rounded-xl border border-dashed border-primary/40 bg-primary-soft/20 p-4">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          <div>
                            <p className="text-xs font-bold text-foreground">Opsi 1: Buat Spreadsheet Otomatis (1-Klik)</p>
                            <p className="text-xs text-muted-foreground mt-0.5">
                              Sistem akan otomatis membuat file Google Spreadsheet berisi daftar 12 roti Halwa di Google Drive Anda.
                            </p>
                          </div>
                          <Button
                            type="button"
                            onClick={handleCreateNewSheet}
                            disabled={!googleUser || isCreatingSheet}
                            className="rounded-xl bg-primary px-4 text-xs font-bold text-primary-foreground hover:bg-primary-strong shadow-gold shrink-0 min-h-9 flex items-center gap-2 disabled:opacity-50"
                          >
                            <FileSpreadsheet size={15} />
                            <span>{isCreatingSheet ? "Membuat file..." : "Buat Spreadsheet Halwa"}</span>
                          </Button>
                        </div>
                        {!googleUser && (
                          <p className="text-[11px] text-amber-700 mt-2 font-medium">
                            * Masuk dengan akun Google di atas terlebih dahulu untuk membuat file otomatis.
                          </p>
                        )}
                      </div>

                      {/* Option B: Manual Input */}
                      <div className="space-y-2">
                        <p className="text-xs font-bold text-foreground">Opsi 2: Atau Tautkan ID / Link Spreadsheet yang Ada</p>
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            placeholder="Tempelkan Link atau ID Google Sheets..."
                            value={customSheetInput}
                            onChange={(e) => setCustomSheetInput(e.target.value)}
                            className="flex-1 rounded-xl border border-border bg-background px-3.5 py-2 text-xs text-foreground placeholder:text-muted-foreground outline-none focus:border-primary"
                          />
                          <Button
                            type="button"
                            onClick={handleSaveCustomSheetId}
                            disabled={!customSheetInput.trim()}
                            className="rounded-xl bg-foreground px-4 text-xs font-bold text-primary-foreground hover:bg-foreground/90 shrink-0 min-h-9"
                          >
                            Tautkan
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Section 3: Cara Kerja & Tips Penggunaan */}
                <div className="rounded-2xl border border-border bg-muted/20 p-4 sm:p-5 space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-primary">
                    Cara Praktis Mengatur Stok dari HP
                  </h4>
                  <ol className="space-y-2 text-xs text-muted-foreground list-decimal list-inside leading-relaxed">
                    <li>
                      <strong className="text-foreground">Buka Google Sheets di HP:</strong> Buka aplikasi Google Sheets di Android atau iPhone Anda, lalu buka file <span className="text-foreground font-semibold">Halwa Bakery - Stok Roti Harian</span>.
                    </li>
                    <li>
                      <strong className="text-foreground">Ubah Angka di Kolom Sisa Stok:</strong> Kapan pun roti baru matang atau laku offline di toko, cukup ganti angka di Kolom E (Sisa Stok).
                    </li>
                    <li>
                      <strong className="text-foreground">Stok di Website Otomatis Sinkron:</strong> Website Halwa Bakery langsung membaca sisa stok tersebut. Jika stok 0, produk otomatis ditandai "Habis" dan terkunci dari pemesanan.
                    </li>
                  </ol>

                  <div className="rounded-xl bg-amber-500/10 border border-amber-500/20 p-3 text-xs text-amber-800">
                    <strong className="font-bold">Tips Akses Publik:</strong> Di Google Sheets, klik tombol <em>Bagikan (Share)</em> lalu ubah izin menjadi <strong>"Siapa saja yang memiliki link dapat melihat"</strong> agar semua pembeli di web dapat memuat sisa stok secara langsung tanpa perlu login.
                  </div>
                </div>

                {/* Modal Footer in Sheets Tab */}
                <div className="flex justify-end pt-2">
                  <Button
                    onClick={() => setIsAdminStockModalOpen(false)}
                    className="rounded-xl bg-foreground px-5 text-xs font-bold text-primary-foreground hover:bg-foreground/90 min-h-10"
                  >
                    Tutup
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Modal Autentikasi Pengelola (Google Auth Only) */}
      {isAdminAuthModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="admin-auth-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-foreground/60 backdrop-blur-xs animate-fade-in"
          onClick={() => setIsAdminAuthModalOpen(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md overflow-hidden rounded-3xl border border-border bg-card shadow-lift animate-rise"
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-border p-5 sm:p-6 bg-primary-soft/30">
              <div className="flex items-center gap-3">
                <div className="grid h-11 w-11 place-items-center rounded-2xl bg-primary text-primary-foreground shadow-gold">
                  <ShieldCheck size={22} />
                </div>
                <div>
                  <h3 id="admin-auth-title" className="font-display text-lg font-bold text-foreground">
                    Akses Mode Pengelola
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Terproteksi Akun Google Pemilik Toko
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setIsAdminAuthModalOpen(false);
                  setAdminAuthError("");
                }}
                className="grid h-8 w-8 place-items-center rounded-xl bg-card text-muted-foreground hover:bg-muted hover:text-foreground transition cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 sm:p-6 space-y-4">
              <p className="text-xs text-muted-foreground leading-relaxed">
                Untuk menjaga keamanan data toko, fitur kelola stok, harga menu, tambah varian, dan sinkronisasi Google Sheets hanya dapat dibuka melalui verifikasi <strong className="text-foreground">Akun Google Pemilik Toko</strong>.
              </p>

              {/* Status Proteksi Privasi & Keamanan */}
              <div className="flex items-start gap-3 rounded-2xl border border-primary/20 bg-primary-soft/30 p-3.5">
                <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-primary/15 text-primary mt-0.5">
                  <Lock size={16} />
                </div>
                <div className="space-y-1 text-xs">
                  <p className="font-bold text-foreground">Sistem Keamanan Akun Terdaftar</p>
                  <p className="text-muted-foreground text-[11px] leading-relaxed">
                    Akses menggunakan otentikasi resmi Google OAuth 2.0. Hanya akun email pemilik yang terdaftar (<span className="font-semibold text-foreground">rakha.ahmad.dzaky@gmail.com</span>) yang diizinkan mengakses panel ini.
                  </p>
                </div>
              </div>

              {/* Tampilan Khusus Jika Terjadi unauthorized-domain */}
              {unauthorizedDomain && (
                <div className="rounded-2xl border border-amber-500/30 bg-amber-50/80 p-4 space-y-3 text-xs text-amber-950">
                  <div className="flex items-start gap-2.5">
                    <AlertCircle size={18} className="text-amber-600 shrink-0 mt-0.5" />
                    <div className="space-y-1">
                      <p className="font-bold text-amber-900 text-sm">
                        Otorisasi Domain Firebase Diperlukan
                      </p>
                      <p className="text-xs text-amber-800 leading-relaxed">
                        Domain <code className="rounded bg-amber-200/70 px-1.5 py-0.5 font-mono font-bold text-amber-950">{unauthorizedDomain}</code> belum didaftarkan di <strong>Authorized Domains</strong> Firebase Authentication.
                      </p>
                    </div>
                  </div>

                  <div className="rounded-xl bg-card/90 p-3.5 border border-amber-200 space-y-2.5 text-xs">
                    <p className="font-bold text-foreground">
                      Langkah Menambahkan Domain (Hanya 1 Kali):
                    </p>
                    <ol className="list-decimal list-inside space-y-1 text-[11px] text-muted-foreground leading-relaxed">
                      <li>Buka Firebase Console pada proyek Anda.</li>
                      <li>Pilih menu <strong>Authentication</strong> &gt; tab <strong>Settings</strong> &gt; <strong>Authorized domains</strong>.</li>
                      <li>Klik <strong>Add domain</strong>, tempelkan domain berikut, lalu klik <strong>Save</strong>.</li>
                    </ol>
                    <div className="flex flex-wrap items-center gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => {
                          if (navigator?.clipboard) {
                            navigator.clipboard.writeText(unauthorizedDomain);
                            setCopiedDomain(true);
                            setTimeout(() => setCopiedDomain(false), 2500);
                          }
                        }}
                        className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-muted/60 px-3 py-2 font-semibold text-xs text-foreground hover:bg-muted transition cursor-pointer"
                      >
                        {copiedDomain ? <Check size={14} className="text-emerald-600" /> : <Copy size={14} />}
                        <span>{copiedDomain ? "Domain Disalin!" : `Salin: ${unauthorizedDomain}`}</span>
                      </button>
                      <a
                        href="https://console.firebase.google.com/project/gen-lang-client-0797374072/authentication/settings"
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-3.5 py-2 font-bold text-xs text-primary-foreground hover:bg-primary-strong shadow-xs transition cursor-pointer"
                      >
                        <ExternalLink size={13} />
                        <span>Buka Firebase Console</span>
                      </a>
                    </div>
                  </div>

                  <div className="pt-1">
                    <button
                      type="button"
                      onClick={handleAdminGoogleLogin}
                      disabled={isAdminLoggingIn}
                      className="w-full rounded-xl border border-amber-600/30 bg-amber-100/60 py-2.5 text-xs font-bold text-amber-900 hover:bg-amber-100 transition cursor-pointer flex items-center justify-center gap-2"
                    >
                      <RefreshCw size={14} className={isAdminLoggingIn ? "animate-spin" : ""} />
                      <span>Coba Login Google Kembali</span>
                    </button>
                  </div>
                </div>
              )}

              {adminAuthError && !unauthorizedDomain && (
                <div className="flex items-start gap-2.5 rounded-2xl bg-destructive/10 border border-destructive/20 p-3.5 text-xs font-semibold text-destructive leading-relaxed">
                  <AlertCircle size={16} className="shrink-0 mt-0.5" />
                  <span>{adminAuthError}</span>
                </div>
              )}

              {/* Kontainer Login Google */}
              <div className="space-y-3 pt-1">
                {googleUser && isEmailAuthorizedAdmin(googleUser.email) ? (
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 rounded-2xl bg-emerald-50 border border-emerald-500/30 p-4 text-emerald-950">
                      <CheckCircle2 size={22} className="text-emerald-600 shrink-0" />
                      <div className="overflow-hidden">
                        <p className="text-xs font-bold text-emerald-900">Terverifikasi sebagai Pemilik Resmi</p>
                        <p className="text-xs font-medium text-emerald-700 truncate">{googleUser.email}</p>
                      </div>
                    </div>

                    <Button
                      type="button"
                      onClick={() => {
                        setIsAdmin(true);
                        try {
                          localStorage.setItem("halwa_is_admin", "true");
                        } catch {}
                        setIsAdminAuthModalOpen(false);
                        openAdminStockModal();
                      }}
                      className="w-full rounded-2xl bg-primary py-3.5 text-xs font-bold text-primary-foreground hover:bg-primary-strong shadow-gold min-h-12 cursor-pointer flex items-center justify-center gap-2"
                    >
                      <Boxes size={16} />
                      <span>Masuk ke Panel Mode Pengelola</span>
                    </Button>

                    <button
                      type="button"
                      onClick={handleAdminGoogleLogin}
                      className="w-full text-center text-xs font-medium text-muted-foreground hover:text-foreground transition cursor-pointer py-1"
                    >
                      Gunakan Akun Google Lain
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <button
                      type="button"
                      onClick={handleAdminGoogleLogin}
                      disabled={isAdminLoggingIn}
                      className="w-full flex items-center justify-center gap-3 rounded-2xl border border-border bg-white px-5 py-3.5 text-xs font-bold text-gray-800 shadow-soft hover:bg-gray-50 active:scale-[0.99] transition cursor-pointer disabled:opacity-60 min-h-12"
                    >
                      {isAdminLoggingIn ? (
                        <RefreshCw size={18} className="animate-spin text-primary" />
                      ) : (
                        <svg className="h-5 w-5 shrink-0" viewBox="0 0 48 48">
                          <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
                          <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
                          <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
                          <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
                        </svg>
                      )}
                      <span>{isAdminLoggingIn ? "Menghubungkan ke Akun Google..." : "Masuk dengan Akun Google Pemilik"}</span>
                    </button>

                    {isRunningInIframe() && (
                      <div className="pt-1 text-center">
                        <a
                          href={typeof window !== "undefined" ? window.location.href : "#"}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1.5 text-xs text-primary font-semibold hover:underline"
                        >
                          <ExternalLink size={13} />
                          <span>Buka di Tab Baru jika Pop-up Terblokir</span>
                        </a>
                      </div>
                    )}

                    <div className="rounded-xl bg-muted/40 p-3 text-center space-y-1 border border-border/50">
                      <p className="text-[11px] font-semibold text-foreground">
                        Akun Pengelola Terdaftar:
                      </p>
                      <p className="text-xs font-mono font-bold text-primary">
                        rakha.ahmad.dzaky@gmail.com
                      </p>
                      <p className="text-[10px] text-muted-foreground">
                        Hanya akun tersebut yang dapat mengakses pengaturan toko dan data stok.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Tambah Varian Baru (Khusus Pengelola) */}
      <AddProductModal
        isOpen={isAddProductModalOpen}
        onClose={() => setIsAddProductModalOpen(false)}
        onAddProduct={handleAddProduct}
        compressImageFile={compressImageFile}
        existingProductsCount={products.length}
      />

      {/* Modal Ubah Harga Khusus Produk Tertentu */}
      <EditPriceModal
        isOpen={Boolean(editingPriceProduct)}
        onClose={() => setEditingPriceProduct(null)}
        product={editingPriceProduct}
        defaultPrice={editingPriceProduct ? getDefaultPrice(editingPriceProduct.id) : 0}
        currentPrice={
          editingPriceProduct
            ? (customPrices[editingPriceProduct.id] ?? editingPriceProduct.price)
            : 0
        }
        onSavePrice={handleUpdateProductPrice}
        onResetPrice={handleResetProductPrice}
        isCustomized={Boolean(editingPriceProduct && customPrices[editingPriceProduct.id])}
      />

      {/* Floating Toast Notifikasi Penambahan/Penghapusan Varian */}
      {productToast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2.5 rounded-2xl bg-[#2A160E] border border-primary/40 px-5 py-3 text-xs font-bold text-[#F7F2E8] shadow-lift animate-rise">
          <CheckCircle2 size={16} className="text-primary shrink-0" />
          <span>{productToast}</span>
        </div>
      )}

      {/* Modal Detail Resmi Sertifikat Halal Indonesia BPJPH */}
      {isHalalDetailModalOpen && (
        <HalalModal onClose={() => setIsHalalDetailModalOpen(false)} />
      )}
    </div>
  );
}
