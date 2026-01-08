# Design Token System

## Overview

This project uses a comprehensive design token system built on a 6-color palette. All colors are **WCAG AA compliant** for accessibility. Tokens are defined as CSS custom properties and integrated with Tailwind CSS for consistent theming across the application.

## Color Palette

### Base Colors

| Name | Hex | OKLCH | Usage |
|------|-----|-------|-------|
| **Charcoal** (color1) | `#0A0A0B` | `oklch(0.145 0.002 286.1)` | Dark text, dark backgrounds |
| **Gray** (color2) | `#626163` | `oklch(0.494 0.003 308.4)` | Muted text, secondary content |
| **Blue** (color3) | `#3D6A9E` | `oklch(0.560 0.080 240.5)` | Primary actions, links (WCAG AA: 4.92:1) |
| **Gold** (color4) | `#FCB716` | `oklch(0.822 0.167 80.5)` | Highlights, secondary actions (WCAG AA: 11.24:1) |
| **Silver** (color5) | `#D4D6D8` | `oklch(0.860 0.003 247.9)` | Sleeker borders (1.5:1 on cream) |
| **Cream** (color6) | `#F1F0EF` | `oklch(0.956 0.002 67.8)` | Main background, cards |
| **Accent** | `#F3F4F5` | 96% lightness | Very subtle hover states |

## Semantic Tokens

### Light Mode

| Token | Value | Description | Usage Example |
|-------|-------|-------------|---------------|
| `--background` | cream | Main page background | `bg-background` |
| `--foreground` | charcoal | Primary text color | `text-foreground` |
| `--primary` | blue | Primary action color | `bg-primary`, `text-primary` |
| `--secondary` | gold | Secondary/highlight | `bg-secondary` |
| `--muted` | light gray | Subtle backgrounds | `bg-muted` |
| `--muted-foreground` | gray | Secondary text | `text-muted-foreground` |
| `--accent` | `#F3F4F5` | Subtle hover: tables, dropdowns, accordions | `bg-accent`, `hover:bg-accent` |
| `--card` | white | Card backgrounds | `bg-card` |
| `--border` | `#D4D6D8` | Sleeker, lighter border color | `border-border` |
| `--input` | `#D4D6D8` | Input field borders | `border-input` |
| `--ring` | blue | Focus ring color (high contrast) | `ring-ring` |

### Dark Mode

Dark mode automatically adjusts semantic tokens while maintaining the color relationships:
- Background becomes charcoal
- Foreground becomes cream
- Primary and accent colors are slightly brightened
- Borders and muted elements are adjusted for proper contrast

## Usage in Tailwind

### Semantic Colors (Recommended)

Use semantic tokens for most UI elements:

```tsx
// Backgrounds and text
<div className="bg-background text-foreground">

// Primary actions
<button className="bg-primary text-primary-foreground">Submit</button>

// Secondary actions or highlights
<button className="bg-secondary text-secondary-foreground">Learn More</button>

// Muted/subtle elements
<div className="bg-muted text-muted-foreground">Helper text</div>

// Cards
<div className="bg-card text-card-foreground border border-border">

// Accents
<span className="text-accent">Important</span>
```

### Brand Colors (Direct Access)

When you need direct access to the palette colors:

```tsx
// Using brand colors directly
<div className="bg-brand-blue text-white">
<div className="bg-brand-gold text-brand-charcoal">
<div className="border-brand-silver">
```

Available brand colors:
- `brand-blue`
- `brand-gold`
- `brand-charcoal`
- `brand-gray`
- `brand-silver`
- `brand-cream`

## Component Examples

### Buttons

```tsx
// Primary button
<Button className="bg-primary hover:bg-primary/90">Primary Action</Button>

// Secondary button
<Button variant="secondary">Secondary Action</Button>

// Accent button
<Button className="bg-accent hover:bg-accent/90">Highlighted Action</Button>
```

### Cards

```tsx
<Card className="bg-card border-border">
  <CardContent className="text-card-foreground">
    Content here
  </CardContent>
</Card>
```

### Forms

```tsx
<Input className="border-input focus:ring-ring" />
<Label className="text-foreground">Label</Label>
<p className="text-muted-foreground text-sm">Helper text</p>
```

### Tags/Badges

```tsx
// Material tag
<Badge className="bg-primary text-primary-foreground">Material</Badge>

// Finish tag
<Badge className="bg-accent text-accent-foreground">Finish</Badge>
```

## Migration from Hardcoded Colors

Replace hardcoded Tailwind colors with semantic tokens:

| Old | New |
|-----|-----|
| `bg-blue-600` | `bg-primary` |
| `text-blue-600` | `text-primary` |
| `bg-purple-600` | `bg-accent` or `bg-secondary` |
| `bg-gray-100` | `bg-muted` |
| `text-gray-600` | `text-muted-foreground` |
| `border-gray-300` | `border-border` |

## Dark Mode Support

To enable dark mode, add the `dark` class to a parent element (typically `<html>` or `<body>`):

```tsx
<html className="dark">
  {/* All semantic tokens automatically adjust */}
</html>
```

Toggle dark mode programmatically:

```tsx
// Toggle dark mode
document.documentElement.classList.toggle('dark');
```

## Future Enhancements

- [ ] Add OKLCH color space support for Tailwind 4+
- [ ] Create tint/shade variants (e.g., `primary-100` through `primary-900`)
- [ ] Add semantic tokens for success/warning states
- [ ] Create component-specific token sets
- [ ] Add spacing/sizing tokens
- [ ] Add typography tokens
