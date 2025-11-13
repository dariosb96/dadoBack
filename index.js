require("dotenv").config();
const express = require("express");
const app = express();
const sequelize = require("./db.js");
const router = require("./routes/index.js");
const { Product, Category, User } = require("./models");
const cors = require('cors')
const morgan = require("morgan")

const path = require("path");
const rateLimit = require("express-rate-limit");

app.use(
  "/login",
  rateLimit({
    windowMs: 15 * 60 * 1000, 
    max: 5,
    message: "Demasiados intentos, espera 15 minutos",
  })
);


app.use("/uploads", express.static(path.join(__dirname, "uploads")));


app.use(morgan("dev"));


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
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Cache-Control", "Pragma", "Expires"],
  })
);


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/", router);


sequelize
  .sync({ force:true  })
  .then(() => {
    console.log("DB sincronizada");
    const PORT = process.env.PORT || 3001;
    app.listen(PORT, () => console.log(`Servidor escuchando en puerto ${PORT}`));
  })
  .catch((err) => {
    console.error("Error al sincronizar la DB:", err);
  });
