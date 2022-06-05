const mongoose = require("mongoose");
const vouchSchema = new mongoose.Schema({
  user: String,
  vouches: Array,
  n_vouches: Number,
  scammer: Boolean,
  vouchesGiven: Number,
});
const vouch = mongoose.model("vouche", vouchSchema);
module.exports = vouch;
