/**
 * Design Token Type Definitions
 * 
 * These types provide autocomplete and type safety for design tokens.
 * Import and use with className builders or styled components.
 */

// Base color palette
export type BrandColor = 
  | 'brand-blue'
  | 'brand-gold'
  | 'brand-charcoal'
  | 'brand-gray'
  | 'brand-silver'
  | 'brand-cream';

// Semantic tokens
export type SemanticColor =
  | 'background'
  | 'foreground'
  | 'card'
  | 'card-foreground'
  | 'popover'
  | 'popover-foreground'
  | 'primary'
  | 'primary-foreground'
  | 'secondary'
  | 'secondary-foreground'
  | 'muted'
  | 'muted-foreground'
  | 'accent'
  | 'accent-foreground'
  | 'destructive'
  | 'destructive-foreground'
  | 'border'
  | 'input'
  | 'ring';

// Tailwind utility prefixes
export type ColorUtility = 'bg' | 'text' | 'border';

// Combined color token types
export type ColorToken = BrandColor | SemanticColor;

// Helper type for building className strings
export type ColorClass = `${ColorUtility}-${ColorToken}`;

// Radius tokens
export type RadiusToken = 'radius' | 'radius-lg' | 'radius-md' | 'radius-sm';

/**
 * Design token values for direct CSS access
 */
export const DesignTokens = {
  colors: {
    // Base palette (WCAG AA compliant)
    brand: {
      blue: '#3D6A9E',
      gold: '#FCB716',
      charcoal: '#0A0A0B',
      gray: '#626163',
      silver: '#828A90',
      cream: '#F1F0EF',
    },
    // OKLCH values for future use
    oklch: {
      blue: 'oklch(0.560 0.080 240.5)',
      gold: 'oklch(0.822 0.167 80.5)',
      charcoal: 'oklch(0.145 0.002 286.1)',
      gray: 'oklch(0.494 0.003 308.4)',
      silver: 'oklch(0.630 0.008 230.0)',
      cream: 'oklch(0.956 0.002 67.8)',
    },
  },
  radius: {
    sm: 'calc(0.5rem - 4px)',
    md: 'calc(0.5rem - 2px)',
    lg: '0.5rem',
  },
} as const;

/**
 * Type-safe color class builder
 * 
 * @example
 * ```tsx
 * const bgClass = colorClass('bg', 'primary'); // "bg-primary"
 * const textClass = colorClass('text', 'brand-blue'); // "text-brand-blue"
 * ```
 */
export function colorClass(
  utility: ColorUtility,
  token: ColorToken
): ColorClass {
  return `${utility}-${token}` as ColorClass;
}

/**
 * Common color combinations for consistency
 */
export const ColorCombinations = {
  // Button variants
  button: {
    primary: 'bg-primary text-primary-foreground hover:opacity-90',
    secondary: 'bg-secondary text-secondary-foreground hover:opacity-90',
    accent: 'bg-accent text-accent-foreground hover:bg-accent/80',
    destructive: 'bg-destructive text-destructive-foreground hover:opacity-90',
    outline: 'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
    ghost: 'hover:bg-accent hover:text-accent-foreground',
  },
  
  // Tag/badge variants
  tag: {
    primary: 'bg-primary text-primary-foreground',
    accent: 'bg-accent text-accent-foreground',
    secondary: 'bg-secondary text-secondary-foreground',
    muted: 'bg-muted text-muted-foreground',
  },
  
  // Card variants
  card: {
    default: 'bg-card text-card-foreground border border-border',
    elevated: 'bg-card text-card-foreground border border-border shadow-sm',
    muted: 'bg-muted text-muted-foreground border border-border',
  },
  
  // Input variants
  input: {
    default: 'border-input bg-background focus:ring-ring',
    error: 'border-destructive bg-background focus:ring-destructive',
  },
} as const;

export type ButtonVariant = keyof typeof ColorCombinations.button;
export type TagVariant = keyof typeof ColorCombinations.tag;
export type CardVariant = keyof typeof ColorCombinations.card;
export type InputVariant = keyof typeof ColorCombinations.input;
