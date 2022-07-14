const vouch = require("../vouch");

module.exports = async (body, res, log) => {
  const owners = ["399029073386668045", "701810732219760710"];
  if (!owners.includes(body.member.user.id))
    return res.send({
      type: 4,
      data: {
        content: "You do not have permissions to add admins.",
        flags: 64,
      },
    });
  let remove = false;
  if (body.data.options.length == 2) {
    remove = body.data.options[1].value;
  }
  await vouch.findOneAndUpdate(
    {
      user: body.data.options[0].value,
    },
    {
      admin: remove ? false : true,
      banner: remove ? false : true,
      voucher: remove ? false : true,
    },
    {
      upsert: true,
    }
  );
  res.send({
    type: 4,
    data: {
      content: remove
        ? `Removed <@${body.data.options[0].value}> as an admin.`
        : `Added <@${body.data.options[0].value}> as an admin.`,
    },
  });
  log(body);
};
