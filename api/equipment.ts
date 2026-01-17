/**
 * Vercel Serverless Function: Get Equipment/Machines (Read-Only)
 * GET /api/equipment - Get all equipment
 * GET /api/equipment?id=1 - Get specific equipment by ID
 * GET /api/equipment?machine_id=HAAS_VF2SS_001 - Get by machine_id
 */

import { sql } from '@vercel/postgres';
import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ 
      success: false, 
      error: 'Method not allowed. Only GET is supported.' 
    });
  }

  try {
    const { id, machine_id, status, type } = req.query;

    // Get specific equipment by ID
    if (id) {
      const equipment = await getEquipmentById(Number(id));
      if (!equipment) {
        return res.status(404).json({ success: false, error: 'Equipment not found' });
      }
      return res.status(200).json({ success: true, data: equipment });
    }

    // Get specific equipment by machine_id
    if (machine_id) {
      const equipment = await getEquipmentByMachineId(String(machine_id));
      if (!equipment) {
        return res.status(404).json({ success: false, error: 'Equipment not found' });
      }
      return res.status(200).json({ success: true, data: equipment });
    }

    // Get all equipment with optional filters
    const equipment = await getAllEquipment({
      status: status as string,
      type: type as string,
    });

    return res.status(200).json({ 
      success: true, 
      data: equipment,
      count: equipment.length 
    });

  } catch (error) {
    console.error('Error fetching equipment:', error);
    return res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch equipment',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}

// Helper function to get equipment by ID with all relations
async function getEquipmentById(id: number) {
  const result = await sql`
    SELECT * FROM equipment WHERE id = ${id}
  `;

  if (result.rows.length === 0) return null;

  return await enrichEquipmentWithRelations(result.rows[0]);
}

// Helper function to get equipment by machine_id
async function getEquipmentByMachineId(machineId: string) {
  const result = await sql`
    SELECT * FROM equipment WHERE machine_id = ${machineId}
  `;

  if (result.rows.length === 0) return null;

  return await enrichEquipmentWithRelations(result.rows[0]);
}

// Helper function to get all equipment with filters
async function getAllEquipment(filters: { status?: string; type?: string }) {
  let query = 'SELECT * FROM equipment WHERE 1=1';
  const params: any[] = [];

  if (filters.status) {
    params.push(filters.status);
    query += ` AND status = $${params.length}`;
  }

  if (filters.type) {
    params.push(filters.type);
    query += ` AND type = $${params.length}`;
  }

  query += ' ORDER BY name';

  const result = await sql.query(query, params);

  // Enrich each equipment with relations
  return Promise.all(
    result.rows.map(row => enrichEquipmentWithRelations(row))
  );
}

// Helper function to add related data (operations, fixtures, materials, preferences)
async function enrichEquipmentWithRelations(equipment: any) {
  const equipmentId = equipment.id;

  // Get operations
  const operations = await sql`
    SELECT operation FROM equipment_operations WHERE equipment_id = ${equipmentId}
  `;

  // Get fixture types
  const fixtures = await sql`
    SELECT fixture_type FROM equipment_fixtures WHERE equipment_id = ${equipmentId}
  `;

  // Get materials (join with materials table for names)
  const materials = await sql`
    SELECT m.name FROM equipment_materials em
    JOIN materials m ON em.material_id = m.id
    WHERE em.equipment_id = ${equipmentId}
  `;

  // Get preferences
  const preferences = await sql`
    SELECT preference FROM equipment_preferences WHERE equipment_id = ${equipmentId}
  `;

  // Parse JSON fields
  const work_envelope_mm = equipment.work_envelope_mm 
    ? JSON.parse(equipment.work_envelope_mm) 
    : null;

  const runtime_metrics = equipment.runtime_metrics 
    ? JSON.parse(equipment.runtime_metrics) 
    : null;

  return {
    id: equipment.id,
    machine_id: equipment.machine_id,
    name: equipment.name,
    type: equipment.type,
    location: equipment.location,
    status: equipment.status,
    controller: equipment.controller,
    work_envelope_mm,
    max_spindle_speed_rpm: equipment.max_spindle_speed_rpm,
    tool_changer_capacity: equipment.tool_changer_capacity,
    max_part_weight_kg: equipment.max_part_weight_kg ? parseFloat(equipment.max_part_weight_kg) : null,
    min_tolerance_mm: equipment.min_tolerance_mm ? parseFloat(equipment.min_tolerance_mm) : null,
    coolant_type: equipment.coolant_type,
    probes_installed: equipment.probes_installed,
    operations: operations.rows.map(r => r.operation),
    fixture_types: fixtures.rows.map(r => r.fixture_type),
    materials: materials.rows.map(r => r.name),
    preferred_for: preferences.rows.map(r => r.preference),
    setup_time_min: equipment.setup_time_min,
    typical_cycle_time_multiplier: equipment.typical_cycle_time_multiplier ? parseFloat(equipment.typical_cycle_time_multiplier) : null,
    estimated_hourly_rate_usd: equipment.estimated_hourly_rate_usd ? parseFloat(equipment.estimated_hourly_rate_usd) : null,
    last_calibrated: equipment.last_calibrated,
    runtime_metrics,
    notes: equipment.notes,
    created_at: equipment.created_at,
    updated_at: equipment.updated_at,
  };
}
