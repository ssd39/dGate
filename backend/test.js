const { REST, Client, GatewayIntentBits, Routes } = require("discord.js");



async function main() {
  //const a = await getToken("kDf89Fv5iulXTmcFyqNLMsMyY0PJVT");
  //console.log(a)
  const rest = new REST({ version: "10" }).setToken("MTI3MDUwMTI1NzAzOTMxNTA1Ng.GRZz7-.rrR293L3j8UjAtUJhHFtSIK5lhfiGtpY9fuRZQ");
  const userChannels = await rest.get(Routes.guildChannels("1129411590840651978"));

  console.log(userChannels);
}

main()