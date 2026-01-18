-- Add capability analysis fields to existing quote_requests table
ALTER TABLE quote_requests 
ADD COLUMN IF NOT EXISTS in_house_feasibility VARCHAR(20),
ADD COLUMN IF NOT EXISTS machine_matches JSONB,
ADD COLUMN IF NOT EXISTS outsourced_steps JSONB,
ADD COLUMN IF NOT EXISTS capability_analysis JSONB,
ADD COLUMN IF NOT EXISTS review_status VARCHAR(50) DEFAULT 'pending_review';

-- Add index for review status
CREATE INDEX IF NOT EXISTS idx_review_status ON quote_requests(review_status);

-- Success message
SELECT 'Capability analysis fields added successfully' AS status;
