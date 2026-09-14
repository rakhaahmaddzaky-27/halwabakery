// Fallback SVGs for Halwa Bakery branding and products with official brand palette
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

export const heroFallback =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 900" width="1200" height="900">
  <defs>
    <!-- Background kitchen sunlight -->
    <linearGradient id="bgGrad" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#F2E6D5" />
      <stop offset="50%" stop-color="#E8D7C0" />
      <stop offset="100%" stop-color="#8C5838" />
    </linearGradient>
    
    <!-- Wooden table -->
    <linearGradient id="woodGrad" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#7C4B2B" />
      <stop offset="50%" stop-color="#9A5E35" />
      <stop offset="100%" stop-color="#6F4125" />
    </linearGradient>

    <!-- Linen cloth -->
    <linearGradient id="clothGrad" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#F7F1E6" />
      <stop offset="100%" stop-color="#E2D6C2" />
    </linearGradient>

    <!-- Bread golden crust -->
    <radialGradient id="breadGold" cx="45%" cy="40%" r="60%">
      <stop offset="0%" stop-color="#F9D77E" />
      <stop offset="60%" stop-color="#DE9F35" />
      <stop offset="100%" stop-color="#96581C" />
    </radialGradient>

    <!-- Sausage slice -->
    <radialGradient id="sausage" cx="40%" cy="40%" r="50%">
      <stop offset="0%" stop-color="#C25942" />
      <stop offset="85%" stop-color="#8E2D1E" />
      <stop offset="100%" stop-color="#651C12" />
    </radialGradient>

    <!-- Cheese melt -->
    <linearGradient id="cheese" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#FFF5D6" />
      <stop offset="100%" stop-color="#F0CA50" />
    </linearGradient>
  </defs>

  <!-- Background wall & warm bokeh -->
  <rect width="1200" height="900" fill="url(#bgGrad)" />
  <circle cx="200" cy="180" r="140" fill="#FFF2DC" opacity="0.3" filter="blur(30px)" />
  <circle cx="950" cy="220" r="180" fill="#FFF2DC" opacity="0.25" filter="blur(40px)" />

  <!-- Wooden tabletop -->
  <path d="M0,380 L1200,380 L1200,900 L0,900 Z" fill="url(#woodGrad)" />
  <!-- Wood grain lines -->
  <line x1="0" y1="460" x2="1200" y2="470" stroke="#5E331B" stroke-width="2" opacity="0.4" />
  <line x1="0" y1="580" x2="1200" y2="590" stroke="#5E331B" stroke-width="1.5" opacity="0.3" />
  <line x1="0" y1="720" x2="1200" y2="730" stroke="#5E331B" stroke-width="2" opacity="0.4" />

  <!-- Textured linen napkin -->
  <path d="M80,510 L1120,490 L1080,870 L140,885 Z" fill="url(#clothGrad)" stroke="#D4C4AC" stroke-width="2" />
  <path d="M120,530 L1090,510 L1055,850 L165,865 Z" fill="none" stroke="#CBB99F" stroke-width="1" stroke-dasharray="6 4" opacity="0.6" />

  <!-- Wheat grains scattered in foreground -->
  <g fill="#D8A552" stroke="#8F5E24" stroke-width="0.8">
    <ellipse cx="280" cy="740" rx="9" ry="5" transform="rotate(-25 280 740)" />
    <ellipse cx="310" cy="760" rx="8" ry="4.5" transform="rotate(15 310 760)" />
    <ellipse cx="250" cy="770" rx="9" ry="5" transform="rotate(40 250 770)" />
    <ellipse cx="360" cy="790" rx="8" ry="4.5" transform="rotate(-60 360 790)" />
    <ellipse cx="880" cy="760" rx="9" ry="5" transform="rotate(20 880 760)" />
    <ellipse cx="910" cy="745" rx="8.5" ry="4.5" transform="rotate(-35 910 745)" />
    <ellipse cx="940" cy="780" rx="9" ry="5" transform="rotate(50 940 780)" />
  </g>

  <!-- Wheat stalk sprig on linen -->
  <g transform="translate(850, 720) rotate(-20)">
    <line x1="-140" y1="20" x2="80" y2="-10" stroke="#C89B3C" stroke-width="3" stroke-linecap="round" />
    <ellipse cx="-40" cy="5" rx="14" ry="7" fill="#DEB155" transform="rotate(-30 -40 5)" />
    <ellipse cx="-20" cy="2" rx="14" ry="7" fill="#DEB155" transform="rotate(30 -20 2)" />
    <ellipse cx="5" cy="-2" rx="14" ry="7" fill="#DEB155" transform="rotate(-30 5 -2)" />
    <ellipse cx="25" cy="-5" rx="14" ry="7" fill="#DEB155" transform="rotate(30 25 -5)" />
    <ellipse cx="50" cy="-8" rx="14" ry="7" fill="#DEB155" transform="rotate(-30 50 -8)" />
    <ellipse cx="75" cy="-12" rx="12" ry="6" fill="#DEB155" transform="rotate(10 75 -12)" />
  </g>

  <!-- ================= LEFT BREAD: BRAIDED SWEET BREAD ================= -->
  <g transform="translate(260, 520)">
    <!-- Shadow -->
    <ellipse cx="0" cy="110" rx="160" ry="40" fill="#3D2010" opacity="0.35" />
    <!-- Paper cup liner -->
    <path d="M-150,70 L-130,110 L130,110 L150,70 Z" fill="#F4EDE0" stroke="#D1C3AD" stroke-width="2" />
    <!-- Bread body -->
    <ellipse cx="0" cy="50" rx="145" ry="110" fill="url(#breadGold)" />
    <!-- Braided swirls -->
    <path d="M-110,60 C-90,10 -30,10 0,55 C30,10 90,10 110,60" fill="none" stroke="#68340E" stroke-width="7" stroke-linecap="round" opacity="0.75" />
    <path d="M-70,45 C-40,0 40,0 70,45" fill="none" stroke="#FEE8A3" stroke-width="8" stroke-linecap="round" opacity="0.6" />
    <!-- Halwa sticker -->
    <circle cx="0" cy="30" r="38" fill="#FFFFFF" stroke="#E3D7C5" stroke-width="1.5" />
    <text x="0" y="27" font-family="'Playfair Display', serif" font-size="16" font-weight="bold" fill="#5A3623" text-anchor="middle">Halwa</text>
    <text x="0" y="42" font-family="sans-serif" font-size="7" font-weight="bold" fill="#C89B3C" text-anchor="middle" letter-spacing="1">100% HALAL</text>
  </g>

  <!-- ================= RIGHT BREAD: TWISTED KNOT BREAD ================= -->
  <g transform="translate(940, 530)">
    <!-- Shadow -->
    <ellipse cx="0" cy="110" rx="160" ry="40" fill="#3D2010" opacity="0.35" />
    <!-- Paper liner -->
    <path d="M-150,70 L-130,110 L130,110 L150,70 Z" fill="#F4EDE0" stroke="#D1C3AD" stroke-width="2" />
    <!-- Bread body -->
    <ellipse cx="0" cy="50" rx="145" ry="110" fill="url(#breadGold)" />
    <!-- Knot fold grooves -->
    <path d="M-100,50 Q-20,0 20,65 Q60,20 100,50" fill="none" stroke="#68340E" stroke-width="7" stroke-linecap="round" opacity="0.75" />
    <path d="M-50,30 Q0,-10 50,30" fill="none" stroke="#FEE8A3" stroke-width="7" stroke-linecap="round" opacity="0.6" />
    <!-- Halwa sticker -->
    <circle cx="0" cy="30" r="38" fill="#FFFFFF" stroke="#E3D7C5" stroke-width="1.5" />
    <text x="0" y="27" font-family="'Playfair Display', serif" font-size="16" font-weight="bold" fill="#5A3623" text-anchor="middle">Halwa</text>
    <text x="0" y="42" font-family="sans-serif" font-size="7" font-weight="bold" fill="#C89B3C" text-anchor="middle" letter-spacing="1">100% HALAL</text>
  </g>

  <!-- ================= CENTER BREAD: SAUSAGE & CHEESE PIZZA BREAD ================= -->
  <g transform="translate(600, 470)">
    <!-- Shadow -->
    <ellipse cx="0" cy="170" rx="220" ry="50" fill="#35180A" opacity="0.45" />
    <!-- Fluted white baking cup -->
    <path d="M-210,120 L-180,180 L180,180 L210,120 Z" fill="#FFFFFF" stroke="#E0D6C6" stroke-width="2.5" />
    <!-- Round golden bun -->
    <circle cx="0" cy="80" r="195" fill="url(#breadGold)" />

    <!-- Melted cheese ribbons -->
    <path d="M-140,50 Q-80,10 0,40 Q80,20 140,60 Q90,140 0,130 Q-90,140 -140,50 Z" fill="url(#cheese)" opacity="0.88" />

    <!-- Sausage slices (coins) -->
    <!-- Slice top -->
    <circle cx="30" cy="-40" r="28" fill="url(#sausage)" stroke="#52140A" stroke-width="1.5" />
    <!-- Slice top-left -->
    <circle cx="-65" cy="-25" r="26" fill="url(#sausage)" stroke="#52140A" stroke-width="1.5" />
    <!-- Slice top-right -->
    <circle cx="105" cy="-10" r="26" fill="url(#sausage)" stroke="#52140A" stroke-width="1.5" />
    <!-- Slice mid-left -->
    <circle cx="-120" cy="50" r="27" fill="url(#sausage)" stroke="#52140A" stroke-width="1.5" />
    <!-- Slice mid-right -->
    <circle cx="125" cy="65" r="27" fill="url(#sausage)" stroke="#52140A" stroke-width="1.5" />
    <!-- Slice bottom-left -->
    <circle cx="-90" cy="130" r="26" fill="url(#sausage)" stroke="#52140A" stroke-width="1.5" />
    <!-- Slice bottom-center -->
    <circle cx="10" cy="155" r="29" fill="url(#sausage)" stroke="#52140A" stroke-width="1.5" />
    <!-- Slice bottom-right -->
    <circle cx="110" cy="140" r="26" fill="url(#sausage)" stroke="#52140A" stroke-width="1.5" />

    <!-- Parsley / herb flakes -->
    <circle cx="-30" cy="10" r="3" fill="#2E5C1B" />
    <circle cx="50" cy="25" r="3" fill="#2E5C1B" />
    <circle cx="-80" cy="80" r="2.5" fill="#2E5C1B" />
    <circle cx="70" cy="100" r="3" fill="#2E5C1B" />
    <circle cx="-20" cy="115" r="2.5" fill="#2E5C1B" />

    <!-- Circular Halwa Bakery official brand sticker on center bun -->
    <circle cx="0" cy="65" r="54" fill="#FFFFFF" stroke="#E5D9C8" stroke-width="2.5" filter="drop-shadow(0 3px 6px rgba(0,0,0,0.18))" />
    <!-- Wheat and arc inside sticker -->
    <path d="M-15,48 C-13,35 -5,28 0,28 C5,28 13,35 15,48" fill="none" stroke="#C89B3C" stroke-width="1.5" />
    <line x1="0" y1="42" x2="0" y2="33" stroke="#C89B3C" stroke-width="1.2" />
    <text x="0" y="65" font-family="'Playfair Display', Georgia, serif" font-size="22" font-weight="bold" fill="#5A3623" text-anchor="middle">Halwa</text>
    <text x="0" y="79" font-family="sans-serif" font-size="8" font-weight="900" fill="#C89B3C" text-anchor="middle" letter-spacing="2">BAKERY</text>
    <rect x="-24" y="85" width="48" height="12" rx="3" fill="#F7F2E8" />
    <text x="0" y="94" font-family="sans-serif" font-size="6.5" font-weight="bold" fill="#5A3623" text-anchor="middle">100% HALAL</text>
  </g>
</svg>
`);

export const productFallbackImage = (name: string, category: string) =>
  "data:image/svg+xml;utf8," +
  encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 600" width="600" height="600">
  <defs>
    <linearGradient id="pGrad" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#FFFFFF" />
      <stop offset="100%" stop-color="#F7F2E8" />
    </linearGradient>
    <radialGradient id="pCenter" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#E2B755" />
      <stop offset="100%" stop-color="#C89B3C" />
    </radialGradient>
  </defs>
  <rect width="600" height="600" fill="url(#pGrad)" />
  <circle cx="300" cy="270" r="160" fill="url(#pCenter)" opacity="0.95" />
  <circle cx="300" cy="270" r="130" fill="none" stroke="#FFFFFF" stroke-width="6" stroke-dasharray="14 10" opacity="0.85" />
  <text x="300" y="270" font-family="'Playfair Display', serif" font-size="70" font-weight="bold" fill="#FFFFFF" text-anchor="middle" dominant-baseline="middle">HALWA</text>
  <text x="300" y="475" font-family="'Playfair Display', serif" font-size="34" font-weight="bold" fill="#5A3623" text-anchor="middle">${name}</text>
  <text x="300" y="515" font-family="'Plus Jakarta Sans', sans-serif" font-size="18" font-weight="700" fill="#C89B3C" text-anchor="middle" letter-spacing="2">${category.toUpperCase()} • 100% HALAL</text>
</svg>
`);
