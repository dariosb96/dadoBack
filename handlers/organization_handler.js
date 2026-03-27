const {
  createOrganization,
  getAllOrganizations,
  getOrganizationById,
  updateOrganization,
  deleteOrganization,
  createStaffMember,
  getStaffMembers,
  deleteStaffMember
} = require("../controllers/organization_controller");
const User = require("../models/User")


const createOrgHandler = async (req, res) => {
  try { 
    const org = await createOrganization(req.body);
  await User.update(
  {
    organizationId: org.id,
    organizationRole: "owner"
  },
  { where: { id: req.user.id } }
);

    res.status(201).json(org);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


const getAllOrgsHandler = async (req, res) => {
  try {
    if (req.user.role !== "superadmin")
      return res.status(403).json({ error: "No autorizado" });

    res.json(await getAllOrganizations());
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


const getMyOrgHandler = async (req, res) => {
  try {
    const org = await getOrganizationById(req.user.organizationId);
    res.json(org);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


const updateMyOrgHandler = async (req, res) => {
  try {
    const updated = await updateOrganization(req.user.organizationId, req.body);
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


const deleteOrgHandler = async (req, res) => {
  try {
    if (req.user.role !== "superadmin")
      return res.status(403).json({ error: "No autorizado" });

    res.json(await deleteOrganization(req.params.id));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createStaffHandler = async (req, res) => {
try {
if (!["admin", "superadmin"].includes(req.user.role)) {
return res.status(403).json({ error: "No autorizado" });
}


const { name, email, password } = req.body;


if (!name || !email || !password) {
return res.status(400).json({ error: "Faltan datos obligatorios" });
}


const staff = await createStaffMember({
name,
email,
password,
organizationId: req.user.organizationId,
});


res.status(201).json(staff);
} catch (error) {
res.status(400).json({ error: error.message });
}
};


// Listar staff de mi org
const getStaffHandler = async (req, res) => {
try {
const staff = await getStaffMembers(req.user.organizationId);
res.json(staff);
} catch (error) {
res.status(500).json({ error: error.message });
}
};


// Eliminar staff
const deleteStaffHandler = async (req, res) => {
try {
if (!["admin", "superadmin"].includes(req.user.role)) {
return res.status(403).json({ error: "No autorizado" });
}


const result = await deleteStaffMember(
req.params.id,
req.user.organizationId
);


res.json(result);
} catch (error) {
res.status(400).json({ error: error.message });
}
};

module.exports = {
  createOrgHandler,
  getAllOrgsHandler,
  getMyOrgHandler,
  updateMyOrgHandler,
  deleteOrgHandler,
  createStaffHandler,
  getStaffHandler,
  deleteStaffHandler,
};