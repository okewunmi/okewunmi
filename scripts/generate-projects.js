// scripts/generate-projects.js
// Builds one SVG card per project featured in the AI Projects, Websites for
// Corporate Bodies, and Ventures & Projects sections of the README. These
// don't depend on any live API — they're static, hand-written summaries —
// but are generated here (rather than hand-drawn) so every card in the
// profile shares one layout and gets regenerated together via
// `npm run generate`.

import { writeFileSync, mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { escapeXml, wrapText } from "./lib/svg-utils.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ASSETS_DIR = join(__dirname, "..", "assets");

// slug is used as the output filename: assets/card-<slug>.svg
const PROJECTS = [
  // ── AI projects ──────────────────────────────────────────────
  {
    slug: "seizure-sentinel",
    title: "Seizure Sentinel",
    desc: "Real-time epileptic seizure detection from EEG signals using a bidirectional LSTM with attention, built to match commercial monitors on false-alarm rate.",
    tag: "Live demo · Repo",
  },
  {
    slug: "consensus-bridge",
    title: "Consensus Bridge",
    desc: "A platform for structured, at-scale deliberative dialogue — running real democratic discussion beyond small-group settings.",
    tag: "Live demo · Repo",
  },
  {
    slug: "voxify-tts",
    title: "Voxify — Text-to-Speech",
    desc: "An AI app that converts text into high-quality, natural-sounding speech.",
    tag: "Android app",
  },
  {
    slug: "voxify-text-extract",
    title: "Voxify — Text Extraction API",
    desc: "A companion API and web playground for pulling clean text out of uploaded documents.",
    tag: "Web playground",
  },
  // ── corporate sites ──────────────────────────────────────────
  {
    slug: "dhi-website",
    title: "Da Hausa Initiative",
    desc: "Community platform for financial and data literacy in Northern Nigeria: public site, admin dashboard, messaging, and a blog with threaded comments.",
    tag: "Site · Repo",
  },
  {
    slug: "mcan-oyo",
    title: "MCAN Oyo",
    desc: "Website for the Muslim Corpers' Association of Nigeria, Oyo chapter.",
    tag: "Site · Repo",
  },
  // ── ventures & projects ──────────────────────────────────────
  {
    slug: "chargefinder-ng",
    title: "ChargeFinder NG",
    desc: "EV charging station locator for Nigeria's emerging EV market — React Native/Expo + Supabase, built on the EVPoint UI kit.",
    tag: "In progress",
  },
  {
    slug: "al-furqan-centre",
    title: "Al-Furqan Centre",
    desc: "19-route Next.js/Supabase platform with a full CMS for non-technical staff and a bank-transfer + WhatsApp payment flow.",
    tag: "Live",
  },
  {
    slug: "portfolio-cms",
    title: "Portfolio CMS",
    desc: "A database-driven Next.js/Supabase CMS with a full admin dashboard, replacing what used to be a static site.",
    tag: "Live",
  },
];

// Dark theme — matches the hero banner and social buttons, kept distinct
// from the white open-source package cards.
const BG = "#0a0a0a";
const BORDER = "#232323";
const ACCENT = "#00C264";
const TEXT = "#f5f5f5";
const MUTED = "#9ca3af";
const FONT = "'Segoe UI', Helvetica, Arial, sans-serif";

function cardSvg({ title, desc, tag }) {
  const WIDTH = 760;
  const HEIGHT = 148;

  const descLines = wrapText(desc, 70, 3);
  const descSvg = descLines
    .map(
      (line, i) =>
        `<text x="34" y="${64 + i * 19}" font-family="${FONT}" font-size="14" fill="${MUTED}">${escapeXml(
          line
        )}</text>`
    )
    .join("\n  ");

  return `<svg width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${escapeXml(
    title
  )}">
  <rect x="0.5" y="0.5" width="${WIDTH - 1}" height="${
    HEIGHT - 1
  }" rx="12" fill="${BG}" stroke="${BORDER}"/>
  <rect x="0" y="0" width="6" height="${HEIGHT}" rx="3" fill="${ACCENT}"/>
  <text x="34" y="40" font-family="${FONT}" font-size="22" font-weight="700" fill="${TEXT}">${escapeXml(
    title
  )}</text>
  ${descSvg}
  <text x="34" y="${HEIGHT - 18}" font-family="${FONT}" font-size="13" font-weight="600" letter-spacing="1" fill="${ACCENT}">${escapeXml(
    tag.toUpperCase()
  )}</text>
</svg>
`;
}

mkdirSync(ASSETS_DIR, { recursive: true });

for (const project of PROJECTS) {
  const svg = cardSvg(project);
  const outPath = join(ASSETS_DIR, `card-${project.slug}.svg`);
  writeFileSync(outPath, svg, "utf8");
  console.log(`✓ wrote assets/card-${project.slug}.svg`);
}
