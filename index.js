require("dotenv").config();

const fetch = require("node-fetch");
const log = require("./logs");

const mongoose = require("mongoose");
mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const express = require("express");
const app = express();

const { verifyKeyMiddleware } = require("discord-interactions");

app.post("/", verifyKeyMiddleware(process.env.PUBLIC_KEY), (req, res) => {
  const body = req.body;
  if (!body?.member) return;
  try {
    const command = require(`./commands/${body.data.name}`);
    command(body, res, log);
  } catch (err) {
    console.log(err);
    res.send({
      type: 4,
      data: {
        content: "This command is not registered, contact developers.",
        flags: 64,
      },
    });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT);
