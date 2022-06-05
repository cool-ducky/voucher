const fetch = require("node-fetch");
module.exports = (body) => {
  let options = [];
  options.push(`**Used by:** <@${body.member.user.id}>`);
  options.push(`**Channel:** <#${body.channel_id}>`);
  const now = new Date();
  options.push(`**Date:** <t:${Math.round(now.getTime() / 1000)}:D>`);
  if (body.data?.options) {
    options.push("Command Options:");
    for (const option of body.data.options) {
      let name = option.name.charAt(0).toUpperCase() + option.name.slice(1);
      if (option.type == 6) {
        let optionUser = body.data.resolved.users[body.data.options[0].value];
        options.push(
          `**${name}:** <@${option.value}> (${
            optionUser.username + "#" + optionUser.discriminator
          })`
        );
      }
      if (option.type == 3 || option.type == 4)
        options.push(`**${name}:** ${option.value}`);
      if (option.type == 8) options.push(`**${name}:** <@&${option.value}>`);
    }
  }
  const user = body.member.user;
  fetch(process.env.WEBHOOK, {
    method: "post",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      embeds: [
        {
          title: "/" + body.data.name,
          description: options.join("\n"),
          footer: {
            text: user.username + "#" + user.discriminator + ` (${user.id})`,
            icon_url: user.avatar
              ? `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png`
              : `https://cdn.discordapp.com/embed/avatars/${
                  user.discriminator % 5
                }.png`,
          },
          color: 0x808080,
        },
      ],
      username: "Logs",
    }),
  });
};
