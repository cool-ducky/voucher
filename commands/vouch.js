const vouch = require("../vouch");
module.exports = async (body, res, log) => {
  if (body.member.user.id == body.data.options[0].value)
    return res.send({
      type: 4,
      data: {
        content: "You can not vouch yourself!",
        flags: 64,
      },
    });
  /*const checkVouch = await vouch.findOne({ user: body.data.options[0].value });
  if (checkVouch?.vouches?.length > 0) {
    for (const vouch of checkVouch.vouches) {
      if (vouch.id == body.member.user.id)
        return res.send({
          type: 4,
          data: {
            content: "You have already vouched this user.",
            flags: 64,
          },
        });
    }
  }*/
  if (
    body.data.options[2].value.length < 10 ||
    body.data.options[2].value.length > 100
  )
    return res.send({
      type: 4,
      data: {
        content:
          body.data.options[2].value.length < 10
            ? "Please provide more details."
            : "Please provide less details.",
        flags: 64,
      },
    });
  await vouch.findOneAndUpdate(
    {
      user: body.data.options[0].value,
    },
    {
      user: body.data.options[0].value,
      $inc: { n_vouches: 1 },
      $push: {
        vouches: {
          id: body.member.user.id,
          rating: body.data.options[1].value,
          details: body.data.options[2].value,
        },
      },
    },
    {
      upsert: true,
    }
  );
  res.send({
    type: 4,
    data: {
      embeds: [
        {
          color: 0x808080,
          title: "✅ Vouched!",
          description: `**Reciever:**\n<@${
            body.data.options[0].value
          }>\n**Giver:**\n<@${body.member.user.id}>\n**Date:**\n<t:${Math.round(
            new Date().getTime() / 1000
          )}:D>\n**Details:**\n${body.data.options[2].value}`,
        },
      ],
    },
  });
  await vouch.findOneAndUpdate(
    {
      user: body.member.user.id,
    },
    {
      $inc: { vouchesGiven: 1 },
    },
    {
      upsert: true,
    }
  );
  log(body);
};
