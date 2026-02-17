/**
 * Feature Flags
 * 
 * Centralized configuration for experimental/prototype features.
 * Toggle features on/off without code refactoring.
 */

export const FEATURE_FLAGS = {
  /**
   * Machine Schedule Insights (PROTOTYPE)
   * Shows scheduling data and machine availability in quote history
   */
  MACHINE_SCHEDULE_INSIGHTS: false,
} as const;

export type FeatureFlag = keyof typeof FEATURE_FLAGS;

/**
 * Check if a feature is enabled
 */
export function isFeatureEnabled(flag: FeatureFlag): boolean {
  return FEATURE_FLAGS[flag] ?? false;
}
