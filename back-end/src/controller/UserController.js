const crypto = require("crypto");

const UserModel = require("../models/user");
const CodeModel = require("../models/code");

const mailler = require("../modules/mailler");

module.exports = {
  async criar(req, res) {
    const { name, telefone, email, dia, mes, ano, file: img_source } = req.body;
    const filename = req.file;

    const tel = await UserModel.findOne({ telefone: req.body.telefone });

    if (tel) {
      return res.json({
        error: true,
        errors: [
          {
            msg:
              "usuário já cadastrado, por favor, se redirecione para a tela de Loggin.",
          },
        ],
        redirect: "/entrar",
      });
    }

    if (!name || !telefone || !email) {
      return res.json({
        error: true,
        errors: [
          {
            msg: "faltam dados",
          },
        ],
      });
    }
    if (!img_source) {
      return res.json({
        error: true,
        errors: [
          {
            msg: "faltam foto do perfil",
          },
        ],
      });
    }

    const token = crypto.randomBytes(18).toString("hex");
    const user = await UserModel.create({
      name,
      telefone,
      img_source,
      token,
      id: crypto.randomBytes(20).toString("hex"),
      email,
      nascimento: `${dia}/${mes}/${ano}`,
    });

    return res.json({ error: false, messege: user, token });
  },

  async read(req, res) {
    const telefone = await UserModel.findOne({ telefone: req.body.telefone });
    const { name, telefone: tel, img_source } = telefone;
    return res.json({ usuario: { name, tel, img_source } });
  },

  async auth(req, res) {
    const { code, email } = req.query;

    if (!email || !code) {
      return res.json({ error: true, errors: [{ msg: "faltam dados" }] });
    }

    const codeDB = await CodeModel.findOne({ idUser: email });

    if (!codeDB) {
      return res.json({ error: true, errors: [{ msg: "sem código" }] });
    }

    if (code !== codeDB.code) {
      return res.json({ error: true, errors: [{ msg: "codigo inválido" }] });
    }

    const userData = await UserModel.findOne({ email });

    return res.json({ userData });
  },

  async entrada(req, res) {
    const { telefone, email } = req.query;

    if (!telefone) {
      return res.json({
        error: true,
        errors: [{ msg: "faltam telefone", header: "telefone" }],
      });
    }
    if (!email) {
      return res.json({
        error: true,
        errors: [{ msg: "faltam email", header: "email" }],
      });
    }

    const user = await UserModel.findOne({ telefone: telefone });
    if (!user) {
      return res.json({
        error: true,
        errors: [{ msg: "usuário não cadastrado" }],
      });
    }

    const code = crypto.randomBytes(3).toString("hex");

    const messege = `<div style="text-align:center">Olá <strong>${user.name}</strong>, seja bem vindo ao chat do jhonis!!<br/> seu codigo de verificação é <h2 style="text-align:center; margin:0; padding:0;">${code}</h2></div>`;

    await CodeModel.create({
      code,
      date: Date(),
      idUser: email,
    });

    try {
      await mailler.sendMail({
        to: email,
        from: "joneivison013@gmail.com",
        subject: "Hello ✔",
        text: "Hello world?",
        html: messege,
      });
    } catch (error) {
      return res.json({ error: true, errors: [error] });
    }
    return res.json({ error: false, messege: "código enviádo com sucesso!!!" });
  },
};
