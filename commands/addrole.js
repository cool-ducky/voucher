const role = require("../role");
module.exports = async (body, res) => {
  const ids = ["399029073386668045", "701810732219760710"];
  if (!ids.includes(body.member.user.id)) return;
  await role.findOneAndUpdate(
    {
      name: body.data.options[1].value,
    },
    {
      name: body.data.options[1].value,
      $push: { ids: body.data.options[0].value },
    },
    {
      upsert: true,
    }
  );
  res.send({
    type: 4,
    data: {
      content: `Succesfully gave <@&${body.data.options[0].value}> ${body.data.options[1].value} perms.`,
      flags: 64,
    },
  });
};
