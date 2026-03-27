const Organization = require("../models/Organization");

const createOrganization = async (data) => {
  return Organization.create(data);
};


const getAllOrganizations = async () => {
  return Organization.findAll({ order: [["createdAt", "DESC"]] });
};


const getOrganizationById = async (id) => {
  return Organization.findByPk(id);
};


const updateOrganization = async (id, data) => {
  const org = await Organization.findByPk(id);
  if (!org) throw new Error("Organización no encontrada");

  await org.update({
    name: data.name ?? org.name,
    logo: data.logo ?? org.logo,
    phone: data.phone ?? org.phone,
  });

  return org;
};

const deleteOrganization = async (id) => {
  const org = await Organization.findByPk(id);
  if (!org) throw new Error("Organización no encontrada");

  await org.destroy(); 
  return { message: "Organización eliminada" };
};

const createStaffMember = async ({ name, email, password, organizationId }) => {
const existing = await User.findOne({ where: { email } });
if (existing) throw new Error("El correo ya está registrado");


const hashedPassword = await bcrypt.hash(password, 12);


const staff = await User.create({
name,
email,
password: hashedPassword,
role: "staff",
organizationId, // 🔥 clave: misma organización
});


const cleanStaff = staff.toJSON();
delete cleanStaff.password;


return cleanStaff;
};


// Listar staff de mi organización
const getStaffMembers = async (organizationId) => {
return User.findAll({
where: { organizationId, role: "staff" },
attributes: { exclude: ["password"] },
order: [["createdAt", "DESC"]],
});
};


// Eliminar staff (solo de mi org)
const deleteStaffMember = async (staffId, organizationId) => {
const staff = await User.findOne({
where: { id: staffId, organizationId, role: "staff" },
});


if (!staff) throw new Error("Staff no encontrado en tu organización");


await staff.destroy();
return { message: "Staff eliminado correctamente" };
};
module.exports = {
  createOrganization,
  getAllOrganizations,
  getOrganizationById,
  updateOrganization,
  deleteOrganization,
  createStaffMember,
  getStaffMembers,
  deleteStaffMember
};