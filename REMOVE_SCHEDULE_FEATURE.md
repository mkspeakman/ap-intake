# How to Remove Machine Schedule Insights Feature Flag

This feature is designed to be easily discarded without refactoring. Follow these steps:

## Quick Disable (Keep code, just turn off)

**File**: `src/lib/feature-flags.ts`
```typescript
MACHINE_SCHEDULE_INSIGHTS: false, // Changed from true to false
```

## Complete Removal (Delete all code)

### Step 1: Delete Files
```bash
rm src/lib/feature-flags.ts
rm src/components/MachineScheduleInsights.tsx
rm public/data/sample-schedule.json
rm generate-schedule-data.js
rm MACHINE_SCHEDULE_FEATURE.md
rm REMOVE_SCHEDULE_FEATURE.md  # This file
```

### Step 2: Edit SubmissionHistory.tsx

**File**: `src/SubmissionHistory.tsx`

**Remove these import lines (marked with comments):**
```typescript
// FEATURE FLAG: Machine Schedule Insights - Remove these 2 lines to discard spike
import { isFeatureEnabled } from '@/lib/feature-flags';
import { MachineScheduleInsights } from '@/components/MachineScheduleInsights';
// END FEATURE FLAG
```

**Remove this entire block (marked with comments):**
```typescript
{/* FEATURE FLAG: Machine Schedule Insights - Remove this entire block to discard spike */}
{isFeatureEnabled('MACHINE_SCHEDULE_INSIGHTS') && 
 submission.machine_matches && 
 submission.machine_matches.length > 0 && (
  <MachineScheduleInsights 
    quoteId={submission.id}
    matchedMachineNames={submission.machine_matches.map(m => m.name)}
  />
)}
{/* END FEATURE FLAG */}
```

### Step 3: Test
```bash
npm run build
```

Should build successfully with no errors.

## What This Feature Doesn't Touch

✅ No database changes
✅ No API modifications  
✅ No changes to existing types
✅ No modifications to other components
✅ No authentication/RBAC changes
✅ No routing changes

## Verification

After removal, search the codebase to confirm no references remain:
```bash
grep -r "MachineScheduleInsights" src/
grep -r "feature-flags" src/
grep -r "MACHINE_SCHEDULE_INSIGHTS" src/
```

All should return no results.
