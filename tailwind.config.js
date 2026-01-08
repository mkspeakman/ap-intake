/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        /* ============================================
           SEMANTIC COLOR TOKENS
           These map to CSS variables defined in index.css
           ============================================ */
        
        // Core semantic colors
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        
        // Primary action color (blue)
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        
        // Secondary/highlight color (gold)
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        
        // Destructive/error states
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        
        // Muted/subtle elements
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        
        // Accent color (alternative to primary)
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        
        // Popovers and dropdowns
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        
        // Cards and elevated surfaces
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        
        /* ============================================
           RAW COLOR PALETTE
           Direct access to base colors when needed
           ============================================ */
        
        brand: {
          blue: "#3D6A9E",      // color3 - Primary (WCAG AA 4.5:1)
          gold: "#FCB716",      // color4 - Accent
          charcoal: "#0A0A0B",  // color1 - Dark
          gray: "#626163",      // color2 - Medium
          silver: "#828A90",    // color5 - Borders (WCAG AA 3:1)
          cream: "#F1F0EF",     // color6 - Light
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [],
}
