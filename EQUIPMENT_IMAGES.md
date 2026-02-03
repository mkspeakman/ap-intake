# Equipment Machine Images

This document describes how to add authentic machine photos to the equipment database.

## Image Requirements

- **Size**: 128x128 pixels minimum (square aspect ratio)
- **Format**: JPG or PNG
- **Background**: White seamless background preferred
- **Quality**: High-resolution product photos showing the actual machine
- **Style**: Professional product photography

## Setup Steps

### 1. Add Images to Public Folder

Create an `equipment` directory in the `public` folder and add machine images:

```
public/
  equipment/
    dnm-4500.jpg
    haas-vf2ss.jpg
    haas-vf2ss-5axis.jpg
    okuma-mb4000h.jpg
    doosan-puma-2100sy.jpg
    haas-st10.jpg
    mazak-integrex-200y.jpg
    brother-speedio.jpg
    makino-edm.jpg
    haas-umc750.jpg
```

### 2. Update Database

Run the SQL migration to add the `image_url` column and populate URLs:

```sql
-- Run this in your Vercel Postgres console or via migrations
\i database/add-equipment-images.sql
```

Or manually:

```sql
ALTER TABLE equipment ADD COLUMN IF NOT EXISTS image_url TEXT;

UPDATE equipment SET image_url = '/equipment/dnm-4500.jpg' WHERE machine_id = 'DNM_4500_001';
UPDATE equipment SET image_url = '/equipment/dnm-4500.jpg' WHERE machine_id = 'DNM_4500_002';
-- ... (see add-equipment-images.sql for full list)
```

### 3. Image Sources

**Recommended sources for authentic machine photos:**

1. **Manufacturer websites** - Official product pages often have high-quality photos
2. **Direct from manufacturers** - Contact sales/marketing for press kit images
3. **Equipment dealer websites** - Used equipment dealers often have actual photos
4. **Your own photos** - Take professional photos of your actual machines

**Specific manufacturer links:**

- DN Solutions: https://www.dnsolutions.com
- Haas: https://www.haascnc.com
- Okuma: https://www.okuma.com
- Doosan: https://www.doosanmachinetools.com
- Mazak: https://www.mazak.com
- Brother: https://www.brother.com/machine-tools
- Makino: https://www.makino.com

### 4. Image Processing

To create consistent images with white backgrounds:

```bash
# Using ImageMagick
convert input.jpg -resize 128x128^ -gravity center -extent 128x128 -background white -flatten output.jpg

# Using online tools
# - remove.bg (background removal)
# - Photopea (free Photoshop alternative)
# - Canva (add white background)
```

### 5. Placeholder Images

If actual photos aren't available yet, you can:

1. Use manufacturer stock photos temporarily
2. Use generic machine type illustrations
3. Leave `image_url` null - the UI will gracefully hide missing images

## Current Machine List

| Machine ID | Machine Name | Type | Image Status |
|------------|--------------|------|--------------|
| DNM_4500_001 | DN Solutions DNM 4500 #1 | 3-Axis Vertical Mill | ⚠️ Needs photo |
| DNM_4500_002 | DN Solutions DNM 4500 #2 | 3-Axis Vertical Mill | ⚠️ Needs photo |
| VF2SS_001 | Haas VF-2 SS | 3-Axis Vertical Mill | ⚠️ Needs photo |
| VF2SS_5AXIS_001 | Haas VF-2 SS 5-Axis | 5-Axis Vertical Mill | ⚠️ Needs photo |
| OKUMA_MB4000H_001 | Okuma MB-4000H | Horizontal Mill | ⚠️ Needs photo |
| PUMA_2100SY_001 | Doosan Puma 2100SY | CNC Lathe with Y-axis | ⚠️ Needs photo |
| ST10_001 | Haas ST-10 #1 | CNC Lathe | ⚠️ Needs photo |
| ST10_002 | Haas ST-10 #2 | CNC Lathe | ⚠️ Needs photo |
| INTEGREX_200Y_001 | Mazak Integrex i-200Y | Mill-Turn Center | ⚠️ Needs photo |
| SPEEDIO_S700X1_001 | Brother Speedio S700X1 | High-Speed 3-Axis Mill | ⚠️ Needs photo |
| MAKINO_EDGE3_001 | Makino EDGE3 | Wire EDM | ⚠️ Needs photo |
| UMC750_001 | Haas UMC-750 | 5-Axis Universal Mill | ⚠️ Needs photo |

## Frontend Implementation

The images are displayed in the high-confidence machine match cards (≥70% match score). Features:

- **Graceful fallback**: Images that fail to load are automatically hidden
- **Responsive**: 128x128px square maintains consistency
- **White background**: Matches Swiss design aesthetic
- **Border**: Subtle border for definition

## Testing

After adding images:

1. Test locally: `npm run dev`
2. Navigate to Submission History
3. Expand a quote with capability analysis
4. Verify images appear for high-confidence matches
5. Check that missing images don't break the layout

## Notes

- Images are served from `/public/equipment/` directory
- URLs are stored in database as `/equipment/filename.jpg`
- Frontend uses `onError` handler to gracefully hide broken images
- No image = card layout adapts (no empty space)
