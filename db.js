require("dotenv").config();
const { Sequelize } = require("sequelize");

const isProduction = process.env.NODE_ENV === "production";

const sequelize = new Sequelize(
  isProduction
    ? process.env.DATABASE_URL
    : `postgres://${process.env.DB_USER_LOCAL}:${process.env.DB_PASSWORD_LOCAL}@${process.env.DB_HOST_LOCAL}:${process.env.DB_PORT_LOCAL}/${process.env.DB_NAME_LOCAL}`,
  {
    dialect: "postgres",
    logging: false,
    dialectOptions: {
      ssl: isProduction
        ? { require: true, rejectUnauthorized: false }
        : false,
    },
  }
);

module.exports = sequelize;
