import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

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
  const [isExpanded, setIsExpanded] = useState(false);

  const handleClear = () => {
    // Create synthetic events to clear all fields
    const fields = ['companyName', 'contactName', 'email', 'phone'];
    fields.forEach(field => {
      const event = {
        target: { name: field, value: '' }
      } as React.ChangeEvent<HTMLInputElement>;
      onChange(event);
    });
    // Collapse the section after clearing
    setIsExpanded(false);
  };

  return (
    <div className={`border-y rounded-lg py-4 px-1 transition-colors ${
      !isExpanded ? 'hover:bg-accent' : ''
    }`}>
      <div 
        className={`flex items-start justify-between ${
          !isExpanded ? 'cursor-pointer' : ''
        }`}
        onClick={() => !isExpanded && setIsExpanded(true)}
      >
        <div>
          <h2 className="text-xl font-medium">Client Information</h2>
          <p className="text-sm text-muted-foreground mt-1">
            {isExpanded 
              ? 'Clear section for "None Specified"' 
              : 'Leave blank if "None Specified"'}
          </p>
        </div>
        <div onClick={(e) => e.stopPropagation()}>
          {isExpanded ? (
            <Button
              type="button"
              variant="ghost"
              onClick={handleClear}
              className="text-sm"
            >
              Clear
            </Button>
          ) : (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => setIsExpanded(true)}
              className="rounded-full"
            >
              <Plus className="h-5 w-5" />
            </Button>
          )}
        </div>
      </div>

      <div 
        className={`grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t mt-4 transition-all ${
          isExpanded ? 'animate-accordion-down' : 'animate-accordion-up'
        }`}
        style={{
          height: isExpanded ? 'auto' : '0',
          marginTop: isExpanded ? '1rem' : '0',
          paddingTop: isExpanded ? '1rem' : '0',
          borderTopWidth: isExpanded ? '1px' : '0',
          overflow: isExpanded ? 'visible' : 'hidden',
        }}
      >
        <div>
          <Label htmlFor="companyName" className="text-sm font-medium">
            Company Name
          </Label>
          <Input
            id="companyName"
            name="companyName"
            placeholder="ABC Corp, Inc."
            value={companyName}
            onChange={onChange}
            className="mt-1.5"
          />
        </div>
        <div>
          <Label htmlFor="contactName" className="text-sm font-medium">
            Contact Name
          </Label>
          <Input
            id="contactName"
            name="contactName"
            placeholder="First and Last Name"
            value={contactName}
            onChange={onChange}
            className="mt-1.5"
          />
        </div>
        <div>
          <Label htmlFor="email" className="text-sm font-medium">
            Email Address
          </Label>
          <Input
            id="email"
            name="email"
            placeholder="address@domain.com"
            type="email"
            value={email}
            onChange={onChange}
            className="mt-1.5"
          />
        </div>
        <div>
          <Label htmlFor="phone" className="text-sm font-medium">
            Phone Number
          </Label>
          <Input
            id="phone"
            name="phone"
            placeholder="(___)___-____"
            type="tel"
            value={phone}
            onChange={onChange}
            className="mt-1.5"
          />
        </div>
      </div>
    </div>
  );
}
