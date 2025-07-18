// /api/discord-auth.js
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: "Method not allowed" });
  }

  const { code } = req.body;

  if (!code) {
    return res.status(400).json({ success: false, error: "Missing code from request" });
  }

  try {
    const params = new URLSearchParams();
    params.append("client_id", process.env.DISCORD_CLIENT_ID);
    params.append("client_secret", process.env.DISCORD_CLIENT_SECRET);
    params.append("grant_type", "authorization_code");
    params.append("code", code);
    params.append("redirect_uri", "https://www.jxfrcloud.xyz/callback");
    params.append("scope", "identify email guilds.join");

    const tokenRes = await fetch("https://discord.com/api/oauth2/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: params.toString(),
    });

    const tokenData = await tokenRes.json();

    if (tokenData.error) {
      return res.status(401).json({ success: false, error: "Invalid token exchange", details: tokenData });
    }

    const userRes = await fetch("https://discord.com/api/users/@me", {
      headers: {
        Authorization: `${tokenData.token_type} ${tokenData.access_token}`,
      },
    });

    const userData = await userRes.json();

    res.status(200).json({ success: true, user: userData });
  } catch (err) {
    res.status(500).json({ success: false, error: "Server error", details: err.message });
  }
}
