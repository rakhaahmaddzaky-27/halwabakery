import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";

interface StoreData {
  spreadsheetId: string;
  spreadsheetUrl: string;
  stock: Record<number, number>;
  productImages: Record<number, string>;
  heroImage: string;
  lastSyncTime: string;
}

const DATA_DIR = path.join(process.cwd(), "data");
const DATA_FILE = path.join(DATA_DIR, "store.json");

const defaultData: StoreData = {
  spreadsheetId: "",
  spreadsheetUrl: "",
  stock: { 1: 15, 2: 12, 3: 10, 4: 8, 5: 4, 6: 15, 7: 20 },
  productImages: {},
  heroImage: "",
  lastSyncTime: "",
};

const PRODUCT_FILE_MAP: Record<number, string> = {
  1: "roti-sosis.jpg",
  2: "roti-keju.jpg",
  3: "roti-coklat.jpg",
  4: "roti-nanas.jpg",
  5: "roti-srikaya.jpg",
  6: "brownies.jpg",
  7: "kue-kacang.jpg",
};

function saveBase64ToFile(dataUrl: string, targetFilePaths: string[]): boolean {
  if (!dataUrl || typeof dataUrl !== "string") return false;
  const match = dataUrl.match(/^data:image\/[a-zA-Z0-9+-]+;base64,(.+)$/);
  if (!match || !match[1]) return false;
  try {
    const buffer = Buffer.from(match[1], "base64");
    for (const filePath of targetFilePaths) {
      const dir = path.dirname(filePath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      fs.writeFileSync(filePath, buffer);
    }
    return true;
  } catch (err) {
    console.error("Failed to save image file:", err);
    return false;
  }
}

function readStore(): StoreData {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (!fs.existsSync(DATA_FILE)) {
      fs.writeFileSync(DATA_FILE, JSON.stringify(defaultData, null, 2), "utf-8");
      return { ...defaultData };
    }
    const raw = fs.readFileSync(DATA_FILE, "utf-8");
    const parsed = JSON.parse(raw);
    return {
      ...defaultData,
      ...parsed,
      stock: { ...defaultData.stock, ...(parsed.stock || {}) },
      productImages: { ...(parsed.productImages || {}) },
    };
  } catch (e) {
    console.error("Error reading store.json:", e);
    return { ...defaultData };
  }
}

function writeStore(data: StoreData): void {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), "utf-8");
  } catch (e) {
    console.error("Error writing store.json:", e);
  }
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  // JSON middleware with increased payload limit for image data URLs
  app.use(express.json({ limit: "30mb" }));
  app.use(express.urlencoded({ extended: true, limit: "30mb" }));

  // Serve static assets directly from public/assets
  app.use("/assets", express.static(path.join(process.cwd(), "public", "assets")));

  // API Routes
  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok" });
  });

  // Get shared store state
  app.get("/api/store", (_req, res) => {
    const store = readStore();
    res.json(store);
  });

  // Update stock
  app.post("/api/store/stock", (req, res) => {
    const { stock, lastSyncTime } = req.body;
    if (!stock || typeof stock !== "object") {
      res.status(400).json({ error: "Invalid stock payload" });
      return;
    }
    const store = readStore();
    store.stock = { ...store.stock, ...stock };
    if (lastSyncTime) {
      store.lastSyncTime = lastSyncTime;
    }
    writeStore(store);
    res.json({ success: true, store });
  });

  // Deduct stock for new order
  app.post("/api/store/order", (req, res) => {
    const { items } = req.body; // Record<number, number>
    if (!items || typeof items !== "object") {
      res.status(400).json({ error: "Invalid order items" });
      return;
    }
    const store = readStore();
    for (const [idStr, qty] of Object.entries(items)) {
      const id = Number(idStr);
      const current = store.stock[id] ?? 0;
      const count = Number(qty) || 0;
      store.stock[id] = Math.max(0, current - count);
    }
    store.lastSyncTime = new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" });
    writeStore(store);
    res.json({ success: true, stock: store.stock, spreadsheetId: store.spreadsheetId });
  });

  // Update configuration (Spreadsheet ID & URL)
  app.post("/api/store/config", (req, res) => {
    const { spreadsheetId, spreadsheetUrl } = req.body;
    const store = readStore();
    if (typeof spreadsheetId === "string") {
      store.spreadsheetId = spreadsheetId;
    }
    if (typeof spreadsheetUrl === "string") {
      store.spreadsheetUrl = spreadsheetUrl;
    }
    writeStore(store);
    res.json({ success: true, store });
  });

  // Update product or hero images
  app.post("/api/store/images", (req, res) => {
    const { productImages, heroImage, resetAll } = req.body;
    const store = readStore();

    if (resetAll) {
      store.productImages = {};
    } else if (productImages && typeof productImages === "object") {
      store.productImages = { ...store.productImages, ...productImages };
      // Save each product image directly to public/assets/products/<filename>
      for (const [idStr, dataUrl] of Object.entries(productImages)) {
        const id = Number(idStr);
        const fileName = PRODUCT_FILE_MAP[id];
        if (fileName && typeof dataUrl === "string" && dataUrl.startsWith("data:image/")) {
          const targets = [
            path.join(process.cwd(), "public", "assets", "products", fileName),
            path.join(process.cwd(), "dist", "assets", "products", fileName),
          ];
          saveBase64ToFile(dataUrl, targets);
        }
      }
    }

    if (typeof heroImage === "string" && heroImage.trim() !== "") {
      store.heroImage = heroImage;
      if (heroImage.startsWith("data:image/")) {
        const targets = [
          path.join(process.cwd(), "public", "assets", "hero.jpg"),
          path.join(process.cwd(), "dist", "assets", "hero.jpg"),
          path.join(process.cwd(), "public", "assets", "current_hero.jpg"),
        ];
        saveBase64ToFile(heroImage, targets);
      }
    }

    writeStore(store);
    res.json({ success: true, productImages: store.productImages, heroImage: store.heroImage });
  });

  // Vite middleware for development vs static build for production
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: false,
      },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Halwa Bakery Server running on http://localhost:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("Failed to start Halwa Bakery server:", err);
});
