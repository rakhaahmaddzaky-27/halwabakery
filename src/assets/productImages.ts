// High-quality, warm bakery illustrations embedded as SVG data URIs
// Guarantees 100% reliable loading on all mobile networks without flaky third-party hosts

export const defaultProductImages: Record<number, string> = {
  // 1: Roti Sosis
  1: "data:image/svg+xml;utf8," + encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500" width="500" height="500">
      <defs>
        <radialGradient id="bg" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="#FFFDF9" />
          <stop offset="100%" stop-color="#F2E6D5" />
        </radialGradient>
        <radialGradient id="crust" cx="45%" cy="35%" r="65%">
          <stop offset="0%" stop-color="#FBD982" />
          <stop offset="60%" stop-color="#DE9F35" />
          <stop offset="100%" stop-color="#9B591E" />
        </radialGradient>
        <radialGradient id="sausage" cx="40%" cy="40%" r="55%">
          <stop offset="0%" stop-color="#CD4B32" />
          <stop offset="75%" stop-color="#982D1D" />
          <stop offset="100%" stop-color="#69190D" />
        </radialGradient>
      </defs>
      <rect width="500" height="500" fill="url(#bg)" />
      <!-- Shadow -->
      <ellipse cx="250" cy="400" rx="170" ry="35" fill="#3D2010" opacity="0.2" />
      <!-- Bun Body -->
      <ellipse cx="250" cy="250" rx="175" ry="145" fill="url(#crust)" />
      <!-- Crust highlight -->
      <path d="M120,220 Q250,140 380,220" stroke="#FFE9A7" stroke-width="12" fill="none" opacity="0.6" stroke-linecap="round" />
      <!-- Sausage Center -->
      <rect x="135" y="215" width="230" height="70" rx="35" fill="url(#sausage)" stroke="#521509" stroke-width="3" />
      <!-- Sausage Score Marks -->
      <line x1="180" y1="225" x2="195" y2="275" stroke="#FFE3DC" stroke-width="4" stroke-linecap="round" opacity="0.7" />
      <line x1="220" y1="223" x2="235" y2="277" stroke="#FFE3DC" stroke-width="4" stroke-linecap="round" opacity="0.7" />
      <line x1="265" y1="223" x2="280" y2="277" stroke="#FFE3DC" stroke-width="4" stroke-linecap="round" opacity="0.7" />
      <line x1="305" y1="225" x2="320" y2="275" stroke="#FFE3DC" stroke-width="4" stroke-linecap="round" opacity="0.7" />
      <!-- Mayonnaise / Cheese Drizzles -->
      <path d="M140,240 Q170,200 200,245 T260,245 T320,245 T360,240" fill="none" stroke="#FFF7D6" stroke-width="6" stroke-linecap="round" opacity="0.9" />
      <path d="M150,260 Q180,290 210,255 T270,255 T330,255 T350,260" fill="none" stroke="#F5CB42" stroke-width="5" stroke-linecap="round" opacity="0.85" />
      <!-- Parsley herbs -->
      <circle cx="190" cy="210" r="3.5" fill="#2E691A" />
      <circle cx="240" cy="205" r="3" fill="#2E691A" />
      <circle cx="290" cy="210" r="3.5" fill="#2E691A" />
      <circle cx="215" cy="290" r="3.5" fill="#2E691A" />
      <circle cx="275" cy="288" r="3" fill="#2E691A" />
      <!-- Brand seal -->
      <circle cx="250" cy="115" r="32" fill="#FFFFFF" stroke="#DE9F35" stroke-width="2" />
      <text x="250" y="112" font-family="serif" font-size="13" font-weight="bold" fill="#5A3623" text-anchor="middle">Halwa</text>
      <text x="250" y="125" font-family="sans-serif" font-size="6.5" font-weight="bold" fill="#C89B3C" text-anchor="middle">ROTI SOSIS</text>
    </svg>
  `),

  // 2: Roti Keju
  2: "data:image/svg+xml;utf8," + encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500" width="500" height="500">
      <defs>
        <radialGradient id="bg2" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="#FFFDF9" />
          <stop offset="100%" stop-color="#F2E6D5" />
        </radialGradient>
        <radialGradient id="breadGold2" cx="45%" cy="35%" r="65%">
          <stop offset="0%" stop-color="#FCE08C" />
          <stop offset="55%" stop-color="#E2A638" />
          <stop offset="100%" stop-color="#A15F22" />
        </radialGradient>
      </defs>
      <rect width="500" height="500" fill="url(#bg2)" />
      <!-- Shadow -->
      <ellipse cx="250" cy="400" rx="160" ry="32" fill="#3D2010" opacity="0.2" />
      <!-- Braided Bread Body -->
      <g transform="translate(250, 250)">
        <ellipse cx="-80" cy="0" rx="65" ry="90" fill="url(#breadGold2)" transform="rotate(-15)" />
        <ellipse cx="80" cy="0" rx="65" ry="90" fill="url(#breadGold2)" transform="rotate(15)" />
        <ellipse cx="0" cy="0" rx="80" ry="110" fill="url(#breadGold2)" />
        <!-- Braided Creases -->
        <path d="M-60,-50 Q0,0 60,-50" stroke="#68340E" stroke-width="7" fill="none" opacity="0.75" stroke-linecap="round" />
        <path d="M-70,10 Q0,60 70,10" stroke="#68340E" stroke-width="7" fill="none" opacity="0.75" stroke-linecap="round" />
        <!-- Golden gloss highlight -->
        <path d="M-40,-35 Q0,-5 40,-35" stroke="#FFF2B8" stroke-width="8" fill="none" opacity="0.7" stroke-linecap="round" />
        <path d="M-50,25 Q0,50 50,25" stroke="#FFF2B8" stroke-width="8" fill="none" opacity="0.7" stroke-linecap="round" />
        <!-- Grated Cheddar Cheese Shavings -->
        <g stroke="#FED955" stroke-width="4.5" stroke-linecap="round">
          <line x1="-50" y1="-20" x2="-20" y2="-15" />
          <line x1="-30" y1="-40" x2="-5" y2="-25" />
          <line x1="15" y1="-30" x2="45" y2="-20" />
          <line x1="25" y1="-10" x2="55" y2="5" />
          <line x1="-40" y1="20" x2="-10" y2="35" />
          <line x1="-15" y1="15" x2="20" y2="25" />
          <line x1="10" y1="35" x2="45" y2="40" />
          <line x1="-25" y1="55" x2="10" y2="65" />
        </g>
      </g>
      <!-- Brand seal -->
      <circle cx="250" cy="115" r="32" fill="#FFFFFF" stroke="#DE9F35" stroke-width="2" />
      <text x="250" y="112" font-family="serif" font-size="13" font-weight="bold" fill="#5A3623" text-anchor="middle">Halwa</text>
      <text x="250" y="125" font-family="sans-serif" font-size="6.5" font-weight="bold" fill="#C89B3C" text-anchor="middle">ROTI KEJU</text>
    </svg>
  `),

  // 3: Roti Coklat
  3: "data:image/svg+xml;utf8," + encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500" width="500" height="500">
      <defs>
        <radialGradient id="bg3" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="#FFFDF9" />
          <stop offset="100%" stop-color="#F2E6D5" />
        </radialGradient>
        <radialGradient id="breadGold3" cx="45%" cy="35%" r="65%">
          <stop offset="0%" stop-color="#FAD782" />
          <stop offset="60%" stop-color="#DA9C34" />
          <stop offset="100%" stop-color="#93541A" />
        </radialGradient>
        <radialGradient id="choco" cx="40%" cy="35%" r="60%">
          <stop offset="0%" stop-color="#542813" />
          <stop offset="70%" stop-color="#38190B" />
          <stop offset="100%" stop-color="#240D04" />
        </radialGradient>
      </defs>
      <rect width="500" height="500" fill="url(#bg3)" />
      <!-- Shadow -->
      <ellipse cx="250" cy="400" rx="165" ry="34" fill="#3D2010" opacity="0.2" />
      <!-- Bun Body -->
      <ellipse cx="250" cy="255" rx="170" ry="135" fill="url(#breadGold3)" />
      <!-- Crust Highlight -->
      <path d="M125,230 Q250,155 375,230" stroke="#FFE7A3" stroke-width="12" fill="none" opacity="0.6" stroke-linecap="round" />
      <!-- Rich Chocolate Drizzle Lines across the top -->
      <path d="M130,225 Q180,180 230,225 T330,225 T370,230" stroke="url(#choco)" stroke-width="14" fill="none" stroke-linecap="round" />
      <path d="M145,260 Q195,215 245,260 T345,260" stroke="url(#choco)" stroke-width="14" fill="none" stroke-linecap="round" />
      <path d="M165,295 Q215,250 265,295 T355,290" stroke="url(#choco)" stroke-width="12" fill="none" stroke-linecap="round" />
      <!-- Chocolate Shine -->
      <path d="M190,205 Q220,195 240,220" stroke="#874B29" stroke-width="4" fill="none" stroke-linecap="round" opacity="0.8" />
      <path d="M205,240 Q235,230 255,255" stroke="#874B29" stroke-width="4" fill="none" stroke-linecap="round" opacity="0.8" />
      <!-- Choco chips -->
      <polygon points="170,220 180,230 170,240 160,230" fill="#240D04" />
      <polygon points="310,240 320,250 310,260 300,250" fill="#240D04" />
      <polygon points="230,270 240,280 230,290 220,280" fill="#240D04" />
      <!-- Brand seal -->
      <circle cx="250" cy="115" r="32" fill="#FFFFFF" stroke="#DE9F35" stroke-width="2" />
      <text x="250" y="112" font-family="serif" font-size="13" font-weight="bold" fill="#5A3623" text-anchor="middle">Halwa</text>
      <text x="250" y="125" font-family="sans-serif" font-size="6.5" font-weight="bold" fill="#C89B3C" text-anchor="middle">ROTI COKLAT</text>
    </svg>
  `),

  // 4: Roti Nanas
  4: "data:image/svg+xml;utf8," + encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500" width="500" height="500">
      <defs>
        <radialGradient id="bg4" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="#FFFDF9" />
          <stop offset="100%" stop-color="#F2E6D5" />
        </radialGradient>
        <radialGradient id="goldSpiral" cx="40%" cy="40%" r="60%">
          <stop offset="0%" stop-color="#FFE885" />
          <stop offset="50%" stop-color="#E8A92A" />
          <stop offset="100%" stop-color="#A86518" />
        </radialGradient>
      </defs>
      <rect width="500" height="500" fill="url(#bg4)" />
      <!-- Shadow -->
      <ellipse cx="250" cy="405" rx="160" ry="32" fill="#3D2010" opacity="0.2" />
      <!-- Golden Seashell / Spiral Keong Emas Bun -->
      <g transform="translate(250, 255)">
        <ellipse cx="0" cy="0" rx="165" ry="135" fill="url(#goldSpiral)" />
        <!-- Seashell Grooves -->
        <path d="M-130,50 Q-60,-80 0,-110 Q60,-80 130,50" stroke="#7E420D" stroke-width="6" fill="none" opacity="0.75" />
        <path d="M-100,60 Q-40,-50 0,-80 Q40,-50 100,60" stroke="#7E420D" stroke-width="6" fill="none" opacity="0.75" />
        <path d="M-70,70 Q-20,-20 0,-40 Q20,-20 70,70" stroke="#7E420D" stroke-width="6" fill="none" opacity="0.75" />
        <!-- Glaze Highlights -->
        <path d="M-120,40 Q-50,-70 0,-95 Q50,-70 120,40" stroke="#FFF7C7" stroke-width="7" fill="none" opacity="0.6" />
        <!-- Pineapple Jam Peek (Warm golden amber drop) -->
        <circle cx="0" cy="65" r="28" fill="#F4B018" stroke="#D1880A" stroke-width="2.5" />
        <circle cx="-5" cy="58" r="7" fill="#FFF2B8" opacity="0.8" />
      </g>
      <!-- Brand seal -->
      <circle cx="250" cy="115" r="32" fill="#FFFFFF" stroke="#DE9F35" stroke-width="2" />
      <text x="250" y="112" font-family="serif" font-size="13" font-weight="bold" fill="#5A3623" text-anchor="middle">Halwa</text>
      <text x="250" y="125" font-family="sans-serif" font-size="6.5" font-weight="bold" fill="#C89B3C" text-anchor="middle">ROTI NANAS</text>
    </svg>
  `),

  // 5: Roti Srikaya
  5: "data:image/svg+xml;utf8," + encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500" width="500" height="500">
      <defs>
        <radialGradient id="bg5" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="#FFFDF9" />
          <stop offset="100%" stop-color="#F2E6D5" />
        </radialGradient>
        <radialGradient id="crust5" cx="45%" cy="35%" r="65%">
          <stop offset="0%" stop-color="#FDE599" />
          <stop offset="60%" stop-color="#E2A536" />
          <stop offset="100%" stop-color="#9E5D1E" />
        </radialGradient>
        <radialGradient id="srikayaJam" cx="40%" cy="40%" r="55%">
          <stop offset="0%" stop-color="#A5C962" />
          <stop offset="70%" stop-color="#6E9E2E" />
          <stop offset="100%" stop-color="#4B701B" />
        </radialGradient>
      </defs>
      <rect width="500" height="500" fill="url(#bg5)" />
      <!-- Shadow -->
      <ellipse cx="250" cy="400" rx="160" ry="32" fill="#3D2010" opacity="0.2" />
      <!-- Soft Bun Body -->
      <ellipse cx="250" cy="255" rx="165" ry="135" fill="url(#crust5)" />
      <path d="M125,230 Q250,155 375,230" stroke="#FFF0B8" stroke-width="12" fill="none" opacity="0.6" stroke-linecap="round" />
      <!-- Center Srikaya Custard Slit -->
      <ellipse cx="250" cy="255" rx="110" ry="40" fill="url(#srikayaJam)" stroke="#395914" stroke-width="2" />
      <!-- Glossy custard shine -->
      <path d="M180,245 Q250,230 320,245" stroke="#DEF0A5" stroke-width="6" fill="none" opacity="0.8" stroke-linecap="round" />
      <!-- Roasted Sesame Sprinkles -->
      <g fill="#FFFFFF" stroke="#D19C45" stroke-width="0.8">
        <ellipse cx="190" cy="190" rx="4" ry="2.5" transform="rotate(20 190 190)" />
        <ellipse cx="230" cy="180" rx="4" ry="2.5" transform="rotate(-15 230 180)" />
        <ellipse cx="270" cy="185" rx="4" ry="2.5" transform="rotate(35 270 185)" />
        <ellipse cx="310" cy="195" rx="4" ry="2.5" transform="rotate(-30 310 195)" />
        <ellipse cx="210" cy="320" rx="4" ry="2.5" transform="rotate(10 210 320)" />
        <ellipse cx="290" cy="320" rx="4" ry="2.5" transform="rotate(-20 290 320)" />
      </g>
      <!-- Brand seal -->
      <circle cx="250" cy="115" r="32" fill="#FFFFFF" stroke="#DE9F35" stroke-width="2" />
      <text x="250" y="112" font-family="serif" font-size="13" font-weight="bold" fill="#5A3623" text-anchor="middle">Halwa</text>
      <text x="250" y="125" font-family="sans-serif" font-size="6.5" font-weight="bold" fill="#C89B3C" text-anchor="middle">ROTI SRIKAYA</text>
    </svg>
  `),

  // 6: Dark Choco Brownies
  6: "data:image/svg+xml;utf8," + encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500" width="500" height="500">
      <defs>
        <radialGradient id="bg6" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="#FFFDF9" />
          <stop offset="100%" stop-color="#F2E6D5" />
        </radialGradient>
        <linearGradient id="brownieTop" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#3D1C0F" />
          <stop offset="50%" stop-color="#2B1208" />
          <stop offset="100%" stop-color="#1B0A04" />
        </linearGradient>
        <linearGradient id="brownieSide" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#2B1208" />
          <stop offset="100%" stop-color="#150602" />
        </linearGradient>
      </defs>
      <rect width="500" height="500" fill="url(#bg6)" />
      <!-- Shadow -->
      <ellipse cx="250" cy="410" rx="160" ry="30" fill="#3D2010" opacity="0.25" />
      <!-- 3D Isometric Brownie Slab -->
      <g transform="translate(250, 240)">
        <!-- Front Side -->
        <polygon points="-140,40 140,40 140,110 -140,110" fill="url(#brownieSide)" />
        <path d="M-140,40 L140,40" stroke="#5E2F1C" stroke-width="3" />
        <!-- Top Face (Glossy cracked brownie crust) -->
        <polygon points="-140,40 -90,-60 190,-60 140,40" fill="url(#brownieTop)" stroke="#4A2211" stroke-width="2" />
        <!-- Crinkly shiny top cracks -->
        <path d="M-100,-20 L-40,10 L20,-15 L80,15" stroke="#68341D" stroke-width="3" fill="none" opacity="0.8" />
        <path d="M-30,-40 L20,-30 L60,-5" stroke="#68341D" stroke-width="2.5" fill="none" opacity="0.8" />
        <!-- Toasted Almond Slices -->
        <ellipse cx="-50" cy="0" rx="22" ry="10" fill="#FBE6C2" stroke="#B87B40" stroke-width="2" transform="rotate(-25 -50 0)" />
        <ellipse cx="40" cy="-20" rx="24" ry="11" fill="#FBE6C2" stroke="#B87B40" stroke-width="2" transform="rotate(35 40 -20)" />
        <ellipse cx="100" cy="10" rx="20" ry="9" fill="#FBE6C2" stroke="#B87B40" stroke-width="2" transform="rotate(-15 100 10)" />
        <ellipse cx="0" cy="20" rx="20" ry="9" fill="#FBE6C2" stroke="#B87B40" stroke-width="2" transform="rotate(60 0 20)" />
        <ellipse cx="-90" cy="-35" rx="18" ry="8" fill="#FBE6C2" stroke="#B87B40" stroke-width="2" transform="rotate(10 -90 -35)" />
        <!-- Dark Chocochips -->
        <polygon points="-20,-10 -10,0 -20,10 -30,0" fill="#0F0502" />
        <polygon points="60,-35 70,-25 60,-15 50,-25" fill="#0F0502" />
        <polygon points="70,25 80,35 70,45 60,35" fill="#0F0502" />
      </g>
      <!-- Brand seal -->
      <circle cx="250" cy="105" r="32" fill="#FFFFFF" stroke="#DE9F35" stroke-width="2" />
      <text x="250" y="102" font-family="serif" font-size="13" font-weight="bold" fill="#5A3623" text-anchor="middle">Halwa</text>
      <text x="250" y="115" font-family="sans-serif" font-size="6.5" font-weight="bold" fill="#C89B3C" text-anchor="middle">BROWNIES</text>
    </svg>
  `),

  // 7: Kue Kacang
  7: "data:image/svg+xml;utf8," + encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500" width="500" height="500">
      <defs>
        <radialGradient id="bg7" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="#FFFDF9" />
          <stop offset="100%" stop-color="#F2E6D5" />
        </radialGradient>
        <radialGradient id="cookie" cx="40%" cy="35%" r="65%">
          <stop offset="0%" stop-color="#FFE49E" />
          <stop offset="55%" stop-color="#E5A63C" />
          <stop offset="100%" stop-color="#A56218" />
        </radialGradient>
      </defs>
      <rect width="500" height="500" fill="url(#bg7)" />
      <!-- Shadow -->
      <ellipse cx="250" cy="405" rx="145" ry="30" fill="#3D2010" opacity="0.2" />
      <!-- Heart-Shaped Peanut Cookie -->
      <g transform="translate(250, 245)">
        <path d="M0,80 C-150,0 -150,-110 -50,-110 C-15,-110 0,-70 0,-50 C0,-70 15,-110 50,-110 C150,-110 150,0 0,80 Z" fill="url(#cookie)" stroke="#8C4D0F" stroke-width="4" />
        <!-- Shiny Egg Wash Crust Highlight -->
        <path d="M-40,-85 C-10,-85 0,-55 0,-40 C0,-55 10,-85 40,-85" stroke="#FFF7CC" stroke-width="8" fill="none" opacity="0.65" stroke-linecap="round" />
        <!-- Roasted Black & White Sesame Seeds -->
        <g fill="#1F130B">
          <circle cx="-35" cy="-40" r="3" />
          <circle cx="20" cy="-50" r="3" />
          <circle cx="-15" cy="-20" r="3" />
          <circle cx="35" cy="-20" r="3" />
          <circle cx="-45" cy="0" r="3" />
          <circle cx="0" cy="10" r="3.5" />
          <circle cx="45" cy="15" r="3" />
          <circle cx="-10" cy="40" r="3" />
          <circle cx="20" cy="45" r="3" />
        </g>
        <g fill="#FFFFFF" opacity="0.85">
          <circle cx="-25" cy="-55" r="3" />
          <circle cx="40" cy="-45" r="3" />
          <circle cx="5" cy="-30" r="3" />
          <circle cx="-40" cy="-15" r="3" />
          <circle cx="20" cy="0" r="3" />
          <circle cx="-25" cy="20" r="3" />
          <circle cx="35" cy="30" r="3" />
          <circle cx="0" cy="55" r="3" />
        </g>
      </g>
      <!-- Brand seal -->
      <circle cx="250" cy="100" r="32" fill="#FFFFFF" stroke="#DE9F35" stroke-width="2" />
      <text x="250" y="97" font-family="serif" font-size="13" font-weight="bold" fill="#5A3623" text-anchor="middle">Halwa</text>
      <text x="250" y="110" font-family="sans-serif" font-size="6.5" font-weight="bold" fill="#C89B3C" text-anchor="middle">KUE KACANG</text>
    </svg>
  `),
};
