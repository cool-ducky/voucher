const mongoose = require("mongoose");
const roleSchema = new mongoose.Schema({
  name: String,
  ids: Array,
  guild: String,
});
const role = mongoose.model("role", roleSchema);
module.exports = role;
