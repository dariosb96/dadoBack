require("dotenv").config();
const express = require("express");
const app = express();
const sequelize = require("./db.js");
const router = require("./routes/index.js");
const { Product, Category, User } = require("./models");
const cors = require("cors");
const morgan = require("morgan");
const path = require("path");
const rateLimit = require("express-rate-limit");

const isProduction = process.env.NODE_ENV === "production";

/* ================= MIDDLEWARES ================= */

app.use(
  "/login",
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5,
    message: "Demasiados intentos, espera 15 minutos",
  })
);

app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use(morgan(isProduction ? "combined" : "dev"));

const allowedOrigins = [
  "https://daddo.vercel.app",
  "http://localhost:5173",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("No permitido por CORS"));
      }
    },
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/", router);

/* ================= DB CONNECTION ================= */

sequelize
  .authenticate()
  .then(async () => {
    console.log("✅ DB conectada correctamente");

    if (!isProduction) {
      console.log("🛠 Sincronizando modelos en LOCAL...");
      await sequelize.sync({ alter: true }); // solo local
    }

    const PORT = process.env.PORT || 3001;
    app.listen(PORT, () =>
      console.log(`Servidor corriendo en puerto ${PORT}`)
    );
  })
  .catch((err) => {
    console.error(" Error conectando a la DB:", err);
  });