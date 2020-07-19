const { Router } = require("express");
const multer = require("multer");

const User = require("./controller/UserController");
const Code = require("./controller/CodeController");

const path = require("path");
const crypto = require("crypto");

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "temp/uploads"),
  filename: (req, file, cb) => {
    crypto.randomBytes(16, (err, hash) => {
      if (err) cb(err);

      const fileName = `${hash.toString("hex")}-${file.originalname}`;

      cb(null, fileName);
    });
  },
});
const upload = multer({ storage });

const rota = Router();

// teste de conexão e funcionamento do back-end
rota.get("/", (req, res) => res.json({ messege: "ola, mundo" }));

// login e autenticação
rota.post("/get-users", User.entrada);
rota.post("/create-users", upload.single("file"), User.criar);
rota.post("/get-auth", User.auth);

module.exports = rota;
