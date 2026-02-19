type ViteAssetModule = { default: string };

export const heroBackgrounds = Object.values(
  import.meta.glob("../images/background/small/*.jpg", {
    eager: true,
  }),
).map((m) => (m as ViteAssetModule).default);
