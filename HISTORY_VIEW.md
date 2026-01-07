# Submission History View - Frontend Mockup

## Overview

This is a frontend mockup of the submission history page, built to match the design language of the existing form.

## URLs

- **Form:** `http://localhost:5173/` or `http://localhost:5173/#/`
- **History:** `http://localhost:5173/#/history`

## Design Elements

### Layout
- **Full-width card** (max-width 7xl) for larger data display
- **Same Card/CardContent structure** as the form
- **Consistent spacing** (p-4, p-6, space-y-4)

### Components Used
- **Table** - Clean data grid with hover states
- **Badge** - Status indicators with color variants
- **Input** - Search bar with icon
- **Button** - Actions (outline variant for secondary)
- **Icons** - Lucide icons matching form style

### Features in Mockup

1. **Header Section**
   - Title and description
   - Filter button (placeholder)

2. **Search Bar**
   - Full-width search with icon
   - Placeholder suggests searchable fields

3. **Stats Summary**
   - 4-card grid showing key metrics
   - Muted background for subtle emphasis

4. **Data Table**
   - Quote number (monospace font)
   - Company with icon and contact
   - Project name with icon
   - Quantity
   - Status badge (color-coded)
   - Submission date with icon
   - Google Drive link (when available)
   - Expand/collapse indicator

5. **Expandable Rows**
   - Click row to expand details
   - Shows contact info, materials, finishes, certifications
   - Action buttons for detail view and Drive access

6. **Pagination**
   - Placeholder for future implementation
   - Shows result count

### Status Colors
- **Pending** - Secondary (gray)
- **In Progress** - Warning (yellow)
- **Quoted** - Default (blue)
- **Completed** - Success (green)

### Mock Data
4 sample submissions with varied:
- Companies and projects
- Materials (Aluminum, Steel, Titanium, etc.)
- Finishes (Anodized, Powder Coat, etc.)
- Certifications (ISO, ITAR, AS9100, etc.)
- Statuses

## Next Steps

1. **Connect to API** - Replace mock data with `/api/quote-requests` endpoint
2. **Implement search** - Filter by company, project, quote number
3. **Add filters** - Date range, status, materials, certifications
4. **Detail modal** - Full submission view with all fields
5. **Pagination** - Handle large datasets
6. **Navigation** - Add app shell with nav between form and history
7. **Sorting** - Click column headers to sort
8. **Real-time updates** - WebSocket or polling for status changes

## Style Consistency

All styles match the form:
- ✅ Same color palette (muted, primary, secondary)
- ✅ Same typography (font-bold for headers, text-sm for body)
- ✅ Same spacing system (gap-2, gap-4, space-y-4)
- ✅ Same dark/light mode support
- ✅ Same icon usage (Lucide React)
- ✅ Same component patterns (Card, Button, Badge)
