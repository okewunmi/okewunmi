// scripts/generate-hero.js
// Generates the profile hero banner as an SVG and writes it to assets/hero.svg.
// Run via `npm run generate`. The GitHub Action publishes assets/ to the
// `live-stats` branch so the banner can be embedded with a stable raw URL.

import { writeFileSync, mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ASSETS_DIR = join(__dirname, "..", "assets");

const NAME = "Afeez Okewunmi";
const TAGLINE = "Full-Stack & Mobile Developer · Lagos, Nigeria";
const SUBLINE =
  "React Native · Next.js · Supabase — building products end-to-end.";
const HANDLE = "GITHUB.COM/OKEWUNMI";

const WIDTH = 1200;
const HEIGHT = 300;

const BG = "#0a0a0a";
const GRID = "#161616";
const ACCENT = "#00C264";
const TEXT = "#f5f5f5";
const MUTED = "#9ca3af";
const FONT = "'Segoe UI', Helvetica, Arial, sans-serif";

function gridLines() {
  let out = "";
  for (let x = 0; x <= WIDTH; x += 40) {
    out += `<line x1="${x}" y1="0" x2="${x}" y2="${HEIGHT}" stroke="${GRID}" stroke-width="1"/>`;
  }
  for (let y = 0; y <= HEIGHT; y += 40) {
    out += `<line x1="0" y1="${y}" x2="${WIDTH}" y2="${y}" stroke="${GRID}" stroke-width="1"/>`;
  }
  return out;
}

function escapeXml(str) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

const svg = `<svg width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${escapeXml(
  NAME
)} — ${escapeXml(TAGLINE)}">
  <rect width="${WIDTH}" height="${HEIGHT}" fill="${BG}"/>
  <g opacity="0.6">${gridLines()}</g>
  <rect x="0" y="0" width="${WIDTH}" height="${HEIGHT}" fill="url(#vignette)"/>
  <defs>
    <radialGradient id="vignette" cx="15%" cy="35%" r="85%">
      <stop offset="0%" stop-color="${BG}" stop-opacity="0"/>
      <stop offset="100%" stop-color="${BG}" stop-opacity="0.55"/>
    </radialGradient>
  </defs>
  <rect x="0" y="0" width="6" height="${HEIGHT}" fill="${ACCENT}"/>

  <text x="60" y="118" font-family="${FONT}" font-size="52" font-weight="700" fill="${TEXT}">${escapeXml(
  NAME
)}</text>
  <text x="60" y="158" font-family="${FONT}" font-size="22" font-weight="600" fill="${ACCENT}">${escapeXml(
  TAGLINE
)}</text>
  <text x="60" y="192" font-family="${FONT}" font-size="16" fill="${MUTED}">${escapeXml(
  SUBLINE
)}</text>

  <text x="60" y="250" font-family="${FONT}" font-size="13" letter-spacing="3" fill="${MUTED}">${escapeXml(
  HANDLE
)}</text>
  <circle cx="${WIDTH - 60}" cy="${HEIGHT - 50}" r="4" fill="${ACCENT}"/>
</svg>
`;

mkdirSync(ASSETS_DIR, { recursive: true });
writeFileSync(join(ASSETS_DIR, "hero.svg"), svg, "utf8");
console.log("✓ wrote assets/hero.svg");
