// middlewares/isSuperAdmin.js
const jwt = require("jsonwebtoken");
const secret = process.env.JWT_SECRET;

const isSuperAdmin = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Token missing or malformed" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, secret);

    if (decoded.role !== "superadmin") {
      return res.status(403).json({ message: "Acceso denegado: requiere rol superadmin" });
    }

    req.userId = decoded.id;
    req.userRole = decoded.role;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

module.exports = isSuperAdmin;
