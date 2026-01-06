import { CheckCircle, AlertCircle, Loader2, X, FileText } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

export type FileUploadStatus = 'pending' | 'uploading' | 'complete' | 'error';

export interface FileUploadItemData {
  file: File;
  status: FileUploadStatus;
  progress: number;
  error?: string;
}

interface FileUploadItemProps {
  data: FileUploadItemData;
  index: number;
  onRemove: (index: number) => void;
}

export function FileUploadItem({ data, index, onRemove }: FileUploadItemProps) {
  const { file, status, progress, error } = data;
  
  const getStatusIcon = () => {
    switch (status) {
      case 'pending':
        return <FileText className="h-4 w-4 text-muted-foreground" />;
      case 'uploading':
        return <Loader2 className="h-4 w-4 text-blue-500 animate-spin" />;
      case 'complete':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
    }
  };

  const getStatusText = () => {
    switch (status) {
      case 'pending':
        return 'Waiting...';
      case 'uploading':
        return `${progress}%`;
      case 'complete':
        return 'Complete';
      case 'error':
        return error || 'Failed';
    }
  };

  const canRemove = status === 'pending' || status === 'complete' || status === 'error';

  return (
    <div className="bg-muted p-3 rounded border space-y-2">
      {/* File info row */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 min-w-0 flex-1">
          {getStatusIcon()}
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <span className="text-sm truncate">{file.name}</span>
              <span className="text-xs text-muted-foreground whitespace-nowrap">
                {(file.size / 1024 / 1024).toFixed(2)} MB
              </span>
            </div>
          </div>
        </div>
        
        {/* Status and remove button */}
        <div className="flex items-center gap-2">
          <span className={`text-xs whitespace-nowrap ${
            status === 'error' ? 'text-red-500' : 
            status === 'complete' ? 'text-green-600' :
            status === 'uploading' ? 'text-blue-500' :
            'text-muted-foreground'
          }`}>
            {getStatusText()}
          </span>
          
          {canRemove && (
            <button
              type="button"
              onClick={() => onRemove(index)}
              className="text-red-500 hover:text-red-600 transition-colors"
              aria-label="Remove file"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      {/* Progress bar - only show during upload */}
      {status === 'uploading' && (
        <Progress value={progress} className="h-1.5" />
      )}
      
      {/* Error message */}
      {status === 'error' && error && (
        <p className="text-xs text-red-500 mt-1">{error}</p>
      )}
    </div>
  );
}
