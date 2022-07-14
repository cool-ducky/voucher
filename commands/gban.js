const vouch = require("../vouch");
const role = require("../role");
const fetch = require("node-fetch");
module.exports = async (body, res, log) => {
  const checkPerms = await vouch.findOne({ user: body.member.user.id });
  if (!checkPerms?.banner)
    return res.send({
      type: 4,
      data: {
        content:
          "You do not have the permissions to ban a member, contact an admin!",
        flags: 64,
      },
    });
  const checkScam = await vouch.findOne({ user: body.data.options[0].value });
  if (checkScam?.scammer)
    return res.send({
      type: 4,
      data: { content: "This user is already marked as a scammer.", flags: 64 },
    });
  res.send({
    type: 4,
    data: {
      content: `<@${body.data.options[0].value}> is being globally banned from all servers. Reason: \`${body.data.options[1].value}\``,
    },
  });
  await vouch.findOneAndUpdate(
    {
      user: body.data.options[0].value,
    },
    {
      scammer: true,
      user: body.data.options[0].value,
    },
    {
      upsert: true,
    }
  );
  log(body);
  const data = await fetch("https://discord.com/api/v9/users/@me/guilds", {
    headers: { Authorization: "Bot " + process.env.BOT_TOKEN },
  });
  const guilds = await data.json();
  for (const guild of guilds) {
    const ban = await fetch(
      `https://discord.com/api/v9/guilds/${guild.id}/bans/${body.data.options[0].value}`,
      {
        method: "put",
        headers: { Authorization: "Bot " + process.env.BOT_TOKEN },
      }
    );
  }
};
