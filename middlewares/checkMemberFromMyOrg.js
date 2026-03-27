const { OrganizationMember } = require("../models");

const checkMemberFromMyOrg = async (req, res, next) => {
  try {
    const { memberId } = req.params;
    const myOrgId = req.user.organizationId;

    const member = await OrganizationMember.findByPk(memberId);

    if (!member) {
      return res.status(404).json({ message: "Miembro no encontrado" });
    }

    if (member.organizationId !== myOrgId) {
      return res.status(403).json({
        message: "No puedes gestionar miembros de otra organización"
      });
    }

    // guardamos por si el controller lo quiere usar
    req.member = member;

    next();
  } catch (error) {
    console.error("Error verificando miembro:", error);
    res.status(500).json({ message: "Error de autorización" });
  }
};

module.exports = checkMemberFromMyOrg;