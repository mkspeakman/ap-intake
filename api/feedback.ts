/**
 * Vercel Serverless Function: Submit User Feedback
 * POST /api/feedback
 * Stores feedback in database and sends email notification via n8n
 */

import { sql } from '@vercel/postgres';
import type { VercelRequest, VercelResponse } from '@vercel/node';

const N8N_FEEDBACK_WEBHOOK_URL = process.env.N8N_FEEDBACK_WEBHOOK_URL || '';

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
    const { message, email, metadata } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    // Extract screenshot from metadata if present
    const screenshot = metadata?.screenshot || null;
    const metadataWithoutScreenshot = { ...metadata };
    delete metadataWithoutScreenshot.screenshot;

    // Store feedback in database
    const result = await sql`
      INSERT INTO feedback (
        message,
        user_email,
        screenshot_base64,
        metadata
      ) VALUES (
        ${message},
        ${email || null},
        ${screenshot},
        ${JSON.stringify(metadataWithoutScreenshot)}
      )
      RETURNING id, created_at
    `;

    const feedbackId = result.rows[0].id;
    const createdAt = result.rows[0].created_at;

    console.log(`Feedback ${feedbackId} stored in database`);

    // Send to n8n webhook for email notification (non-blocking)
    if (N8N_FEEDBACK_WEBHOOK_URL) {
      try {
        const n8nPayload = {
          feedbackId,
          message,
          userEmail: email || 'anonymous',
          screenshot,
          metadata: metadataWithoutScreenshot,
          createdAt,
        };

        const n8nResponse = await fetch(N8N_FEEDBACK_WEBHOOK_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(n8nPayload),
        });

        if (!n8nResponse.ok) {
          console.error('n8n webhook error:', n8nResponse.status, await n8nResponse.text());
        } else {
          console.log(`Feedback ${feedbackId} sent to n8n webhook`);
        }
      } catch (n8nError) {
        // Don't fail the request if n8n is down - feedback is already saved
        console.error('Failed to send to n8n webhook:', n8nError);
      }
    } else {
      console.warn('N8N_FEEDBACK_WEBHOOK_URL not configured - skipping email notification');
    }

    return res.status(200).json({
      success: true,
      message: 'Feedback submitted successfully',
      feedbackId,
    });
  } catch (error: any) {
    console.error('Error submitting feedback:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to submit feedback',
      details: error.message,
    });
  }
}
