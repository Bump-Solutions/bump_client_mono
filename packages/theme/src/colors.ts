export const semanticColors = {
  white: "#FFFFFF",
  black: "#000000",

  font: "#343a40",
  fontHeadline: "#212529",
  fontLight: "#f8f9fa",

  bgDark: "#262626",
  bgDarkTransparent: "rgba(38, 38, 38, 0.98)",
} as const;

export type SemanticColorName = keyof typeof semanticColors;
