const vouch = require("../vouch");
const fetch = require("node-fetch");
const getRole = require("../role");
module.exports = async (body, res, log) => {
  const getVouches = await vouch.findOne({ user: body.member.user.id });
  if (!getVouches?.n_vouches || getVouches.n_vouches < 30)
    return res.send({
      type: 4,
      data: {
        content: `You need at least 30 vouches to get a role, you have **${
          getVouches?.n_vouches || 0
        }** vouches.`,
        flags: 64,
      },
    });
  const levels = {
    30: "trust 1",
    75: "trust 2",
    125: "trust 3",
    200: "trust 4",
    300: "trust 5",
  };
  let rolesToGive = [];
  for (const level in levels) {
    if (level <= getVouches.n_vouches) {
      let role = await getRole.findOne({
        guild: body.guild_id,
        name: levels[level],
      });
      if (!role?.ids || role?.ids?.length == 0) continue;
      for (const id of role.ids) {
        if (!body.member.roles.includes(id) && !rolesToGive.includes(id))
          rolesToGive.push(id);
      }
    }
  }
  if (rolesToGive.length == 0)
    return res.send({
      type: 4,
      data: {
        content: "You have already claimed all the possible roles.",
        flags: 64,
      },
    });
  let formattedRoles = [];
  for (const role of rolesToGive) {
    formattedRoles.push("<@&" + role + ">");
  }
  res.send({
    type: 4,
    data: {
      content: `Assigning ${formattedRoles.join(", ")} role(s) to you.`,
    },
  });
  
    const req = await fetch(
      `https://discord.com/api/v9/guilds/${body.guild_id}/members/${body.member.user.id}`,
      {
        method: "patch",
        body: JSON.stringify({
          roles: rolesToGive.concat(body.member.roles),
        }),
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bot " + process.env.BOT_TOKEN,
        },
      }
    );
const json = await req.json()
console.log(json)
  log(body);
};
