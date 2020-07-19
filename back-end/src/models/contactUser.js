const mongoose = require("mongoose");

const ContactUser = new mongoose.Schema({
  id_client: String,
  messeges: String,
  id_user: String,
});

module.exports = mongoose.model("Contact", ContactUser);
