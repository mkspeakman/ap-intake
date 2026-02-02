# Figma Design System Reference

**Project:** AP-Intake Manufacturing Quote Request System  
**Last Updated:** February 1, 2026  
**Purpose:** Complete design token specification for recreating the design system in Figma

---

## Table of Contents

1. [Color System](#1-color-system)
2. [Typography System](#2-typography-system)
3. [Spacing & Layout](#3-spacing--layout)
4. [Component Styles](#4-component-styles)
5. [Effects & Shadows](#5-effects--shadows)
6. [Border Radius](#6-border-radius)
7. [Opacity & Transparency](#7-opacity--transparency)
8. [Figma Variables Setup](#8-figma-variables-setup)
9. [Component Architecture](#9-component-architecture)
10. [Usage Guidelines](#10-usage-guidelines)

---

## 1. Color System

### 1.1 Brand Color Palette (Primitives)

These are the foundational colors. All semantic tokens derive from these.

| Color Name | Hex | RGB | HSL | OKLCH | Usage |
|------------|-----|-----|-----|-------|-------|
| **Charcoal** | `#0A0A0B` | `10, 10, 11` | `270°, 8%, 4%` | `0.145 0.002 286.1` | Primary text, dark backgrounds |
| **Gray** | `#626163` | `98, 97, 99` | `300°, 2%, 38%` | `0.494 0.003 308.4` | Secondary text, muted content |
| **Blue** | `#3D6A9E` | `61, 106, 158` | `212°, 44%, 43%` | `0.560 0.080 240.5` | Primary actions, links (WCAG AA: 4.5:1) |
| **Gold** | `#FCB716` | `252, 183, 22` | `42°, 97%, 54%` | `0.822 0.167 80.5` | Secondary highlights, accents |
| **Silver** | `#D4D6D8` | `212, 214, 216` | `210°, 4%, 84%` | `0.860 0.003 247.9` | Borders, dividers (subtle aesthetic) |
| **Cream** | `#F1F0EF` | `241, 240, 239` | `30°, 9%, 94%` | `0.956 0.002 67.8` | Page background, light surfaces |

### 1.2 Additional Palette Colors

| Color Name | Hex | Usage |
|------------|-----|-------|
| **Pure White** | `#FFFFFF` | Cards, elevated surfaces |
| **Accent Light** | `#F3F4F5` | Hover states (96% lightness, very subtle) |
| **Destructive Red** | `#DC2626` | Error states, destructive actions |

### 1.3 Semantic Color Tokens (Light Mode)

Map these as **Figma Variables** for theming support.

#### Background Colors

| Token Name | Value (HSL) | Hex Equivalent | Usage |
|------------|-------------|----------------|-------|
| `background` | `30° 9% 94.5%` | `#F1F0EF` | Main page background |
| `foreground` | `270° 8% 4%` | `#0A0A0B` | Primary text color |

#### Surface Colors (Cards, Popovers)

| Token Name | Value (HSL) | Hex Equivalent | Usage |
|------------|-------------|----------------|-------|
| `card` | `0° 0% 100%` | `#FFFFFF` | Card backgrounds |
| `card-foreground` | `270° 8% 4%` | `#0A0A0B` | Text on cards |
| `popover` | `0° 0% 100%` | `#FFFFFF` | Dropdown backgrounds |
| `popover-foreground` | `270° 8% 4%` | `#0A0A0B` | Text in dropdowns |

#### Action Colors

| Token Name | Value (HSL) | Hex Equivalent | Usage |
|------------|-------------|----------------|-------|
| `primary` | `210° 45% 43%` | `#3D6A9E` | Primary buttons, links |
| `primary-foreground` | `0° 0% 100%` | `#FFFFFF` | Text on primary |
| `secondary` | `43° 97% 54%` | `#FCB716` | Secondary actions, highlights |
| `secondary-foreground` | `270° 8% 4%` | `#0A0A0B` | Text on secondary |

#### State Colors

| Token Name | Value (HSL) | Hex Equivalent | Usage |
|------------|-------------|----------------|-------|
| `accent` | `210° 8% 96%` | `#F3F4F5` | Hover states, subtle highlights |
| `accent-foreground` | `270° 8% 4%` | `#0A0A0B` | Text on accent |
| `muted` | `208° 9% 76%` | `#BBC0C5` | Muted backgrounds |
| `muted-foreground` | `300° 2% 38%` | `#626163` | Secondary/muted text |
| `destructive` | `0° 84% 60%` | `#DC2626` | Error states, delete buttons |
| `destructive-foreground` | `0° 0% 100%` | `#FFFFFF` | Text on destructive |

#### Border & Input Colors

| Token Name | Value (HSL) | Hex Equivalent | Usage |
|------------|-------------|----------------|-------|
| `border` | `210° 13% 84%` | `#D4D6D8` | Default borders |
| `input` | `210° 13% 84%` | `#D4D6D8` | Input field borders |
| `ring` | `210° 45% 43%` | `#3D6A9E` | Focus ring (matches primary) |

### 1.4 Semantic Color Tokens (Dark Mode)

For future dark mode implementation:

| Token Name | Value (HSL) | Hex Equivalent | Usage |
|------------|-------------|----------------|-------|
| `background` | `270° 8% 4%` | `#0A0A0B` | Dark background |
| `foreground` | `30° 9% 94.5%` | `#F1F0EF` | Light text |
| `card` | `270° 8% 8%` | `#141416` | Slightly lighter cards |
| `primary` | `213° 50% 70%` | `#6FA8DC` | Lighter blue for dark mode |
| `border` | `300° 2% 25%` | `#3E3E3F` | Dark mode borders |

### 1.5 Color Contrast Matrix (WCAG Compliance)

| Foreground | Background | Ratio | Passes |
|------------|------------|-------|--------|
| `#0A0A0B` (Charcoal) | `#F1F0EF` (Cream) | 18.7:1 | AAA (Large + Small Text) |
| `#3D6A9E` (Blue) | `#FFFFFF` (White) | 4.92:1 | AA (Small Text) |
| `#626163` (Gray) | `#F1F0EF` (Cream) | 4.51:1 | AA (Small Text) |
| `#FCB716` (Gold) | `#0A0A0B` (Charcoal) | 11.24:1 | AAA (Large + Small Text) |
| `#D4D6D8` (Silver) | `#F1F0EF` (Cream) | 1.5:1 | ❌ Decorative Only |

**Note:** Silver borders are intentionally subtle for sleek aesthetic, not for critical UI elements.

---

## 2. Typography System

### 2.1 Font Families

#### Primary Font Stack (Body & UI)
```
Menbere, Reddit Sans, Noto Sans, Source Sans 3, Saira, Glory, SUSE Mono, Oxanium, Exo 2, sans-serif
```

**Figma Setup:**
- Primary: Use **Inter** or **Roboto** as a proxy (Google Fonts available in Figma)
- Fallback: System UI fonts

#### Monospace Font Stack (Code)
```
ui-monospace, SF Mono, Monaco, Cascadia Code, Courier New, monospace
```

**Figma Setup:**
- Use **SF Mono** or **Roboto Mono**

### 2.2 Type Scale

All sizes include paired line heights for optimal readability.

| Scale | Size (rem) | Size (px) | Line Height (rem) | Line Height (px) | Usage |
|-------|------------|-----------|-------------------|------------------|-------|
| `xs` | `0.75rem` | `12px` | `1rem` | `16px` | Fine print, captions |
| `sm` | `0.875rem` | `14px` | `1.25rem` | `20px` | Small labels, helper text |
| `base` | `1rem` | `16px` | `1.5rem` | `24px` | Body text (default) |
| `lg` | `1.125rem` | `18px` | `1.75rem` | `28px` | Emphasized body text |
| `xl` | `1.25rem` | `20px` | `1.75rem` | `28px` | Small headings |
| `2xl` | `1.5rem` | `24px` | `2rem` | `32px` | Section headings |
| `3xl` | `1.875rem` | `30px` | `2.25rem` | `36px` | Page headings |
| `4xl` | `2.25rem` | `36px` | `2.5rem` | `40px` | Hero headings |

### 2.3 Font Weights

| Weight Name | Value | Usage |
|-------------|-------|-------|
| `regular` | `400` | Body text, default |
| `medium` | `500` | Emphasized text, labels |
| `semibold` | `600` | Strong emphasis, subheadings |
| `bold` | `700` | Headings, high emphasis |

### 2.4 Letter Spacing

| Tracking Name | Value | Usage |
|---------------|-------|-------|
| `tight` | `-0.01em` | Headings, large text |
| `normal` | `0` | Body text (default) |
| `wide` | `0.025em` | All-caps text, small labels |

### 2.5 Figma Text Styles

Create these as **Figma Text Styles** for consistency:

| Style Name | Font | Size | Weight | Line Height | Letter Spacing |
|------------|------|------|--------|-------------|----------------|
| `Heading/4XL` | Primary | 36px | Bold (700) | 40px | -0.01em |
| `Heading/3XL` | Primary | 30px | Bold (700) | 36px | -0.01em |
| `Heading/2XL` | Primary | 24px | Semibold (600) | 32px | -0.01em |
| `Heading/XL` | Primary | 20px | Semibold (600) | 28px | 0 |
| `Body/Large` | Primary | 18px | Regular (400) | 28px | 0 |
| `Body/Base` | Primary | 16px | Regular (400) | 24px | 0 |
| `Body/Small` | Primary | 14px | Regular (400) | 20px | 0 |
| `Body/XSmall` | Primary | 12px | Regular (400) | 16px | 0 |
| `Label/Medium` | Primary | 14px | Medium (500) | 20px | 0 |
| `Label/Semibold` | Primary | 14px | Semibold (600) | 20px | 0 |
| `Button/Base` | Primary | 16px | Medium (500) | 24px | 0 |
| `Button/Small` | Primary | 14px | Medium (500) | 20px | 0 |

---

## 3. Spacing & Layout

### 3.1 Spacing Scale

Based on **4px base unit** for consistency.

| Token | Value | Pixels | Usage |
|-------|-------|--------|-------|
| `0` | `0rem` | `0px` | None |
| `0.5` | `0.125rem` | `2px` | Micro spacing |
| `1` | `0.25rem` | `4px` | Tight spacing |
| `1.5` | `0.375rem` | `6px` | Extra small gaps |
| `2` | `0.5rem` | `8px` | Small gaps |
| `3` | `0.75rem` | `12px` | Medium gaps |
| `4` | `1rem` | `16px` | Standard spacing |
| `5` | `1.25rem` | `20px` | Comfortable spacing |
| `6` | `1.5rem` | `24px` | Large spacing |
| `8` | `2rem` | `32px` | Section spacing |
| `10` | `2.5rem` | `40px` | Major sections |
| `12` | `3rem` | `48px` | Page sections |
| `16` | `4rem` | `64px` | Large gutters |
| `20` | `5rem` | `80px` | Hero sections |
| `24` | `6rem` | `96px` | Extra large sections |

### 3.2 Component Spacing Patterns

| Component | Padding | Margin | Gap |
|-----------|---------|--------|-----|
| **Button** | `12px 24px` (3 x 6) | — | — |
| **Input** | `10px 12px` (2.5 x 3) | — | — |
| **Card** | `24px` (6) | `16px` (4) | — |
| **Form Section** | `24px` (6) | `16px` (4) | `12px` (3) |
| **Modal** | `32px` (8) | — | `16px` (4) |
| **Table Cell** | `12px 16px` (3 x 4) | — | — |
| **Badge** | `4px 12px` (1 x 3) | — | — |

### 3.3 Layout Grid

| Breakpoint | Min Width | Columns | Gutter | Margin |
|------------|-----------|---------|--------|--------|
| **Mobile** | `320px` | 4 | `16px` | `16px` |
| **Tablet** | `768px` | 8 | `24px` | `24px` |
| **Desktop** | `1024px` | 12 | `32px` | `32px` |
| **Wide** | `1440px` | 12 | `32px` | `auto` |

### 3.4 Container Widths

| Container | Max Width | Usage |
|-----------|-----------|-------|
| `sm` | `640px` | Small forms, modals |
| `md` | `768px` | Standard forms |
| `lg` | `1024px` | Content pages |
| `xl` | `1280px` | Wide layouts |
| `2xl` | `1536px` | Full-width dashboards |

---

## 4. Component Styles

### 4.1 Buttons

#### Primary Button
- **Background:** `primary` (#3D6A9E)
- **Text:** `primary-foreground` (#FFFFFF)
- **Padding:** `12px 24px`
- **Border Radius:** `8px` (medium)
- **Font:** 16px, medium (500)
- **Hover:** Darken background by 10%
- **Focus:** `ring` color (#3D6A9E), 2px offset

#### Secondary Button
- **Background:** `secondary` (#FCB716)
- **Text:** `secondary-foreground` (#0A0A0B)
- **Padding:** `12px 24px`
- **Border Radius:** `8px`
- **Hover:** Darken background by 10%

#### Outline Button
- **Background:** Transparent
- **Border:** `1px solid border` (#D4D6D8)
- **Text:** `foreground` (#0A0A0B)
- **Padding:** `12px 24px`
- **Hover:** `accent` background (#F3F4F5)

#### Ghost Button
- **Background:** Transparent
- **Text:** `foreground` (#0A0A0B)
- **Padding:** `12px 24px`
- **Hover:** `accent` background (#F3F4F5)

#### Destructive Button
- **Background:** `destructive` (#DC2626)
- **Text:** `destructive-foreground` (#FFFFFF)
- **Padding:** `12px 24px`
- **Hover:** Darken background by 10%

### 4.2 Input Fields

#### Text Input
- **Background:** `#FFFFFF`
- **Border:** `1px solid input` (#D4D6D8)
- **Text:** `foreground` (#0A0A0B)
- **Placeholder:** `muted-foreground` (#626163)
- **Padding:** `10px 12px`
- **Border Radius:** `6px` (small)
- **Font:** 16px, regular (400)
- **Focus:** `ring` color (#3D6A9E), 2px offset

#### Textarea
- Same as text input, with `min-height: 80px`

#### Select Dropdown
- Same as text input
- **Icon:** Chevron down, `muted-foreground`
- **Dropdown Item Hover:** `accent` (#F3F4F5)

### 4.3 Cards

#### Standard Card
- **Background:** `card` (#FFFFFF)
- **Border:** `1px solid border` (#D4D6D8)
- **Border Radius:** `12px` (large)
- **Padding:** `24px`
- **Shadow:** `0 1px 3px rgba(0,0,0,0.1)`

#### Elevated Card
- Same as standard, with stronger shadow:
- **Shadow:** `0 4px 6px rgba(0,0,0,0.1)`

### 4.4 Tables

#### Table Structure
- **Background:** `card` (#FFFFFF)
- **Border:** `1px solid border` (#D4D6D8)
- **Border Radius:** `8px`

#### Table Header
- **Background:** `muted` (#BBC0C5)
- **Text:** `foreground` (#0A0A0B), 14px, semibold (600)
- **Padding:** `12px 16px`

#### Table Row
- **Background:** `#FFFFFF`
- **Border Bottom:** `1px solid border` (#D4D6D8)
- **Padding:** `12px 16px`
- **Hover:** `accent` (#F3F4F5)

#### Table Cell
- **Text:** `foreground` (#0A0A0B), 14px, regular (400)

### 4.5 Badges

#### Default Badge
- **Background:** `accent` (#F3F4F5)
- **Text:** `accent-foreground` (#0A0A0B)
- **Padding:** `4px 12px`
- **Border Radius:** `9999px` (full/pill)
- **Font:** 12px, medium (500)

#### Primary Badge
- **Background:** `primary` (#3D6A9E)
- **Text:** `primary-foreground` (#FFFFFF)

#### Secondary Badge
- **Background:** `secondary` (#FCB716)
- **Text:** `secondary-foreground` (#0A0A0B)

#### Status Badges
- **Pending:** Muted background (#BBC0C5), charcoal text
- **Approved:** Green background (#10B981), white text
- **Rejected:** Destructive background (#DC2626), white text

### 4.6 Modals/Dialogs

#### Dialog Overlay
- **Background:** `rgba(0, 0, 0, 0.5)`

#### Dialog Content
- **Background:** `card` (#FFFFFF)
- **Border Radius:** `12px`
- **Padding:** `32px`
- **Max Width:** `600px`
- **Shadow:** `0 20px 25px rgba(0,0,0,0.15)`

### 4.7 Accordions

#### Accordion Header
- **Background:** Transparent
- **Padding:** `16px`
- **Hover:** `accent` (#F3F4F5)
- **Border Bottom:** `1px solid border` (#D4D6D8)

#### Accordion Content
- **Padding:** `16px`
- **Animation:** Expand/collapse with ease-out (0.2s)

---

## 5. Effects & Shadows

### 5.1 Shadow Scale

| Level | CSS Value | Usage |
|-------|-----------|-------|
| `xs` | `0 1px 2px rgba(0,0,0,0.05)` | Subtle depth |
| `sm` | `0 1px 3px rgba(0,0,0,0.1), 0 1px 2px rgba(0,0,0,0.06)` | Cards, inputs |
| `md` | `0 4px 6px rgba(0,0,0,0.1), 0 2px 4px rgba(0,0,0,0.06)` | Dropdowns |
| `lg` | `0 10px 15px rgba(0,0,0,0.1), 0 4px 6px rgba(0,0,0,0.05)` | Modals |
| `xl` | `0 20px 25px rgba(0,0,0,0.15), 0 10px 10px rgba(0,0,0,0.04)` | Overlays |
| `2xl` | `0 25px 50px rgba(0,0,0,0.25)` | Heavy emphasis |

### 5.2 Focus Ring

- **Color:** `ring` (#3D6A9E)
- **Width:** `2px`
- **Offset:** `2px`
- **Style:** Solid

### 5.3 Hover Effects

- **Background Transition:** `background-color 150ms ease`
- **Opacity Transition:** `opacity 150ms ease`
- **Transform (buttons):** `transform 150ms ease` (subtle scale: 0.98)

---

## 6. Border Radius

### 6.1 Radius Scale

| Token | Value | Usage |
|-------|-------|-------|
| `none` | `0` | Sharp corners |
| `sm` | `4px` | Small elements |
| `base` | `6px` | Inputs, small buttons |
| `md` | `8px` | Standard buttons |
| `lg` | `12px` | Cards, modals |
| `xl` | `16px` | Large cards |
| `2xl` | `24px` | Hero sections |
| `full` | `9999px` | Pills, badges, circular buttons |

### 6.2 Component Radius Mapping

| Component | Radius |
|-----------|--------|
| Button | `8px` (md) |
| Input | `6px` (base) |
| Card | `12px` (lg) |
| Badge | `9999px` (full) |
| Modal | `12px` (lg) |
| Checkbox | `4px` (sm) |
| Avatar | `9999px` (full) |

---

## 7. Opacity & Transparency

### 7.1 Opacity Scale

| Level | Value | Usage |
|-------|-------|-------|
| `0` | `0` | Hidden |
| `5` | `0.05` | Very subtle overlays |
| `10` | `0.1` | Subtle overlays |
| `20` | `0.2` | Disabled states |
| `30` | `0.3` | Placeholders |
| `40` | `0.4` | Muted elements |
| `50` | `0.5` | Semi-transparent |
| `60` | `0.6` | — |
| `70` | `0.7` | — |
| `80` | `0.8` | Hover states |
| `90` | `0.9` | Almost opaque |
| `100` | `1.0` | Fully opaque |

### 7.2 Common Use Cases

- **Disabled button:** Opacity 40%
- **Loading state:** Opacity 50%
- **Hover overlay:** Opacity 10-20%
- **Modal backdrop:** `rgba(0,0,0,0.5)` (50% black)

---

## 8. Figma Variables Setup

### 8.1 Creating Color Variables

1. **Open Figma → Select "Variables" panel**
2. **Create Collection:** "AP Intake | Design Tokens"
3. **Create Modes:** "Light Mode", "Dark Mode"
4. **Add Color Variables:**

#### Brand Colors (Primitives)
- `brand/charcoal` → `#0A0A0B`
- `brand/gray` → `#626163`
- `brand/blue` → `#3D6A9E`
- `brand/gold` → `#FCB716`
- `brand/silver` → `#D4D6D8`
- `brand/cream` → `#F1F0EF`

#### Semantic Colors (Light Mode)
- `semantic/background` → `#F1F0EF`
- `semantic/foreground` → `#0A0A0B`
- `semantic/primary` → `#3D6A9E`
- `semantic/primary-foreground` → `#FFFFFF`
- `semantic/secondary` → `#FCB716`
- `semantic/secondary-foreground` → `#0A0A0B`
- `semantic/accent` → `#F3F4F5`
- `semantic/accent-foreground` → `#0A0A0B`
- `semantic/muted` → `#BBC0C5`
- `semantic/muted-foreground` → `#626163`
- `semantic/card` → `#FFFFFF`
- `semantic/card-foreground` → `#0A0A0B`
- `semantic/border` → `#D4D6D8`
- `semantic/input` → `#D4D6D8`
- `semantic/ring` → `#3D6A9E`
- `semantic/destructive` → `#DC2626`
- `semantic/destructive-foreground` → `#FFFFFF`

### 8.2 Creating Typography Variables

**Not recommended** - Use Text Styles instead (see section 2.5)

### 8.3 Creating Number Variables (Spacing)

1. **Create Number Variables in same collection:**
   - `spacing/0` → `0`
   - `spacing/1` → `4`
   - `spacing/2` → `8`
   - `spacing/3` → `12`
   - `spacing/4` → `16`
   - `spacing/5` → `20`
   - `spacing/6` → `24`
   - `spacing/8` → `32`
   - `spacing/10` → `40`
   - `spacing/12` → `48`
   - `spacing/16` → `64`
   - `spacing/20` → `80`
   - `spacing/24` → `96`

### 8.4 Importing figma-variables.json

The project includes a `figma-variables.json` file with all tokens pre-configured:

1. **Download** `figma-variables.json` from project root
2. **In Figma:** Variables panel → "⋯" menu → "Import variables"
3. **Select** the JSON file
4. **Review** and confirm import

---

## 9. Component Architecture

### 9.1 Atomic Design Hierarchy

#### Atoms (Smallest Units)
- Text labels
- Icons
- Buttons
- Input fields
- Checkboxes
- Radio buttons
- Badges

#### Molecules (Simple Combinations)
- Form fields (label + input + error)
- Search bar (input + icon)
- Button groups
- Tags with remove button
- Table cells with content

#### Organisms (Complex Components)
- Navigation header
- Form sections (multiple fields)
- Data tables
- Modal dialogs
- Accordions
- File upload area

#### Templates (Page Layouts)
- Main form page
- Submission history page
- User management page
- Login modal

### 9.2 Component Naming Convention

Use this naming pattern in Figma:

```
[Category]/[Component]/[Variant]/[State]
```

**Examples:**
- `Button/Primary/Default`
- `Button/Primary/Hover`
- `Button/Primary/Disabled`
- `Input/Text/Default`
- `Input/Text/Focus`
- `Input/Text/Error`
- `Card/Standard/Default`
- `Card/Elevated/Default`

### 9.3 Component States to Include

For each interactive component, create these states:

1. **Default** - Resting state
2. **Hover** - Mouse over
3. **Focus** - Keyboard/click focus
4. **Active** - Being clicked/pressed
5. **Disabled** - Non-interactive
6. **Error** - Validation failure (inputs)
7. **Loading** - In-progress (buttons)

---

## 10. Usage Guidelines

### 10.1 Color Usage Rules

#### Do's ✅
- Use `primary` for main CTAs and links
- Use `secondary` sparingly for highlights
- Use `accent` for all hover states (consistency)
- Use `muted` for backgrounds of disabled states
- Use `destructive` only for delete/error actions
- Maintain contrast ratios for text (WCAG AA minimum)

#### Don'ts ❌
- Don't use `secondary` (gold) for primary buttons
- Don't mix hover state colors (always use `accent`)
- Don't use `border` color for critical UI (too subtle)
- Don't use pure black (#000000) - use `charcoal` (#0A0A0B)
- Don't use pure white (#FFFFFF) for page backgrounds - use `cream` (#F1F0EF)

### 10.2 Typography Usage Rules

#### Do's ✅
- Use type scale consistently (don't create custom sizes)
- Pair font sizes with their designated line heights
- Use medium (500) or semibold (600) for emphasis
- Use tight tracking (-0.01em) for headings
- Keep body text at 16px minimum for readability

#### Don'ts ❌
- Don't use font weights outside the defined set
- Don't adjust line heights independently from type scale
- Don't use all-caps without wide tracking (0.025em)
- Don't go below 12px for any text (accessibility)

### 10.3 Spacing Usage Rules

#### Do's ✅
- Use 4px increments for all spacing
- Use spacing tokens (`1`, `2`, `3`, etc.) consistently
- Maintain vertical rhythm with consistent gaps
- Use larger spacing between sections (8, 10, 12)
- Use smaller spacing within components (2, 3, 4)

#### Don'ts ❌
- Don't create arbitrary spacing values (e.g., 13px)
- Don't use negative margins excessively
- Don't ignore the spacing scale

### 10.4 Accessibility Checklist

When creating designs in Figma, verify:

- ✅ Text contrast meets WCAG AA (4.5:1 minimum)
- ✅ Focus states are visible (2px ring, distinct color)
- ✅ Interactive elements are at least 44x44px (touch targets)
- ✅ Color is not the only indicator of state
- ✅ Form fields have visible labels
- ✅ Error messages are clear and associated with inputs
- ✅ Hover states are consistent across similar components

### 10.5 Responsive Design Guidelines

#### Mobile (320px - 767px)
- Stack form fields vertically
- Full-width buttons
- 16px side margins
- Larger touch targets (48px minimum)
- Simplified navigation (hamburger menu)

#### Tablet (768px - 1023px)
- 2-column form layouts where appropriate
- 24px side margins
- Standard button widths

#### Desktop (1024px+)
- Multi-column layouts
- Hover states active
- 32px+ side margins
- Inline form validation

---

## 11. Exporting from Figma

### 11.1 Asset Export Settings

| Asset Type | Format | Scale | Notes |
|------------|--------|-------|-------|
| Icons | SVG | 1x | Outline, no fill |
| Logos | SVG, PNG | 1x, 2x | Transparent background |
| Images | PNG, WebP | 1x, 2x | Optimize for web |
| Illustrations | SVG | 1x | Preserve vector |

### 11.2 Code Export (Dev Handoff)

Use Figma's built-in **Inspect** panel to provide:
- CSS for spacing, colors, typography
- SVG code for icons
- Asset URLs for images

---

## 12. Additional Resources

### Design Files
- **Figma Variables JSON:** `figma-variables.json` (project root)
- **CSS Variables:** `src/index.css`
- **Tailwind Config:** `tailwind.config.js`
- **Design Docs:** `DESIGN_SYSTEM_FINAL.md`, `DESIGN_TOKENS.md`

### Reference Links
- [Tailwind CSS Color Docs](https://tailwindcss.com/docs/customizing-colors)
- [Radix UI Design System](https://www.radix-ui.com/colors)
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [Figma Variables Documentation](https://help.figma.com/hc/en-us/articles/15339657135383-Guide-to-variables-in-Figma)

---

## 13. Design System Maintenance

### When to Update

- **New Components:** Add to component library with all states
- **Color Changes:** Update primitive → semantic tokens → update components
- **Typography Changes:** Update type scale → text styles → components
- **Spacing Changes:** Update spacing scale → component padding/margins

### Version Control

Tag design system updates in both Figma and code:
- Figma: Use version history and descriptions
- Code: Git tags (e.g., `design-system-v2.0`)

---

**End of Figma Design System Reference**

*For implementation questions, see AI_CONTEXT.md or contact the development team.*
