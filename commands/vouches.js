const vouch = require("../vouch");
module.exports = async (body, res, log) => {
  const user = body.data.resolved.users[body.data.options[0].value];
  const getVouches = await vouch.findOne({ user: body.data.options[0].value });
  /*if (!getVouches?.vouches || getVouches?.vouches?.length == 0)
    return res.send({
      type: 4,
      data: {
        content: "This user has no vouches.",
      },
    });*/
  let rating = 0;
  let totalRatings = 0;
  let stars = "";
  if (getVouches?.vouches) {
    for (const vouch of getVouches.vouches) {
      if (vouch?.rating) {
        rating += vouch.rating;
        totalRatings++;
      }
    }
  }
  rating = Math.round(rating / totalRatings);
  for (let i = 0; i < rating; i++) {
    stars += "✭";
  }
  let trust = "";
  const v = getVouches?.n_vouches;
  if (!v || v <= 10) trust = "Not trustworthy";
  if (v > 10 && v <= 30) trust = "Little trustworthy";
  if (v > 30 && v <= 75) trust = "Moderately trustworthy";
  if (v > 75 && v <= 125) trust = "Pretty trustworthy";
  if (v > 125 && v <= 200) trust = "Very trustworthy";
  if (v > 200) trust = "Super trustworthy";
  let scam = "Not a scammer";
  if (getVouches?.scammer) scam = "Marked as scammer";
  const dateBits = Number(
    BigInt.asUintN(64, body.data.options[0].value) >> 22n
  );
  const joinDate = new Date(dateBits + 1420070400000);
  const nowDate = new Date();
  const diffTime = Math.abs(joinDate - nowDate);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  let embed = {
    author: {
      name: `${user.username + "#" + user.discriminator}'s Profile`,
      icon_url: user.avatar
        ? `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png`
        : `https://cdn.discordapp.com/embed/avatars/${
            user.discriminator % 5
          }.png`,
    },
    description: `**Rating:**\n${!rating ? "" : stars + " "}(${
      rating || 0
    }/5 Stars)\n**Vouches Recieved:**\n${
      getVouches?.n_vouches || "0"
    }\n**Vouches Given:**\n${
      getVouches?.vouchesGiven ? getVouches?.vouchesGiven : "0"
    }\n**Trustworthy:**\n${trust}\n**Scammer:**\n${scam}`,
    footer: {
      text: `Joined discord ${diffDays} days ago`,
    },
    color: 0x808080,
  };
  res.send({
    type: 4,
    data: {
      embeds: [embed],
    },
  });
  log(body);
};
