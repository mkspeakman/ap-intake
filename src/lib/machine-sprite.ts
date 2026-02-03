/**
 * Machine image mapping - individual images
 */

const MACHINE_IMAGE_MAP: Record<string, string> = {
  // DNM 4500
  'DNM_4500_001': '/equipment/dnm-4500.jpg',
  'DNM_4500_002': '/equipment/dnm-4500.jpg',
  
  // Haas VF-2SS
  'HAAS_VF2SS_001': '/equipment/haas-vf2ss.jpg',
  
  // Haas VF-2SS 5-Axis
  'HAAS_VF2SS_5X_001': '/equipment/haas-vf2ss-5axis.jpg',
  
  // Haas DT-1
  'HAAS_DT1_001': '/equipment/haas-vf2ss.jpg', // Using VF2SS as placeholder
  
  // Haas Super Mini-Mills
  'HAAS_MINIMILL_001': '/equipment/haas-vf2ss.jpg',
  'HAAS_MINIMILL_002': '/equipment/haas-vf2ss.jpg',
  'HAAS_MINIMILL_003': '/equipment/haas-vf2ss.jpg',
  
  // Okuma MB-4000H
  'OKUMA_MB4000H_001': '/equipment/okuma-mb4000h.jpg',
  
  // Doosan Puma 2100SY
  'DOOSAN_PUMA2100SY_001': '/equipment/doosan-puma-2100sy.jpg',
  
  // Haas UMC-750 Gen 1
  'HAAS_UMC750_001': '/equipment/haas-umc750-gen1.jpg',
  
  // Haas UMC-750 Gen 2
  'HAAS_UMC750_002': '/equipment/haas-umc750-gen2.jpg',
  
  // Haas ST-10
  'HAAS_ST10_001': '/equipment/haas-st10.jpg',
  'HAAS_ST10_002': '/equipment/haas-st10.jpg',
  
  // Mazak Integrex 200Y
  'MAZAK_INTEGREX200Y_001': '/equipment/mazak-integrex-200y.jpg',
  
  // Brother Speedio
  'BROTHER_SPEEDIO_001': '/equipment/brother-speedio.jpg',
  
  // Makino Wire EDM
  'MAKINO_EDGE3_001': '/equipment/makino-wire-edm.jpg',
  
  // Makino Sinker EDM
  'MAKINO_SINKER_001': '/equipment/makino-sinker-edm.jpg',
};

/**
 * Get machine image URL
 * @param machineId - The machine_id from the database
 * @returns Image URL or null if not found
 */
export function getMachineImage(machineId: string): string | null {
  return MACHINE_IMAGE_MAP[machineId] || null;
}

/**
 * Check if a machine has an image
 */
export function hasMachineImage(machineId: string): boolean {
  return machineId in MACHINE_IMAGE_MAP;
}

// Legacy exports for backward compatibility
export const getMachineSpritePosition = getMachineImage;
export const hasMachineSprite = hasMachineImage;
