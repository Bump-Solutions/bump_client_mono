interface ImportMeta {
  glob(
    pattern: string,
    options: {
      eager: true;
    },
  ): Record<string, { default: string }>;
}
