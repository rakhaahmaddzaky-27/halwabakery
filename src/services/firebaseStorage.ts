import { initializeApp, getApps } from "firebase/app";
import {
  getStorage,
  ref,
  uploadString,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import firebaseConfig from "@/firebase-applet-config.json";

// Initialize Firebase App if not already initialized
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

// Storage bucket from config: gen-lang-client-0797374072.firebasestorage.app
export const storageBucket = firebaseConfig.storageBucket || "gen-lang-client-0797374072.firebasestorage.app";
export const storage = getStorage(app, `gs://${storageBucket}`);

export interface UploadResult {
  url: string;
  storagePath: string;
}

/**
 * Checks whether an image URL is hosted on Firebase Storage.
 */
export function isFirebaseImageUrl(url?: string | null): boolean {
  if (!url || typeof url !== "string") return false;
  return url.includes("firebasestorage.googleapis.com") || url.includes(".appspot.com");
}

/**
 * Uploads a base64 Data URL to Firebase Storage.
 * Saves to halwa-products/product-{productId}-{timestamp}.jpg
 */
export async function uploadProductImageToFirebase(
  productId: number,
  dataUrl: string
): Promise<UploadResult> {
  if (!dataUrl || !dataUrl.startsWith("data:image/")) {
    throw new Error("Format gambar tidak valid. Gunakan format data URL base64.");
  }

  const timestamp = Date.now();
  const storagePath = `halwa-products/product-${productId}-${timestamp}.jpg`;
  const storageRef = ref(storage, storagePath);

  await uploadString(storageRef, dataUrl, "data_url", {
    contentType: "image/jpeg",
    customMetadata: {
      productId: String(productId),
      uploadedAt: new Date().toISOString(),
      source: "halwa-bakery-web",
    },
  });

  const downloadUrl = await getDownloadURL(storageRef);
  return { url: downloadUrl, storagePath };
}

/**
 * Uploads a hero banner image to Firebase Storage.
 */
export async function uploadHeroImageToFirebase(dataUrl: string): Promise<UploadResult> {
  if (!dataUrl || !dataUrl.startsWith("data:image/")) {
    throw new Error("Format gambar tidak valid. Gunakan format data URL base64.");
  }

  const timestamp = Date.now();
  const storagePath = `halwa-banners/hero-${timestamp}.jpg`;
  const storageRef = ref(storage, storagePath);

  await uploadString(storageRef, dataUrl, "data_url", {
    contentType: "image/jpeg",
    customMetadata: {
      type: "hero-banner",
      uploadedAt: new Date().toISOString(),
      source: "halwa-bakery-web",
    },
  });

  const downloadUrl = await getDownloadURL(storageRef);
  return { url: downloadUrl, storagePath };
}

/**
 * Deletes an image from Firebase Storage if given a storage path or firebase URL.
 */
export async function deleteImageFromFirebase(pathOrUrl: string): Promise<void> {
  try {
    let storageRef;
    if (pathOrUrl.startsWith("http://") || pathOrUrl.startsWith("https://")) {
      storageRef = ref(storage, pathOrUrl);
    } else {
      storageRef = ref(storage, pathOrUrl);
    }
    await deleteObject(storageRef);
  } catch (err) {
    console.warn("Gagal menghapus file dari Firebase Storage:", err);
  }
}
