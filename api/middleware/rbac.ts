// RBAC Middleware for API routes
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { sql } from '@vercel/postgres';

export interface AuthenticatedRequest extends VercelRequest {
  user?: {
    id: number;
    email: string;
    role: string;
    name: string;
  };
}

// Simple token validation (in production, use JWT)
export async function authenticateUser(req: AuthenticatedRequest): Promise<boolean> {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return false;
  }

  // For now, token is base64 encoded user email (INSECURE - use JWT in production)
  const token = authHeader.substring(7);
  
  try {
    const email = Buffer.from(token, 'base64').toString('utf-8');
    
    // Fetch user from database
    const result = await sql`
      SELECT id, email, name, role, last_login
      FROM users 
      WHERE email = ${email}
    `;

    if (result.rows.length === 0) {
      return false;
    }

    req.user = result.rows[0] as any;
    
    // Update last_login
    await sql`
      UPDATE users 
      SET last_login = NOW() 
      WHERE id = ${req.user!.id}
    `;

    return true;
  } catch (error) {
    console.error('Authentication error:', error);
    return false;
  }
}

// Require authentication
export async function requireAuth(
  req: AuthenticatedRequest,
  res: VercelResponse
): Promise<boolean> {
  const isAuthenticated = await authenticateUser(req);
  
  if (!isAuthenticated) {
    res.status(401).json({ error: 'Unauthorized' });
    return false;
  }
  
  return true;
}

// Require specific role(s)
export async function requireRole(
  req: AuthenticatedRequest,
  res: VercelResponse,
  allowedRoles: string[]
): Promise<boolean> {
  const isAuthenticated = await requireAuth(req, res);
  
  if (!isAuthenticated) {
    return false;
  }

  const userRole = req.user!.role;
  
  if (!allowedRoles.includes(userRole)) {
    res.status(403).json({ 
      error: 'Forbidden',
      message: `This action requires one of the following roles: ${allowedRoles.join(', ')}` 
    });
    return false;
  }

  return true;
}

// Audit log helper
export async function logAudit(
  userId: number,
  action: string,
  resourceType: string,
  resourceId?: number,
  details?: any,
  req?: VercelRequest
) {
  try {
    const ipAddress = req?.headers['x-forwarded-for'] || req?.headers['x-real-ip'] || 'unknown';
    const userAgent = req?.headers['user-agent'] || 'unknown';

    await sql`
      INSERT INTO audit_logs (user_id, action, resource_type, resource_id, ip_address, user_agent, details)
      VALUES (${userId}, ${action}, ${resourceType}, ${resourceId || null}, ${ipAddress as string}, ${userAgent}, ${JSON.stringify(details || {})})
    `;
  } catch (error) {
    console.error('Audit logging error:', error);
    // Don't fail the request if audit logging fails
  }
}
