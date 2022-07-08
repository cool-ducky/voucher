const vouch = require("../vouch");
const role = require("../role");
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
  const scammers = await vouch.find({ scammer: true });
  let description = "";
  if (scammers) {
    for (const scammer of scammers) {
      description += `<@${scammer.user}> (${scammer.user})\n`;
    }
  } else {
    description = "No scammers!";
  }

  res.send({
    type: 4,
    data: {
      embeds: [
        {
          title: "Scammers",
          description,
        },
      ],
    },
  });
  log(body);
};
