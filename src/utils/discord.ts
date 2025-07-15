const BOT_TOKEN = 'MTA5MDkxNzQ1ODM0NjUyNDczNA.GQ_NjH.ELBEn7rrxJ0sAXIlUIhC_gHeQEKpaNBOrz7Vh0';
const GUILD_ID = '1388084142075547680';

export const addUserToGuild = async (userId: string, accessToken: string) => {
  try {
    const response = await fetch(`https://discord.com/api/guilds/${GUILD_ID}/members/${userId}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bot ${BOT_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        access_token: accessToken,
      }),
    });

    if (response.ok) {
      console.log('User successfully added to guild');
      return true;
    } else if (response.status === 204) {
      console.log('User is already in the guild');
      return true;
    } else {
      const error = await response.text();
      console.error('Failed to add user to guild:', error);
      return false;
    }
  } catch (error) {
    console.error('Error adding user to guild:', error);
    return false;
  }
};

export const getUserGuilds = async (accessToken: string) => {
  try {
    const response = await fetch('https://discord.com/api/users/@me/guilds', {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    });

    if (response.ok) {
      const guilds = await response.json();
      return guilds;
    } else {
      console.error('Failed to fetch user guilds');
      return [];
    }
  } catch (error) {
    console.error('Error fetching user guilds:', error);
    return [];
  }
};
