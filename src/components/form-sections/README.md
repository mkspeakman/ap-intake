# Form Sections Components

This directory contains modular, reusable form section components for the manufacturing quote request form. Each component is self-contained and can be easily installed, modified, or reused in other projects.

## Components

### CompanyContactSection
**File:** `CompanyContactSection.tsx`

Handles company and contact information input fields.

**Props:**
- `companyName: string` - Company name value
- `contactName: string` - Contact name value
- `email: string` - Email value
- `phone: string` - Phone number value
- `onChange: (e: React.ChangeEvent<HTMLInputElement>) => void` - Change handler

---

### ProjectInformationSection
**File:** `ProjectInformationSection.tsx`

Handles project name and description fields.

**Props:**
- `projectName: string` - Project name value
- `description: string` - Project description value
- `onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void` - Change handler

---

### MaterialRequirementsSection
**File:** `MaterialRequirementsSection.tsx`

Handles material selection with predefined options and custom material input.

**Props:**
- `materials: string[]` - Array of selected materials
- `customMaterial: string` - Custom material input value
- `onMaterialAdd: (material: string) => void` - Add material handler
- `onMaterialRemove: (material: string) => void` - Remove material handler
- `onCustomMaterialChange: (e: React.ChangeEvent<HTMLInputElement>) => void` - Custom material input change handler
- `onCustomMaterialAdd: () => void` - Add custom material handler

**Included Constants:**
- Predefined list of common materials (Aluminum, Stainless Steel, Titanium, PEEK, etc.)

---

### FinishRequirementsSection
**File:** `FinishRequirementsSection.tsx`

Handles finish selection with predefined options and custom finish input.

**Props:**
- `finishes: string[]` - Array of selected finishes
- `customFinish: string` - Custom finish input value
- `onFinishAdd: (finish: string) => void` - Add finish handler
- `onFinishRemove: (finish: string) => void` - Remove finish handler
- `onCustomFinishChange: (e: React.ChangeEvent<HTMLInputElement>) => void` - Custom finish input change handler
- `onCustomFinishAdd: () => void` - Add custom finish handler

**Included Constants:**
- Predefined list of common finishes (Anodize, Powder Coat, Plating, etc.)

---

### QuantityTimelineSection
**File:** `QuantityTimelineSection.tsx`

Handles quantity input and lead time selection.

**Props:**
- `quantity: string` - Quantity value
- `leadTime: string` - Selected lead time value
- `onQuantityChange: (e: React.ChangeEvent<HTMLInputElement>) => void` - Quantity change handler
- `onLeadTimeChange: (value: string) => void` - Lead time selection handler

**Lead Time Options:**
- Rush (1-2 weeks)
- Standard (3-4 weeks)
- Extended (5-8 weeks)
- Flexible

---

### PartRequirementsSection
**File:** `PartRequirementsSection.tsx`

Handles special requirements, tolerances, and notes textarea.

**Props:**
- `partNotes: string` - Part notes value
- `onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void` - Change handler

---

### CertificationSection
**File:** `CertificationSection.tsx`

Handles certification requirements with checkboxes.

**Props:**
- `certifications: string[]` - Array of selected certification IDs
- `onCertificationToggle: (certId: string) => void` - Certification toggle handler

**Included Constants:**
- Predefined list of certifications (ITAR, ISO 9001, AS9100, COC, Material Cert, FAI)

---

### FileUploadSection
**File:** `FileUploadSection.tsx`

Handles file upload with drag-and-drop functionality and file validation.

**Props:**
- `files: File[]` - Array of uploaded files
- `onFilesChange: (files: File[]) => void` - Files change handler
- `onFileRemove: (index: number) => void` - File removal handler

**Features:**
- Drag-and-drop file upload
- File type validation (STEP, IGES, STL, PDF, DXF, DWG, ZIP)
- File size display
- Visual feedback for drag state

---

## Usage

Import all components from the index file:

```tsx
import {
  CompanyContactSection,
  ProjectInformationSection,
  MaterialRequirementsSection,
  FinishRequirementsSection,
  QuantityTimelineSection,
  PartRequirementsSection,
  CertificationSection,
  FileUploadSection,
} from '@/components/form-sections';
```

Or import individual components:

```tsx
import { CompanyContactSection } from '@/components/form-sections/CompanyContactSection';
```

## Benefits

✅ **Modular** - Each section is independent and self-contained  
✅ **Reusable** - Can be used in other projects or forms  
✅ **Maintainable** - Easy to update or modify individual sections  
✅ **Type-safe** - Full TypeScript support with proper interfaces  
✅ **Composable** - Mix and match sections as needed  
✅ **Clean** - Reduced code complexity in the main form component

## Dependencies

All components use shared UI components from `@/components/ui`:
- Button
- Card
- Checkbox
- Input
- Label
- Select
- Textarea

Icons from `lucide-react`:
- Upload
- X
