const vouch = require("../vouch");
const role = require("../role");
const fetch = require("node-fetch");
module.exports = async (body, res, log) => {
  const roleCheck = await role.findOne({ name: "scam", guild: body.guild_id });
  if (!roleCheck?.ids)
    return res.send({
      type: 4,
      data: {
        content:
          "No roles are registered to use this. (Use the /addrole command)",
        flags: 64,
      },
    });
  if (body.member.roles.length == 0)
    return res.send({
      type: 4,
      data: {
        content: "You do not have the correct role to use the command.",
        flags: 64,
      },
    });
  let hasRole = false;
  let roles = [];
  for (const role of roleCheck.ids) {
    if (!roles.includes(`<@&${role}>`)) roles.push(`<@&${role}>`);
    if (body.member.roles.includes(role)) {
      hasRole = true;
      break;
    }
  }
  if (!hasRole)
    return res.send({
      type: 4,
      data: {
        content: `You do not have the correct role to use the command.\n**Allowed roles:** ${roles.join(
          ", "
        )}`,
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
      content:
        "Marked user as scammer, trying to ban from all guilds now. (Might encounter issues because of discord API ratelimits)",
      flags: 64,
    },
  });
  vouch.findOneAndUpdate(
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
