import fs from "node:fs";
import path from "node:path";

import { semanticColors } from "../src/colors";
import { palettes } from "../src/palette";

const OUT_FILE = path.resolve(
  process.cwd(),
  "../../apps/web/src/styles/css/_tokens.css",
);

function toCssVarName(palette: string, tone: string) {
  return `--clr-${palette}-${tone}`;
}

function toKebab(s: string) {
  return s.replace(/[A-Z]/g, (m) => `-${m.toLowerCase()}`);
}

let css = `/* AUTO-GENERATED FILE. DO NOT EDIT DIRECTLY. */\n:root {\n`;

for (const [paletteName, tones] of Object.entries(palettes)) {
  for (const [tone, value] of Object.entries(tones)) {
    css += `  ${toCssVarName(paletteName, tone)}: ${value};\n`;
  }

  css += `\n`;
}

css += `\n  /* semantic */\n`;
for (const [name, value] of Object.entries(semanticColors)) {
  css += `  --clr-${toKebab(name)}: ${value};\n`;
}

css += `}\n`;

fs.mkdirSync(path.dirname(OUT_FILE), { recursive: true });
fs.writeFileSync(OUT_FILE, css, "utf8");

console.log(`Generated: ${OUT_FILE}`);

// This script generates a CSS file with color variables based on the palettes and semantic colors defined in the source files. The generated CSS file can then be imported into the web app's styles to use these color variables throughout the application.
// run: pnpm tokens
