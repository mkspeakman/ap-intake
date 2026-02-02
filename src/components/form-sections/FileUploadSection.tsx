import { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Upload, X } from 'lucide-react';

interface FileUploadSectionProps {
  files: File[];
  onFilesChange: (files: File[]) => void;
  onFileRemove: (index: number) => void;
}

export function FileUploadSection({
  files,
  onFilesChange,
  onFileRemove,
}: FileUploadSectionProps) {
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
    <div className="space-y-4">
      <h2 className="text-lg font-medium border-b pb-2">Technical Files</h2>
      <div>
        <Label>Upload CAD Files & Technical Drawings</Label>
        <div
          className={`mt-2 border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
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
          <div className="mt-4 space-y-2">
            {files.map((file, index) => (
              <div
                key={index}
                className="flex items-center justify-between bg-muted p-3 rounded border border-border"
              >
                <div className="flex items-center gap-2">
                  <span className="text-sm text-foreground">{file.name}</span>
                  <span className="text-xs text-muted-foreground">
                    ({(file.size / 1024 / 1024).toFixed(2)} MB)
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => onFileRemove(index)}
                  className="text-destructive hover:opacity-80 transition-opacity"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
