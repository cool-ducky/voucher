const mongoose = require("mongoose");
const roleSchema = new mongoose.Schema({
  name: String,
  ids: Array,
});
const role = mongoose.model("role", roleSchema);
module.exports = role;
