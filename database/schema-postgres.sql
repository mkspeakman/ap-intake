-- Manufacturing Quote Requests Database Schema
-- PostgreSQL version for Vercel Postgres

-- Main quote requests table
CREATE TABLE IF NOT EXISTS quote_requests (
    id SERIAL PRIMARY KEY,
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
    
    -- Google Drive Integration
    drive_file_id VARCHAR(255),
    drive_link TEXT,
    
    -- Metadata
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    submitted_by VARCHAR(255)
);

CREATE INDEX IF NOT EXISTS idx_company ON quote_requests(company_name);
CREATE INDEX IF NOT EXISTS idx_status ON quote_requests(status);
CREATE INDEX IF NOT EXISTS idx_created ON quote_requests(created_at);
CREATE INDEX IF NOT EXISTS idx_quote_number ON quote_requests(quote_number);

-- Materials table
CREATE TABLE IF NOT EXISTS materials (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) UNIQUE NOT NULL,
    category VARCHAR(100),
    is_custom BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Quote-Material junction table
CREATE TABLE IF NOT EXISTS quote_materials (
    id SERIAL PRIMARY KEY,
    quote_request_id INTEGER NOT NULL,
    material_id INTEGER NOT NULL,
    notes TEXT,
    FOREIGN KEY (quote_request_id) REFERENCES quote_requests(id) ON DELETE CASCADE,
    FOREIGN KEY (material_id) REFERENCES materials(id),
    UNIQUE(quote_request_id, material_id)
);

-- Finishes table
CREATE TABLE IF NOT EXISTS finishes (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) UNIQUE NOT NULL,
    category VARCHAR(100),
    is_custom BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Quote-Finish junction table
CREATE TABLE IF NOT EXISTS quote_finishes (
    id SERIAL PRIMARY KEY,
    quote_request_id INTEGER NOT NULL,
    finish_id INTEGER NOT NULL,
    notes TEXT,
    FOREIGN KEY (quote_request_id) REFERENCES quote_requests(id) ON DELETE CASCADE,
    FOREIGN KEY (finish_id) REFERENCES finishes(id),
    UNIQUE(quote_request_id, finish_id)
);

-- Certifications table
CREATE TABLE IF NOT EXISTS certifications (
    id SERIAL PRIMARY KEY,
    code VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT
);

-- Quote-Certification junction table
CREATE TABLE IF NOT EXISTS quote_certifications (
    id SERIAL PRIMARY KEY,
    quote_request_id INTEGER NOT NULL,
    certification_id INTEGER NOT NULL,
    FOREIGN KEY (quote_request_id) REFERENCES quote_requests(id) ON DELETE CASCADE,
    FOREIGN KEY (certification_id) REFERENCES certifications(id),
    UNIQUE(quote_request_id, certification_id)
);

-- Files table
CREATE TABLE IF NOT EXISTS quote_files (
    id SERIAL PRIMARY KEY,
    quote_request_id INTEGER NOT NULL,
    filename VARCHAR(255) NOT NULL,
    file_extension VARCHAR(10) NOT NULL,
    file_type VARCHAR(50),
    file_size_bytes INTEGER,
    upload_order INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (quote_request_id) REFERENCES quote_requests(id) ON DELETE CASCADE
);

-- Equipment/Machines table
CREATE TABLE IF NOT EXISTS equipment (
    id SERIAL PRIMARY KEY,
    machine_id VARCHAR(100) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(100) NOT NULL,
    location VARCHAR(100),
    status VARCHAR(50) DEFAULT 'available',
    controller VARCHAR(100),
    
    -- Technical Specifications (JSON for nested objects)
    work_envelope_mm JSONB,
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
    runtime_metrics JSONB,
    
    -- Additional Info
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_equipment_status ON equipment(status);
CREATE INDEX IF NOT EXISTS idx_equipment_type ON equipment(type);
CREATE INDEX IF NOT EXISTS idx_equipment_machine_id ON equipment(machine_id);

-- Equipment Operations (what the machine can do)
CREATE TABLE IF NOT EXISTS equipment_operations (
    id SERIAL PRIMARY KEY,
    equipment_id INTEGER NOT NULL,
    operation VARCHAR(100) NOT NULL,
    FOREIGN KEY (equipment_id) REFERENCES equipment(id) ON DELETE CASCADE,
    UNIQUE(equipment_id, operation)
);

-- Equipment Fixture Types
CREATE TABLE IF NOT EXISTS equipment_fixtures (
    id SERIAL PRIMARY KEY,
    equipment_id INTEGER NOT NULL,
    fixture_type VARCHAR(100) NOT NULL,
    FOREIGN KEY (equipment_id) REFERENCES equipment(id) ON DELETE CASCADE,
    UNIQUE(equipment_id, fixture_type)
);

-- Equipment Materials (reuse existing materials table)
CREATE TABLE IF NOT EXISTS equipment_materials (
    id SERIAL PRIMARY KEY,
    equipment_id INTEGER NOT NULL,
    material_id INTEGER NOT NULL,
    FOREIGN KEY (equipment_id) REFERENCES equipment(id) ON DELETE CASCADE,
    FOREIGN KEY (material_id) REFERENCES materials(id),
    UNIQUE(equipment_id, material_id)
);

-- Equipment Preferences (what the machine is preferred for)
CREATE TABLE IF NOT EXISTS equipment_preferences (
    id SERIAL PRIMARY KEY,
    equipment_id INTEGER NOT NULL,
    preference VARCHAR(100) NOT NULL,
    FOREIGN KEY (equipment_id) REFERENCES equipment(id) ON DELETE CASCADE,
    UNIQUE(equipment_id, preference)
);

-- Pre-populate common materials
INSERT INTO materials (name, category) VALUES
('Aluminum 6061-T6', 'Aluminum'),
('Aluminum 7075-T6', 'Aluminum'),
('Stainless Steel 304', 'Steel'),
('Stainless Steel 316', 'Steel'),
('Titanium Grade 5', 'Titanium'),
('Carbon Steel', 'Steel'),
('Brass', 'Copper Alloy'),
('Bronze', 'Copper Alloy')
ON CONFLICT (name) DO NOTHING;

-- Pre-populate common finishes
INSERT INTO finishes (name, category) VALUES
('Anodized', 'Surface Treatment'),
('Powder Coated', 'Coating'),
('Electropolish', 'Surface Treatment'),
('Bead Blasted', 'Surface Treatment'),
('Passivated', 'Chemical Treatment'),
('Black Oxide', 'Chemical Treatment'),
('Zinc Plated', 'Plating'),
('Chrome Plated', 'Plating')
ON CONFLICT (name) DO NOTHING;

-- Pre-populate certifications
INSERT INTO certifications (code, name, description) VALUES
('AS9100', 'AS9100', 'Aerospace Quality Management System'),
('ISO 9001', 'ISO 9001', 'Quality Management System'),
('ITAR', 'ITAR', 'International Traffic in Arms Regulations'),
('NADCAP', 'NADCAP', 'National Aerospace and Defense Contractors Accreditation Program'),
('Material Certs', 'Material Certifications', 'Material test reports and certifications'),
('First Article Inspection', 'First Article Inspection', 'AS9102 First Article Inspection Report')
ON CONFLICT (code) DO NOTHING;
