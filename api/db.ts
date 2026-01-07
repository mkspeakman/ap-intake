/**
 * Database configuration for development and production
 * 
 * - Development: Uses local SQLite (server/index.ts)
 * - Production: Uses Vercel Postgres (this file, deployed as serverless functions)
 */

import { sql } from '@vercel/postgres';

export async function query(text: string, params?: any[]) {
  const result = await sql.query(text, params);
  return result;
}

export async function getOrCreateMaterial(name: string, isCustom = false) {
  const result = await sql`
    SELECT id FROM materials WHERE name = ${name}
  `;
  
  if (result.rows.length > 0) {
    return result.rows[0].id;
  }
  
  const insertResult = await sql`
    INSERT INTO materials (name, is_custom) 
    VALUES (${name}, ${isCustom}) 
    RETURNING id
  `;
  
  return insertResult.rows[0].id;
}

export async function getOrCreateFinish(name: string, isCustom = false) {
  const result = await sql`
    SELECT id FROM finishes WHERE name = ${name}
  `;
  
  if (result.rows.length > 0) {
    return result.rows[0].id;
  }
  
  const insertResult = await sql`
    INSERT INTO finishes (name, is_custom) 
    VALUES (${name}, ${isCustom}) 
    RETURNING id
  `;
  
  return insertResult.rows[0].id;
}
