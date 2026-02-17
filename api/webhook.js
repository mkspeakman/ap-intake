export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const webhookURL = 'https://speakhost.app.n8n.cloud/webhook/project-submission';
    
    // Get the raw body as a buffer
    const chunks = [];
    for await (const chunk of req) {
      chunks.push(chunk);
    }
    const body = Buffer.concat(chunks);
    
    // Forward to n8n
    const response = await fetch(webhookURL, {
      method: 'POST',
      headers: {
        'Content-Type': req.headers['content-type'] || 'application/json',
      },
      body: body,
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
