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
