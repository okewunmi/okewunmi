// scripts/lib/svg-utils.js
// Small shared helpers for the SVG-generating scripts. No dependencies —
// these are plain string/text utilities, not a rendering engine.

export function escapeXml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

/**
 * Very rough character-count word-wrap. SVG has no native text wrapping,
 * and we don't have a canvas/font-metrics library available, so this
 * approximates by chars-per-line. `maxCharsPerLine` should be tuned per
 * font-size/column-width combination (~7px per char is a safe average for
 * the 13–14px sans-serif text used across these cards).
 */
export function wrapText(text, maxCharsPerLine, maxLines = 2) {
  const words = String(text).split(/\s+/);
  const lines = [];
  let current = "";

  for (const word of words) {
    const next = current ? `${current} ${word}` : word;
    if (next.length > maxCharsPerLine && current) {
      lines.push(current);
      current = word;
      if (lines.length === maxLines - 1) break;
    } else {
      current = next;
    }
  }
  if (current) lines.push(current);

  // If we stopped early because we hit maxLines, glue whatever's left onto
  // the final line and ellipsize so nothing is silently dropped.
  const consumedWords = lines.join(" ").split(/\s+/).length;
  if (consumedWords < words.length) {
    const rest = words.slice(consumedWords).join(" ");
    let last = lines.pop() ?? "";
    let combined = `${last} ${rest}`;
    if (combined.length > maxCharsPerLine) {
      combined = `${combined.slice(0, maxCharsPerLine - 1).trimEnd()}…`;
    }
    lines.push(combined);
  }

  return lines.slice(0, maxLines);
}
