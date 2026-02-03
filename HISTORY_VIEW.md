# Submission History View

## Overview

The submission history page provides a comprehensive view of all manufacturing quote requests with advanced filtering, equipment capability analysis, and detailed submission information.

## Features

### Core Functionality
1. **Quote List View**
   - Full-width responsive table
   - Click to expand for detailed analysis
   - Real-time data from Postgres database

2. **Equipment Capability Analysis**
   - AI-powered machine matching
   - Cost estimation (material + machining)
   - Lead time calculation
   - Material difficulty assessment
   - Risk flags for exotic materials
   - Shows up to 12 matched machines

3. **Search & Filters**
   - Search by company, project, quote number
   - Filter by date range, status, materials
   - Real-time filtering

4. **Expandable Details**
   - Manufacturing capability analysis
   - Cost estimates with breakdown
   - Lead time (setup + production + queue)
   - Material difficulty flags
   - Risk warnings
   - Operations matched
   - Contact information
   - Project specifications

5. **Admin Actions** (Admin/Superadmin only)
   - View Details dialog (Swiss-style typography)
   - Re-analyze capability (rerun analysis with current data)

### Status Indicators
- **Pending** - Awaiting review
- **Auto Matched** - Full in-house capability
- **Partial** - Requires outsourcing
- **Insufficient Data** - Missing required information
- **Manual Review** - Requires engineering assessment

## Component Structure

### Main Components
- **SubmissionHistory.tsx** - Main container with search/filter/table
- **Equipment Analysis Section** - Capability analysis display
- **Cost Estimate Card** - Material + machining costs
- **Lead Time Card** - Production timeline
- **Material Difficulty Card** - Risk assessment
- **Machine Matches Grid** - Compatible equipment list
- **Details Dialog** - Clean text-based submission view

### Display Sections

#### 1. Capability Analysis
Shows when available:
- Feasibility summary
- Risk flags (amber warning card)
- Material difficulty (blue info card for non-standard materials)
- Cost estimate (green card with breakdown)
- Lead time estimate (purple card with timeline)
- Operations matched (green badges)
- Machine matches (grid of up to 12 machines)
- Outsourced steps (orange badges)
- Quick stats (operations, confidence, setup time)

#### 2. Contact & Specifications
Two-column layout:
- Contact information (email, phone, company)
- Project specifications (materials, finishes, quantity)

## API Integration

### Endpoints Used
- `GET /api/quote-requests` - Fetch all submissions
  - Returns: quotes with materials, finishes, certifications (via SQL joins)
- `POST /api/analyze-capability` - Re-run capability analysis
  - Body: `{ quote_id, materials, quantity, certifications, description }`

### Data Structure
```typescript
interface Submission {
  id: number;
  quote_number: string;
  status: string;
  company_name: string | null;
  materials: string[];
  finishes: string[];
  certifications: string[];
  capability_analysis?: {
    feasibility_summary: string;
    cost_estimate?: CostEstimate;
    lead_time_estimate?: LeadTimeEstimate;
    material_difficulty?: MaterialDifficulty;
    risk_flags?: string[];
    operations_list?: string[];
    confidence_score: number;
  };
  machine_matches?: MachineMatch[];
}
```

## Recent Improvements (Feb 2, 2026)

### Enhanced Capability Analysis
- ✅ Cost estimation with material + machining breakdown
- ✅ Lead time calculation (setup + production + queue)
- ✅ Material difficulty ratings (Standard/Moderate/Difficult/Exotic)
- ✅ Risk flags for difficult materials and certifications
- ✅ Operations list display
- ✅ All matched machines shown (up to 12, was 5)

### Fixed Issues
- ✅ Materials/finishes now properly retrieved from database
- ✅ Dialog close button has visible X icon
- ✅ Null checks prevent crashes on missing data
- ✅ Page refresh maintains correct route

### Value Improvement
**Before:** 4/10 - Basic feasibility only  
**After:** 8/10 - Full decision-making data

Engineering managers can now answer:
1. ✅ Can we make it?
2. ✅ What will it cost?
3. ✅ When can we deliver?
4. ✅ What are the risks?
5. ✅ Which machines can do it?

## Permissions

- **Guest/Viewer:** Cannot access
- **Client:** View own submissions only
- **Team Member:** View all submissions
- **Admin/Superadmin:** View all + Re-analyze capability

## Routing

- **URL:** `/history`
- **Type:** Browser history mode (clean URLs)
- **Protected:** Yes (requires authentication)
- **Fallback:** Redirects to home if unauthorized
