// middlewares/allowOrgRoles.js

const allowOrgRoles = (...allowedRoles) => {
  return (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({ message: "No autenticado" });
      }

      // 🔥 Superadmin global siempre puede
      if (req.user.role === "superadmin") {
        return next();
      }

      const userRoleInOrg = req.user.organizationRole;

      if (!userRoleInOrg) {
        return res.status(403).json({ message: "Usuario sin rol en la organización" });
      }

      if (!allowedRoles.includes(userRoleInOrg)) {
        return res.status(403).json({
          message: `Acceso denegado. Rol requerido: ${allowedRoles.join(", ")}`
        });
      }

      next();
    } catch (error) {
      console.error("Error en allowOrgRoles:", error);
      res.status(500).json({ message: "Error de autorización" });
    }
  };
};

module.exports = allowOrgRoles;