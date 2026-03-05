import type { ColorData } from "@bump/types";
import ColorThief from "color-thief-ts";

export const rgbToHex = (rgb?: number[]): string | null => {
  if (!rgb) return null;

  return (
    "#" +
    rgb
      .map((x) => {
        const hex = x.toString(16);
        return hex.length === 1 ? "0" + hex : hex;
      })
      .join("")
  );
};

async function loadImageForCanvas(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();

    img.crossOrigin = "Anonymous";
    img.decoding = "async";

    img.onload = async () => {
      try {
        if ("decode" in img) {
          await (img as HTMLImageElement).decode();
        }
        resolve(img);
      } catch {
        resolve(img);
      }
    };
    img.onerror = () => reject(new Error("Image load error"));

    img.src = url;
  });
}

// Dominant color
export const getImageDominantColor = async (
  imageUrl: string,
): Promise<string | null> => {
  if (!imageUrl) return null;

  const img = await loadImageForCanvas(imageUrl);
  const colorThief = new ColorThief();

  return colorThief.getColor(img, {
    colorType: "hex",
  });
};

// Palette
export const getImagePalette = async (
  imageUrl: string,
  count = 5,
): Promise<(string | null)[]> => {
  if (!imageUrl) return [];

  const img = await loadImageForCanvas(imageUrl);
  const colorThief = new ColorThief();

  const palette = colorThief.getPalette(img, count, { colorType: "hex" }) as (
    | string
    | null
  )[];

  return palette.filter((v, i, self) => v !== null && self.indexOf(v) === i);
};

// Dominant color + Palette
export const getImageDominantColorAndPalette = async (
  imageUrl: string,
  count = 5,
): Promise<{
  dominantColor: string | null;
  palette: (string | null)[];
}> => {
  if (!imageUrl)
    return { dominantColor: null, palette: [] as (string | null)[] };

  const img = await loadImageForCanvas(imageUrl);
  const colorThief = new ColorThief();

  const dominantColor = colorThief.getColor(img, { colorType: "hex" }) as
    | string
    | null;
  const palette = (
    colorThief.getPalette(img, count, { colorType: "hex" }) as (string | null)[]
  ).filter((v, i, self) => v != null && self.indexOf(v) === i);

  return { dominantColor, palette };
};

// Check if color is light
export const isLightColor = (hex?: string): boolean => {
  if (!hex) return false;

  const c = hex.substring(1); // strip #
  const rgb = parseInt(c, 16); // convert rrggbb to decimal
  const r = (rgb >> 16) & 0xff; // extract red
  const g = (rgb >> 8) & 0xff; // extract green
  const b = (rgb >> 0) & 0xff; // extract blue

  const luma = 0.2126 * r + 0.7152 * g + 0.0722 * b; // per ITU-R BT.709

  return luma > 128;
};

export const getProfilePictureColors = async (
  image: string | null | undefined,
): Promise<ColorData | null> => {
  if (!image) return null;

  const { dominantColor, palette } = await getImageDominantColorAndPalette(
    image,
    12,
  );

  if (!dominantColor) return null;

  // filter out any nulls in the palette:
  const cleanPalette = palette.filter(
    (c): c is string => c !== null && typeof c === "string",
  );

  return { dominantColor, palette: cleanPalette };
};
