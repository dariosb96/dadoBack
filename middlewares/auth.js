const jwt = require("jsonwebtoken");
const  User  = require("../models/User"); 
const secret = process.env.JWT_SECRET;

const verifyToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Token missing or malformed" });
  }
  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, secret);
    req.userId = decoded.id;
    req.userRole = decoded.role;

    const user = await User.findByPk(decoded.id);

    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }
    req.user = user; 
    next();

  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "El token ha expirado" });
    } else if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ message: "Token inválido" });
    } else {
      return res.status(500).json({ message: "Error al validar el token" });
    }
  }
};

module.exports = verifyToken;
