-- Manufacturing Quote Requests Database Schema
-- Optimized for AI querying and flexible analysis

-- Main quote requests table
CREATE TABLE quote_requests (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    quote_number VARCHAR(50) UNIQUE NOT NULL,
    status VARCHAR(20) DEFAULT 'pending',
    
    -- Company & Contact Information
    company_name VARCHAR(255) NOT NULL,
    contact_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    
    -- Project Information
    project_name VARCHAR(255) NOT NULL,
    description TEXT,
    quantity VARCHAR(100) NOT NULL,
    lead_time VARCHAR(50),
    part_notes TEXT,
    
    -- Equipment Capability Analysis
    in_house_feasibility VARCHAR(20), -- 'full', 'partial', 'none'
    machine_matches TEXT, -- JSON array of matched machine IDs with scores
    outsourced_steps TEXT, -- JSON array of operations requiring outsourcing
    capability_analysis TEXT, -- JSON with detailed reasoning and match scores
    review_status VARCHAR(50) DEFAULT 'pending_review', -- 'pending_review', 'auto_matched', 'approved', 'manual_override'
    
    -- Google Drive Integration
    drive_file_id VARCHAR(255),
    drive_link TEXT,
    
    -- Metadata
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    submitted_by VARCHAR(255),
    
    -- Indexes for common queries
    INDEX idx_company (company_name),
    INDEX idx_status (status),
    INDEX idx_created (created_at),
    INDEX idx_quote_number (quote_number)
);

-- Materials table (many-to-many with quote_requests)
CREATE TABLE materials (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name VARCHAR(255) UNIQUE NOT NULL,
    category VARCHAR(100),
    is_custom BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Quote-Material junction table
CREATE TABLE quote_materials (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    quote_request_id INTEGER NOT NULL,
    material_id INTEGER NOT NULL,
    notes TEXT,
    FOREIGN KEY (quote_request_id) REFERENCES quote_requests(id) ON DELETE CASCADE,
    FOREIGN KEY (material_id) REFERENCES materials(id),
    UNIQUE(quote_request_id, material_id)
);

-- Finishes table (many-to-many with quote_requests)
CREATE TABLE finishes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name VARCHAR(255) UNIQUE NOT NULL,
    category VARCHAR(100),
    is_custom BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Quote-Finish junction table
CREATE TABLE quote_finishes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    quote_request_id INTEGER NOT NULL,
    finish_id INTEGER NOT NULL,
    notes TEXT,
    FOREIGN KEY (quote_request_id) REFERENCES quote_requests(id) ON DELETE CASCADE,
    FOREIGN KEY (finish_id) REFERENCES finishes(id),
    UNIQUE(quote_request_id, finish_id)
);

-- Certifications table
CREATE TABLE certifications (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    code VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT
);

-- Quote-Certification junction table
CREATE TABLE quote_certifications (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    quote_request_id INTEGER NOT NULL,
    certification_id INTEGER NOT NULL,
    FOREIGN KEY (quote_request_id) REFERENCES quote_requests(id) ON DELETE CASCADE,
    FOREIGN KEY (certification_id) REFERENCES certifications(id),
    UNIQUE(quote_request_id, certification_id)
);

-- Files table (stores metadata, actual files stored separately)
CREATE TABLE quote_files (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    quote_request_id INTEGER NOT NULL,
    filename VARCHAR(255) NOT NULL,
    file_extension VARCHAR(10) NOT NULL,
    file_type VARCHAR(50),
    file_size_bytes INTEGER,
    upload_order INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (quote_request_id) REFERENCES quote_requests(id) ON DELETE CASCADE,
    INDEX idx_quote_files (quote_request_id)
);

-- Equipment/Machines table
CREATE TABLE equipment (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    machine_id VARCHAR(100) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(100) NOT NULL,
    location VARCHAR(100),
    status VARCHAR(50) DEFAULT 'available',
    controller VARCHAR(100),
    
    -- Technical Specifications (JSON stored as TEXT in SQLite)
    work_envelope_mm TEXT,
    max_spindle_speed_rpm INTEGER,
    tool_changer_capacity INTEGER,
    max_part_weight_kg DECIMAL(10,2),
    min_tolerance_mm DECIMAL(10,5),
    coolant_type VARCHAR(50),
    probes_installed BOOLEAN DEFAULT FALSE,
    
    -- Scheduling & Cost
    setup_time_min INTEGER,
    typical_cycle_time_multiplier DECIMAL(5,2) DEFAULT 1.0,
    estimated_hourly_rate_usd DECIMAL(10,2),
    
    -- Maintenance & Performance (JSON for nested metrics)
    last_calibrated DATE,
    runtime_metrics TEXT,
    
    -- Additional Info
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_equipment_status (status),
    INDEX idx_equipment_type (type),
    INDEX idx_equipment_machine_id (machine_id)
);

-- Equipment Operations (what the machine can do)
CREATE TABLE equipment_operations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    equipment_id INTEGER NOT NULL,
    operation VARCHAR(100) NOT NULL,
    FOREIGN KEY (equipment_id) REFERENCES equipment(id) ON DELETE CASCADE,
    UNIQUE(equipment_id, operation)
);

-- Equipment Fixture Types
CREATE TABLE equipment_fixtures (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    equipment_id INTEGER NOT NULL,
    fixture_type VARCHAR(100) NOT NULL,
    FOREIGN KEY (equipment_id) REFERENCES equipment(id) ON DELETE CASCADE,
    UNIQUE(equipment_id, fixture_type)
);

-- Equipment Materials (reuse existing materials table)
CREATE TABLE equipment_materials (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    equipment_id INTEGER NOT NULL,
    material_id INTEGER NOT NULL,
    FOREIGN KEY (equipment_id) REFERENCES equipment(id) ON DELETE CASCADE,
    FOREIGN KEY (material_id) REFERENCES materials(id),
    UNIQUE(equipment_id, material_id)
);

-- Equipment Preferences (what the machine is preferred for)
CREATE TABLE equipment_preferences (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    equipment_id INTEGER NOT NULL,
    preference VARCHAR(100) NOT NULL,
    FOREIGN KEY (equipment_id) REFERENCES equipment(id) ON DELETE CASCADE,
    UNIQUE(equipment_id, preference)
);

-- Pre-populate certifications
INSERT INTO certifications (code, name, description) VALUES
    ('itar', 'ITAR Compliant', 'International Traffic in Arms Regulations'),
    ('iso', 'ISO 9001', 'Quality Management System'),
    ('as9100', 'AS9100', 'Aerospace Quality Management'),
    ('coc', 'Certificate of Conformance', 'Material and process conformance certificate'),
    ('material-cert', 'Material Certification', 'Material traceability and certification'),
    ('fai', 'First Article Inspection', 'FAI report per AS9102');

-- Pre-populate common materials
INSERT INTO materials (name, category) VALUES
    ('6061-T6 Aluminum', 'Aluminum'),
    ('7075 Aluminum', 'Aluminum'),
    ('304 Stainless Steel', 'Stainless Steel'),
    ('316 Stainless Steel', 'Stainless Steel'),
    ('Titanium', 'Titanium'),
    ('PEEK', 'Polymer'),
    ('Delrin', 'Polymer'),
    ('ABS', 'Polymer'),
    ('Polycarbonate', 'Polymer'),
    ('Brass', 'Brass'),
    ('Copper', 'Copper');

-- Pre-populate common finishes
INSERT INTO finishes (name, category) VALUES
    ('As-Machined', 'None'),
    ('Anodize (Type II)', 'Anodize'),
    ('Anodize (Type III - Hard)', 'Anodize'),
    ('Bead Blast', 'Surface Treatment'),
    ('Powder Coat', 'Coating'),
    ('Chrome Plating', 'Plating'),
    ('Black Oxide', 'Coating'),
    ('Passivation', 'Surface Treatment'),
    ('Electropolish', 'Surface Treatment');
