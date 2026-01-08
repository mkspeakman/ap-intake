# Design Token Quick Reference

## Common Patterns

### Buttons
```tsx
<button className="bg-primary text-primary-foreground hover:opacity-90">
<button className="bg-secondary text-secondary-foreground hover:opacity-90">
<button className="bg-accent text-accent-foreground hover:opacity-90">
```

### Tags/Badges
```tsx
<span className="tag-primary">Selected Item</span>
<span className="tag-accent">Highlight</span>
<span className="tag-secondary">Secondary</span>
```

### Cards
```tsx
<Card className="bg-card border-border">
  <CardContent className="text-card-foreground">
```

### Text Hierarchy
```tsx
<h1 className="text-foreground">Main Heading</h1>
<p className="text-foreground">Body text</p>
<span className="text-muted-foreground">Secondary text</span>
```

### Forms
```tsx
<label className="text-foreground font-medium">
<input className="bg-background border-input focus:ring-ring" />
<p className="text-muted-foreground text-sm">Helper text</p>
```

### Borders & Dividers
```tsx
<div className="border-border">
<hr className="border-border" />
```

## Color Token Reference

| Use Case | Token | Class |
|----------|-------|-------|
| Page background | `background` | `bg-background` |
| Main text | `foreground` | `text-foreground` |
| Primary button | `primary` | `bg-primary text-primary-foreground` |
| Highlight/secondary | `secondary` | `bg-secondary text-secondary-foreground` |
| Subtle hover/focus | `accent` | `bg-accent text-accent-foreground` |
| Subtle text | `muted-foreground` | `text-muted-foreground` |
| Subtle background | `muted` | `bg-muted` |
| Card surface | `card` | `bg-card border-border` |
| Border | `border` | `border-border` |
| Focus ring | `ring` | `focus:ring-ring` |
| Error/delete | `destructive` | `bg-destructive text-destructive-foreground` |

## Brand Colors (Direct Use)

When you need the exact palette colors:

```tsx
<div className="bg-brand-blue">     {/* #3D6A9E - WCAG AA */}
<div className="bg-brand-gold">     {/* #FCB716 */}
<div className="bg-brand-charcoal"> {/* #0A0A0B */}
<div className="bg-brand-gray">     {/* #626163 */}
<div className="bg-brand-silver">   {/* #D4D6D8 - Sleeker borders */}
<div className="bg-brand-cream">    {/* #F1F0EF */}
```

## TypeScript Helpers

```tsx
import { colorClass, ColorCombinations } from '@/types/design-tokens.types';

// Type-safe color class builder
const className = colorClass('bg', 'primary'); // "bg-primary"

// Predefined combinations
const buttonClass = ColorCombinations.button.primary;
const tagClass = ColorCombinations.tag.accent;
```

## Dark Mode

Toggle dark mode:
```tsx
// JavaScript
document.documentElement.classList.toggle('dark');

// Or conditionally
document.documentElement.classList.add('dark');
document.documentElement.classList.remove('dark');
```

## Migration Guide

| Old | New |
|-----|-----|
| `bg-blue-600` | `bg-primary` |
| `bg-purple-600` | `bg-accent` |
| `text-gray-600` | `text-muted-foreground` |
| `bg-gray-100` | `bg-muted` |
| `border-gray-300` | `border-border` |
| `text-blue-600` | `text-primary` |

## Component Classes

Utility classes defined in [src/index.css](../src/index.css):

```tsx
// Tags
<span className="tag-primary">
<span className="tag-accent">
<span className="tag-secondary">

// Remove button in tags
<button className="tag-remove-btn">

// Direct brand colors
<div className="bg-brand-blue text-brand-gold">
```
