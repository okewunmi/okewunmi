// scripts/generate-stats.js
// Fetches live GitHub star counts and npm weekly download counts for each
// featured package, then writes one SVG card per package to assets/.
// Run via `npm run generate` (needs Node 18+ for global fetch).

import { writeFileSync, mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { escapeXml, wrapText } from "./lib/svg-utils.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ASSETS_DIR = join(__dirname, "..", "assets");

const GITHUB_USER = "okewunmi";

// Add or remove packages here — one card is generated per entry.
const PACKAGES = [
  {
    repo: "react-native-naira-utils",
    npmName: "react-native-naira-utils",
    label: "react-native-naira-utils",
    desc: "Naira/kobo formatting, phone/network detection, and NUBAN validation for Expo apps",
  },
  {
    repo: "naija-nllb-translate",
    npmName: "naija-nllb-translate",
    label: "naija-nllb-translate",
    desc: "Offline English ↔ Hausa/Igbo/Yoruba/Fulfulde/Kanuri translation via NLLB-200 on ONNX",
  },
  {
    repo: "ussd-router-plus",
    npmName: "ussd-router-plus",
    label: "ussd-router-plus",
    desc: "Express-style USSD state router with Africa's Talking and Qrios adapters",
  },
  {
    repo: "react-native-text-extract",
    npmName: "react-native-text-extract",
    label: "react-native-text-extract",
    desc: "On-device text extraction from PDF, DOCX, XLSX, and CSV, with API fallback",
  },
];

// White-card theme — kept separate from the dark hero/project-card theme
// per request, so the open-source section reads distinctly on the page.
const BG = "#ffffff";
const BORDER = "#e5e7eb";
const CHIP_BG = "#0a0a0a";
const ACCENT = "#00A854"; // slightly darker than brand green for AA contrast on white
const TEXT = "#0a0a0a";
const MUTED = "#6b7280";
const FONT = "'Segoe UI', Helvetica, Arial, sans-serif";
const MONO = "'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace";

async function getStars(repo) {
  try {
    const res = await fetch(
      `https://api.github.com/repos/${GITHUB_USER}/${repo}`,
      {
        headers: {
          "User-Agent": "okewunmi-profile-stats",
          Accept: "application/vnd.github+json",
        },
      }
    );
    if (!res.ok) return null;
    const data = await res.json();
    return typeof data.stargazers_count === "number"
      ? data.stargazers_count
      : null;
  } catch {
    return null;
  }
}

async function getWeeklyDownloads(npmName) {
  try {
    const res = await fetch(
      `https://api.npmjs.org/downloads/point/last-week/${npmName}`
    );
    if (!res.ok) return null;
    const data = await res.json();
    return typeof data.downloads === "number" ? data.downloads : null;
  } catch {
    return null;
  }
}

function fmt(n) {
  if (n === null || n === undefined) return "—";
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
  return String(n);
}

function cardSvg({ label, desc, npmName, stars, downloads, publishedSoon }) {
  const WIDTH = 760;
  const HEIGHT = 172;

  const descLines = wrapText(desc, 68, 2);
  const descSvg = descLines
    .map(
      (line, i) =>
        `<text x="34" y="${62 + i * 18}" font-family="${FONT}" font-size="14" fill="${MUTED}">${escapeXml(
          line
        )}</text>`
    )
    .join("\n  ");

  const installText = `$ npm install ${npmName}`;
  const chipWidth = Math.min(692, 22 + installText.length * 7.3);

  const statsLine = publishedSoon
    ? `<text x="34" y="152" font-family="${FONT}" font-size="14" font-weight="600" fill="${MUTED}">publishing soon</text>`
    : `<text x="34" y="152" font-family="${FONT}" font-size="14" font-weight="600" fill="${ACCENT}">★ ${fmt(
        stars
      )} stars</text>
  <text x="220" y="152" font-family="${FONT}" font-size="14" font-weight="600" fill="${ACCENT}">⬇ ${fmt(
        downloads
      )} / week</text>`;

  return `<svg width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${escapeXml(
    label
  )} stats">
  <rect x="0.5" y="0.5" width="${WIDTH - 1}" height="${
    HEIGHT - 1
  }" rx="12" fill="${BG}" stroke="${BORDER}"/>
  <rect x="0" y="0" width="6" height="${HEIGHT}" rx="3" fill="${ACCENT}"/>
  <text x="34" y="38" font-family="${FONT}" font-size="22" font-weight="700" fill="${TEXT}">${escapeXml(
    label
  )}</text>
  ${descSvg}
  <rect x="34" y="88" width="${chipWidth}" height="26" rx="6" fill="${CHIP_BG}"/>
  <text x="${34 + chipWidth / 2}" y="105" text-anchor="middle" font-family="${MONO}" font-size="12.5" fill="${ACCENT}">${escapeXml(
    installText
  )}</text>
  ${statsLine}
</svg>
`;
}

async function main() {
  mkdirSync(ASSETS_DIR, { recursive: true });

  for (const pkg of PACKAGES) {
    const [stars, downloads] = await Promise.all([
      getStars(pkg.repo),
      getWeeklyDownloads(pkg.npmName),
    ]);

    // If the package isn't published yet, npm/GitHub calls will just
    // return null and the card will render a "publishing soon" state.
    const publishedSoon = stars === null && downloads === null;

    const svg = cardSvg({
      label: pkg.label,
      desc: pkg.desc,
      npmName: pkg.npmName,
      stars,
      downloads,
      publishedSoon,
    });

    const outPath = join(ASSETS_DIR, `card-${pkg.repo}.svg`);
    writeFileSync(outPath, svg, "utf8");
    console.log(
      `✓ wrote assets/card-${pkg.repo}.svg (stars: ${
        stars ?? "n/a"
      }, downloads/week: ${downloads ?? "n/a"})`
    );
  }
}

main();
