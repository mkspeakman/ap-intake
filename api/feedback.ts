/**
 * Vercel Serverless Function: Submit Feedback to Feedback Fish
 * POST /api/feedback
 */

import type { VercelRequest, VercelResponse } from '@vercel/node';

const FEEDBACK_FISH_PROJECT_ID = process.env.VITE_FEEDBACK_FISH_PROJECT_ID || process.env.FEEDBACK_FISH_PROJECT_ID || '';

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

    if (!FEEDBACK_FISH_PROJECT_ID) {
      console.error('FEEDBACK_FISH_PROJECT_ID is not set');
      return res.status(500).json({ 
        error: 'Feedback service not configured',
        details: 'Project ID is missing'
      });
    }

    console.log('Submitting feedback to project:', FEEDBACK_FISH_PROJECT_ID);

    // Submit to Feedback Fish API - using correct endpoint
    const feedbackData: any = {
      projectId: FEEDBACK_FISH_PROJECT_ID,
      text: message,
      category: 'other',
      userId: (email && email.trim()) || 'anonymous',
      metadata: metadata || {},
    };

    console.log('Feedback data:', JSON.stringify(feedbackData));

    const response = await fetch(`https://api.feedback.fish/feedback`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(feedbackData),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Feedback Fish API error:', response.status, errorText);
      throw new Error(`Failed to submit feedback to Feedback Fish: ${response.status} ${errorText}`);
    }

    return res.status(200).json({
      success: true,
      message: 'Feedback submitted successfully',
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
