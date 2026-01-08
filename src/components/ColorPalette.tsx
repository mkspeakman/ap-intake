import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

/**
 * ColorPalette Component
 * 
 * A visual reference for the design token system.
 * Import and render this component to see all colors in action.
 * 
 * Usage:
 * ```tsx
 * import { ColorPalette } from '@/components/ColorPalette';
 * 
 * function Page() {
 *   return <ColorPalette />;
 * }
 * ```
 */
export function ColorPalette() {
  return (
    <div className="container mx-auto p-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Design Token System</h1>
        <p className="text-muted-foreground">
          Visual reference for the color palette and semantic tokens
        </p>
      </div>

      {/* Base Palette */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Base Color Palette</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <ColorSwatch
            name="Charcoal"
            hex="#0A0A0B"
            className="bg-brand-charcoal"
            textColor="text-white"
          />
          <ColorSwatch
            name="Gray"
            hex="#626163"
            className="bg-brand-gray"
            textColor="text-white"
          />
          <ColorSwatch
            name="Blue"
            hex="#3D6A9E"
            className="bg-brand-blue"
            textColor="text-white"
          />
          <ColorSwatch
            name="Gold"
            hex="#FCB716"
            className="bg-brand-gold"
            textColor="text-foreground"
          />
          <ColorSwatch
            name="Silver"
            hex="#828A90"
            className="bg-brand-silver"
            textColor="text-foreground"
          />
          <ColorSwatch
            name="Cream"
            hex="#F1F0EF"
            className="bg-brand-cream"
            textColor="text-foreground"
          />
        </div>
      </section>

      {/* Semantic Tokens */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Semantic Tokens</h2>
        
        {/* Background & Foreground */}
        <div className="mb-6">
          <h3 className="text-lg font-medium mb-3">Background & Text</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="bg-background border-border">
              <CardContent className="pt-6">
                <p className="text-foreground font-medium">Background + Foreground</p>
                <p className="text-muted-foreground text-sm mt-1">
                  Default page background and text color
                </p>
              </CardContent>
            </Card>
            <Card className="bg-card border-border">
              <CardContent className="pt-6">
                <p className="text-card-foreground font-medium">Card + Card Foreground</p>
                <p className="text-muted-foreground text-sm mt-1">
                  Elevated surface color
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Actions */}
        <div className="mb-6">
          <h3 className="text-lg font-medium mb-3">Action Colors</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button className="bg-primary text-primary-foreground px-4 py-3 rounded-lg font-medium hover:opacity-90 transition">
              Primary Action
            </button>
            <button className="bg-secondary text-secondary-foreground px-4 py-3 rounded-lg font-medium hover:opacity-90 transition">
              Secondary Action
            </button>
            <button className="bg-accent text-accent-foreground px-4 py-3 rounded-lg font-medium hover:opacity-90 transition">
              Accent Action
            </button>
          </div>
        </div>

        {/* Muted & Borders */}
        <div className="mb-6">
          <h3 className="text-lg font-medium mb-3">Subtle Elements</h3>
          <div className="space-y-3">
            <div className="bg-muted text-muted-foreground px-4 py-3 rounded-lg">
              <span className="font-medium">Muted Background</span> with muted foreground text
            </div>
            <div className="border-2 border-border px-4 py-3 rounded-lg">
              Element with <span className="font-medium">border</span> color
            </div>
            <div className="border-2 border-input px-4 py-3 rounded-lg">
              Input field with <span className="font-medium">input border</span> color
            </div>
            <div className="border-2 border-ring px-4 py-3 rounded-lg ring-2 ring-ring ring-offset-2">
              Element with <span className="font-medium">focus ring</span> (ring color)
            </div>
          </div>
        </div>

        {/* Tags/Badges */}
        <div className="mb-6">
          <h3 className="text-lg font-medium mb-3">Tags & Badges</h3>
          <div className="flex flex-wrap gap-2">
            <span className="tag-primary">Primary Tag</span>
            <span className="tag-accent">Accent Tag</span>
            <span className="tag-secondary">Secondary Tag</span>
            <span className="inline-flex items-center gap-1 bg-destructive text-destructive-foreground px-3 py-1 rounded-full text-sm">
              Destructive Tag
            </span>
          </div>
        </div>

        {/* States */}
        <div>
          <h3 className="text-lg font-medium mb-3">State Colors</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-destructive text-destructive-foreground px-4 py-3 rounded-lg">
              <span className="font-medium">Destructive:</span> Error or delete actions
            </div>
            <div className="bg-popover text-popover-foreground border border-border px-4 py-3 rounded-lg">
              <span className="font-medium">Popover:</span> Dropdown menus and tooltips
            </div>
          </div>
        </div>
      </section>

      {/* Usage Examples */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Usage Examples</h2>
        <Card>
          <CardHeader>
            <CardTitle>Example Form</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-foreground">Company Name</label>
              <input
                type="text"
                placeholder="Enter company name"
                className="w-full mt-1 px-3 py-2 bg-background border border-input rounded-md focus:ring-2 focus:ring-ring focus:border-ring"
              />
              <p className="text-xs text-muted-foreground mt-1">
                This will be used for your quote
              </p>
            </div>
            
            <div>
              <p className="text-sm font-medium mb-2">Selected Materials</p>
              <div className="flex flex-wrap gap-2">
                <span className="tag-primary">6061-T6 Aluminum</span>
                <span className="tag-primary">304 Stainless Steel</span>
              </div>
            </div>
            
            <div>
              <p className="text-sm font-medium mb-2">Selected Finishes</p>
              <div className="flex flex-wrap gap-2">
                <span className="tag-accent">Anodize (Type II)</span>
                <span className="tag-accent">Bead Blast</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}

interface ColorSwatchProps {
  name: string;
  hex: string;
  className: string;
  textColor: string;
}

function ColorSwatch({ name, hex, className, textColor }: ColorSwatchProps) {
  return (
    <div className={`${className} rounded-lg p-4 aspect-square flex flex-col justify-end`}>
      <p className={`${textColor} font-medium text-sm`}>{name}</p>
      <p className={`${textColor} text-xs opacity-80 font-mono`}>{hex}</p>
    </div>
  );
}
