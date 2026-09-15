const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

// 1. Full standard icon SVG (Warm cream background, refined gold border, centered Halwa Bakery logo from photo 2)
const createStandardSvg = (size, scale = 1, withBorder = true) => `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="${size}" height="${size}">
  <defs>
    <radialGradient id="creamBg" cx="50%" cy="46%" r="62%">
      <stop offset="0%" stop-color="#FFFDF9" />
      <stop offset="65%" stop-color="#FAF6EF" />
      <stop offset="100%" stop-color="#F2ECE0" />
    </radialGradient>
    <filter id="logoShadow" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="0" dy="3" stdDeviation="5" flood-color="#5A3623" flood-opacity="0.08" />
    </filter>
  </defs>

  <!-- Clean warm cream canvas -->
  <rect width="512" height="512" fill="url(#creamBg)" />

  ${withBorder ? `
  <!-- Elegant warm golden border for contrast against dark or light phone wallpapers -->
  <rect x="14" y="14" width="484" height="484" rx="108" fill="none" stroke="#C89B3C" stroke-width="4.5" stroke-opacity="0.4" />
  <rect x="22" y="22" width="468" height="468" rx="100" fill="none" stroke="#5A3623" stroke-width="1.2" stroke-opacity="0.12" />
  ` : ''}

  <!-- Halwa Bakery Logo (exact match to Photo 2) -->
  <g transform="translate(256, 252) scale(${scale})" filter="url(#logoShadow)">
    <!-- Golden Arched Crescent & Wheat Stalk -->
    <g transform="translate(0, -68)">
      <!-- Golden Crescent Arc -->
      <path d="M-86,28 C-80,-64 -32,-116 0,-116 C36,-116 80,-68 90,32" 
            fill="none" 
            stroke="#C89B3C" 
            stroke-width="5.8" 
            stroke-linecap="round" />
      
      <!-- Wheat Stalk -->
      <g transform="translate(0, -70)">
        <line x1="0" y1="38" x2="0" y2="-28" stroke="#C89B3C" stroke-width="4.2" stroke-linecap="round" />
        <path d="M0,-28 C-3,-36 0,-44 0,-45 C0,-44 3,-36 0,-28 Z" fill="#C89B3C" />
        <path d="M0,-20 C-10,-28 -15,-18 -7,-12 C-3,-9 0,-13 0,-20 Z" fill="#C89B3C" />
        <path d="M0,-20 C10,-28 15,-18 7,-12 C3,-9 0,-13 0,-20 Z" fill="#C89B3C" />
        <path d="M0,-8 C-12,-16 -17,-7 -9,0 C-4,3 0,-1 0,-8 Z" fill="#C89B3C" />
        <path d="M0,-8 C12,-16 17,-7 9,0 C4,3 0,-1 0,-8 Z" fill="#C89B3C" />
        <path d="M0,5 C-13,-3 -18,6 -11,12 C-5,15 0,11 0,5 Z" fill="#C89B3C" />
        <path d="M0,5 C13,-3 18,6 11,12 C5,15 0,11 0,5 Z" fill="#C89B3C" />
        <path d="M0,18 C-13,11 -17,19 -10,25 C-5,28 0,24 0,18 Z" fill="#C89B3C" />
        <path d="M0,18 C13,11 17,19 10,25 C5,28 0,24 0,18 Z" fill="#C89B3C" />
      </g>
    </g>

    <!-- Halwa Typography (Serif, Deep Rich Chocolate Brown) -->
    <text x="0" y="44" 
          font-family="Playfair Display, Georgia, serif" 
          font-size="106" 
          font-weight="700" 
          fill="#542817" 
          text-anchor="middle" 
          letter-spacing="-1">Halwa</text>

    <!-- BAKERY Subtitle (Warm Golden Ochre with wide tracking) -->
    <text x="0" y="96" 
          font-family="Plus Jakarta Sans, system-ui, sans-serif" 
          font-size="25" 
          font-weight="800" 
          fill="#C89B3C" 
          text-anchor="middle" 
          letter-spacing="10">BAKERY</text>
  </g>
</svg>
`;

// 2. Android Maskable Icon (Full bleed cream background, no border, logo safely inside the 80% circle)
const createMaskableSvg = (size) => `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="${size}" height="${size}">
  <defs>
    <radialGradient id="creamBgMask" cx="50%" cy="46%" r="62%">
      <stop offset="0%" stop-color="#FFFDF9" />
      <stop offset="65%" stop-color="#FAF6EF" />
      <stop offset="100%" stop-color="#F2ECE0" />
    </radialGradient>
    <filter id="maskShadow" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="0" dy="3" stdDeviation="5" flood-color="#5A3623" flood-opacity="0.08" />
    </filter>
  </defs>

  <!-- Full-bleed background for Android squircle safe-zone -->
  <rect width="512" height="512" fill="url(#creamBgMask)" />

  <!-- Logo Group centered inside 80% safe circle (scale: 0.85) -->
  <g transform="translate(256, 252) scale(0.85)" filter="url(#maskShadow)">
    <g transform="translate(0, -68)">
      <path d="M-86,28 C-80,-64 -32,-116 0,-116 C36,-116 80,-68 90,32" 
            fill="none" 
            stroke="#C89B3C" 
            stroke-width="5.8" 
            stroke-linecap="round" />
      
      <g transform="translate(0, -70)">
        <line x1="0" y1="38" x2="0" y2="-28" stroke="#C89B3C" stroke-width="4.2" stroke-linecap="round" />
        <path d="M0,-28 C-3,-36 0,-44 0,-45 C0,-44 3,-36 0,-28 Z" fill="#C89B3C" />
        <path d="M0,-20 C-10,-28 -15,-18 -7,-12 C-3,-9 0,-13 0,-20 Z" fill="#C89B3C" />
        <path d="M0,-20 C10,-28 15,-18 7,-12 C3,-9 0,-13 0,-20 Z" fill="#C89B3C" />
        <path d="M0,-8 C-12,-16 -17,-7 -9,0 C-4,3 0,-1 0,-8 Z" fill="#C89B3C" />
        <path d="M0,-8 C12,-16 17,-7 9,0 C4,3 0,-1 0,-8 Z" fill="#C89B3C" />
        <path d="M0,5 C-13,-3 -18,6 -11,12 C-5,15 0,11 0,5 Z" fill="#C89B3C" />
        <path d="M0,5 C13,-3 18,6 11,12 C5,15 0,11 0,5 Z" fill="#C89B3C" />
        <path d="M0,18 C-13,11 -17,19 -10,25 C-5,28 0,24 0,18 Z" fill="#C89B3C" />
        <path d="M0,18 C13,11 17,19 10,25 C5,28 0,24 0,18 Z" fill="#C89B3C" />
      </g>
    </g>

    <text x="0" y="44" 
          font-family="Playfair Display, Georgia, serif" 
          font-size="106" 
          font-weight="700" 
          fill="#542817" 
          text-anchor="middle" 
          letter-spacing="-1">Halwa</text>

    <text x="0" y="96" 
          font-family="Plus Jakarta Sans, system-ui, sans-serif" 
          font-size="25" 
          font-weight="800" 
          fill="#C89B3C" 
          text-anchor="middle" 
          letter-spacing="10">BAKERY</text>
  </g>
</svg>
`;

async function generate() {
  const publicDir = path.join(__dirname, '..', 'public');

  // Save SVG files
  const std512Svg = createStandardSvg(512, 1, true);
  const std192Svg = createStandardSvg(192, 1, true);
  const maskableSvg = createMaskableSvg(512);

  fs.writeFileSync(path.join(publicDir, 'pwa-512x512.svg'), std512Svg);
  fs.writeFileSync(path.join(publicDir, 'pwa-192x192.svg'), std192Svg);
  fs.writeFileSync(path.join(publicDir, 'apple-touch-icon.svg'), std512Svg);
  fs.writeFileSync(path.join(publicDir, 'pwa-maskable-512x512.svg'), maskableSvg);

  // Generate PNGs via Sharp
  await sharp(Buffer.from(std512Svg)).png().toFile(path.join(publicDir, 'pwa-512x512.png'));
  console.log('Generated pwa-512x512.png');

  await sharp(Buffer.from(std192Svg)).resize(192, 192).png().toFile(path.join(publicDir, 'pwa-192x192.png'));
  console.log('Generated pwa-192x192.png');

  await sharp(Buffer.from(std512Svg)).resize(180, 180).png().toFile(path.join(publicDir, 'apple-touch-icon.png'));
  console.log('Generated apple-touch-icon.png');

  await sharp(Buffer.from(maskableSvg)).resize(512, 512).png().toFile(path.join(publicDir, 'pwa-maskable-512x512.png'));
  console.log('Generated pwa-maskable-512x512.png');

  console.log('All icons generated successfully!');
}

generate().catch(console.error);
