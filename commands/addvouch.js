const vouch = require("../vouch");
const role = require("../role");
const fetch = require("node-fetch");
module.exports = async (body, res) => {
  const roleCheck = await role.findOne({ name: "vouch" });
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
  const update = await vouch.findOneAndUpdate(
    {
      user: body.data.options[0].value,
    },
    {
      user: body.data.options[0].value,
      $inc: { n_vouches: body.data.options[1].value },
    },
    {
      upsert: true,
      new: true,
    }
  );
  res.send({
    type: 4,
    data: {
      content: `Successfully added **${body.data.options[1].value}** vouches to **<@${body.data.options[0].value}>**, they now have **${update.n_vouches}** vouches.`,
      flags: 64,
    },
  });
};
