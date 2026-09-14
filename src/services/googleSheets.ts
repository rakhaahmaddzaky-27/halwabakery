import { initializeApp, getApps } from "firebase/app";
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  onAuthStateChanged,
  signOut,
  type User,
} from "firebase/auth";
import firebaseConfig from "@/firebase-applet-config.json";
import { products } from "@/src/routes/index.tsx";

// Initialize Firebase App
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
export const auth = getAuth(app);

export const SCOPES = ["https://www.googleapis.com/auth/spreadsheets"];

const provider = new GoogleAuthProvider();
SCOPES.forEach((scope) => provider.addScope(scope));

// In-memory token cache (Do NOT store access token in localStorage/sessionStorage per security guidelines)
let cachedAccessToken: string | null = null;
let isSigningIn = false;

export const getCachedAccessToken = () => cachedAccessToken;

export const initAuth = (
  onAuthSuccess?: (user: User, token: string) => void,
  onAuthFailure?: () => void
) => {
  return onAuthStateChanged(auth, async (user) => {
    if (user && cachedAccessToken) {
      onAuthSuccess?.(user, cachedAccessToken);
    } else if (!isSigningIn) {
      cachedAccessToken = null;
      onAuthFailure?.();
    }
  });
};

export const isRunningInIframe = (): boolean => {
  try {
    return typeof window !== "undefined" && window.self !== window.top;
  } catch {
    return true;
  }
};

export const googleSignIn = async (): Promise<{ user: User; accessToken: string }> => {
  if (isSigningIn) {
    throw new Error("Proses login sedang berjalan di jendela pop-up. Silakan periksa jendela login Anda.");
  }
  try {
    isSigningIn = true;
    const result = await signInWithPopup(auth, provider);
    const credential = GoogleAuthProvider.credentialFromResult(result);
    if (!credential?.accessToken) {
      throw new Error("Gagal memperoleh token akses dari Google. Silakan coba lagi.");
    }
    cachedAccessToken = credential.accessToken;
    return { user: result.user, accessToken: cachedAccessToken };
  } catch (error: any) {
    const code = error?.code || "";
    const msg = error?.message || "";

    if (code === "auth/popup-blocked") {
      const isIframe = isRunningInIframe();
      const guidance = isIframe
        ? "Jendela pop-up login terblokir oleh browser di dalam frame preview. Silakan buka aplikasi di tab baru atau izinkan pop-up."
        : "Jendela pop-up login diblokir oleh browser. Silakan izinkan pop-up pada peramban Anda untuk melanjutkan.";
      const err = new Error(guidance) as any;
      err.code = "auth/popup-blocked";
      throw err;
    }

    if (code === "auth/popup-closed-by-user" || msg.includes("popup-closed-by-user")) {
      const err = new Error("Jendela login ditutup sebelum proses selesai.") as any;
      err.code = "auth/popup-closed-by-user";
      throw err;
    }

    if (code === "auth/cancelled-popup-request" || msg.includes("INTERNAL ASSERTION FAILED")) {
      const err = new Error("Permintaan login dibatalkan atau tertunda.") as any;
      err.code = "auth/cancelled-popup-request";
      throw err;
    }

    throw error;
  } finally {
    setTimeout(() => {
      isSigningIn = false;
    }, 400);
  }
};

export const googleSignOut = async (): Promise<void> => {
  cachedAccessToken = null;
  await signOut(auth);
};

export interface SheetStockItem {
  id: number;
  name: string;
  category: string;
  price: number;
  stock: number;
}

/**
 * Creates a brand new Halwa Bakery stock spreadsheet on the owner's Google Drive.
 */
export const createHalwaSpreadsheet = async (
  accessToken: string,
  initialStock: Record<number, number>
): Promise<{ id: string; url: string }> => {
  const values = [
    ["ID", "Nama Produk", "Kategori", "Harga (Rp)", "Sisa Stok", "Terakhir Diperbarui"],
    ...products.map((p) => [
      p.id,
      p.name,
      p.category,
      p.price,
      initialStock[p.id] ?? p.stock,
      new Date().toLocaleString("id-ID"),
    ]),
  ];

  const res = await fetch("https://sheets.googleapis.com/v4/spreadsheets", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      properties: {
        title: "Halwa Bakery - Stok Roti Harian",
      },
      sheets: [
        {
          properties: {
            title: "Stok Roti",
            gridProperties: {
              frozenRowCount: 1,
            },
          },
          data: [
            {
              startRow: 0,
              startColumn: 0,
              rowData: values.map((row) => ({
                values: row.map((cell) => ({
                  userEnteredValue:
                    typeof cell === "number"
                      ? { numberValue: cell }
                      : { stringValue: String(cell) },
                })),
              })),
            },
          ],
        },
      ],
    }),
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Gagal membuat Google Spreadsheet: ${errorText}`);
  }

  const data = await res.json();
  const spreadsheetId = data.spreadsheetId;
  const spreadsheetUrl = data.spreadsheetUrl || `https://docs.google.com/spreadsheets/d/${spreadsheetId}/edit`;

  return { id: spreadsheetId, url: spreadsheetUrl };
};

/**
 * Updates stock numbers in Google Sheets.
 */
export const updateStockInGoogleSheets = async (
  spreadsheetId: string,
  stockMap: Record<number, number>,
  accessToken: string
): Promise<void> => {
  // Update Sisa Stok column (Column E, rows 2 to 13) and Terakhir Diperbarui (Column F)
  const rows = products.map((p) => [
    stockMap[p.id] ?? p.stock,
    new Date().toLocaleString("id-ID"),
  ]);

  const range = "Stok Roti!E2:F" + (products.length + 1);

  const res = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${encodeURIComponent(
      range
    )}?valueInputOption=USER_ENTERED`,
    {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        range,
        majorDimension: "ROWS",
        values: rows,
      }),
    }
  );

  if (!res.ok) {
    // Try fallback without sheet title in case the user named it Sheet1
    const fallbackRange = "E2:F" + (products.length + 1);
    const fallbackRes = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${encodeURIComponent(
        fallbackRange
      )}?valueInputOption=USER_ENTERED`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          range: fallbackRange,
          majorDimension: "ROWS",
          values: rows,
        }),
      }
    );
    if (!fallbackRes.ok) {
      const err = await fallbackRes.text();
      throw new Error(`Gagal mengupdate Google Sheets: ${err}`);
    }
  }
};

/**
 * Reads stock from Google Sheets via API (with OAuth token) or via public CSV export.
 */
export const fetchStockFromGoogleSheets = async (
  spreadsheetId: string,
  accessToken?: string | null
): Promise<Record<number, number>> => {
  const stockMap: Record<number, number> = {};

  if (accessToken) {
    // Read with API
    try {
      const res = await fetch(
        `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/A2:E${
          products.length + 1
        }`,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );

      if (res.ok) {
        const data = await res.json();
        const rows: any[][] = data.values || [];
        rows.forEach((row) => {
          const id = parseInt(row[0], 10);
          const stock = parseInt(row[4], 10);
          if (!isNaN(id) && !isNaN(stock)) {
            stockMap[id] = Math.max(0, stock);
          }
        });
        if (Object.keys(stockMap).length > 0) {
          return stockMap;
        }
      }
    } catch (e) {
      console.warn("API fetch error, trying CSV export:", e);
    }
  }

  // Public CSV export fallback (works without auth if sheet is shared to anyone with link)
  try {
    const csvUrl = `https://docs.google.com/spreadsheets/d/${spreadsheetId}/export?format=csv`;
    const csvRes = await fetch(csvUrl);
    if (csvRes.ok) {
      const csvText = await csvRes.text();
      const lines = csvText.split(/\r?\n/).filter(Boolean);
      // Skip header line
      for (let i = 1; i < lines.length; i++) {
        const parts = lines[i].split(",");
        const id = parseInt(parts[0], 10);
        const stock = parseInt(parts[4], 10);
        if (!isNaN(id) && !isNaN(stock)) {
          stockMap[id] = Math.max(0, stock);
        }
      }
    }
  } catch (e) {
    console.warn("CSV fetch error:", e);
  }

  return stockMap;
};
