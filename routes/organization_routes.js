const {Router} = require('express');
const verifytoken = require('../middlewares/auth');
const allowOrgRoles = require('../middlewares/allowedRoles')

const {
  getAllOrgsHandler,
  getMyOrgHandler,
  updateMyOrgHandler,
  deleteOrgHandler,
  createOrgHandler,
  createStaffHandler,
  getStaffHandler,
  deleteStaffHandler
} = require('../handlers/organization_handler');

const OrganizationRouter = Router();

// Solo superadmin ve todas
OrganizationRouter.get("/", verifytoken, allowOrgRoles("owner"), getAllOrgsHandler);

// Mi organización
OrganizationRouter.get("/me", verifytoken, getMyOrgHandler);

// Editar mi org
OrganizationRouter.put("/me", verifytoken, allowOrgRoles("owner"), updateMyOrgHandler);

// Eliminar org (solo owner o superadmin)
OrganizationRouter.delete("/:id", verifytoken, allowOrgRoles("owner"), deleteOrgHandler);

// Crear org (usuario logueado)
OrganizationRouter.post("/new", verifytoken, createOrgHandler);

OrganizationRouter.post("/staff", verifytoken, createStaffHandler); 

OrganizationRouter.get("/", verifytoken, getStaffHandler); 

OrganizationRouter.delete("/:id", verifytoken, deleteStaffHandler);

module.exports.organizationRouter = OrganizationRouter;