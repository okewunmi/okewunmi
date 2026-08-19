// Generates one assets/card-<package>.svg per entry in PACKAGES below,
// pulling live npm downloads + GitHub stars/forks. No API keys required
// (GITHUB_TOKEN is optional, just raises the GitHub rate limit).
//
// Run with: node scripts/generate-stats.js

import fs from "node:fs";
import path from "node:path";

// --- Edit this list as your packages go live / get renamed ---
const PACKAGES = [
  {
    label: "nominatim-landmark",
    npm: "nominatim-landmark",
    repo: "okewunmi/nominatim-landmark",
  },
  {
    label: "react-native-yarngpt",
    npm: "react-native-yarngpt",
    repo: "okewunmi/react-native-yarngpt",
  },
  {
    // Rename pending (npm name conflict on "ussd-router") —
    // update npm + repo once you publish under the final name,
    // e.g. "@okewunmi/ussd-router" or "naija-ussd-router".
    label: "ussd-router",
    npm: "@okewunmi/ussd-router",
    repo: "okewunmi/ussd-router",
  },
];
// ----------------------------------------------------------------

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

async function getNpmDownloads(pkgName) {
  try {
    const res = await fetch(
      `https://api.npmjs.org/downloads/point/last-month/${encodeURIComponent(pkgName)}`
    );
    if (!res.ok) return 0;
    const data = await res.json();
    return data.downloads ?? 0;
  } catch {
    return 0;
  }
}

async function getGithubStats(repoSlug) {
  try {
    const res = await fetch(`https://api.github.com/repos/${repoSlug}`, {
      headers: GITHUB_TOKEN ? { Authorization: `Bearer ${GITHUB_TOKEN}` } : {},
    });
    if (!res.ok) return { stars: 0, forks: 0 };
    const data = await res.json();
    return { stars: data.stargazers_count ?? 0, forks: data.forks_count ?? 0 };
  } catch {
    return { stars: 0, forks: 0 };
  }
}

function cardSvg(name, downloads, stars, forks) {
  const width = 380;
  const height = 120;
  return `<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
  <rect x="1" y="1" width="${width - 2}" height="${height - 2}" rx="12" fill="#0d1117" stroke="#30363d"/>
  <text x="20" y="34" font-family="Segoe UI, Helvetica, Arial, sans-serif" font-size="18" font-weight="700" fill="#e6edf3">${name}</text>
  <text x="20" y="62" font-family="Segoe UI, Helvetica, Arial, sans-serif" font-size="13" fill="#8b949e">📦 npm downloads (30d)</text>
  <text x="360" y="62" font-family="Segoe UI, Helvetica, Arial, sans-serif" font-size="13" fill="#00c264" text-anchor="end" font-weight="600">${downloads.toLocaleString()}</text>
  <text x="20" y="86" font-family="Segoe UI, Helvetica, Arial, sans-serif" font-size="13" fill="#8b949e">⭐ GitHub stars</text>
  <text x="360" y="86" font-family="Segoe UI, Helvetica, Arial, sans-serif" font-size="13" fill="#e6edf3" text-anchor="end" font-weight="600">${stars.toLocaleString()}</text>
  <text x="20" y="106" font-family="Segoe UI, Helvetica, Arial, sans-serif" font-size="13" fill="#8b949e">🍴 Forks</text>
  <text x="360" y="106" font-family="Segoe UI, Helvetica, Arial, sans-serif" font-size="13" fill="#e6edf3" text-anchor="end" font-weight="600">${forks.toLocaleString()}</text>
</svg>`;
}

async function main() {
  const outDir = path.resolve("assets");
  fs.mkdirSync(outDir, { recursive: true });

  for (const pkg of PACKAGES) {
    const [downloads, gh] = await Promise.all([
      getNpmDownloads(pkg.npm),
      getGithubStats(pkg.repo),
    ]);
    const svg = cardSvg(pkg.label, downloads, gh.stars, gh.forks);
    fs.writeFileSync(path.join(outDir, `card-${pkg.label}.svg`), svg);
    console.log(
      `Generated card-${pkg.label}.svg — downloads: ${downloads}, stars: ${gh.stars}, forks: ${gh.forks}`
    );
  }
}

main();
