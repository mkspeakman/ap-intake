// Database types and interfaces for quote requests

export interface QuoteRequest {
  id?: number;
  quote_number: string;
  status: 'pending' | 'processing' | 'quoted' | 'completed' | 'cancelled';
  
  // Company & Contact
  company_name: string;
  contact_name: string;
  email: string;
  phone?: string;
  
  // Project Information
  project_name: string;
  description?: string;
  quantity: string;
  lead_time?: string;
  part_notes?: string;
  
  // Relations (IDs or names depending on query)
  materials?: string[];
  finishes?: string[];
  certifications?: string[];
  files?: QuoteFile[];
  
  // Metadata
  created_at?: string;
  updated_at?: string;
  submitted_by?: string;
}

export interface QuoteFile {
  id?: number;
  quote_request_id?: number;
  filename: string;
  file_extension: string;
  file_type?: string;
  file_size_bytes?: number;
  upload_order?: number;
  created_at?: string;
}

export interface Material {
  id?: number;
  name: string;
  category?: string;
  is_custom?: boolean;
  created_at?: string;
}

export interface Finish {
  id?: number;
  name: string;
  category?: string;
  is_custom?: boolean;
  created_at?: string;
}

export interface Certification {
  id?: number;
  code: string;
  name: string;
  description?: string;
}

// Form submission payload
export interface QuoteRequestSubmission {
  companyName: string;
  contactName: string;
  email: string;
  phone?: string;
  projectName: string;
  description?: string;
  materials: string[];
  finishes: string[];
  quantity: string;
  leadTime?: string;
  partNotes?: string;
  certifications: string[];
  files: {
    filename: string;
    file_extension: string;
    file_size_bytes: number;
  }[];
}

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface QuoteRequestResponse {
  id: number;
  quote_number: string;
  created_at: string;
}
