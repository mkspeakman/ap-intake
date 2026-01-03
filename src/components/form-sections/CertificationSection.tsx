import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

const CERTIFICATIONS = [
  { id: 'itar', label: 'ITAR Compliant' },
  { id: 'iso', label: 'ISO 9001' },
  { id: 'as9100', label: 'AS9100' },
  { id: 'coc', label: 'Certificate of Conformance' },
  { id: 'material-cert', label: 'Material Certification' },
  { id: 'fai', label: 'First Article Inspection (FAI)' },
];

interface CertificationSectionProps {
  certifications: string[];
  onCertificationToggle: (certId: string) => void;
}

export function CertificationSection({
  certifications,
  onCertificationToggle,
}: CertificationSectionProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold border-b pb-2">Certification Requirements</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {CERTIFICATIONS.map((cert) => (
          <div key={cert.id} className="flex items-center space-x-2">
            <Checkbox
              id={cert.id}
              checked={certifications.includes(cert.id)}
              onCheckedChange={() => onCertificationToggle(cert.id)}
            />
            <Label
              htmlFor={cert.id}
              className="text-sm font-normal cursor-pointer"
            >
              {cert.label}
            </Label>
          </div>
        ))}
      </div>
    </div>
  );
}
