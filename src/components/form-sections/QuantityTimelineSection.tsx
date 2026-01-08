import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface QuantityTimelineSectionProps {
  quantity: string;
  leadTime: string;
  onQuantityChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onLeadTimeChange: (value: string) => void;
}

export function QuantityTimelineSection({
  quantity,
  leadTime,
  onQuantityChange,
  onLeadTimeChange,
}: QuantityTimelineSectionProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold border-b pb-2 hidden">Quantity & Timeline</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="quantity">Quantity <small className="text-destructive">required</small></Label>
          <Input
            id="quantity"
            name="quantity"
            placeholder="e.g., 100, 500, 1000+"
            value={quantity}
            onChange={onQuantityChange}
            required
          />
        </div>
        <div>
          <Label htmlFor="leadTime">Required Lead Time</Label>
          <Select value={leadTime} onValueChange={onLeadTimeChange}>
            <SelectTrigger>
              <SelectValue placeholder="Select lead time..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="rush">Rush (1-2 weeks)</SelectItem>
              <SelectItem value="standard">Standard (3-4 weeks)</SelectItem>
              <SelectItem value="extended">Extended (5-8 weeks)</SelectItem>
              <SelectItem value="flexible">Flexible</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}
