export default async function handler(req, res) {
  const code = req.query.code;

  if (!code) {
    return res.status(400).json({ success: false, error: "Missing code" });
  }

  try {
    const params = new URLSearchParams();
    params.append("client_id", process.env.DISCORD_CLIENT_ID);
    params.append("client_secret", process.env.DISCORD_CLIENT_SECRET);
    params.append("grant_type", "authorization_code");
    params.append("code", code);
    params.append("redirect_uri", process.env.DISCORD_REDIRECT_URI); // Must match Discord portal

    // Step 1: Get access token
    const tokenResponse = await fetch("https://discord.com/api/oauth2/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: params,
    });

    const tokenData = await tokenResponse.json();

    if (!tokenData.access_token) {
      return res.status(500).json({ success: false, error: "Token exchange failed", tokenData });
    }

    const accessToken = tokenData.access_token;

    // Step 2: Get user info
    const userResponse = await fetch("https://discord.com/api/users/@me", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const userData = await userResponse.json();

    // Step 3: Add user to your server
    const guildId = process.env.DISCORD_GUILD_ID; // Your server ID
    const botToken = process.env.DISCORD_BOT_TOKEN; // Must be bot in your server with Manage Server

    const joinResponse = await fetch(`https://discord.com/api/guilds/${guildId}/members/${userData.id}`, {
      method: "PUT",
      headers: {
        Authorization: `Bot ${botToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        access_token: accessToken,
      }),
    });

    if (!joinResponse.ok) {
      const errorText = await joinResponse.text();
      return res.status(500).json({ success: false, error: "Failed to add user to guild", errorText });
    }

    res.status(200).json({ success: true, message: "User added to server", user: userData });

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Unexpected error", details: error.message });
  }
}
