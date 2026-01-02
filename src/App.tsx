import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Upload, X, CheckCircle, AlertCircle } from 'lucide-react';
import { submitQuoteRequest, generateQuoteNumber } from '@/services/database.service';
import type { QuoteRequestSubmission } from '@/types/database.types';

const MATERIALS = [
  '6061-T6 Aluminum',
  '7075 Aluminum',
  '304 Stainless Steel',
  '316 Stainless Steel',
  'Titanium',
  'PEEK',
  'Delrin',
  'ABS',
  'Polycarbonate',
  'Brass',
  'Copper',
];

const FINISHES = [
  'As-Machined',
  'Anodize (Type II)',
  'Anodize (Type III - Hard)',
  'Bead Blast',
  'Powder Coat',
  'Chrome Plating',
  'Black Oxide',
  'Passivation',
  'Electropolish',
];

const CERTIFICATIONS = [
  { id: 'itar', label: 'ITAR Compliant' },
  { id: 'iso', label: 'ISO 9001' },
  { id: 'as9100', label: 'AS9100' },
  { id: 'coc', label: 'Certificate of Conformance' },
  { id: 'material-cert', label: 'Material Certification' },
  { id: 'fai', label: 'First Article Inspection (FAI)' },
];

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

  const [dragActive, setDragActive] = useState(false);
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newFiles = Array.from(e.target.files || []);
    handleFiles(newFiles);
  };

  const handleFiles = (newFiles: File[]) => {
    const validExtensions = ['.step', '.stp', '.iges', '.igs', '.stl', '.pdf', '.dxf', '.dwg', '.zip'];
    const validFiles = newFiles.filter((file) => {
      const ext = file.name.toLowerCase().substring(file.name.lastIndexOf('.'));
      return validExtensions.includes(ext);
    });

    if (validFiles.length < newFiles.length) {
      alert('Some files were rejected. Please upload only CAD files (STEP, IGES, STL) or technical drawings (PDF, DXF).');
    }

    setForm((prev) => ({ ...prev, files: [...prev.files, ...validFiles] }));
  };

  const handleRemoveFile = (index: number) => {
    setForm((prev) => ({
      ...prev,
      files: prev.files.filter((_, i) => i !== index),
    }));
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = Array.from(e.dataTransfer.files);
    handleFiles(files);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus({ type: null, message: '' });

    try {
      // Prepare file metadata (only filenames and extensions)
      const fileMetadata = form.files.map((file) => ({
        filename: file.name,
        file_extension: file.name.substring(file.name.lastIndexOf('.')),
        file_size_bytes: file.size,
      }));

      // Prepare submission payload
      const submissionData: QuoteRequestSubmission = {
        companyName: form.companyName,
        contactName: form.contactName,
        email: form.email,
        phone: form.phone,
        projectName: form.projectName,
        description: form.description,
        materials: form.materials,
        finishes: form.finishes,
        quantity: form.quantity,
        leadTime: form.leadTime,
        partNotes: form.partNotes,
        certifications: form.certifications,
        files: fileMetadata,
      };

      // Submit to database
      const response = await submitQuoteRequest(submissionData);

      if (response.success) {
        setSubmitStatus({
          type: 'success',
          message: 'Quote request submitted successfully!',
          quoteNumber: response.data?.quote_number,
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
      } else {
        throw new Error(response.error || 'Failed to submit quote request');
      }
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
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center p-4">
      <Card className="w-full max-w-4xl shadow-xl">
        <CardContent className="p-6 space-y-6">
          <div className="text-center">
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
                  ? 'bg-green-900/30 border border-green-500'
                  : 'bg-red-900/30 border border-red-500'
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
                  <p className="text-sm text-gray-300 mt-1">
                    Quote Number: <span className="font-mono">{submitStatus.quoteNumber}</span>
                  </p>
                )}
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Company & Contact Information */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold border-b pb-2">Company & Contact Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="companyName">Company Name *</Label>
                  <Input
                    id="companyName"
                    name="companyName"
                    placeholder="Acme Manufacturing"
                    value={form.companyName}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="contactName">Contact Name *</Label>
                  <Input
                    id="contactName"
                    name="contactName"
                    placeholder="John Doe"
                    value={form.contactName}
                    onChange={handleChange}
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
                    value={form.email}
                    onChange={handleChange}
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
                    value={form.phone}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>

            {/* Project Information */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold border-b pb-2">Project Information</h2>
              <div>
                <Label htmlFor="projectName">Project Name *</Label>
                <Input
                  id="projectName"
                  name="projectName"
                  placeholder="Hydraulic Mount Bracket"
                  value={form.projectName}
                  onChange={handleChange}
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
                  value={form.description}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Materials */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold border-b pb-2">Material Requirements</h2>
              <div>
                <Label>Select Material(s) *</Label>
                <Select onValueChange={handleAddMaterial}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select materials..." />
                  </SelectTrigger>
                  <SelectContent>
                    {MATERIALS.map((material) => (
                      <SelectItem key={material} value={material}>
                        {material}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {form.materials.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {form.materials.map((material) => (
                      <span
                        key={material}
                        className="inline-flex items-center gap-1 bg-blue-600 text-white px-3 py-1 rounded-full text-sm"
                      >
                        {material}
                        <button
                          type="button"
                          onClick={() => handleRemoveMaterial(material)}
                          className="hover:bg-blue-700 rounded-full p-0.5"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
              <div>
                <Label htmlFor="customMaterial">Add Custom Material</Label>
                <div className="flex gap-2">
                  <Input
                    id="customMaterial"
                    name="customMaterial"
                    placeholder="e.g., Inconel 718"
                    value={form.customMaterial}
                    onChange={handleChange}
                  />
                  <Button type="button" onClick={handleAddCustomMaterial} variant="outline">
                    Add
                  </Button>
                </div>
              </div>
            </div>

            {/* Finishes */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold border-b pb-2">Finish Requirements</h2>
              <div>
                <Label>Select Finish(es)</Label>
                <Select onValueChange={handleAddFinish}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select finishes..." />
                  </SelectTrigger>
                  <SelectContent>
                    {FINISHES.map((finish) => (
                      <SelectItem key={finish} value={finish}>
                        {finish}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {form.finishes.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {form.finishes.map((finish) => (
                      <span
                        key={finish}
                        className="inline-flex items-center gap-1 bg-purple-600 text-white px-3 py-1 rounded-full text-sm"
                      >
                        {finish}
                        <button
                          type="button"
                          onClick={() => handleRemoveFinish(finish)}
                          className="hover:bg-purple-700 rounded-full p-0.5"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
              <div>
                <Label htmlFor="customFinish">Add Custom Finish</Label>
                <div className="flex gap-2">
                  <Input
                    id="customFinish"
                    name="customFinish"
                    placeholder="e.g., Nickel Plating"
                    value={form.customFinish}
                    onChange={handleChange}
                  />
                  <Button type="button" onClick={handleAddCustomFinish} variant="outline">
                    Add
                  </Button>
                </div>
              </div>
            </div>

            {/* Quantities & Lead Time */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold border-b pb-2">Quantity & Timeline</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="quantity">Quantity *</Label>
                  <Input
                    id="quantity"
                    name="quantity"
                    placeholder="e.g., 100, 500, 1000+"
                    value={form.quantity}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="leadTime">Required Lead Time</Label>
                  <Select onValueChange={(value) => setForm((prev) => ({ ...prev, leadTime: value }))}>
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

            {/* Part Notes */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold border-b pb-2">Part-Level Requirements</h2>
              <div>
                <Label htmlFor="partNotes">Special Requirements, Tolerances, or Notes</Label>
                <Textarea
                  id="partNotes"
                  name="partNotes"
                  placeholder="GD&T callouts, critical dimensions, tolerances, surface finish requirements, inspection criteria..."
                  rows={4}
                  value={form.partNotes}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Certifications */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold border-b pb-2">Certification Requirements</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {CERTIFICATIONS.map((cert) => (
                  <div key={cert.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={cert.id}
                      checked={form.certifications.includes(cert.id)}
                      onCheckedChange={() => handleCertificationToggle(cert.id)}
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

            {/* File Upload */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold border-b pb-2">Technical Files</h2>
              <div>
                <Label>Upload CAD Files & Technical Drawings</Label>
                <div
                  className={`mt-2 border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                    dragActive ? 'border-blue-500 bg-blue-50/10' : 'border-gray-600'
                  }`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                >
                  <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <p className="text-sm mb-2">
                    Drag and drop files here, or{' '}
                    <label className="text-blue-500 hover:text-blue-600 cursor-pointer">
                      browse
                      <input
                        type="file"
                        multiple
                        accept=".step,.stp,.iges,.igs,.stl,.pdf,.dxf,.dwg,.zip"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                    </label>
                  </p>
                  <p className="text-xs text-gray-400">
                    Supported: STEP, IGES, STL, PDF, DXF, DWG, ZIP
                  </p>
                </div>
                {form.files.length > 0 && (
                  <div className="mt-4 space-y-2">
                    {form.files.map((file, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between bg-gray-800 p-3 rounded"
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-sm">{file.name}</span>
                          <span className="text-xs text-gray-400">
                            ({(file.size / 1024 / 1024).toFixed(2)} MB)
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveFile(index)}
                          className="text-red-500 hover:text-red-600"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

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
