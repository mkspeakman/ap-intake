-- Add image_url column to equipment table
ALTER TABLE equipment ADD COLUMN IF NOT EXISTS image_url TEXT;

-- Update equipment with image URLs
-- These should be authentic photos of the actual machines with white seamless backgrounds
-- For now using placeholder structure - replace with actual image URLs when available

UPDATE equipment SET image_url = '/equipment/dnm-4500.jpg' WHERE machine_id = 'DNM_4500_001';
UPDATE equipment SET image_url = '/equipment/dnm-4500.jpg' WHERE machine_id = 'DNM_4500_002';
UPDATE equipment SET image_url = '/equipment/haas-vf2ss.jpg' WHERE machine_id = 'VF2SS_001';
UPDATE equipment SET image_url = '/equipment/haas-vf2ss-5axis.jpg' WHERE machine_id = 'VF2SS_5AXIS_001';
UPDATE equipment SET image_url = '/equipment/okuma-mb4000h.jpg' WHERE machine_id = 'OKUMA_MB4000H_001';
UPDATE equipment SET image_url = '/equipment/doosan-puma-2100sy.jpg' WHERE machine_id = 'PUMA_2100SY_001';
UPDATE equipment SET image_url = '/equipment/haas-st10.jpg' WHERE machine_id = 'ST10_001';
UPDATE equipment SET image_url = '/equipment/haas-st10.jpg' WHERE machine_id = 'ST10_002';
UPDATE equipment SET image_url = '/equipment/mazak-integrex-200y.jpg' WHERE machine_id = 'INTEGREX_200Y_001';
UPDATE equipment SET image_url = '/equipment/brother-speedio.jpg' WHERE machine_id = 'SPEEDIO_S700X1_001';
UPDATE equipment SET image_url = '/equipment/makino-edm.jpg' WHERE machine_id = 'MAKINO_EDGE3_001';
UPDATE equipment SET image_url = '/equipment/haas-umc750.jpg' WHERE machine_id = 'UMC750_001';
