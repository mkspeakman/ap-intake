import { Readable } from 'stream';

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const webhookURL = 'https://speakhost.app.n8n.cloud/webhook/project-submission';
    
    // Convert request to a readable stream and forward to n8n
    const response = await fetch(webhookURL, {
      method: 'POST',
      headers: {
        'Content-Type': req.headers['content-type'],
      },
      body: Readable.from(req),
      duplex: 'half',
    });

    const data = await response.text();
    
    // Return the response from n8n
    res.status(response.status).send(data);
  } catch (error) {
    console.error('Proxy error:', error);
    res.status(500).json({ error: 'Failed to forward request', details: error.message });
  }
}

export const config = {
  api: {
    bodyParser: false,
  },
};
