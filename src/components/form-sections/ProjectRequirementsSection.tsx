import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { MaterialRequirementsSection } from './MaterialRequirementsSection';
import { FinishRequirementsSection } from './FinishRequirementsSection';
import { PartRequirementsSection } from './PartRequirementsSection';
import { CertificationSection } from './CertificationSection';

interface ProjectRequirementsSectionProps {
  // Material props
  materials: string[];
  customMaterial: string;
  onMaterialAdd: (material: string) => void;
  onMaterialRemove: (material: string) => void;
  onCustomMaterialChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onCustomMaterialAdd: () => void;
  
  // Finish props
  finishes: string[];
  customFinish: string;
  onFinishAdd: (finish: string) => void;
  onFinishRemove: (finish: string) => void;
  onCustomFinishChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onCustomFinishAdd: () => void;
  
  // Part notes props
  partNotes: string;
  onPartNotesChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  
  // Certification props
  certifications: string[];
  onCertificationToggle: (certId: string) => void;
}

export function ProjectRequirementsSection({
  materials,
  customMaterial,
  onMaterialAdd,
  onMaterialRemove,
  onCustomMaterialChange,
  onCustomMaterialAdd,
  finishes,
  customFinish,
  onFinishAdd,
  onFinishRemove,
  onCustomFinishChange,
  onCustomFinishAdd,
  partNotes,
  onPartNotesChange,
  certifications,
  onCertificationToggle,
}: ProjectRequirementsSectionProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold hidden">Project Requirements</h2>
      
      <Accordion type="multiple" className="w-full">
        <AccordionItem value="materials">
          <AccordionTrigger className="text-lg font-semibold">
            Material Requirements
          </AccordionTrigger>
          <AccordionContent>
            <MaterialRequirementsSection
              materials={materials}
              customMaterial={customMaterial}
              onMaterialAdd={onMaterialAdd}
              onMaterialRemove={onMaterialRemove}
              onCustomMaterialChange={onCustomMaterialChange}
              onCustomMaterialAdd={onCustomMaterialAdd}
            />
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="finishes">
          <AccordionTrigger className="text-lg font-semibold">
            Finish Requirements
          </AccordionTrigger>
          <AccordionContent>
            <FinishRequirementsSection
              finishes={finishes}
              customFinish={customFinish}
              onFinishAdd={onFinishAdd}
              onFinishRemove={onFinishRemove}
              onCustomFinishChange={onCustomFinishChange}
              onCustomFinishAdd={onCustomFinishAdd}
            />
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="part-requirements">
          <AccordionTrigger className="text-lg font-semibold">
            Part-Level Requirements
          </AccordionTrigger>
          <AccordionContent>
            <PartRequirementsSection
              partNotes={partNotes}
              onChange={onPartNotesChange}
            />
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="certifications">
          <AccordionTrigger className="text-lg font-semibold">
            Certification Requirements
          </AccordionTrigger>
          <AccordionContent>
            <CertificationSection
              certifications={certifications}
              onCertificationToggle={onCertificationToggle}
            />
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
