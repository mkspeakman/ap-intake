import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle, AlertCircle } from 'lucide-react';
import { CompanyContactSection } from '@/components/form-sections/CompanyContactSection';
import { ProjectInformationSection } from '@/components/form-sections/ProjectInformationSection';
import { ProjectRequirementsSection } from '@/components/form-sections/ProjectRequirementsSection';
import { QuantityTimelineSection } from '@/components/form-sections/QuantityTimelineSection';

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

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{
    type: 'success' | 'error' | null;
    message: string;
    quoteNumber?: string;
  }>({ type: null, message: '' });

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
  };

  const handleRemoveFile = (index: number) => {
    setForm((prev) => ({
      ...prev,
      files: prev.files.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus({ type: null, message: '' });

    try {
      // Create FormData for multipart/form-data submission
      const formData = new FormData();
      
      // Add form fields
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
      form.files.forEach((file, index) => {
        console.log(`Adding file ${index}:`, file.name, file.type, file.size, 'bytes');
        formData.append('files', file);
      });

      // Log what we're sending (FormData can't be directly logged)
      console.log('Form data summary:');
      console.log('- Files:', form.files.length);
      console.log('- Company:', form.companyName);
      console.log('- Project:', form.projectName);

      console.log('Submitting to webhook:', WEBHOOK_URL);

      // Submit to webhook
      const response = await fetch(WEBHOOK_URL, {
        method: 'POST',
        body: formData,
      });

      console.log('Response status:', response.status);
      console.log('Response headers:', Object.fromEntries(response.headers.entries()));

      // Try to get response text for debugging
      const responseText = await response.text();
      console.log('Response text:', responseText);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}, message: ${responseText}`);
      }

      // Parse the response
      let data;
      try {
        data = JSON.parse(responseText);
      } catch (e) {
        data = { message: responseText };
      }
      console.log('Response data:', data);

      setSubmitStatus({
        type: 'success',
        message: 'Quote request submitted successfully!',
        quoteNumber: data.quoteNumber || data.quote_number,
      });

      // Reset form
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

      // Scroll to top to show success message
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) {
      console.error('Submission error:', error);
      setSubmitStatus({
        type: 'error',
        message: error instanceof Error ? error.message : 'Failed to submit quote request. Please try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-4xl">
        <CardContent className="p-6 space-y-6">
          <div className="text-left">
            <h1 className="text-3xl font-bold">Manufacturing Quote Request</h1>
            <p className="text-sm text-muted-foreground mt-2">
              Submit your project details and technical requirements
            </p>
          </div>

          {/* Success/Error Message */}
          {submitStatus.type && (
            <div
              className={`p-4 rounded-lg flex items-center gap-3 ${
                submitStatus.type === 'success'
                  ? 'bg-green-100 border border-green-500 text-green-900 dark:bg-green-900/30 dark:text-green-100'
                  : 'bg-red-100 border border-red-500 text-red-900 dark:bg-red-900/30 dark:text-red-100'
              }`}
            >
              {submitStatus.type === 'success' ? (
                <CheckCircle className="h-5 w-5 text-green-500" />
              ) : (
                <AlertCircle className="h-5 w-5 text-red-500" />
              )}
              <div>
                <p className="font-semibold">{submitStatus.message}</p>
                {submitStatus.quoteNumber && (
                  <p className="text-sm text-muted-foreground mt-1">
                    Quote Number: <span className="font-mono">{submitStatus.quoteNumber}</span>
                  </p>
                )}
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Project Information */}
            <ProjectInformationSection
              projectName={form.projectName}
              description={form.description}
              files={form.files}
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

            {/* Submit */}
            <div className="text-center pt-4">
              <Button 
                type="submit" 
                size="lg" 
                className="px-8 bg-blue-600 hover:bg-blue-700"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Submitting...' : 'Submit Quote Request'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
