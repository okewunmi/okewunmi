// Generates assets/hero.svg — the top banner on the profile README.
// Run with: node scripts/generate-hero.js
// Edit NAME / TAGLINE / SUBLINE below to change the wording, no design tool needed.

import fs from "node:fs";
import path from "node:path";

const NAME = "Afeez Okewunmi";
const TAGLINE = "Full-stack & mobile developer — Lagos, Nigeria";
const SUBLINE =
  "React Native · Next.js · Supabase — building tools for African developers & users";

function heroSvg() {
  const width = 900;
  const height = 220;
  return `<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#0d1117"/>
      <stop offset="100%" stop-color="#0f2e1d"/>
    </linearGradient>
  </defs>
  <rect width="${width}" height="${height}" rx="16" fill="url(#bg)"/>
  <rect x="1" y="1" width="${width - 2}" height="${height - 2}" rx="16" fill="none" stroke="#30363d"/>
  <text x="40" y="90" font-family="Segoe UI, Helvetica, Arial, sans-serif" font-size="38" font-weight="800" fill="#e6edf3">${NAME}</text>
  <text x="40" y="130" font-family="Segoe UI, Helvetica, Arial, sans-serif" font-size="20" fill="#00c264" font-weight="600">${TAGLINE}</text>
  <text x="40" y="160" font-family="Segoe UI, Helvetica, Arial, sans-serif" font-size="15" fill="#8b949e">${SUBLINE}</text>
  <rect x="40" y="180" width="6" height="6" fill="#00c264"/>
</svg>`;
}

const outDir = path.resolve("assets");
fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(path.join(outDir, "hero.svg"), heroSvg());
console.log("Generated assets/hero.svg");
