const bcrypt = require("bcrypt");

exports.seed = async function (knex) {
  await knex("users").insert([
    {
      name: "Mateo",
      lastname: "Cecchi",
      email: "cecchimateo@gmail.com",
      phone: "1123456734",
      password: bcrypt.hashSync("12345678", 10),
      is_partner: false,
      is_admin: true,
    },
    {
      name: "Pepe",
      lastname: "Ojeda",
      email: "pepeojeda@gmail.com",
      phone: "12345678",
      password: bcrypt.hashSync("12345678", 10),
      is_partner: true,
      is_admin: false,
    },
    {
      name: "Daniel",
      lastname: "Molina",
      email: "danielmolina@gmail.com",
      phone: "12345678",
      password: bcrypt.hashSync("12345678", 10),
      is_partner: true,
      is_admin: false,
    },
    {
      name: "Paco",
      lastname: "Perez",
      email: "pacoperez@gmail.com",
      phone: "12345678",
      password: bcrypt.hashSync("12345678", 10),
      is_partner: true,
      is_admin: false,
    },
    {
      name: "Lolo",
      lastname: "Ayala",
      email: "loloayala@gmail.com",
      phone: "1123456734",
      password: bcrypt.hashSync("12345678", 10),
      is_partner: true,
      is_admin: false,
    },
    {
      name: "Juan",
      lastname: "Ugarte",
      email: "juanugarte@gmail.com",
      phone: "1123456734",
      password: bcrypt.hashSync("12345678", 10),
      is_partner: true,
      is_admin: false,
    },
    {
      name: "Pedro",
      lastname: "Contreras",
      email: "pedrocontreras@gmail.com",
      phone: "12345678",
      password: bcrypt.hashSync("12345678", 10),
      is_partner: true,
      is_admin: false,
    },
    {
      name: "Agus",
      lastname: "Risso",
      email: "agusrisso@gmail.com",
      phone: "12345678",
      password: bcrypt.hashSync("12345678", 10),
      is_partner: false,
      is_admin: false,
    },
  ]);
};
