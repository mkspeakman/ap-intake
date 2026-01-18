/**
 * Vercel Serverless Function: Analyze Equipment Capability for Quote
 * POST /api/analyze-capability
 */

import { sql } from '@vercel/postgres';
import type { VercelRequest, VercelResponse } from '@vercel/node';
import type { JobRequirements, EquipmentData } from '../src/services/equipment-matching.service';

// Note: In serverless, we can't import from src directly, so we inline the matching logic
// or move it to /api folder

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { quote_id, materials, operations, quantity, certifications, dimensions, tolerances, description } = req.body;

    if (!quote_id) {
      return res.status(400).json({ error: 'quote_id is required' });
    }

    // VALIDATION: Check for insufficient data before running analysis
    const validationResult = validateRequest(req.body);
    if (!validationResult.isValid) {
      // Mark as insufficient data and return early
      const insufficientDataAnalysis = {
        feasibility_summary: validationResult.message,
        total_operations_required: 0,
        operations_matched: 0,
        operations_outsourced: 0,
        material_compatibility: false,
        tolerance_achievable: false,
        confidence_score: 0,
        validation_errors: validationResult.errors,
        analysis_timestamp: new Date().toISOString(),
      };

      await sql`
        UPDATE quote_requests 
        SET 
          in_house_feasibility = 'none',
          machine_matches = '[]'::jsonb,
          outsourced_steps = '[]'::jsonb,
          capability_analysis = ${JSON.stringify(insufficientDataAnalysis)},
          review_status = 'insufficient_data',
          updated_at = CURRENT_TIMESTAMP
        WHERE id = ${quote_id}
      `;

      return res.status(200).json({
        success: true,
        data: {
          quote_id,
          feasibility: 'none',
          machine_matches: [],
          outsourced_steps: [],
          analysis: insufficientDataAnalysis,
          validation_failed: true,
        },
      });
    }

    // Fetch all available equipment with their capabilities
    const equipment = await fetchEquipmentWithCapabilities();

    // Build job requirements
    const requirements: JobRequirements = {
      materials: materials || [],
      operations,
      quantity,
      certifications,
      dimensions,
      tolerances,
    };

    // Perform matching analysis
    const analysis = await matchEquipmentToJob(requirements, equipment);

    // Update the quote with analysis results
    await sql`
      UPDATE quote_requests 
      SET 
        in_house_feasibility = ${analysis.feasibility},
        machine_matches = ${JSON.stringify(analysis.matches)},
        outsourced_steps = ${JSON.stringify(analysis.outsourcedSteps)},
        capability_analysis = ${JSON.stringify(analysis.analysis)},
        review_status = ${analysis.feasibility === 'full' ? 'auto_matched' : 'pending_review'},
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ${quote_id}
    `;

    return res.status(200).json({
      success: true,
      data: {
        quote_id,
        feasibility: analysis.feasibility,
        machine_matches: analysis.matches,
        outsourced_steps: analysis.outsourcedSteps,
        analysis: analysis.analysis,
      },
    });
  } catch (error: any) {
    console.error('Error analyzing capability:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to analyze capability',
      details: error.message,
    });
  }
}

/**
 * Fetch all equipment with their full capabilities
 */
async function fetchEquipmentWithCapabilities(): Promise<EquipmentData[]> {
  const result = await sql`
    SELECT 
      e.id,
      e.machine_id,
      e.name,
      e.type,
      e.status,
      e.work_envelope_mm,
      e.min_tolerance_mm,
      e.setup_time_min,
      e.estimated_hourly_rate_usd,
      array_agg(DISTINCT eo.operation) FILTER (WHERE eo.operation IS NOT NULL) as operations,
      array_agg(DISTINCT m.name) FILTER (WHERE m.name IS NOT NULL) as materials,
      array_agg(DISTINCT ep.preference) FILTER (WHERE ep.preference IS NOT NULL) as preferred_for
    FROM equipment e
    LEFT JOIN equipment_operations eo ON e.id = eo.equipment_id
    LEFT JOIN equipment_materials em ON e.id = em.equipment_id
    LEFT JOIN materials m ON em.material_id = m.id
    LEFT JOIN equipment_preferences ep ON e.id = ep.equipment_id
    WHERE e.status = 'available'
    GROUP BY e.id
  `;

  return result.rows.map(row => ({
    ...row,
    operations: row.operations || [],
    materials: row.materials || [],
    preferred_for: row.preferred_for || [],
    work_envelope_mm: typeof row.work_envelope_mm === 'string' 
      ? JSON.parse(row.work_envelope_mm) 
      : row.work_envelope_mm,
  }));
}

/**
 * Equipment matching logic (inlined for serverless)
 */
async function matchEquipmentToJob(requirements: JobRequirements, availableEquipment: EquipmentData[]) {
  const matches: any[] = [];
  const matchedOperations = new Set<string>();
  const requiredOperations = requirements.operations || ['milling', 'drilling'];

  // Score each machine
  for (const machine of availableEquipment) {
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

      score.matchedOps.forEach((op: string) => matchedOperations.add(op));
    }
  }

  matches.sort((a, b) => b.match_score - a.match_score);

  const outsourcedSteps = requiredOperations.filter(op => !matchedOperations.has(op));

  // Add outsourced finishes/certifications
  if (requirements.certifications) {
    const outsourcedCerts = requirements.certifications.filter(c => 
      c.toLowerCase().includes('anodiz') || 
      c.toLowerCase().includes('plate') || 
      c.toLowerCase().includes('coat')
    );
    outsourcedSteps.push(...outsourcedCerts);
  }

  let feasibility: 'full' | 'partial' | 'none' = 'none';
  if (matches.length > 0) {
    if (outsourcedSteps.length === 0) {
      feasibility = 'full';
    } else if (matchedOperations.size > 0) {
      feasibility = 'partial';
    }
  }

  const analysis = {
    feasibility_summary: generateFeasibilitySummary(feasibility, matches, outsourcedSteps),
    total_operations_required: requiredOperations.length,
    operations_matched: matchedOperations.size,
    operations_outsourced: outsourcedSteps.length,
    material_compatibility: matches.some(m => m.matched_materials.length > 0),
    tolerance_achievable: true,
    estimated_setup_time_min: matches[0]?.match_score > 0 
      ? availableEquipment.find(e => e.machine_id === matches[0].machine_id)?.setup_time_min 
      : undefined,
    recommended_sequence: matches.slice(0, 3).map(m => m.name),
    confidence_score: matches.length > 0 ? Math.round(matches[0].match_score) : 0,
    analysis_timestamp: new Date().toISOString(),
  };

  return {
    feasibility,
    matches: matches.slice(0, 5),
    outsourcedSteps,
    analysis,
  };
}

function calculateMachineScore(machine: EquipmentData, requirements: JobRequirements) {
  let score = 0;
  const matchedOps: string[] = [];
  const matchedMats: string[] = [];
  const notes: string[] = [];

  // Material matching
  for (const reqMat of requirements.materials) {
    if (machine.materials.some(m => 
      m.toLowerCase().includes(reqMat.toLowerCase()) || 
      reqMat.toLowerCase().includes(m.toLowerCase())
    )) {
      matchedMats.push(reqMat);
      score += 30;
    }
  }

  // Operations matching
  const reqOps = requirements.operations || ['milling', 'drilling'];
  for (const reqOp of reqOps) {
    if (machine.operations.some(op => op.toLowerCase().includes(reqOp.toLowerCase()))) {
      matchedOps.push(reqOp);
      score += 20;
    }
  }

  // Work envelope check
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

  return {
    totalScore: Math.max(0, score),
    matchedOps,
    matchedMats,
    notes: notes.join('; '),
  };
}

function generateFeasibilitySummary(
  feasibility: string,
  matches: any[],
  outsourcedSteps: string[]
): string {
  if (feasibility === 'full') {
    return `✅ Fully manufacturable in-house. ${matches.length} compatible machine(s) identified.`;
  } else if (feasibility === 'partial') {
    return `⚠️ Partially manufacturable in-house. ${matches.length} machine(s) matched, but requires outsourcing: ${outsourcedSteps.join(', ')}.`;
  } else {
    return `❌ Cannot be manufactured in-house. Recommend vendor network.`;
  }
}

/**
 * Validate request has sufficient data for capability analysis
 */
function validateRequest(body: any): { isValid: boolean; message: string; errors: string[] } {
  const errors: string[] = [];
  
  // Check for materials
  if (!body.materials || body.materials.length === 0) {
    errors.push('No materials specified');
  }
  
  // Check for valid quantity
  if (!body.quantity || body.quantity <= 0 || !Number.isFinite(body.quantity)) {
    errors.push('Invalid or missing quantity');
  }
  
  // Check for manufacturing-related content in description
  const description = body.description || '';
  const manufacturingKeywords = [
    'machine', 'machining', 'cnc', 'mill', 'turn', 'lathe', 'drill',
    'part', 'parts', 'component', 'fabricate', 'fabrication', 'manufacture',
    'tolerance', 'surface', 'finish', 'material', 'aluminum', 'steel', 'titanium',
    'bracket', 'shaft', 'housing', 'plate', 'fixture', 'assembly'
  ];
  
  const hasManufacturingContext = manufacturingKeywords.some(keyword => 
    description.toLowerCase().includes(keyword)
  );
  
  if (!hasManufacturingContext && description.length < 20) {
    errors.push('Description lacks manufacturing context or details');
  }
  
  // Determine if request is valid
  const isValid = errors.length === 0;
  
  let message = '';
  if (!isValid) {
    message = `⚠️ Insufficient data for capability analysis: ${errors.join(', ')}. Please provide complete manufacturing specifications.`;
  }
  
  return { isValid, message, errors };
}
