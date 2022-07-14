const vouch = require("../vouch");

module.exports = async (body, res, log) => {
  let remove = false;
  if (body.data.options.length == 2) {
    remove = body.data.options[1].value;
  }
  const checkPerm = await vouch.findOne({
    user: body.member.user.id,
  });
  if (!checkPerm?.admin)
    return res.send({
      type: 4,
      data: {
        content: "You do not have the permissions to add staff.",
        flags: 64,
      },
    });
  await vouch.findOneAndUpdate(
    {
      user: body.data.options[0].value,
    },
    {
      banner: remove ? false : true,
    },
    {
      upsert: true,
    }
  );
  res.send({
    type: 4,
    data: {
      content: remove
        ? `Removed <@${body.data.options[0].value}> as staff.`
        : `Added <@${body.data.options[0].value}> as staff.`,
    },
  });
  log(body);
};
