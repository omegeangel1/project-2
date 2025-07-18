// File: api/discord-auth.js

export default async function handler(req, res) {
  // CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === 'OPTIONS') {
    return res.status(200).end(); // Pre-flight request
  }

  if (req.method === 'GET') {
    return res.status(200).json({
      success: true,
      message: "Discord Auth API is working on Vercel!",
    });
  }

  if (req.method === 'POST') {
    const { code } = req.body;

    if (!code) {
      return res.status(400).json({ success: false, error: 'Missing authorization code.' });
    }

    try {
      // Step 1: Exchange code for access token
      const tokenResponse = await fetch('https://discord.com/api/oauth2/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          client_id: process.env.DISCORD_CLIENT_ID,
          client_secret: process.env.DISCORD_CLIENT_SECRET,
          grant_type: 'authorization_code',
          code,
          redirect_uri: process.env.DISCORD_REDIRECT_URI,
          scope: 'identify email',
        }),
      });

      const tokenData = await tokenResponse.json();

      if (!tokenData.access_token) {
        return res.status(400).json({ success: false, error: 'Failed to get access token', details: tokenData });
      }

      // Step 2: Fetch user info from Discord
      const userResponse = await fetch('https://discord.com/api/users/@me', {
        headers: {
          Authorization: `Bearer ${tokenData.access_token}`,
        },
      });

      const userData = await userResponse.json();

      return res.status(200).json({
        success: true,
        user: userData,
        token: tokenData.access_token,
      });

    } catch (err) {
      console.error('OAuth Error:', err);
      return res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
  }

  res.status(405).json({ success: false, error: "Method Not Allowed" });
}
