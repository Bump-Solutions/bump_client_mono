import { semanticColors, type SemanticColorName } from "./colors";
import { palettes, type PaletteName, type Tone } from "./palette";

export function color(name: PaletteName, tone: Tone): string {
  return palettes[name][tone];
}

export function semantic(name: SemanticColorName): string {
  return semanticColors[name];
}
