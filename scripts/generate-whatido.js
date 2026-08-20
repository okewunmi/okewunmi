// scripts/generate-whatido.js
// Builds the "What I Do" banner: four capability columns rendered as one
// wide SVG, in the same dark theme as the hero. Static content — content
// lives here as data, not fetched from anywhere.

import { writeFileSync, mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { escapeXml, wrapText } from "./lib/svg-utils.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ASSETS_DIR = join(__dirname, "..", "assets");

const CAPABILITIES = [
  {
    icon: "📱",
    title: "Mobile",
    desc: "Cross-platform apps with React Native / Expo",
  },
  {
    icon: "🌐",
    title: "Full-Stack Web",
    desc: "Next.js + Supabase — auth, RLS, storage, CMS",
  },
  {
    icon: "📦",
    title: "Open Source",
    desc: "npm tooling for the Nigerian/African dev ecosystem",
  },
  {
    icon: "🏗️",
    title: "Accelerators",
    desc: "Submissions and MVP builds (ADTC, Open Startup)",
  },
];

const WIDTH = 1200;
const HEIGHT = 220;
const COL_WIDTH = WIDTH / CAPABILITIES.length;

const BG = "#0a0a0a";
const BORDER = "#1c1c1c";
const ACCENT = "#00C264";
const TEXT = "#f5f5f5";
const MUTED = "#9ca3af";
const FONT = "'Segoe UI', Helvetica, Arial, sans-serif";

function column({ icon, title, desc }, index) {
  const x = index * COL_WIDTH;
  const centerX = x + COL_WIDTH / 2;
  const descLines = wrapText(desc, 24, 3);
  const descSvg = descLines
    .map(
      (line, i) =>
        `<text x="${centerX}" y="${142 + i * 18}" text-anchor="middle" font-family="${FONT}" font-size="13.5" fill="${MUTED}">${escapeXml(
          line
        )}</text>`
    )
    .join("\n  ");

  const divider =
    index > 0
      ? `<line x1="${x}" y1="24" x2="${x}" y2="${HEIGHT - 24}" stroke="${BORDER}" stroke-width="1"/>`
      : "";

  return `${divider}
  <text x="${centerX}" y="76" text-anchor="middle" font-size="34">${icon}</text>
  <text x="${centerX}" y="112" text-anchor="middle" font-family="${FONT}" font-size="19" font-weight="700" fill="${TEXT}">${escapeXml(
    title
  )}</text>
  ${descSvg}
  <rect x="${centerX - 16}" y="${HEIGHT - 34}" width="32" height="3" rx="1.5" fill="${ACCENT}"/>`;
}

const columnsSvg = CAPABILITIES.map(column).join("\n  ");

const svg = `<svg width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="What I do: Mobile, Full-Stack Web, Open Source, Accelerators">
  <rect x="0.5" y="0.5" width="${WIDTH - 1}" height="${
  HEIGHT - 1
}" rx="14" fill="${BG}" stroke="${BORDER}"/>
  ${columnsSvg}
</svg>
`;

mkdirSync(ASSETS_DIR, { recursive: true });
writeFileSync(join(ASSETS_DIR, "whatido.svg"), svg, "utf8");
console.log("✓ wrote assets/whatido.svg");
