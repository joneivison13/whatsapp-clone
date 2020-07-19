require("dotenv/config");

const express = require("express");
const app = express();
const routes = require("./routes");
const mongoose = require("mongoose");
const bodyparser = require("body-parser");
const cors = require("cors");

mongoose
  .connect(
    `mongodb+srv://joneivisonGato:${process.env.PASSWORD_DATABASE}@cluster0.eggza.mongodb.net/loja?retryWrites=true&w=majority`,
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(() => console.log("database ok"))
  .catch((error) => console.log(error));

app.use(cors());
app.use(bodyparser.json());
app.use(express.json());
app.use(routes);
app.listen(3333, () => console.log("servidor rodando na porta 3000"));
