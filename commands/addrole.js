const role = require("../role");
const vouch = require("./vouch");
module.exports = async (body, res, log) => {
  const checkPerm = await vouch.findOne({
    user: body.member.user.id,
  });
  if (!checkPerm?.admin)
    return res.send({
      type: 4,
      data: {
        content: "You do not have the permissions to add roles.",
        flags: 64,
      },
    });
  await role.findOneAndUpdate(
    {
      name: body.data.options[1].value,
      guild: body.guild_id,
    },
    {
      name: body.data.options[1].value,
      $push: { ids: body.data.options[0].value },
      guild: body.guild_id,
    },
    {
      upsert: true,
    }
  );
  res.send({
    type: 4,
    data: {
      content: `Succesfully assigned <@&${body.data.options[0].value}> to ${body.data.options[1].value}.`,
    },
  });
  log(body);
};
