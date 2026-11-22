// bring-the-humans-03 entry program (Node 22, standard library only).
// The entry is the video ad itself (ad.mp4); this program only hands the
// gate the video's address: it copies VIDEO.json from the repository root
// to /output/VIDEO.json, where the gate reads it. VIDEO.json names the
// TikTok video Junior posts; until he posts it the file holds a placeholder
// address and the gate refuses the entry (valid 0), which is expected.

import { copyFileSync, existsSync, mkdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = dirname(fileURLToPath(import.meta.url));
const botDir = process.env.MAKEFUN_BOT_DIR ?? repoRoot;
const outputDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";

const source = join(botDir, "VIDEO.json");
const target = join(outputDir, "VIDEO.json");

if (!existsSync(source)) {
  console.error(`VIDEO.json not found in ${botDir}`);
  process.exit(1);
}

const entry = JSON.parse(readFileSync(source, "utf8"));
if (typeof entry.url !== "string" || entry.url.length === 0) {
  console.error("VIDEO.json must name the video in its url field");
  process.exit(1);
}

// The placeholder address is expected until Junior posts the video;
// warn loudly so a submitted placeholder is never mistaken for a live one.
if (entry.url.includes("PLACEHOLDER")) {
  console.warn("WARNING: VIDEO.json still holds the placeholder address — replace it with the posted TikTok video's address before submitting.");
}

mkdirSync(outputDir, { recursive: true });
copyFileSync(source, target);
console.log(`VIDEO.json copied to ${target} (url: ${entry.url})`);
