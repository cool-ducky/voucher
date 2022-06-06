const role = require("../role");
module.exports = async (body, res, log) => {
  const ids = ["399029073386668045", "701810732219760710"];
  if (!ids.includes(body.member.user.id)) return;
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
