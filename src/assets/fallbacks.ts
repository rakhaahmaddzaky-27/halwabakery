import { REAL_HERO_IMAGE, REAL_PRODUCT_IMAGES } from "./realPhotos.ts";

// Fallback SVG for Halwa Bakery logo branding
export const halwaMark =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="95 65 310 295" width="310" height="295">
  <g transform="translate(250, 190)">
    <path d="M-82,25 C-76,-62 -30,-112 0,-112 C34,-112 74,-66 84,28" 
          fill="none" 
          stroke="#C89B3C" 
          stroke-width="5.5" 
          stroke-linecap="round" />
    <g transform="translate(0, -68)">
      <line x1="0" y1="36" x2="0" y2="-28" stroke="#C89B3C" stroke-width="4" stroke-linecap="round" />
      <path d="M0,-28 C-3,-36 0,-43 0,-44 C0,-43 3,-36 0,-28 Z" fill="#C89B3C" />
      <path d="M0,-20 C-9,-27 -14,-18 -7,-12 C-3,-9 0,-13 0,-20 Z" fill="#C89B3C" />
      <path d="M0,-20 C9,-27 14,-18 7,-12 C3,-9 0,-13 0,-20 Z" fill="#C89B3C" />
      <path d="M0,-8 C-11,-16 -16,-7 -9,0 C-4,3 0,-1 0,-8 Z" fill="#C89B3C" />
      <path d="M0,-8 C11,-16 16,-7 9,0 C4,3 0,-1 0,-8 Z" fill="#C89B3C" />
      <path d="M0,5 C-12,-3 -17,6 -10,12 C-5,15 0,11 0,5 Z" fill="#C89B3C" />
      <path d="M0,5 C12,-3 17,6 10,12 C5,15 0,11 0,5 Z" fill="#C89B3C" />
      <path d="M0,18 C-12,11 -16,19 -9,25 C-5,28 0,24 0,18 Z" fill="#C89B3C" />
      <path d="M0,18 C12,11 16,19 9,25 C5,28 0,24 0,18 Z" fill="#C89B3C" />
    </g>
  </g>
  <text x="250" y="295" 
        font-family="'Playfair Display', Georgia, 'Times New Roman', serif" 
        font-size="98" 
        font-weight="700" 
        fill="#5A3623" 
        text-anchor="middle" 
        letter-spacing="-1">Halwa</text>
  <text x="250" y="342" 
        font-family="'Plus Jakarta Sans', ui-sans-serif, system-ui, sans-serif" 
        font-size="22" 
        font-weight="800" 
        fill="#C89B3C" 
        text-anchor="middle" 
        letter-spacing="9">BAKERY</text>
</svg>
`);

// 100% Authentic Halwa Bakery Hero Photography (NO cartoon drawings)
export const heroFallback = REAL_HERO_IMAGE;

// Fallback matching directly to the authentic bakery photo
export const productFallbackImage = (name: string, _category: string): string => {
  const lower = (name || "").toLowerCase();
  if (lower.includes("sosis")) return REAL_PRODUCT_IMAGES[1];
  if (lower.includes("keju")) return REAL_PRODUCT_IMAGES[2];
  if (lower.includes("coklat") || lower.includes("cokelat")) return REAL_PRODUCT_IMAGES[3];
  if (lower.includes("nanas")) return REAL_PRODUCT_IMAGES[4];
  if (lower.includes("srikaya")) return REAL_PRODUCT_IMAGES[5];
  if (lower.includes("brownies")) return REAL_PRODUCT_IMAGES[6];
  if (lower.includes("kacang")) return REAL_PRODUCT_IMAGES[7];
  return REAL_PRODUCT_IMAGES[1];
};
