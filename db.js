require("dotenv").config(); // ✅ Importante que esté arriba de todo

const { Sequelize } = require("sequelize");



const sequelize = new Sequelize(
  process.env.DB_NAME_LOCAL,
  process.env.DB_USER_LOCAL,
  process.env.DB_PASSWORD_LOCAL,
  {
    host: process.env.DB_HOST_LOCAL,
    port: process.env.DB_PORT_LOCAL,
    dialect: "postgres",
    logging: false,
  }
);

module.exports = sequelize;
