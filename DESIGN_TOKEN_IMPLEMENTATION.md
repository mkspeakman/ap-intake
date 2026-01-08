# Design Token System Implementation

## What Was Implemented

A comprehensive design token system has been established for the AP Intake application, providing a cohesive, maintainable approach to theming and styling.

## Files Modified/Created

### Core Configuration
1. **[src/index.css](src/index.css)** - CSS custom properties with semantic tokens
   - Base color palette with hex and OKLCH values
   - Semantic tokens for light and dark modes
   - Utility component classes for common patterns

2. **[tailwind.config.js](tailwind.config.js)** - Tailwind integration
   - Semantic color tokens mapped to CSS variables
   - Direct brand color access
   - HSL color space integration

### Documentation
3. **[DESIGN_TOKENS.md](DESIGN_TOKENS.md)** - Comprehensive guide
   - Color palette reference
   - Semantic token mapping
   - Usage examples and patterns
   - Migration guide from hardcoded colors

4. **[DESIGN_TOKEN_IMPLEMENTATION.md](DESIGN_TOKEN_IMPLEMENTATION.md)** - This file

### Components
5. **[src/components/ColorPalette.tsx](src/components/ColorPalette.tsx)** - Visual reference
   - Interactive color swatch display
   - Live examples of all tokens
   - Component usage patterns

6. **[src/types/design-tokens.types.ts](src/types/design-tokens.types.ts)** - TypeScript definitions
   - Type-safe color tokens
   - Helper functions
   - Common color combinations

### Updated Components
7. **[src/components/form-sections/MaterialRequirementsSection.tsx](src/components/form-sections/MaterialRequirementsSection.tsx)**
   - Changed from `bg-blue-600` to `bg-primary`

8. **[src/components/form-sections/FinishRequirementsSection.tsx](src/components/form-sections/FinishRequirementsSection.tsx)**
   - Changed from `bg-purple-600` to `bg-accent`

## Color Palette

| Color Name | Hex | Purpose |
|------------|-----|---------|
| **Charcoal** | `#0A0A0B` | Dark text, dark mode backgrounds |
| **Gray** | `#626163` | Muted text, secondary content |
| **Blue** | `#3D6A9E` | Primary actions, links (WCAG AA compliant) |
| **Gold** | `#FCB716` | Highlights, secondary actions |
| **Silver** | `#D4D6D8` | Sleeker borders, subtle UI elements (1.5:1 on cream) |
| **Cream** | `#F1F0EF` | Main background, cards |
| **Accent** | `#F3F4F5` | Very subtle hover states (96% lightness) |

> **Note:** Text and interactive element colors meet WCAG 2.1 Level AA accessibility standards. Borders are intentionally subtle for a sleeker aesthetic.

## Semantic Token Mapping

### Light Mode
- Background: Cream (#F1F0EF)
- Text: Charcoal (#0A0A0B)
- Primary: Blue (#3D6A9E)
- Secondary: Gold (#FCB716)
- Accent: Very subtle gray (#F3F4F5) - Table rows, dropdown items, accordions
- Muted: Light gray
- Borders: Silver (#D4D6D8) - Sleeker aesthetic

### Dark Mode
- Background: Charcoal (#0A0A0B)
- Text: Cream (#F1F0EF)
- Primary: Lighter Blue
- Secondary: Brighter Gold
- Accent: Medium gray - Subtle highlights
- Muted: Darker neutrals
- Borders: Dark grays

## Quick Start

### Using Semantic Tokens (Recommended)

```tsx
// Backgrounds and text
<div className="bg-background text-foreground">

// Primary actions
<button className="bg-primary text-primary-foreground">Submit</button>

// Accents/highlights
<span className="bg-accent text-accent-foreground">New</span>

// Muted content
<p className="text-muted-foreground">Helper text</p>

// Cards
<Card className="bg-card border-border">
```

### Using Brand Colors Directly

```tsx
// When you need exact palette colors
<div className="bg-brand-blue text-white">
<div className="bg-brand-gold text-brand-charcoal">
```

### Using Component Classes

```tsx
// Predefined tag patterns
<span className="tag-primary">Material</span>
<span className="tag-accent">Finish</span>
```

## Testing the Implementation

### View Color Palette
Add this to your router or a page component:

```tsx
import { ColorPalette } from '@/components/ColorPalette';

// In your component
<ColorPalette />
```

### Toggle Dark Mode
```tsx
// Add to a button or toggle
document.documentElement.classList.toggle('dark');
```

## Benefits

1. **Consistency**: All colors come from a single source of truth
2. **Maintainability**: Change colors in one place, updates everywhere
3. **Dark Mode**: Built-in support with automatic token adjustments
4. **Type Safety**: TypeScript definitions for color tokens
5. **Semantic Naming**: Clear, purpose-driven color names
6. **Future-Proof**: OKLCH values included for modern color space support

## Next Steps

### Recommended Enhancements
1. Add component to toggle dark mode in UI
2. Create tint/shade variants (primary-100 through primary-900)
3. Add semantic tokens for success/warning states
4. Create typography tokens (font sizes, weights, line heights)
5. Add spacing tokens for consistent margins/padding
6. Consider animation/transition tokens

### Migration Tasks
- [ ] Update remaining hardcoded colors in components
- [ ] Replace `text-red-500` with semantic error token
- [ ] Update any inline styles with color values
- [ ] Document component-specific color usage

## Resources

- **Full Documentation**: See [DESIGN_TOKENS.md](DESIGN_TOKENS.md)
- **Type Definitions**: See [src/types/design-tokens.types.ts](src/types/design-tokens.types.ts)
- **Visual Reference**: Render `<ColorPalette />` component
- **Tailwind Docs**: [Custom Colors](https://tailwindcss.com/docs/customizing-colors)

## Support for OKLCH

The system includes OKLCH color space values for future use. When Tailwind 4+ or browsers fully support OKLCH, you can:

1. Switch from HSL to OKLCH in semantic tokens
2. Create better color variations with perceptually uniform adjustments
3. Access a wider color gamut for modern displays

Current OKLCH values are stored as CSS custom properties with `-oklch` suffix.
