# Typography Token System

## Overview
Typography is fully tokenized and font-agnostic. All type properties (sizes, line heights, weights, tracking) are defined as CSS custom properties, allowing instant font swapping.

## Swapping Fonts

### Single Change Point
```css
/* In src/index.css */
:root {
  --font-primary: 'Your Font Name', fallback, sans-serif;
}
```

### Try Different Fonts
```css
/* Modern Sans */
--font-primary: 'Inter', -apple-system, sans-serif;

/* Geometric */
--font-primary: 'Circular', 'Avenir Next', sans-serif;

/* Humanist */
--font-primary: 'Gill Sans', 'Trebuchet MS', sans-serif;

/* Grotesque */
--font-primary: 'Helvetica Neue', Helvetica, Arial, sans-serif;

/* Neo-grotesque */
--font-primary: 'Archivo', 'Univers', sans-serif;
```

## Token Structure

### Type Scale (Size + Line Height)
```css
--text-xs-size: 0.75rem;      /* 12px */
--text-xs-line: 1rem;          /* 16px */

--text-sm-size: 0.875rem;     /* 14px */
--text-sm-line: 1.25rem;      /* 20px */

--text-base-size: 1rem;       /* 16px */
--text-base-line: 1.5rem;     /* 24px */

--text-lg-size: 1.125rem;     /* 18px */
--text-lg-line: 1.75rem;      /* 28px */

--text-xl-size: 1.25rem;      /* 20px */
--text-xl-line: 1.75rem;      /* 28px */

--text-2xl-size: 1.5rem;      /* 24px */
--text-2xl-line: 2rem;        /* 32px */

--text-3xl-size: 1.875rem;    /* 30px */
--text-3xl-line: 2.25rem;     /* 36px */

--text-4xl-size: 2.25rem;     /* 36px */
--text-4xl-line: 2.5rem;      /* 40px */
```

### Font Weights (Semantic)
```css
--font-regular: 400;
--font-medium: 500;
--font-semibold: 600;
--font-bold: 700;
```

### Letter Spacing
```css
--tracking-tight: -0.01em;
--tracking-normal: 0;
--tracking-wide: 0.025em;
```

## Usage

### Tailwind Classes (Auto-generated)
```tsx
<h1 className="text-4xl font-bold">Heading</h1>
<p className="text-base font-regular">Body text</p>
<span className="text-sm font-medium tracking-wide">Label</span>
```

### Direct CSS Variables
```css
.custom-element {
  font-family: var(--font-primary);
  font-size: var(--text-lg-size);
  line-height: var(--text-lg-line);
  font-weight: var(--font-semibold);
  letter-spacing: var(--tracking-tight);
}
```

## Adjusting Type Scale

To modify proportions for different fonts, only adjust the tokens:

```css
/* Tighter for condensed fonts */
:root {
  --text-base-line: 1.4rem;  /* Down from 1.5rem */
  --tracking-normal: -0.005em;
}

/* Looser for wide fonts */
:root {
  --text-base-line: 1.6rem;  /* Up from 1.5rem */
  --tracking-normal: 0.01em;
}

/* Larger scale for dramatic fonts */
:root {
  --text-4xl-size: 3rem;     /* Up from 2.25rem */
  --text-4xl-line: 3.5rem;   /* Up from 2.5rem */
}
```

## Benefits

1. **Instant Font Swapping** - Change one variable, see entire UI update
2. **Consistent Scale** - Typography proportions stay intact across fonts
3. **Fine-Tuning** - Adjust line heights and tracking per font without touching components
4. **Zero Refactoring** - All existing classes continue working
5. **Type Safety** - Prevents arbitrary font-size values across codebase

## Example: Testing Multiple Fonts

```css
/* Test these by uncommenting one at a time */
:root {
  /* Default System */
  --font-primary: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  
  /* Inter (Modern) */
  /* --font-primary: 'Inter', -apple-system, sans-serif; */
  
  /* IBM Plex Sans (Technical) */
  /* --font-primary: 'IBM Plex Sans', 'Segoe UI', sans-serif; */
  
  /* Work Sans (Friendly) */
  /* --font-primary: 'Work Sans', 'Helvetica Neue', sans-serif; */
  
  /* DM Sans (Clean) */
  /* --font-primary: 'DM Sans', Arial, sans-serif; */
}
```

All type scales, weights, and spacing remain perfectly tuned - only the font face changes.
