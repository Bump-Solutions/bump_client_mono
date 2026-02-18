import { palettes, type PaletteName, type Tone } from "./palette";

export function color(name: PaletteName, tone: Tone): string {
  return palettes[name][tone];
}
