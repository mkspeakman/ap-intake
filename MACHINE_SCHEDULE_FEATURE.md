# Machine Schedule Insights Feature Flag

## Overview

This is a **prototype feature** that displays machine scheduling data in the quote history expanded view. It's controlled by a feature flag and designed to be easily enabled/disabled without code refactoring.

## Feature Flag Control

**File**: `src/lib/feature-flags.ts`

```typescript
export const FEATURE_FLAGS = {
  MACHINE_SCHEDULE_INSIGHTS: true, // Set to false to disable
} as const;
```

## Components

### 1. Feature Flag System
- **File**: `src/lib/feature-flags.ts`
- Centralized boolean flags for prototype features
- Easy to toggle on/off

### 2. Sample Data
- **File**: `public/data/sample-schedule.json`
- Static JSON file with sample machine schedule data
- No database changes required
- Can be replaced with real API endpoint later

### 3. Schedule Insights Component
- **File**: `src/components/MachineScheduleInsights.tsx`
- Standalone React component
- Displays:
  - Jobs scheduled for the current quote
  - Activity on machines that match the quote
  - Job statuses (scheduled, in_progress, complete, delayed)
  - Machine availability context

### 4. Integration
- **File**: `src/SubmissionHistory.tsx`
- Conditionally renders based on feature flag
- Appears below "Matched Equipment" section
- Clearly labeled as "PROTOTYPE"

## Data Structure

```typescript
interface ScheduleEntry {
  equipment_id: number;
  machine_name: string;
  job_name: string;
  quote_id: number;
  start_time: string;
  end_time: string;
  status: 'scheduled' | 'in_progress' | 'complete' | 'delayed';
  operation: string;
  part_count: number;
  estimated_hours: number;
}
```

## Usage

### To Enable
Set `MACHINE_SCHEDULE_INSIGHTS: true` in `src/lib/feature-flags.ts`

### To Disable
Set `MACHINE_SCHEDULE_INSIGHTS: false` in `src/lib/feature-flags.ts`

### To Remove Completely
1. Delete `src/lib/feature-flags.ts`
2. Delete `src/components/MachineScheduleInsights.tsx`
3. Delete `public/data/sample-schedule.json`
4. Remove import and conditional render from `src/SubmissionHistory.tsx`:
   ```tsx
   // Remove these lines:
   import { isFeatureEnabled } from '@/lib/feature-flags';
   import { MachineScheduleInsights } from '@/components/MachineScheduleInsights';
   
   // Remove this block:
   {isFeatureEnabled('MACHINE_SCHEDULE_INSIGHTS') && ...}
   ```

## Visual Indicators

The component includes visual cues that it's a prototype:
- Dashed blue border
- "🔧 Prototype: Machine Schedule Insights" header
- "Feature Flag" badge
- Blue/cyan color scheme to differentiate from production features

## Future Development

To make this production-ready:
1. Replace `/data/sample-schedule.json` with real API endpoint
2. Add database schema for machine schedules
3. Remove prototype styling and badges
4. Remove feature flag (make it always-on)
5. Add user preferences for showing/hiding
6. Add real-time updates via WebSocket

## Sample Data

The sample includes 30 schedule entries across:
- 4 machines (VF2SS, UMC750, Puma 2100SY, Makino EDM)
- 10 quotes (quote_id 1-10)
- Various statuses and time ranges
- February - April 2026 timeframe
