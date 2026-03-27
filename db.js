require("dotenv").config();
const { Sequelize } = require("sequelize");

let sequelize;

if (process.env.DATABASE_URL) {
  console.log("🌍 DB: PRODUCCIÓN (usando DATABASE_URL)");

  sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: "postgres",
    logging: false,
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
  });

} else {
  console.log("💻 DB: LOCAL");

  if (!process.env.DB_NAME) {
    throw new Error("❌ DB_NAME no está definido en .env para entorno local");
  }

  sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
      host: process.env.DB_HOST || "localhost",
      dialect: "postgres",
      logging: false,
    }
  );
}

module.exports = sequelize;