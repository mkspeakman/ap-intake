# Equipment Machine Images

This document describes the machine image implementation for the quote history display.

## Individual Image Implementation

The system uses individual machine images for each piece of equipment. Images are displayed in the quote history for high-confidence equipment matches (≥70% confidence).

### Image Files

**Directory**: `public/equipment/`

Individual machine images:
- `dnm-4500.jpg` - DN Solutions DNM 4500
- `haas-vf2ss.jpg` - Haas VF-2 SS
- `haas-vf2ss-5axis.jpg` - Haas VF-2 SS 5-Axis
- `haas-st10.jpg` - Haas ST-10
- `haas-umc750-gen1.jpg` - Haas UMC-750 Gen 1
- `haas-umc750-gen2.jpg` - Haas UMC-750 Gen 2
- `okuma-mb4000h.jpg` - Okuma MB-4000H
- `doosan-puma-2100sy.jpg` - Doosan Puma 2100SY
- `mazak-integrex-200y.jpg` - Mazak Integrex 200Y
- `brother-speedio.jpg` - Brother Speedio S700X1
- `makino-wire-edm.jpg` - Makino Wire EDM
- `makino-sinker-edm.jpg` - Makino Sinker EDM

### Machine ID Mapping

The image URLs are mapped in `src/lib/machine-sprite.ts`:

| Machine ID | Image File | Machine Name |
|------------|------------|--------------|
| DNM_4500_001 | dnm-4500.jpg | DN Solutions DNM 4500 #1 |
| DNM_4500_002 | dnm-4500.jpg | DN Solutions DNM 4500 #2 |
| HAAS_VF2SS_001 | haas-vf2ss.jpg | Haas VF-2 SS |
| HAAS_VF2SS_5X_001 | haas-vf2ss-5axis.jpg | Haas VF-2 SS 5-Axis |
| HAAS_DT1_001 | haas-vf2ss.jpg | Haas DT-1 (placeholder) |
| HAAS_MINIMILL_001 | haas-vf2ss.jpg | Haas Super Mini-Mill #1 (placeholder) |
| HAAS_MINIMILL_002 | haas-vf2ss.jpg | Haas Super Mini-Mill #2 (placeholder) |
| HAAS_MINIMILL_003 | haas-vf2ss.jpg | Haas Super Mini-Mill #3 (placeholder) |
| OKUMA_MB4000H_001 | okuma-mb4000h.jpg | Okuma MB-4000H |
| DOOSAN_PUMA2100SY_001 | doosan-puma-2100sy.jpg | Doosan Puma 2100SY |
| HAAS_UMC750_001 | haas-umc750-gen1.jpg | Haas UMC-750 Gen 1 |
| HAAS_UMC750_002 | haas-umc750-gen2.jpg | Haas UMC-750 Gen 2 |
| HAAS_ST10_001 | haas-st10.jpg | Haas ST-10 #1 |
| HAAS_ST10_002 | haas-st10.jpg | Haas ST-10 #2 |
| MAZAK_INTEGREX200Y_001 | mazak-integrex-200y.jpg | Mazak Integrex i-200Y |
| BROTHER_SPEEDIO_001 | brother-speedio.jpg | Brother Speedio S700X1 |
| MAKINO_EDGE3_001 | makino-wire-edm.jpg | Makino Wire EDM |
| MAKINO_SINKER_001 | makino-sinker-edm.jpg | Makino Sinker EDM |

## Usage

Images are automatically displayed in the quote history when:
1. A machine match has ≥70% confidence
2. The machine_id has a corresponding image mapping
3. The image file exists in `public/equipment/`

## Technical Details

### Display Implementation

- **Component**: `src/SubmissionHistory.tsx`
- **Image Size**: 128px × 128px (w-32 h-32)
- **Display**: `object-contain` with 8px padding
- **Border**: Rounded with border 
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
