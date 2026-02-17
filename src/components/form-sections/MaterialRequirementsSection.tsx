import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { X } from 'lucide-react';

const MATERIALS = [
  '6061-T6 Aluminum',
  '7075 Aluminum',
  '304 Stainless Steel',
  '316 Stainless Steel',
  'Titanium',
  'PEEK',
  'Delrin',
  'ABS',
  'Polycarbonate',
  'Brass',
  'Copper',
];

interface MaterialRequirementsSectionProps {
  materials: string[];
  customMaterial: string;
  onMaterialAdd: (material: string) => void;
  onMaterialRemove: (material: string) => void;
  onCustomMaterialChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onCustomMaterialAdd: () => void;
}

export function MaterialRequirementsSection({
  materials,
  customMaterial,
  onMaterialAdd,
  onMaterialRemove,
  onCustomMaterialChange,
  onCustomMaterialAdd,
}: MaterialRequirementsSectionProps) {
  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="materials">Select Material(s) *</Label>
        <Select onValueChange={onMaterialAdd}>
          <SelectTrigger id="materials">
            <SelectValue placeholder="Select materials..." />
          </SelectTrigger>
          <SelectContent>
            {MATERIALS.map((material) => (
              <SelectItem key={material} value={material}>
                {material}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {materials.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {materials.map((material) => (
              <span
                key={material}
                className="inline-flex items-center gap-1 bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm"
              >
                {material}
                <button
                  type="button"
                  onClick={() => onMaterialRemove(material)}
                  className="hover:opacity-90 rounded-full p-0.5"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))}
          </div>
        )}
      </div>
      <div>
        <Label htmlFor="customMaterial">Add Custom Material</Label>
        <div className="flex gap-2">
          <Input
            id="customMaterial"
            name="customMaterial"
            placeholder="e.g., Inconel 718"
            autoComplete="off"
            value={customMaterial}
            onChange={onCustomMaterialChange}
          />
          <Button type="button" onClick={onCustomMaterialAdd} variant="outline">
            Add
          </Button>
        </div>
      </div>
    </div>
  );
}
