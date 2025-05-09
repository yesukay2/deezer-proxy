const fetch = require('node-fetch');

module.exports = async (req, res) => {
  try {
    // Extract path from request
    const path = req.url.split('/proxy/')[1];
    const targetUrl = `https://cdnt-preview.dzcdn.net/${path}`;

    // Forward headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Content-Type', 'audio/mpeg');
    res.setHeader('Cache-Control', 'public, max-age=31536000');

    // Proxy the request
    const response = await fetch(targetUrl);
    response.body.pipe(res);
  } catch (error) {
    res.status(500).json({ error: 'Proxy error' });
  }
};
