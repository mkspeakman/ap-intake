-- Insert Equipment Data for Autopilot, Inc
-- PostgreSQL version for Vercel/Neon

-- First, let's ensure we have the materials from the capabilities sheet
INSERT INTO materials (name, category) VALUES
('Aluminum 1000 Series', 'Aluminum'),
('Aluminum 2000 Series', 'Aluminum'),
('Aluminum 4000 Series', 'Aluminum'),
('Aluminum 5000 Series', 'Aluminum'),
('Aluminum 6000 Series', 'Aluminum'),
('Aluminum 7000 Series', 'Aluminum'),
('Stainless Steel 300 Series', 'Stainless Steel'),
('Stainless Steel 400 Series', 'Stainless Steel'),
('Stainless Steel 15-5', 'Stainless Steel'),
('Stainless Steel 17-4', 'Stainless Steel'),
('Tool Steel', 'Steel'),
('Carbon Steel', 'Steel'),
('Alloy Steel', 'Steel'),
('Titanium Grade 2', 'Titanium'),
('Titanium Grade 5', 'Titanium'),
('Titanium Ti-6AL-4V', 'Titanium'),
('Brass', 'Copper Alloy'),
('Bronze', 'Copper Alloy'),
('Inconel', 'Exotic'),
('Beryllium', 'Exotic'),
('VIM VAR', 'Exotic'),
('Invar', 'Exotic'),
('Magnesium', 'Exotic'),
('Cast Iron', 'Iron')
ON CONFLICT (name) DO NOTHING;

-- =============================================
-- CNC MILLING MACHINES
-- =============================================

-- 1. DN Solutions DNM 4500 #1
INSERT INTO equipment (
    machine_id, name, type, location, status, controller,
    work_envelope_mm, max_spindle_speed_rpm, tool_changer_capacity,
    setup_time_min, typical_cycle_time_multiplier, estimated_hourly_rate_usd,
    notes
) VALUES (
    'DNM_4500_001',
    'DN Solutions DNM 4500 #1',
    '3-Axis Vertical Mill',
    'Bay 1',
    'available',
    'Fanuc',
    '{"x": 800, "y": 450, "z": 510}',
    12000,
    30,
    45,
    1.0,
    95,
    'High-speed machining center with 30-tool capacity'
) RETURNING id AS dnm4500_1_id \gset

INSERT INTO equipment_operations (equipment_id, operation) VALUES
    (:dnm4500_1_id, 'milling'),
    (:dnm4500_1_id, 'drilling'),
    (:dnm4500_1_id, 'tapping'),
    (:dnm4500_1_id, 'boring'),
    (:dnm4500_1_id, 'contouring');

INSERT INTO equipment_fixtures (equipment_id, fixture_type) VALUES
    (:dnm4500_1_id, 'vise'),
    (:dnm4500_1_id, 'custom_plate'),
    (:dnm4500_1_id, '4th_axis');

-- 2. DN Solutions DNM 4500 #2
INSERT INTO equipment (
    machine_id, name, type, location, status, controller,
    work_envelope_mm, max_spindle_speed_rpm, tool_changer_capacity,
    setup_time_min, typical_cycle_time_multiplier, estimated_hourly_rate_usd,
    notes
) VALUES (
    'DNM_4500_002',
    'DN Solutions DNM 4500 #2',
    '3-Axis Vertical Mill',
    'Bay 1',
    'available',
    'Fanuc',
    '{"x": 800, "y": 450, "z": 510}',
    12000,
    30,
    45,
    1.0,
    95,
    'High-speed machining center with 30-tool capacity'
) RETURNING id AS dnm4500_2_id \gset

INSERT INTO equipment_operations (equipment_id, operation) VALUES
    (:dnm4500_2_id, 'milling'),
    (:dnm4500_2_id, 'drilling'),
    (:dnm4500_2_id, 'tapping'),
    (:dnm4500_2_id, 'boring'),
    (:dnm4500_2_id, 'contouring');

INSERT INTO equipment_fixtures (equipment_id, fixture_type) VALUES
    (:dnm4500_2_id, 'vise'),
    (:dnm4500_2_id, 'custom_plate'),
    (:dnm4500_2_id, '4th_axis');

-- 3. Haas VF-2 SS
INSERT INTO equipment (
    machine_id, name, type, location, status, controller,
    work_envelope_mm, max_spindle_speed_rpm, tool_changer_capacity,
    setup_time_min, typical_cycle_time_multiplier, estimated_hourly_rate_usd,
    notes
) VALUES (
    'HAAS_VF2SS_001',
    'Haas VF-2 SS',
    '3-Axis Vertical Mill',
    'Bay 2',
    'available',
    'Haas Next Gen',
    '{"x": 762, "y": 406, "z": 508}',
    12000,
    20,
    60,
    1.0,
    85,
    'Super-speed vertical machining center'
) RETURNING id AS vf2ss_id \gset

INSERT INTO equipment_operations (equipment_id, operation) VALUES
    (:vf2ss_id, 'milling'),
    (:vf2ss_id, 'drilling'),
    (:vf2ss_id, 'tapping'),
    (:vf2ss_id, 'boring');

INSERT INTO equipment_fixtures (equipment_id, fixture_type) VALUES
    (:vf2ss_id, 'vise'),
    (:vf2ss_id, 'custom_plate'),
    (:vf2ss_id, '4th_axis');

INSERT INTO equipment_preferences (equipment_id, preference) VALUES
    (:vf2ss_id, 'tight_tolerance'),
    (:vf2ss_id, 'short_run');

-- 4. Haas VF-2 SS 5-Axis
INSERT INTO equipment (
    machine_id, name, type, location, status, controller,
    work_envelope_mm, max_spindle_speed_rpm, tool_changer_capacity,
    setup_time_min, typical_cycle_time_multiplier, estimated_hourly_rate_usd,
    notes
) VALUES (
    'HAAS_VF2SS_5X_001',
    'Haas VF-2 SS 5-Axis',
    '5-Axis Vertical Mill',
    'Bay 2',
    'available',
    'Haas Next Gen',
    '{"x": 762, "y": 406, "z": 508}',
    12000,
    70,
    90,
    1.3,
    125,
    '5-axis simultaneous machining with 70-tool capacity'
) RETURNING id AS vf2ss_5x_id \gset

INSERT INTO equipment_operations (equipment_id, operation) VALUES
    (:vf2ss_5x_id, 'milling'),
    (:vf2ss_5x_id, 'drilling'),
    (:vf2ss_5x_id, 'tapping'),
    (:vf2ss_5x_id, 'boring'),
    (:vf2ss_5x_id, 'contouring'),
    (:vf2ss_5x_id, '5-axis_simultaneous');

INSERT INTO equipment_fixtures (equipment_id, fixture_type) VALUES
    (:vf2ss_5x_id, 'tombstone'),
    (:vf2ss_5x_id, 'trunnion'),
    (:vf2ss_5x_id, 'custom_plate');

INSERT INTO equipment_preferences (equipment_id, preference) VALUES
    (:vf2ss_5x_id, 'complex_geometry'),
    (:vf2ss_5x_id, 'aerospace'),
    (:vf2ss_5x_id, 'tight_tolerance');

-- 5. Haas DT-1
INSERT INTO equipment (
    machine_id, name, type, location, status, controller,
    work_envelope_mm, max_spindle_speed_rpm, tool_changer_capacity,
    setup_time_min, typical_cycle_time_multiplier, estimated_hourly_rate_usd,
    notes
) VALUES (
    'HAAS_DT1_001',
    'Haas DT-1',
    'Drill/Tap Center',
    'Bay 3',
    'available',
    'Haas Next Gen',
    '{"x": 508, "y": 406, "z": 394}',
    10000,
    20,
    30,
    0.8,
    70,
    'High-speed drill and tap center'
) RETURNING id AS dt1_id \gset

INSERT INTO equipment_operations (equipment_id, operation) VALUES
    (:dt1_id, 'drilling'),
    (:dt1_id, 'tapping'),
    (:dt1_id, 'reaming'),
    (:dt1_id, 'light_milling');

INSERT INTO equipment_fixtures (equipment_id, fixture_type) VALUES
    (:dt1_id, 'vise'),
    (:dt1_id, 'custom_plate');

INSERT INTO equipment_preferences (equipment_id, preference) VALUES
    (:dt1_id, 'high_volume_drilling'),
    (:dt1_id, 'fast_setup');

-- 6. Haas Super Mini-Mill #1
INSERT INTO equipment (
    machine_id, name, type, location, status, controller,
    work_envelope_mm, max_spindle_speed_rpm, tool_changer_capacity,
    setup_time_min, typical_cycle_time_multiplier, estimated_hourly_rate_usd,
    notes
) VALUES (
    'HAAS_MINIMILL_001',
    'Haas Super Mini-Mill #1',
    'Compact 3-Axis Mill',
    'Bay 3',
    'available',
    'Haas',
    '{"x": 406, "y": 305, "z": 254}',
    10000,
    10,
    30,
    0.9,
    65,
    'Compact mill for small parts and prototypes'
) RETURNING id AS mini1_id \gset

INSERT INTO equipment_operations (equipment_id, operation) VALUES
    (:mini1_id, 'milling'),
    (:mini1_id, 'drilling'),
    (:mini1_id, 'tapping');

INSERT INTO equipment_fixtures (equipment_id, fixture_type) VALUES
    (:mini1_id, 'vise'),
    (:mini1_id, 'custom_plate');

INSERT INTO equipment_preferences (equipment_id, preference) VALUES
    (:mini1_id, 'small_parts'),
    (:mini1_id, 'prototype');

-- 7. Haas Super Mini-Mill #2
INSERT INTO equipment (
    machine_id, name, type, location, status, controller,
    work_envelope_mm, max_spindle_speed_rpm, tool_changer_capacity,
    setup_time_min, typical_cycle_time_multiplier, estimated_hourly_rate_usd,
    notes
) VALUES (
    'HAAS_MINIMILL_002',
    'Haas Super Mini-Mill #2',
    'Compact 3-Axis Mill',
    'Bay 3',
    'available',
    'Haas',
    '{"x": 406, "y": 305, "z": 254}',
    10000,
    10,
    30,
    0.9,
    65,
    'Compact mill for small parts and prototypes'
) RETURNING id AS mini2_id \gset

INSERT INTO equipment_operations (equipment_id, operation) VALUES
    (:mini2_id, 'milling'),
    (:mini2_id, 'drilling'),
    (:mini2_id, 'tapping');

INSERT INTO equipment_fixtures (equipment_id, fixture_type) VALUES
    (:mini2_id, 'vise'),
    (:mini2_id, 'custom_plate');

INSERT INTO equipment_preferences (equipment_id, preference) VALUES
    (:mini2_id, 'small_parts'),
    (:mini2_id, 'prototype');

-- 8. Haas Super Mini-Mill #3
INSERT INTO equipment (
    machine_id, name, type, location, status, controller,
    work_envelope_mm, max_spindle_speed_rpm, tool_changer_capacity,
    setup_time_min, typical_cycle_time_multiplier, estimated_hourly_rate_usd,
    notes
) VALUES (
    'HAAS_MINIMILL_003',
    'Haas Super Mini-Mill #3',
    'Compact 3-Axis Mill',
    'Bay 3',
    'available',
    'Haas',
    '{"x": 406, "y": 305, "z": 254}',
    10000,
    10,
    30,
    0.9,
    65,
    'Compact mill for small parts and prototypes'
) RETURNING id AS mini3_id \gset

INSERT INTO equipment_operations (equipment_id, operation) VALUES
    (:mini3_id, 'milling'),
    (:mini3_id, 'drilling'),
    (:mini3_id, 'tapping');

INSERT INTO equipment_fixtures (equipment_id, fixture_type) VALUES
    (:mini3_id, 'vise'),
    (:mini3_id, 'custom_plate');

INSERT INTO equipment_preferences (equipment_id, preference) VALUES
    (:mini3_id, 'small_parts'),
    (:mini3_id, 'prototype');

-- =============================================
-- CNC TURNING MACHINES
-- =============================================

-- 9. DN Solutions Lynx 220
INSERT INTO equipment (
    machine_id, name, type, location, status, controller,
    max_spindle_speed_rpm, tool_changer_capacity,
    setup_time_min, typical_cycle_time_multiplier, estimated_hourly_rate_usd,
    notes
) VALUES (
    'LYNX_220_001',
    'DN Solutions Lynx 220',
    'CNC Lathe - Twin Spindle',
    'Bay 4',
    'available',
    'Fanuc',
    4000,
    12,
    45,
    1.1,
    95,
    'Twin-spindle lathe with live tooling, Y-axis travel, and LNS 12" bar feeder. Max turn diameter: 11.8"'
) RETURNING id AS lynx220_id \gset

INSERT INTO equipment_operations (equipment_id, operation) VALUES
    (:lynx220_id, 'turning'),
    (:lynx220_id, 'milling'),
    (:lynx220_id, 'drilling'),
    (:lynx220_id, 'tapping'),
    (:lynx220_id, 'boring');

INSERT INTO equipment_fixtures (equipment_id, fixture_type) VALUES
    (:lynx220_id, 'chuck'),
    (:lynx220_id, 'bar_feeder'),
    (:lynx220_id, 'collet');

INSERT INTO equipment_preferences (equipment_id, preference) VALUES
    (:lynx220_id, 'bar_stock'),
    (:lynx220_id, 'high_volume'),
    (:lynx220_id, 'complex_turned_parts');

-- 10. DN Solutions Lynx 2100
INSERT INTO equipment (
    machine_id, name, type, location, status, controller,
    max_spindle_speed_rpm, tool_changer_capacity,
    setup_time_min, typical_cycle_time_multiplier, estimated_hourly_rate_usd,
    notes
) VALUES (
    'LYNX_2100_001',
    'DN Solutions Lynx 2100',
    'CNC Lathe - Twin Spindle',
    'Bay 4',
    'available',
    'Fanuc',
    4000,
    12,
    45,
    1.1,
    95,
    'Twin-spindle lathe with live tooling and Y-axis travel. Max turn diameter: 11.8"'
) RETURNING id AS lynx2100_id \gset

INSERT INTO equipment_operations (equipment_id, operation) VALUES
    (:lynx2100_id, 'turning'),
    (:lynx2100_id, 'milling'),
    (:lynx2100_id, 'drilling'),
    (:lynx2100_id, 'tapping'),
    (:lynx2100_id, 'boring');

INSERT INTO equipment_fixtures (equipment_id, fixture_type) VALUES
    (:lynx2100_id, 'chuck'),
    (:lynx2100_id, 'collet');

INSERT INTO equipment_preferences (equipment_id, preference) VALUES
    (:lynx2100_id, 'complex_turned_parts'),
    (:lynx2100_id, 'high_precision');

-- 11. DN Solutions Puma 2600SY II
INSERT INTO equipment (
    machine_id, name, type, location, status, controller,
    max_spindle_speed_rpm, tool_changer_capacity,
    setup_time_min, typical_cycle_time_multiplier, estimated_hourly_rate_usd,
    notes
) VALUES (
    'PUMA_2600SY_001',
    'DN Solutions Puma 2600SY II',
    'CNC Lathe',
    'Bay 4',
    'available',
    'Fanuc',
    3500,
    12,
    50,
    1.0,
    90,
    '10" chuck lathe with Y-axis travel and live tooling. Max turn length: 30"'
) RETURNING id AS puma_id \gset

INSERT INTO equipment_operations (equipment_id, operation) VALUES
    (:puma_id, 'turning'),
    (:puma_id, 'milling'),
    (:puma_id, 'drilling'),
    (:puma_id, 'boring');

INSERT INTO equipment_fixtures (equipment_id, fixture_type) VALUES
    (:puma_id, 'chuck'),
    (:puma_id, 'collet');

INSERT INTO equipment_preferences (equipment_id, preference) VALUES
    (:puma_id, 'long_parts'),
    (:puma_id, 'larger_diameter');

-- 12. Haas SL-10
INSERT INTO equipment (
    machine_id, name, type, location, status, controller,
    max_spindle_speed_rpm, tool_changer_capacity,
    setup_time_min, typical_cycle_time_multiplier, estimated_hourly_rate_usd,
    notes
) VALUES (
    'HAAS_SL10_001',
    'Haas SL-10',
    'CNC Lathe',
    'Bay 4',
    'available',
    'Haas Next Gen',
    6000,
    12,
    40,
    0.95,
    75,
    'Compact lathe with 6.5" chuck size'
) RETURNING id AS sl10_id \gset

INSERT INTO equipment_operations (equipment_id, operation) VALUES
    (:sl10_id, 'turning'),
    (:sl10_id, 'drilling'),
    (:sl10_id, 'boring'),
    (:sl10_id, 'threading');

INSERT INTO equipment_fixtures (equipment_id, fixture_type) VALUES
    (:sl10_id, 'chuck'),
    (:sl10_id, 'collet');

INSERT INTO equipment_preferences (equipment_id, preference) VALUES
    (:sl10_id, 'small_parts'),
    (:sl10_id, 'fast_cycle');

-- =============================================
-- Link all machines to materials they support
-- =============================================

-- Get all material IDs
DO $$
DECLARE
    material_rec RECORD;
    equipment_rec RECORD;
BEGIN
    -- For each equipment
    FOR equipment_rec IN SELECT id FROM equipment LOOP
        -- Link to all common materials (all machines can handle these)
        FOR material_rec IN 
            SELECT id FROM materials WHERE category IN ('Aluminum', 'Steel', 'Stainless Steel', 'Copper Alloy')
        LOOP
            INSERT INTO equipment_materials (equipment_id, material_id) 
            VALUES (equipment_rec.id, material_rec.id)
            ON CONFLICT DO NOTHING;
        END LOOP;
        
        -- Milling machines can also handle Titanium and some exotics better
        IF equipment_rec.id IN (
            SELECT id FROM equipment WHERE type LIKE '%Mill%'
        ) THEN
            FOR material_rec IN 
                SELECT id FROM materials WHERE category IN ('Titanium', 'Exotic')
            LOOP
                INSERT INTO equipment_materials (equipment_id, material_id) 
                VALUES (equipment_rec.id, material_rec.id)
                ON CONFLICT DO NOTHING;
            END LOOP;
        END IF;
    END LOOP;
END $$;

-- Success message
SELECT 'Equipment data successfully inserted!' AS status;
SELECT COUNT(*) AS total_equipment FROM equipment;
SELECT COUNT(*) AS total_operations FROM equipment_operations;
SELECT COUNT(*) AS total_fixtures FROM equipment_fixtures;
SELECT COUNT(*) AS total_material_links FROM equipment_materials;
SELECT COUNT(*) AS total_preferences FROM equipment_preferences;
