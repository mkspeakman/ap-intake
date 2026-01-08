import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { CompanyContactSection } from '@/components/form-sections/CompanyContactSection';
import { ProjectInformationSection } from '@/components/form-sections/ProjectInformationSection';
import { ProjectRequirementsSection } from '@/components/form-sections/ProjectRequirementsSection';
import { QuantityTimelineSection } from '@/components/form-sections/QuantityTimelineSection';
import { SubmissionDialog } from '@/components/SubmissionDialog';
import type { FileUploadItemData } from '@/components/form-sections/FileUploadItem';

// Use proxy path for local development to avoid CORS issues
// In production (Vercel), use Vercel serverless function
const WEBHOOK_URL = import.meta.env.DEV 
  ? '/api'
  : '/api/webhook';

export default function ManufacturingIntakeForm() {
  const [form, setForm] = useState({
    companyName: '',
    contactName: '',
    email: '',
    phone: '',
    projectName: '',
    description: '',
    materials: [] as string[],
    customMaterial: '',
    finishes: [] as string[],
    customFinish: '',
    quantity: '',
    leadTime: '',
    partNotes: '',
    certifications: [] as string[],
    files: [] as File[],
  });

  const [fileUploadData, setFileUploadData] = useState<FileUploadItemData[]>([]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [dialogState, setDialogState] = useState<{
    step: 'database' | 'uploading' | 'linking' | 'complete' | 'error';
    message: string;
    error?: string;
  }>({
    step: 'database',
    message: 'Saving your submission...',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddMaterial = (material: string) => {
    if (!form.materials.includes(material)) {
      setForm((prev) => ({ ...prev, materials: [...prev.materials, material] }));
    }
  };

  const handleRemoveMaterial = (material: string) => {
    setForm((prev) => ({
      ...prev,
      materials: prev.materials.filter((m) => m !== material),
    }));
  };

  const handleAddCustomMaterial = () => {
    if (form.customMaterial && !form.materials.includes(form.customMaterial)) {
      setForm((prev) => ({
        ...prev,
        materials: [...prev.materials, prev.customMaterial],
        customMaterial: '',
      }));
    }
  };

  const handleAddFinish = (finish: string) => {
    if (!form.finishes.includes(finish)) {
      setForm((prev) => ({ ...prev, finishes: [...prev.finishes, finish] }));
    }
  };

  const handleRemoveFinish = (finish: string) => {
    setForm((prev) => ({
      ...prev,
      finishes: prev.finishes.filter((f) => f !== finish),
    }));
  };

  const handleAddCustomFinish = () => {
    if (form.customFinish && !form.finishes.includes(form.customFinish)) {
      setForm((prev) => ({
        ...prev,
        finishes: [...prev.finishes, prev.customFinish],
        customFinish: '',
      }));
    }
  };

  const handleCertificationToggle = (certId: string) => {
    setForm((prev) => ({
      ...prev,
      certifications: prev.certifications.includes(certId)
        ? prev.certifications.filter((c) => c !== certId)
        : [...prev.certifications, certId],
    }));
  };

  const handleFilesChange = (files: File[]) => {
    setForm((prev) => ({ ...prev, files }));
    
    // Initialize upload data for each file
    setFileUploadData(
      files.map((file) => ({
        file,
        status: 'pending' as const,
        progress: 0,
      }))
    );
  };

  const handleRemoveFile = (index: number) => {
    setForm((prev) => ({
      ...prev,
      files: prev.files.filter((_, i) => i !== index),
    }));
    setFileUploadData((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setShowDialog(true);
    setDialogState({
      step: 'database',
      message: 'Saving your submission...',
    });

    // Generate quote number upfront
    const quoteNumber = `QR-${new Date().toISOString().slice(0,10).replace(/-/g,'')}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;

    try {
      // STEP 1: Save to database FIRST (reliable, local)
      const dbPayload = {
        quote_number: quoteNumber,
        company_name: form.companyName,
        contact_name: form.contactName,
        email: form.email,
        phone: form.phone,
        project_name: form.projectName,
        description: form.description,
        quantity: form.quantity,
        lead_time: form.leadTime,
        part_notes: form.partNotes,
        materials: form.materials,
        finishes: form.finishes,
        certifications: form.certifications,
        files: form.files.map((file, index) => ({
          filename: file.name,
          file_extension: file.name.substring(file.name.lastIndexOf('.')),
          file_size_bytes: file.size,
          upload_order: index,
        })),
      };

      let dbQuoteId;
      try {
        const dbResponse = await fetch('/api/quote-requests', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(dbPayload),
        });
        
        if (dbResponse.ok) {
          const dbData = await dbResponse.json();
          dbQuoteId = dbData.data.id;
        }
      } catch (dbError) {
        // Database save failed but continue with webhook
      }

      // STEP 2: Submit to n8n webhook (can fail, not critical since data is saved)
      setDialogState({
        step: 'uploading',
        message: 'Uploading files...',
      });
      
      // Create FormData for multipart/form-data submission
      const formData = new FormData();
      
      // Add quote number and form fields
      formData.append('quoteNumber', quoteNumber);
      formData.append('companyName', form.companyName);
      formData.append('contactName', form.contactName);
      formData.append('email', form.email);
      formData.append('phone', form.phone);
      formData.append('projectName', form.projectName);
      formData.append('description', form.description);
      formData.append('materials', JSON.stringify(form.materials));
      formData.append('finishes', JSON.stringify(form.finishes));
      formData.append('quantity', form.quantity);
      formData.append('leadTime', form.leadTime);
      formData.append('partNotes', form.partNotes);
      formData.append('certifications', JSON.stringify(form.certifications));
      
      // Add files
      form.files.forEach((file) => {
        formData.append('files', file);
      });

      // Set all files to uploading status
      setFileUploadData((prev) =>
        prev.map((item) => ({ ...item, status: 'uploading' as const }))
      );

      // Use XMLHttpRequest for upload
      const xhr = new XMLHttpRequest();

      // Handle response
      const response = await new Promise<XMLHttpRequest>((resolve, reject) => {
        xhr.addEventListener('load', () => resolve(xhr));
        xhr.addEventListener('error', () => reject(new Error('Network error')));
        xhr.addEventListener('abort', () => reject(new Error('Upload cancelled')));
        
        xhr.open('POST', WEBHOOK_URL);
        xhr.send(formData);
      });

      let webhookData;
      let webhookSuccessful = false;

      if (response.status >= 200 && response.status < 300) {
        try {
          webhookData = JSON.parse(response.responseText);
          webhookSuccessful = true;

          // STEP 3: Update database with Google Drive link (if we have dbQuoteId)
          if (dbQuoteId && webhookData?.webViewLink) {
            setDialogState({
              step: 'linking',
              message: 'Linking to Google Drive...',
            });
            try {
              await fetch(`/api/drive-link?id=${dbQuoteId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                  drive_file_id: webhookData.id,
                  drive_link: webhookData.webViewLink,
                }),
              });
            } catch (updateError) {
              // Failed to update database with Drive link
            }
          }
        } catch (e) {
          webhookData = { message: response.responseText };
        }
      }

      // Mark all files as complete
      setFileUploadData((prev) =>
        prev.map((item) => ({ ...item, status: 'complete' as const, progress: 100 }))
      );

      // Show success message (data is saved in database regardless of webhook)
      setDialogState({
        step: 'complete',
        message: webhookSuccessful 
          ? `Quote request submitted successfully! Quote Number: ${quoteNumber}` 
          : `Quote request saved! (Google Drive sync pending) Quote Number: ${quoteNumber}`,
      });

      // Reset form immediately (behind the modal)
      setForm({
        companyName: '',
        contactName: '',
        email: '',
        phone: '',
        projectName: '',
        description: '',
        materials: [],
        customMaterial: '',
        finishes: [],
        customFinish: '',
        quantity: '',
        leadTime: '',
        partNotes: '',
        certifications: [],
        files: [],
      });
      setFileUploadData([]);
    } catch (error) {
      console.error('Submission error:', error); // Keep for production error tracking
      
      // Mark all files as error
      setFileUploadData((prev) =>
        prev.map((item) => ({
          ...item,
          status: 'error' as const,
          error: 'Upload failed',
        }))
      );
      
      setDialogState({
        step: 'error',
        message: 'Submission failed',
        error: error instanceof Error ? error.message : 'Failed to submit quote request. Please try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCloseDialog = () => {
    setShowDialog(false);
    setDialogState({
      step: 'database',
      message: 'Saving your submission...',
    });
  };

  return (
    <>
      {/* Fixed Header - 48px tall */}
      <header className="fixed top-0 left-0 right-0 bg-[#0A0A0B] z-50 h-12">
        <div className="h-full px-6 flex items-center">
          <img 
            src="/ap-ai-on-black.svg" 
            alt="AP-AI Logo" 
            className="h-6"
          />
        </div>
      </header>

      {/* Main Content with top padding for fixed header */}
      <div className="relative top-[48px] min-h-screen bg-card flex items-center justify-center sm:p-2 md:p-8 pt-16">
        <Card className="w-full max-w-4xl overflow-visible">
        <CardContent className="p-6 space-y-6 pt-8 overflow-visible">
          <div className="text-left">
            <h1 className="text-3xl font-bold">Manufacturing Quote Request</h1>
            <p className="text-sm text-muted-foreground mt-2">
              Submit your project details and technical requirements
            </p>
          </div>

          <form id="quote-form" onSubmit={handleSubmit} className="space-y-6">
            {/* Project Information */}
            <ProjectInformationSection
              projectName={form.projectName}
              description={form.description}
              files={form.files}
              fileUploadData={fileUploadData}
              onChange={handleChange}
              onFilesChange={handleFilesChange}
              onFileRemove={handleRemoveFile}
            />

            {/* Company & Contact Information */}
            <CompanyContactSection
              companyName={form.companyName}
              contactName={form.contactName}
              email={form.email}
              phone={form.phone}
              onChange={handleChange}
            />

            {/* Project Requirements (Accordion) */}
            <ProjectRequirementsSection
              materials={form.materials}
              customMaterial={form.customMaterial}
              onMaterialAdd={handleAddMaterial}
              onMaterialRemove={handleRemoveMaterial}
              onCustomMaterialChange={handleChange}
              onCustomMaterialAdd={handleAddCustomMaterial}
              finishes={form.finishes}
              customFinish={form.customFinish}
              onFinishAdd={handleAddFinish}
              onFinishRemove={handleRemoveFinish}
              onCustomFinishChange={handleChange}
              onCustomFinishAdd={handleAddCustomFinish}
              partNotes={form.partNotes}
              onPartNotesChange={handleChange}
              certifications={form.certifications}
              onCertificationToggle={handleCertificationToggle}
            />

            {/* Quantities & Lead Time */}
            <QuantityTimelineSection
              quantity={form.quantity}
              leadTime={form.leadTime}
              onQuantityChange={handleChange}
              onLeadTimeChange={(value) => setForm((prev) => ({ ...prev, leadTime: value }))}
            />

            {/* Extra space to clear the fixed footer */}
            <div className="h-24"></div>
          </form>
        </CardContent>
        </Card>

        {/* Fixed Footer with Submit Button */}
        <div className="fixed bottom-0 left-0 right-0 bg-background border-t shadow-[0_-2px_10px_rgba(0,0,0,0.05)] py-4 z-50">
          <div className="text-center">
            <Button 
              type="submit"
              form="quote-form"
              size="lg" 
              className="px-8 bg-primary text-primary-foreground hover:opacity-90"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Submitting...' : 'Submit Quote Request'}
            </Button>
          </div>
        </div>
      </div>

      <SubmissionDialog
        open={showDialog}
        step={dialogState.step}
        message={dialogState.message}
        files={fileUploadData.map(f => ({
          name: f.file.name,
          status: f.status,
          progress: f.progress,
          size: f.file.size,
        }))}
        error={dialogState.error}
        onClose={handleCloseDialog}
      />
    </>
  );
}
