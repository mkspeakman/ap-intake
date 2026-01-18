/**
 * Equipment Matching Service
 * Analyzes job requirements and matches them against available equipment
 */

import type { MachineMatch, CapabilityAnalysis } from '@/types/database.types';

export interface JobRequirements {
  materials: string[];
  operations?: string[];
  tolerances?: {
    min_tolerance_mm?: number;
  };
  dimensions?: {
    x?: number;
    y?: number;
    z?: number;
  };
  quantity?: string;
  certifications?: string[];
}

export interface EquipmentData {
  id: number;
  machine_id: string;
  name: string;
  type: string;
  status: string;
  operations: string[];
  materials: string[];
  preferred_for: string[];
  work_envelope_mm?: { x: number; y: number; z: number };
  min_tolerance_mm?: number;
  setup_time_min?: number;
  estimated_hourly_rate_usd?: number;
}

/**
 * Main function to match job requirements against equipment
 */
export async function matchEquipmentToJob(
  requirements: JobRequirements,
  availableEquipment: EquipmentData[]
): Promise<{
  feasibility: 'full' | 'partial' | 'none';
  matches: MachineMatch[];
  outsourcedSteps: string[];
  analysis: CapabilityAnalysis;
}> {
  const matches: MachineMatch[] = [];
  const matchedOperations = new Set<string>();
  const requiredOperations = requirements.operations || inferOperationsFromMaterials(requirements.materials);

  // Score each machine
  for (const machine of availableEquipment) {
    if (machine.status !== 'available') continue;

    const score = calculateMachineScore(machine, requirements);
    
    if (score.totalScore > 0) {
      matches.push({
        machine_id: machine.machine_id,
        name: machine.name,
        match_score: score.totalScore,
        matched_operations: score.matchedOps,
        matched_materials: score.matchedMats,
        notes: score.notes,
      });

      // Track what operations we can handle
      score.matchedOps.forEach(op => matchedOperations.add(op));
    }
  }

  // Sort by score (highest first)
  matches.sort((a, b) => b.match_score - a.match_score);

  // Determine what needs outsourcing
  const outsourcedSteps = requiredOperations.filter(op => !matchedOperations.has(op));

  // Add common outsourced processes if certifications/finishes require them
  if (requirements.certifications?.some(c => c.toLowerCase().includes('anodiz'))) {
    outsourcedSteps.push('anodizing');
  }

  // Determine overall feasibility
  let feasibility: 'full' | 'partial' | 'none' = 'none';
  if (matches.length > 0) {
    if (outsourcedSteps.length === 0) {
      feasibility = 'full';
    } else if (matchedOperations.size > 0) {
      feasibility = 'partial';
    }
  }

  // Build analysis
  const analysis: CapabilityAnalysis = {
    feasibility_summary: generateFeasibilitySummary(feasibility, matches, outsourcedSteps),
    total_operations_required: requiredOperations.length,
    operations_matched: matchedOperations.size,
    operations_outsourced: outsourcedSteps.length,
    material_compatibility: matches.some(m => m.matched_materials.length > 0),
    tolerance_achievable: evaluateToleranceCapability(requirements, matches),
    estimated_setup_time_min: matches[0]?.match_score > 0 
      ? availableEquipment.find(e => e.machine_id === matches[0].machine_id)?.setup_time_min 
      : undefined,
    recommended_sequence: matches.slice(0, 3).map(m => m.name),
    confidence_score: calculateConfidenceScore(matches, requiredOperations.length),
    analysis_timestamp: new Date().toISOString(),
  };

  return {
    feasibility,
    matches: matches.slice(0, 5), // Top 5 matches
    outsourcedSteps,
    analysis,
  };
}

/**
 * Calculate match score for a single machine
 */
function calculateMachineScore(
  machine: EquipmentData,
  requirements: JobRequirements
): {
  totalScore: number;
  matchedOps: string[];
  matchedMats: string[];
  notes: string;
} {
  let score = 0;
  const matchedOps: string[] = [];
  const matchedMats: string[] = [];
  const notes: string[] = [];

  // Check material compatibility (high weight)
  for (const reqMat of requirements.materials) {
    if (machine.materials.some(m => 
      m.toLowerCase().includes(reqMat.toLowerCase()) || 
      reqMat.toLowerCase().includes(m.toLowerCase())
    )) {
      matchedMats.push(reqMat);
      score += 30;
    }
  }

  // Check operations (medium-high weight)
  const reqOps = requirements.operations || inferOperationsFromMaterials(requirements.materials);
  for (const reqOp of reqOps) {
    if (machine.operations.some(op => op.toLowerCase().includes(reqOp.toLowerCase()))) {
      matchedOps.push(reqOp);
      score += 20;
    }
  }

  // Check work envelope if dimensions provided
  if (requirements.dimensions && machine.work_envelope_mm) {
    const fitsEnvelope = 
      (!requirements.dimensions.x || requirements.dimensions.x <= machine.work_envelope_mm.x) &&
      (!requirements.dimensions.y || requirements.dimensions.y <= machine.work_envelope_mm.y) &&
      (!requirements.dimensions.z || requirements.dimensions.z <= machine.work_envelope_mm.z);
    
    if (fitsEnvelope) {
      score += 15;
      notes.push('Part fits work envelope');
    } else {
      score -= 20;
      notes.push('⚠️ Part may exceed work envelope');
    }
  }

  // Check tolerance capability
  if (requirements.tolerances?.min_tolerance_mm && machine.min_tolerance_mm) {
    if (machine.min_tolerance_mm <= requirements.tolerances.min_tolerance_mm) {
      score += 10;
      notes.push('Tolerance achievable');
    } else {
      score -= 10;
      notes.push('⚠️ Tolerance may be challenging');
    }
  }

  // Bonus for preferred applications
  if (requirements.quantity) {
    const qty = parseInt(requirements.quantity);
    if (qty > 100 && machine.preferred_for.includes('high_volume')) {
      score += 5;
      notes.push('Well-suited for volume');
    } else if (qty < 10 && machine.preferred_for.includes('prototype')) {
      score += 5;
      notes.push('Good for prototypes');
    }
  }

  return {
    totalScore: Math.max(0, score),
    matchedOps,
    matchedMats,
    notes: notes.join('; '),
  };
}

/**
 * Infer likely operations from materials (basic heuristic)
 */
function inferOperationsFromMaterials(materials: string[]): string[] {
  const ops = ['milling', 'drilling'];
  
  // If materials suggest turned parts
  if (materials.some(m => m.toLowerCase().includes('shaft') || m.toLowerCase().includes('rod'))) {
    ops.push('turning');
  }
  
  return ops;
}

/**
 * Evaluate if tolerances are achievable
 */
function evaluateToleranceCapability(
  requirements: JobRequirements,
  matches: MachineMatch[]
): boolean {
  if (!requirements.tolerances?.min_tolerance_mm) return true;
  return matches.some(m => m.match_score > 50); // Assume high-scoring machines can handle it
}

/**
 * Generate human-readable feasibility summary
 */
function generateFeasibilitySummary(
  feasibility: 'full' | 'partial' | 'none',
  matches: MachineMatch[],
  outsourcedSteps: string[]
): string {
  if (feasibility === 'full') {
    return `✅ Fully manufacturable in-house. ${matches.length} compatible machine(s) identified.`;
  } else if (feasibility === 'partial') {
    return `⚠️ Partially manufacturable in-house. ${matches.length} machine(s) matched, but requires outsourcing: ${outsourcedSteps.join(', ')}.`;
  } else {
    return `❌ Cannot be manufactured in-house. Recommend vendor network. Missing capabilities: ${outsourcedSteps.join(', ')}.`;
  }
}

/**
 * Calculate overall confidence in the analysis
 */
function calculateConfidenceScore(matches: MachineMatch[], requiredOpsCount: number): number {
  if (matches.length === 0) return 0;
  
  const avgScore = matches.reduce((sum, m) => sum + m.match_score, 0) / matches.length;
  const coverageRatio = matches[0]?.matched_operations.length / Math.max(1, requiredOpsCount);
  
  return Math.min(100, Math.round((avgScore * 0.6 + coverageRatio * 40)));
}
