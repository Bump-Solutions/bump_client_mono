type ViteAssetModule = { default: string };

const toUrls = (glob: Record<string, unknown>): string[] =>
  Object.values(glob).map((m) => (m as ViteAssetModule).default);

export const heroBackgrounds = toUrls(
  import.meta.glob("../images/background/small/*.jpg", { eager: true }),
);

export const brandLogos = {
  adidas: toUrls(
    import.meta.glob("../images/brands/adidas.png", { eager: true }),
  ),
  airJordan: toUrls(
    import.meta.glob("../images/brands/air_jordan.jpg", { eager: true }),
  ),
  asics: toUrls(
    import.meta.glob("../images/brands/asics.jpeg", { eager: true }),
  ),
  converse: toUrls(
    import.meta.glob("../images/brands/converse.jpeg", { eager: true }),
  ),
  fearOfGod: toUrls(
    import.meta.glob("../images/brands/fear_of_god.jpeg", { eager: true }),
  ),
  newBalance: toUrls(
    import.meta.glob("../images/brands/new_balance.jpeg", { eager: true }),
  ),
  nike: toUrls(import.meta.glob("../images/brands/nike.jpeg", { eager: true })),
  puma: toUrls(import.meta.glob("../images/brands/puma.jpeg", { eager: true })),
  reebok: toUrls(
    import.meta.glob("../images/brands/reebok.png", { eager: true }),
  ),
  stussy: toUrls(
    import.meta.glob("../images/brands/stussy.png", { eager: true }),
  ),
  vans: toUrls(import.meta.glob("../images/brands/vans.jpeg", { eager: true })),
  yeezy: toUrls(
    import.meta.glob("../images/brands/yeezy.jpeg", { eager: true }),
  ),
} as const;
