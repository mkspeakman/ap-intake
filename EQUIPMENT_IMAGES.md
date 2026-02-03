# Equipment Machine Images

This document describes the machine sprite sheet implementation.

## Sprite Sheet Implementation

The system uses a single sprite sheet image containing all machine photos for optimal performance and consistency.

### Sprite Sheet Layout

**File**: `public/equipment/machines-sprite.jpg`
**Grid**: 6 columns × 2 rows (12 machines total)
**Individual image size**: ~200px × 200px (approximate)

**Layout**:
```
Row 1: [0] DNM 4500  [1] Haas VF-2SS  [2] Haas VF-2SS 5-Axis  [3] Okuma MB-4000H  [4] Doosan Puma 2100SY  [5] Haas UMC-750
Row 2: [6] Haas ST-10  [7] Mazak Integrex 200Y  [8] Brother Speedio  [9] Makino EDM  [10] (unused)  [11] (unused)
```

### Machine ID Mapping

The sprite positions are mapped in `src/lib/machine-sprite.ts`:

| Machine ID | Position | Machine Name |
|------------|----------|--------------|
| DNM_4500_001 | Row 0, Col 0 | DN Solutions DNM 4500 #1 |
| DNM_4500_002 | Row 0, Col 0 | DN Solutions DNM 4500 #2 |
| VF2SS_001 | Row 0, Col 1 | Haas VF-2 SS |
| VF2SS_5AXIS_001 | Row 0, Col 2 | Haas VF-2 SS 5-Axis |
| OKUMA_MB4000H_001 | Row 0, Col 3 | Okuma MB-4000H |
| PUMA_2100SY_001 | Row 0, Col 4 | Doosan Puma 2100SY |
| UMC750_001 | Row 0, Col 5 | Haas UMC-750 |
| ST10_001 | Row 1, Col 0 | Haas ST-10 #1 |
| ST10_002 | Row 1, Col 0 | Haas ST-10 #2 |
| INTEGREX_200Y_001 | Row 1, Col 1 | Mazak Integrex i-200Y |
| SPEEDIO_S700X1_001 | Row 1, Col 2 | Brother Speedio S700X1 |
| MAKINO_EDGE3_001 | Row 1, Col 3 | Makino EDGE3 |

## Setup

1. **Save the sprite sheet** to `public/equipment/machines-sprite.jpg`
2. Images are automatically mapped and displayed for high-confidence matches (≥70%)

## Technical Details

### CSS Background Positioning

- **Background Size**: `600% 200%` (6 columns, 2 rows)
- **Position Calculation**: 
  - X: `col × 20%` (0%, 20%, 40%, 60%, 80%, 100%)
  - Y: `row × 100%` (0%, 100%)

### Display Features

- **Size**: 128×128px squares
- **Background**: White with subtle border
- **Fallback**: Machines without sprites display without image
- **Performance**: Single image load for all machines

## Updating the Sprite

To add or update machines:

1. Edit `src/lib/machine-sprite.ts` to add new machine ID mappings
2. Update the sprite sheet image with new machine photos
3. Ensure grid layout matches (6×2)
