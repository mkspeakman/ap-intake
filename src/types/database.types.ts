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
  
  // Equipment Capability Analysis
  in_house_feasibility?: 'full' | 'partial' | 'none';
  machine_matches?: MachineMatch[];
  outsourced_steps?: string[];
  capability_analysis?: CapabilityAnalysis;
  review_status?: 'pending_review' | 'auto_matched' | 'approved' | 'manual_override';
  
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

export interface MachineMatch {
  machine_id: string;
  name: string;
  match_score: number;
  matched_operations: string[];
  matched_materials: string[];
  notes?: string;
}

export interface CapabilityAnalysis {
  feasibility_summary: string;
  total_operations_required: number;
  operations_matched: number;
  operations_outsourced: number;
  material_compatibility: boolean;
  tolerance_achievable: boolean;
  estimated_setup_time_min?: number;
  recommended_sequence?: string[];
  confidence_score?: number;
  analysis_timestamp: string;
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

// Equipment/Machine types
export interface Equipment {
  id?: number;
  machine_id: string;
  name: string;
  type: string;
  location?: string;
  status: 'available' | 'in_use' | 'maintenance' | 'offline';
  controller?: string;
  
  // Technical Specifications
  work_envelope_mm?: {
    x: number;
    y: number;
    z: number;
  };
  max_spindle_speed_rpm?: number;
  tool_changer_capacity?: number;
  max_part_weight_kg?: number;
  min_tolerance_mm?: number;
  coolant_type?: string;
  probes_installed?: boolean;
  
  // Capabilities (from junction tables)
  operations?: string[];
  fixture_types?: string[];
  materials?: string[];
  preferred_for?: string[];
  
  // Scheduling & Cost
  setup_time_min?: number;
  typical_cycle_time_multiplier?: number;
  estimated_hourly_rate_usd?: number;
  
  // Maintenance & Performance
  last_calibrated?: string;
  runtime_metrics?: {
    avg_uptime_pct?: number;
    last_maintenance?: string;
    operating_shifts?: string[];
  };
  
  notes?: string;
  created_at?: string;
  updated_at?: string;
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
