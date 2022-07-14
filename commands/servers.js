const fetch = require("node-fetch");
module.exports = async (body, res, log) => {
  const response = await fetch("https://discord.com/api/v9/users/@me/guilds", {
    method: "GET",
    headers: {
      Authorization: "Bot " + process.env.BOT_TOKEN,
    },
  });
  const guilds = await response.json();
  let list = "";
  for (const guild of guilds) {
    list += guild.name + "\n";
  }
  res.send({
    type: 4,
    data: {
      embeds: [
        {
          title: guilds.length + " Guilds",
          description: list.length < 4000 ? list : null,
          color: 0x808080,
        },
      ],
    },
  });
};
