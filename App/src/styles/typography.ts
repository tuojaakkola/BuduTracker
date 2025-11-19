export const typography = {
  sizes: {
    xs: 10,
    sm: 11,
    md: 12,
    base: 14,
    lg: 16,
    xl: 18,
    xxl: 21,
    xxxl: 24,
    xxxxl: 28,
  },
  
  weights: {
    regular: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
  },
  
  lineHeights: {
    tight: 1.2,
    normal: 1.4,
    relaxed: 1.6,
  },
} as const;
