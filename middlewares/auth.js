const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Organization = require("../models/Organization");

const secret = process.env.JWT_SECRET;

const verifyToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Token missing or malformed" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, secret);
    

    const user = await User.findByPk(decoded.id, {
      include: [{ model: Organization, attributes: ["id", "plan"] }]
    });

    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

 

    // 🔥 AQUÍ ESTÁ LA CLAVE DE TODO TU SISTEMA
    req.user = {
      id: user.id,
      role: user.role, // rol global (superadmin, etc)
      organizationRole: user.organizationRole, // owner/admin/staff dentro del negocio
      organizationId: user.organizationId,
      organizationPlan: user.Organization?.plan || "free"
    };

    next();

  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "El token ha expirado" });
    } else if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ message: "Token inválido" });
    } else {
      console.error("Error verifyToken:", error);
      return res.status(500).json({ message: "Error al validar el token" });
    }
  }
};

module.exports = verifyToken;