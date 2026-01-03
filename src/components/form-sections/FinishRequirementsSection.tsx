import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { X } from 'lucide-react';

const FINISHES = [
  'As-Machined',
  'Anodize (Type II)',
  'Anodize (Type III - Hard)',
  'Bead Blast',
  'Powder Coat',
  'Chrome Plating',
  'Black Oxide',
  'Passivation',
  'Electropolish',
];

interface FinishRequirementsSectionProps {
  finishes: string[];
  customFinish: string;
  onFinishAdd: (finish: string) => void;
  onFinishRemove: (finish: string) => void;
  onCustomFinishChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onCustomFinishAdd: () => void;
}

export function FinishRequirementsSection({
  finishes,
  customFinish,
  onFinishAdd,
  onFinishRemove,
  onCustomFinishChange,
  onCustomFinishAdd,
}: FinishRequirementsSectionProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold border-b pb-2">Finish Requirements</h2>
      <div>
        <Label>Select Finish(es)</Label>
        <Select onValueChange={onFinishAdd}>
          <SelectTrigger>
            <SelectValue placeholder="Select finishes..." />
          </SelectTrigger>
          <SelectContent>
            {FINISHES.map((finish) => (
              <SelectItem key={finish} value={finish}>
                {finish}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {finishes.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {finishes.map((finish) => (
              <span
                key={finish}
                className="inline-flex items-center gap-1 bg-purple-600 text-white px-3 py-1 rounded-full text-sm"
              >
                {finish}
                <button
                  type="button"
                  onClick={() => onFinishRemove(finish)}
                  className="hover:bg-purple-700 rounded-full p-0.5"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))}
          </div>
        )}
      </div>
      <div>
        <Label htmlFor="customFinish">Add Custom Finish</Label>
        <div className="flex gap-2">
          <Input
            id="customFinish"
            name="customFinish"
            placeholder="e.g., Nickel Plating"
            value={customFinish}
            onChange={onCustomFinishChange}
          />
          <Button type="button" onClick={onCustomFinishAdd} variant="outline">
            Add
          </Button>
        </div>
      </div>
    </div>
  );
}
