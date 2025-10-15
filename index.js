require("dotenv").config();
const express = require("express");
const app = express();
const sequelize = require("./db.js");
const router = require("./routes/index.js");
const { Product, Category, User } = require("./models");
const cors = require('cors')
const morgan = require("morgan")


const path = require('path');

const rateLimit = require('express-rate-limit');

app.use('/login', rateLimit({ windowMs: 15*60*1000, max: 5 }));


app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(morgan("dev"));
app.use( cors ({
    origin: 'http://dado-front.vercel.app',
    credentials: true,
 methods: ['GET','POST','PUT','DELETE','OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Cache-Control', 'Pragma', 'Expires']
}));


app.use(express.json());
app.use("/", router); 
app.use("/uploads", express.static("uploads"));




sequelize.sync({ force:false}).then( () => {
    console.log("DB sincronizada");
    app.listen(3001, () => console.log("Servidor escuchando en puerto 3001 "));
}).catch(err => {
  console.error("Error al sincronizar la DB:", err);
});