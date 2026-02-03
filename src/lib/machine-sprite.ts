/**
 * Machine sprite sheet mapping
 * Sprite layout: 6 columns × 2 rows
 */

export interface SpritePosition {
  col: number; // 0-5
  row: number; // 0-1
}

const SPRITE_MAP: Record<string, SpritePosition> = {
  // Row 1
  'DNM_4500_001': { col: 0, row: 0 },
  'DNM_4500_002': { col: 0, row: 0 }, // Same machine
  'VF2SS_001': { col: 1, row: 0 },
  'VF2SS_5AXIS_001': { col: 2, row: 0 },
  'OKUMA_MB4000H_001': { col: 3, row: 0 },
  'PUMA_2100SY_001': { col: 4, row: 0 },
  'UMC750_001': { col: 5, row: 0 },
  
  // Row 2
  'ST10_001': { col: 0, row: 1 },
  'ST10_002': { col: 0, row: 1 }, // Same machine
  'INTEGREX_200Y_001': { col: 1, row: 1 },
  'SPEEDIO_S700X1_001': { col: 2, row: 1 },
  'MAKINO_EDGE3_001': { col: 3, row: 1 },
};

/**
 * Get CSS background-position for a machine sprite
 * @param machineId - The machine_id from the database
 * @returns CSS background-position string or null if not found
 */
export function getMachineSpritePosition(machineId: string): string | null {
  const position = SPRITE_MAP[machineId];
  if (!position) return null;
  
  // Calculate percentage position
  // 6 columns means each is 20% wide (100% / 5 steps between 0-100)
  // 2 rows means each is 100% tall (100% / 1 step between 0-100)
  const xPercent = position.col * 20;
  const yPercent = position.row * 100;
  
  return `${xPercent}% ${yPercent}%`;
}

/**
 * Check if a machine has a sprite image
 */
export function hasMachineSprite(machineId: string): boolean {
  return machineId in SPRITE_MAP;
}
