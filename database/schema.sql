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
