const mongoose = require("mongoose");

const Code = mongoose.Schema({
  code: String,
  date: Date,
  idUser: String,
});

module.exports = mongoose.model("CodeUser", Code);
