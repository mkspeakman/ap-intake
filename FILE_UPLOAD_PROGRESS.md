# File Upload Progress - Design System Implementation

## Overview
The file upload UI now includes **design system compliant progress tracking** using:
- **Shadcn UI Progress component** (Radix UI primitive)
- **Semantic color tokens** (adapts to light/dark mode)
- **Visual status indicators** with icons and animations

## Component Architecture

### 1. FileUploadItem Component
**Location:** `src/components/form-sections/FileUploadItem.tsx`

Individual file item with status tracking and progress display.

#### States:
- **`pending`** - File queued, waiting to upload (gray file icon)
- **`uploading`** - Upload in progress (blue spinner, progress bar)
- **`complete`** - Upload successful (green checkmark)
- **`error`** - Upload failed (red alert, error message)

#### Features:
- Progress bar (only visible during upload)
- Status icon with color coding
- File size display
- Remove button (disabled during upload)
- Error message display
- Responsive truncation for long filenames

### 2. Progress Component
**Location:** `src/components/ui/progress.tsx`

Standard Shadcn UI progress bar with semantic theming.

#### Design System Tokens:
- `bg-secondary` - Track background
- `bg-primary` - Progress indicator
- Height: `h-1.5` (6px) for subtle appearance

### 3. ProjectInformationSection
**Location:** `src/components/form-sections/ProjectInformationSection.tsx`

Updated to accept optional `fileUploadData` prop.

#### Props:
```typescript
interface ProjectInformationSectionProps {
  projectName: string;
  description: string;
  files: File[];
  fileUploadData?: FileUploadItemData[]; // Optional - enables progress tracking
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onFilesChange: (files: File[]) => void;
  onFileRemove: (index: number) => void;
}
```

## Implementation

### Basic Usage (No Progress Tracking)
If you don't pass `fileUploadData`, it defaults to showing all files in 'pending' state:

```tsx
<ProjectInformationSection
  projectName={projectName}
  description={description}
  files={files}
  onChange={handleChange}
  onFilesChange={handleFilesChange}
  onFileRemove={handleRemoveFile}
/>
```

### Advanced Usage (With Progress Tracking)
Track upload status for each file:

```tsx
// In your parent component (App.tsx)
const [fileUploadData, setFileUploadData] = useState<FileUploadItemData[]>([]);

// When files are added
const handleFilesChange = (files: File[]) => {
  setForm((prev) => ({ ...prev, files }));
  
  // Initialize upload data
  setFileUploadData(
    files.map((file) => ({
      file,
      status: 'pending',
      progress: 0,
    }))
  );
};

// Pass to component
<ProjectInformationSection
  projectName={projectName}
  description={description}
  files={files}
  fileUploadData={fileUploadData}  // ← Add this
  onChange={handleChange}
  onFilesChange={handleFilesChange}
  onFileRemove={handleRemoveFile}
/>
```

## Upload Progress Integration

### Using XMLHttpRequest (Recommended)
XMLHttpRequest provides native upload progress events:

```typescript
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  
  const formData = new FormData();
  // ... add your form fields and files
  
  // Set all files to uploading
  setFileUploadData((prev) =>
    prev.map((item) => ({ ...item, status: 'uploading', progress: 0 }))
  );

  const xhr = new XMLHttpRequest();
  
  // Track upload progress
  xhr.upload.addEventListener('progress', (e) => {
    if (e.lengthComputable) {
      const percentComplete = Math.round((e.loaded / e.total) * 100);
      
      // Update progress for all files
      setFileUploadData((prev) =>
        prev.map((item) => ({
          ...item,
          status: 'uploading',
          progress: percentComplete,
        }))
      );
    }
  });

  // Handle completion
  xhr.addEventListener('load', () => {
    if (xhr.status >= 200 && xhr.status < 300) {
      // Success - mark all complete
      setFileUploadData((prev) =>
        prev.map((item) => ({ ...item, status: 'complete', progress: 100 }))
      );
    } else {
      // Error - mark all failed
      setFileUploadData((prev) =>
        prev.map((item) => ({
          ...item,
          status: 'error',
          error: 'Upload failed',
        }))
      );
    }
  });

  xhr.open('POST', WEBHOOK_URL);
  xhr.send(formData);
};
```

### Per-File Progress (Advanced)
For individual file progress tracking, you'd need to:
1. Upload files separately (one request per file)
2. Track each file's progress independently
3. Update specific file status in the array

```typescript
// Upload files one by one
for (let i = 0; i < form.files.length; i++) {
  const file = form.files[i];
  const formData = new FormData();
  formData.append('file', file);
  
  // Update this specific file to uploading
  setFileUploadData((prev) =>
    prev.map((item, idx) =>
      idx === i ? { ...item, status: 'uploading', progress: 0 } : item
    )
  );

  const xhr = new XMLHttpRequest();
  
  xhr.upload.addEventListener('progress', (e) => {
    if (e.lengthComputable) {
      const percent = Math.round((e.loaded / e.total) * 100);
      
      // Update only this file's progress
      setFileUploadData((prev) =>
        prev.map((item, idx) =>
          idx === i ? { ...item, progress: percent } : item
        )
      );
    }
  });

  await new Promise((resolve, reject) => {
    xhr.addEventListener('load', () => {
      setFileUploadData((prev) =>
        prev.map((item, idx) =>
          idx === i ? { ...item, status: 'complete', progress: 100 } : item
        )
      );
      resolve(xhr);
    });
    
    xhr.addEventListener('error', () => {
      setFileUploadData((prev) =>
        prev.map((item, idx) =>
          idx === i ? { ...item, status: 'error', error: 'Upload failed' } : item
        )
      );
      reject(new Error('Upload failed'));
    });
    
    xhr.open('POST', `${WEBHOOK_URL}/file`);
    xhr.send(formData);
  });
}
```

## Design System Compliance

### Color Tokens Used
All colors use semantic Tailwind tokens that adapt to light/dark mode:

| Element | Token | Purpose |
|---------|-------|---------|
| File item background | `bg-muted` | Neutral background |
| File item border | `border` | Subtle separation |
| File name | `text-sm` | Primary text |
| File size | `text-muted-foreground` | Secondary text |
| Pending icon | `text-muted-foreground` | Neutral state |
| Uploading icon | `text-blue-500` | Active/processing |
| Complete icon | `text-green-500` | Success state |
| Error icon | `text-red-500` | Error state |
| Error text | `text-red-500` | Error message |
| Progress track | `bg-secondary` | Inactive track |
| Progress bar | `bg-primary` | Active progress |

### Icons (Lucide React)
- **FileText** - Pending state
- **Loader2** - Uploading (with `animate-spin`)
- **CheckCircle** - Success
- **AlertCircle** - Error
- **X** - Remove button

### Animations
- **Spinner**: `animate-spin` (Tailwind built-in)
- **Progress bar**: CSS transition via Radix UI
- **Hover states**: `transition-colors` on remove button

## Accessibility
- **Remove buttons** have `aria-label="Remove file"`
- **Progress updates** announced to screen readers via Radix
- **Color + icon** combination (not relying on color alone)
- **Keyboard accessible** remove buttons

## Browser Compatibility
- **XMLHttpRequest upload events**: All modern browsers (IE10+)
- **Radix UI Progress**: All modern browsers
- **FormData**: Universal support

## Testing Locally
The current implementation tracks progress during form submission to your n8n webhook. To test:

1. Add multiple large files (>5MB each)
2. Submit the form
3. Watch files transition: pending → uploading → complete
4. Check browser DevTools Network tab to see actual upload

For faster local testing with simulated progress:
```typescript
// Simulate upload progress (for development)
const simulateProgress = (fileIndex: number) => {
  let progress = 0;
  const interval = setInterval(() => {
    progress += 10;
    
    setFileUploadData((prev) =>
      prev.map((item, idx) =>
        idx === fileIndex
          ? { ...item, status: 'uploading', progress: Math.min(progress, 100) }
          : item
      )
    );
    
    if (progress >= 100) {
      clearInterval(interval);
      setFileUploadData((prev) =>
        prev.map((item, idx) =>
          idx === fileIndex ? { ...item, status: 'complete' } : item
        )
      );
    }
  }, 200);
};
```

## Future Enhancements
1. **Retry failed uploads** - Add retry button for error state
2. **Cancel uploads** - Add cancel button during upload (call `xhr.abort()`)
3. **Queue management** - Upload files sequentially instead of all at once
4. **File preview** - Show thumbnails for images/PDFs
5. **Chunked uploads** - For very large files (>100MB)
6. **Resume capability** - Store upload state for retry after page refresh
