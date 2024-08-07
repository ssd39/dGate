const { REST, Client, GatewayIntentBits } = require("discord.js");

const getClient = (token) => {
  const rest = new REST({ version: "10" ,}).setToken(token);
  return rest;
};

const getToken = async (code) => {
  const tokenResponseData = await fetch(
    "https://discord.com/api/oauth2/token",
    {
      method: "POST",
      body: new URLSearchParams({
        client_id: process.env.DISCORD_CLIENT_ID,
        client_secret: process.env.DISCORD_SECRET,
        code,
        grant_type: "authorization_code",
        redirect_uri: process.env.REDIRECT_URI,
        scope: "identify",
      }).toString(),
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    }
  );
  return await tokenResponseData.json();
};

module.exports = {
  getClient,
  getToken,
};
