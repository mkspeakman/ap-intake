import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

interface ProjectInformationSectionProps {
  projectName: string;
  description: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

export function ProjectInformationSection({
  projectName,
  description,
  onChange,
}: ProjectInformationSectionProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold border-b pb-2">Project Information</h2>
      <div>
        <Label htmlFor="projectName">Project Name *</Label>
        <Input
          id="projectName"
          name="projectName"
          placeholder="Hydraulic Mount Bracket"
          value={projectName}
          onChange={onChange}
          required
        />
      </div>
      <div>
        <Label htmlFor="description">Project Description</Label>
        <Textarea
          id="description"
          name="description"
          placeholder="General overview, application, critical requirements..."
          rows={3}
          value={description}
          onChange={onChange}
        />
      </div>
    </div>
  );
}
