import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Upload } from 'lucide-react';
import { FileUploadItem, type FileUploadItemData } from './FileUploadItem';

interface ProjectInformationSectionProps {
  projectName: string;
  description: string;
  files: File[];
  fileUploadData?: FileUploadItemData[];
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onFilesChange: (files: File[]) => void;
  onFileRemove: (index: number) => void;
}

export function ProjectInformationSection({
  projectName,
  description,
  files,
  fileUploadData,
  onChange,
  onFilesChange,
  onFileRemove,
}: ProjectInformationSectionProps) {
  const [generateSummary, setGenerateSummary] = useState(true);
  const [dragActive, setDragActive] = useState(false);

  const handleFiles = (newFiles: File[]) => {
    const validExtensions = ['.step', '.stp', '.iges', '.igs', '.stl', '.pdf', '.dxf', '.dwg', '.zip'];
    const validFiles = newFiles.filter((file) => {
      const ext = file.name.toLowerCase().substring(file.name.lastIndexOf('.'));
      return validExtensions.includes(ext);
    });

    if (validFiles.length < newFiles.length) {
      alert('Some files were rejected. Please upload only CAD files (STEP, IGES, STL) or technical drawings (PDF, DXF).');
    }

    if (validFiles.length > 0) {
      onFilesChange([...files, ...validFiles]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newFiles = Array.from(e.target.files || []);
    handleFiles(newFiles);
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

    const droppedFiles = Array.from(e.dataTransfer.files);
    handleFiles(droppedFiles);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-6">
      {/* Left Column - Project Details */}
      <div className="space-y-4">
        <div>
          <Label htmlFor="projectName" className="text-base font-medium">
            Project Name <span className="text-red-500 text-sm">required</span>
          </Label>
          <Input
            id="projectName"
            name="projectName"
            placeholder="Hydraulic mounting bracket"
            value={projectName}
            onChange={onChange}
            required
            autoComplete="off"
            className="mt-2"
          />
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="generateSummary"
            checked={generateSummary}
            onCheckedChange={(checked) => {
              const newChecked = checked as boolean;
              setGenerateSummary(newChecked);
              
              // Clear description when toggling AI summary on
              if (newChecked && description) {
                const event = {
                  target: { name: 'description', value: '' }
                } as React.ChangeEvent<HTMLTextAreaElement>;
                onChange(event);
              }
            }}
          />
          <Label
            htmlFor="generateSummary"
            className="text-sm font-normal cursor-pointer"
          >
            Generate summary with Ai
          </Label>
        </div>

        <div>
          <Label htmlFor="description" className="text-sm font-medium">
            Description
          </Label>
          <Textarea
            id="description"
            name="description"
            placeholder={generateSummary ? "AI will generate summary from files" : "Provide a description, summary, and remarks"}
            rows={5}
            value={description}
            onChange={onChange}
            disabled={generateSummary}
            autoComplete="off"
            className="resize-none disabled:opacity-50 disabled:cursor-not-allowed mt-1.5"
          />
        </div>
      </div>

      {/* Right Column - File Upload */}
      <div className="space-y-4">
        <h3 className="text-base font-medium">Drawings and Files</h3>
        
        <div
          className={`border-2 border-dashed rounded-lg px-8 py-0 text-center transition-colors min-h-[204px] flex flex-col items-center justify-center ${
            dragActive 
              ? 'border-primary bg-primary/5' 
              : 'border-input bg-background hover:bg-accent'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <p className="text-sm text-foreground mb-2">
            Drag and drop files here, or{' '}
            <label className="text-primary hover:opacity-80 cursor-pointer underline">
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
          <p className="text-xs text-muted-foreground">
            Supported: STEP, IGES, STL, PDF, DXF, DWG, ZIP
          </p>
        </div>

        {files.length > 0 && (
          <div className="space-y-2">
            {fileUploadData ? (
              // Enhanced view with upload progress tracking
              fileUploadData.map((uploadData, index) => (
                <FileUploadItem
                  key={index}
                  data={uploadData}
                  index={index}
                  onRemove={onFileRemove}
                />
              ))
            ) : (
              // Fallback to simple file list (backward compatible)
              files.map((file, index) => (
                <FileUploadItem
                  key={index}
                  data={{
                    file,
                    status: 'pending',
                    progress: 0,
                  }}
                  index={index}
                  onRemove={onFileRemove}
                />
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
