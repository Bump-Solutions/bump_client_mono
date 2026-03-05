declare module "color-thief-ts" {
  type GetColorOptionsRgb = { colorType?: "rgb" };
  type GetColorOptionsHex = { colorType: "hex" };

  type GetPaletteOptionsRgb = { colorType?: "rgb" };
  type GetPaletteOptionsHex = { colorType: "hex" };

  export default class ColorThief {
    // getColor overloads
    getColor(
      image: HTMLImageElement,
      options: GetColorOptionsHex,
    ): string | null;
    getColor(
      image: HTMLImageElement,
      options?: GetColorOptionsRgb,
    ): number[] | null;

    // getPalette overloads
    getPalette(
      image: HTMLImageElement,
      count: number | undefined,
      options: GetPaletteOptionsHex,
    ): Array<string | null>;
    getPalette(
      image: HTMLImageElement,
      count?: number,
      options?: GetPaletteOptionsRgb,
    ): Array<number[] | null>;
  }
}
