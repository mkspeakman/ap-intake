import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface CompanyContactSectionProps {
  companyName: string;
  contactName: string;
  email: string;
  phone: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function CompanyContactSection({
  companyName,
  contactName,
  email,
  phone,
  onChange,
}: CompanyContactSectionProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold border-b pb-2">Company & Contact Information</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="companyName">Company Name *</Label>
          <Input
            id="companyName"
            name="companyName"
            placeholder="Acme Manufacturing"
            value={companyName}
            onChange={onChange}
            required
          />
        </div>
        <div>
          <Label htmlFor="contactName">Contact Name *</Label>
          <Input
            id="contactName"
            name="contactName"
            placeholder="John Doe"
            value={contactName}
            onChange={onChange}
            required
          />
        </div>
        <div>
          <Label htmlFor="email">Email *</Label>
          <Input
            id="email"
            name="email"
            placeholder="john@acme.com"
            type="email"
            value={email}
            onChange={onChange}
            required
          />
        </div>
        <div>
          <Label htmlFor="phone">Phone Number</Label>
          <Input
            id="phone"
            name="phone"
            placeholder="(555) 123-4567"
            type="tel"
            value={phone}
            onChange={onChange}
          />
        </div>
      </div>
    </div>
  );
}
