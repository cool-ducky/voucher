module.exports = (body, res, log) => {
  res.send({
    type: 4,
    data: {
      embeds: [
        {
          title: "Invite Me!",
          url: "https://discord.com/oauth2/authorize?client_id=983202558304747591&scope=bot&permissions=2147483648",
          color: 0x808080,
        },
      ],
    },
  });
  log(body);
};
