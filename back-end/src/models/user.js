const mongoose = require("mongoose");

const User = new mongoose.Schema({
  id: String,
  last_messege_id: String,
  name: String,
  telefone: Number,
  img_source: String,
  token: String,
  email: String,
  nascimento: String,
});

module.exports = mongoose.model("User", User);
