import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from './ui/dialog';
import { Button } from './ui/button';
import { CheckCircle, AlertCircle, Loader2, Database, Cloud, FileText } from 'lucide-react';
import type { FileUploadStatus } from './form-sections/FileUploadItem';

interface SubmissionDialogProps {
  open: boolean;
  step: 'database' | 'uploading' | 'linking' | 'complete' | 'error';
  message: string;
  files: Array<{
    name: string;
    status: FileUploadStatus;
    progress?: number;
    size?: number;
  }>;
  error?: string;
  onClose: () => void;
}

export function SubmissionDialog({
  open,
  step,
  message,
  files,
  error,
  onClose,
}: SubmissionDialogProps) {
  const isComplete = step === 'complete' || step === 'error';

  // Estimate upload time based on file sizes
  const estimateUploadTime = () => {
    if (!files.length) return '';
    
    const totalBytes = files.reduce((sum, f) => sum + (f.size || 0), 0);
    const totalMB = totalBytes / (1024 * 1024);
    
    // Rough estimates: ~2-3 seconds per MB for n8n processing + Google Drive upload
    // Plus base overhead of ~3 seconds for n8n workflow
    const estimatedSeconds = Math.max(5, Math.round(3 + (totalMB * 2.5)));
    
    if (estimatedSeconds < 10) return 'a few seconds';
    if (estimatedSeconds < 30) return `~${estimatedSeconds} seconds`;
    if (estimatedSeconds < 90) return `~${Math.round(estimatedSeconds / 10) * 10} seconds`;
    return `~${Math.ceil(estimatedSeconds / 60)} minute${estimatedSeconds >= 120 ? 's' : ''}`;
  };

  return (
    <Dialog open={open} onOpenChange={isComplete ? onClose : undefined}>
      <DialogContent 
        hideClose 
        className="sm:max-w-[500px]"
        onInteractOutside={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {step === 'complete' && (
              <>
                <CheckCircle className="h-5 w-5 text-green-600" />
                Submission Complete
              </>
            )}
            {step === 'error' && (
              <>
                <AlertCircle className="h-5 w-5 text-red-600" />
                Submission Error
              </>
            )}
            {!isComplete && (
              <>
                Submitting Project...
              </>
            )}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Progress Steps */}
          <div className="space-y-3">
            {/* Database Step */}
            <div className="flex items-start gap-3">
              <div className="mt-0.5">
                {step === 'database' && <Loader2 className="h-5 w-5 animate-spin text-primary" />}
                {(step === 'uploading' || step === 'linking' || step === 'complete') && (
                  <CheckCircle className="h-5 w-5 text-green-600" />
                )}
                {step === 'error' && <AlertCircle className="h-5 w-5 text-red-600" />}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <Database className="h-4 w-4 text-muted-foreground" />
                  <p className="text-sm font-medium">Recording to database</p>
                </div>
                {step === 'database' && (
                  <p className="text-xs text-muted-foreground mt-1">{message}</p>
                )}
              </div>
            </div>

            {/* Upload Step */}
            {(step === 'uploading' || step === 'linking' || step === 'complete' || step === 'error') && (
              <div className="flex items-start gap-3">
                <div className="mt-0.5">
                  {step === 'uploading' && <Loader2 className="h-5 w-5 animate-spin text-primary" />}
                  {(step === 'linking' || step === 'complete') && (
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  )}
                  {step === 'error' && <AlertCircle className="h-5 w-5 text-muted-foreground" />}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <Cloud className="h-4 w-4 text-muted-foreground" />
                    <p className="text-sm font-medium">Uploading to Google Drive</p>
                  </div>
                  {step === 'uploading' && (
                    <>
                      <p className="text-xs text-muted-foreground mt-1">{message}</p>
                      {files.length > 0 && (
                        <p className="text-xs text-muted-foreground/70 mt-1 italic">
                          Estimated time: {estimateUploadTime()}
                        </p>
                      )}
                    </>
                  )}
                </div>
              </div>
            )}

            {/* File Upload Progress */}
            {step === 'uploading' && files.length > 0 && (
              <div className="pl-8 space-y-2 mt-2">
                {files.map((file, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                    <div className="flex-shrink-0">
                      {file.status === 'uploading' && <Loader2 className="h-4 w-4 text-blue-500 animate-spin" />}
                      {file.status === 'complete' && <CheckCircle className="h-4 w-4 text-green-500" />}
                      {file.status === 'error' && <AlertCircle className="h-4 w-4 text-red-500" />}
                      {file.status === 'pending' && <FileText className="h-4 w-4 text-muted-foreground" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{file.name}</p>
                    </div>
                    <div className="flex-shrink-0 text-xs text-muted-foreground">
                      {file.status === 'uploading' && 'Uploading...'}
                      {file.status === 'complete' && 'Complete'}
                      {file.status === 'error' && 'Failed'}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Linking Step */}
            {(step === 'linking' || step === 'complete') && (
              <div className="flex items-start gap-3">
                <div className="mt-0.5">
                  {step === 'linking' && <Loader2 className="h-5 w-5 animate-spin text-primary" />}
                  {step === 'complete' && <CheckCircle className="h-5 w-5 text-green-600" />}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Finalizing submission</p>
                  {step === 'linking' && (
                    <p className="text-xs text-muted-foreground mt-1">{message}</p>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Success/Error Message */}
          {step === 'complete' && (
            <div className="rounded-lg bg-green-50 dark:bg-green-950/20 p-4 border border-green-200 dark:border-green-900">
              <p className="text-sm text-green-900 dark:text-green-100">
                {message || 'Your project has been successfully submitted and saved to the database. Files have been uploaded to Google Drive.'}
              </p>
            </div>
          )}

          {step === 'error' && (
            <div className="rounded-lg bg-red-50 dark:bg-red-950/20 p-4 border border-red-200 dark:border-red-900">
              <p className="text-sm font-medium text-red-900 dark:text-red-100">
                {error || 'An error occurred during submission'}
              </p>
              <p className="text-xs text-red-700 dark:text-red-300 mt-2">
                {message}
              </p>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button
            onClick={onClose}
            disabled={!isComplete}
            className="w-full"
          >
            {isComplete ? 'Close' : 'Please wait...'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
