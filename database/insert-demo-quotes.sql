-- Demo Quote 1: Fully In-House Capable
-- Simple aluminum bracket - perfect for 3-axis mill
INSERT INTO quote_requests (
    quote_number, company_name, contact_name, email, phone,
    project_name, description, quantity, lead_time, part_notes,
    status, in_house_feasibility, review_status,
    machine_matches, outsourced_steps, capability_analysis
) VALUES (
    'Q2026-DEMO-001',
    'Acme Aerospace Components',
    'Sarah Chen',
    's.chen@acmeaero.com',
    '406-555-0123',
    'UAV Mounting Bracket',
    'CNC machined aluminum mounting bracket for UAV payload system. Simple 3-axis geometry with standard tolerances.',
    '50',
    '3 weeks',
    'Standard tolerances ±0.010", all edges deburred, anodize Type II clear per MIL-A-8625.',
    'pending',
    'full',
    'auto_matched',
    '[
        {
            "machine_id": "HAAS_VF2SS_001",
            "name": "Haas VF-2 SS",
            "match_score": 85,
            "matched_operations": ["milling", "drilling", "tapping"],
            "matched_materials": ["6061-T6 Aluminum"],
            "notes": "Part fits work envelope; Tolerance achievable; Good for short runs"
        },
        {
            "machine_id": "DNM_4500_001",
            "name": "DN Solutions DNM 4500 #1",
            "match_score": 80,
            "matched_operations": ["milling", "drilling"],
            "matched_materials": ["6061-T6 Aluminum"],
            "notes": "Part fits work envelope; High-speed capable"
        }
    ]'::jsonb,
    '["anodizing"]'::jsonb,
    '{
        "feasibility_summary": "✅ Fully manufacturable in-house. 2 compatible machine(s) identified.",
        "total_operations_required": 3,
        "operations_matched": 3,
        "operations_outsourced": 1,
        "material_compatibility": true,
        "tolerance_achievable": true,
        "estimated_setup_time_min": 60,
        "recommended_sequence": ["Haas VF-2 SS", "DN Solutions DNM 4500 #1"],
        "confidence_score": 85,
        "analysis_timestamp": "2026-01-18T10:30:00Z"
    }'::jsonb
) RETURNING id AS demo_quote_1_id \gset

-- Add materials for Quote 1
INSERT INTO quote_materials (quote_request_id, material_id)
SELECT :demo_quote_1_id, id FROM materials WHERE name = '6061-T6 Aluminum';

-- Add finishes for Quote 1
INSERT INTO quote_finishes (quote_request_id, finish_id)
SELECT :demo_quote_1_id, id FROM finishes WHERE name LIKE 'Anodize%' LIMIT 1;

-- Add certifications for Quote 1
INSERT INTO quote_certifications (quote_request_id, certification_id)
SELECT :demo_quote_1_id, id FROM certifications WHERE code IN ('material-cert', 'fai');

-- Add files for Quote 1
INSERT INTO quote_files (quote_request_id, filename, file_extension, file_size_bytes, upload_order)
VALUES 
    (:demo_quote_1_id, 'bracket_assy_rev3.step', '.step', 245760, 0),
    (:demo_quote_1_id, 'drawing_A1234.pdf', '.pdf', 1048576, 1);

-- Demo Quote 2: Partial In-House (Complex Turning + Milling)
-- Requires both lathe and mill work
INSERT INTO quote_requests (
    quote_number, company_name, contact_name, email, phone,
    project_name, description, quantity, lead_time, part_notes,
    status, in_house_feasibility, review_status,
    machine_matches, outsourced_steps, capability_analysis
) VALUES (
    'Q2026-DEMO-002',
    'Precision Medical Devices Inc',
    'Dr. Michael Torres',
    'm.torres@precisionmed.com',
    '503-555-7890',
    'Surgical Instrument Shaft',
    'Precision turned shaft with milled features. 316 stainless steel. Requires turning, live tooling operations, and passivation.',
    '100',
    '2 weeks',
    'Tight tolerance ±0.002" on critical diameters. Surface finish Ra 32. Passivation per ASTM A967.',
    'pending',
    'partial',
    'pending_review',
    '[
        {
            "machine_id": "LYNX_220_001",
            "name": "DN Solutions Lynx 220",
            "match_score": 92,
            "matched_operations": ["turning", "milling", "drilling"],
            "matched_materials": ["316 Stainless Steel"],
            "notes": "Twin-spindle with live tooling; Bar feeder for efficiency; Tight tolerance achievable"
        },
        {
            "machine_id": "LYNX_2100_001",
            "name": "DN Solutions Lynx 2100",
            "match_score": 88,
            "matched_operations": ["turning", "milling"],
            "matched_materials": ["316 Stainless Steel"],
            "notes": "Live tooling capable; Y-axis for complex features"
        },
        {
            "machine_id": "HAAS_VF2SS_001",
            "name": "Haas VF-2 SS",
            "match_score": 45,
            "matched_operations": ["milling"],
            "matched_materials": ["316 Stainless Steel"],
            "notes": "Secondary operations if needed"
        }
    ]'::jsonb,
    '["passivation", "final_inspection"]'::jsonb,
    '{
        "feasibility_summary": "⚠️ Partially manufacturable in-house. 3 machine(s) matched, but requires outsourcing: passivation, final_inspection.",
        "total_operations_required": 5,
        "operations_matched": 3,
        "operations_outsourced": 2,
        "material_compatibility": true,
        "tolerance_achievable": true,
        "estimated_setup_time_min": 45,
        "recommended_sequence": ["DN Solutions Lynx 220", "DN Solutions Lynx 2100", "Haas VF-2 SS"],
        "confidence_score": 92,
        "analysis_timestamp": "2026-01-18T11:15:00Z"
    }'::jsonb
) RETURNING id AS demo_quote_2_id \gset

-- Add materials for Quote 2
INSERT INTO quote_materials (quote_request_id, material_id)
SELECT :demo_quote_2_id, id FROM materials WHERE name LIKE '%316%Stainless%' LIMIT 1;

-- Add finishes for Quote 2
INSERT INTO quote_finishes (quote_request_id, finish_id)
SELECT :demo_quote_2_id, id FROM finishes WHERE name = 'Passivation';

-- Add certifications for Quote 2
INSERT INTO quote_certifications (quote_request_id, certification_id)
SELECT :demo_quote_2_id, id FROM certifications WHERE code IN ('material-cert', 'coc', 'fai');

-- Add files for Quote 2
INSERT INTO quote_files (quote_request_id, filename, file_extension, file_size_bytes, upload_order)
VALUES 
    (:demo_quote_2_id, 'shaft_model_v2.step', '.step', 128000, 0),
    (:demo_quote_2_id, 'medical_spec_MS5678.pdf', '.pdf', 512000, 1),
    (:demo_quote_2_id, 'material_cert_required.pdf', '.pdf', 256000, 2);

-- Demo Quote 3: Complex 5-Axis Job with Multiple Operations
-- Aerospace titanium part requiring 5-axis work
INSERT INTO quote_requests (
    quote_number, company_name, contact_name, email, phone,
    project_name, description, quantity, lead_time, part_notes,
    status, in_house_feasibility, review_status,
    machine_matches, outsourced_steps, capability_analysis
) VALUES (
    'Q2026-DEMO-003',
    'SpaceWorks Engineering',
    'Jennifer Park',
    'j.park@spaceworks.com',
    '720-555-4321',
    'Titanium Control Arm',
    'Complex 5-axis machined control arm for satellite positioning system. Titanium Ti-6Al-4V with complex curved surfaces and tight tolerances.',
    '15',
    '6 weeks',
    'Aerospace quality required. All dimensions ±0.003". Surface finish Ra 16. Black oxide coating. AS9100 documentation required.',
    'pending',
    'partial',
    'pending_review',
    '[
        {
            "machine_id": "HAAS_VF2SS_5X_001",
            "name": "Haas VF-2 SS 5-Axis",
            "match_score": 95,
            "matched_operations": ["milling", "drilling", "5-axis_simultaneous", "contouring"],
            "matched_materials": ["Titanium"],
            "notes": "⭐ Ideal for complex geometry; Tight tolerance achievable; Well-suited for aerospace"
        },
        {
            "machine_id": "DNM_4500_001",
            "name": "DN Solutions DNM 4500 #1",
            "match_score": 70,
            "matched_operations": ["milling", "drilling"],
            "matched_materials": ["Titanium"],
            "notes": "Secondary operations or simpler features"
        }
    ]'::jsonb,
    '["black_oxide", "electropolish", "laser_marking"]'::jsonb,
    '{
        "feasibility_summary": "⚠️ Partially manufacturable in-house. 2 machine(s) matched, but requires outsourcing: black_oxide, electropolish, laser_marking.",
        "total_operations_required": 6,
        "operations_matched": 4,
        "operations_outsourced": 3,
        "material_compatibility": true,
        "tolerance_achievable": true,
        "estimated_setup_time_min": 90,
        "recommended_sequence": ["Haas VF-2 SS 5-Axis", "DN Solutions DNM 4500 #1"],
        "confidence_score": 95,
        "analysis_timestamp": "2026-01-18T14:45:00Z"
    }'::jsonb
) RETURNING id AS demo_quote_3_id \gset

-- Add materials for Quote 3
INSERT INTO quote_materials (quote_request_id, material_id)
SELECT :demo_quote_3_id, id FROM materials WHERE name LIKE '%Titanium%6AL%' OR name LIKE '%Ti-6%' LIMIT 1;

-- Add finishes for Quote 3
INSERT INTO quote_finishes (quote_request_id, finish_id)
SELECT :demo_quote_3_id, id FROM finishes WHERE name = 'Black Oxide';

INSERT INTO quote_finishes (quote_request_id, finish_id)
SELECT :demo_quote_3_id, id FROM finishes WHERE name = 'Electropolish';

-- Add certifications for Quote 3
INSERT INTO quote_certifications (quote_request_id, certification_id)
SELECT :demo_quote_3_id, id FROM certifications WHERE code IN ('as9100', 'material-cert', 'fai');

-- Add files for Quote 3
INSERT INTO quote_files (quote_request_id, filename, file_extension, file_size_bytes, upload_order)
VALUES 
    (:demo_quote_3_id, 'control_arm_5axis.step', '.step', 4194304, 0),
    (:demo_quote_3_id, 'AS9102_requirements.pdf', '.pdf', 768000, 1),
    (:demo_quote_3_id, 'inspection_plan.xlsx', '.xlsx', 102400, 2),
    (:demo_quote_3_id, 'surface_finish_spec.pdf', '.pdf', 204800, 3);

-- Success summary
SELECT 
    'Demo quotes created successfully!' AS status,
    COUNT(*) AS total_quotes
FROM quote_requests 
WHERE quote_number LIKE 'Q2026-DEMO-%';

SELECT 
    quote_number,
    company_name,
    project_name,
    in_house_feasibility,
    review_status
FROM quote_requests 
WHERE quote_number LIKE 'Q2026-DEMO-%'
ORDER BY quote_number;
