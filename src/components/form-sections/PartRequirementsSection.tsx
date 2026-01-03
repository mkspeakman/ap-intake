import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

interface PartRequirementsSectionProps {
  partNotes: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

export function PartRequirementsSection({
  partNotes,
  onChange,
}: PartRequirementsSectionProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold border-b pb-2">Part-Level Requirements</h2>
      <div>
        <Label htmlFor="partNotes">Special Requirements, Tolerances, or Notes</Label>
        <Textarea
          id="partNotes"
          name="partNotes"
          placeholder="GD&T callouts, critical dimensions, tolerances, surface finish requirements, inspection criteria..."
          rows={4}
          value={partNotes}
          onChange={onChange}
        />
      </div>
    </div>
  );
}
