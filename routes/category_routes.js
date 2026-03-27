const {Router} = require('express');
const {
  getAllCategories,
  getCategoryById_handler,
  createCat_handler,
  deleteCat_handler,
  updateCat_handler,
 
} = require('../handlers/category_handler');

const verifytoken = require('../middlewares/auth');
const allowOrgRoles = require('../middlewares/allowedRoles')

const CategoryRouter = Router();

// ⚠️ SOLO superadmin debería ver todas
CategoryRouter.get("/", verifytoken, allowOrgRoles("owner"), getAllCategories);

CategoryRouter.post("/", verifytoken, allowOrgRoles("owner","admin"), createCat_handler);
CategoryRouter.get("/:id", verifytoken, allowOrgRoles("owner","admin","staff"), getCategoryById_handler);
CategoryRouter.delete("/:id", verifytoken, allowOrgRoles("owner","admin"), deleteCat_handler);
CategoryRouter.put("/update/:id", verifytoken, allowOrgRoles("owner","admin"), updateCat_handler);
module.exports.categoryRouter = CategoryRouter;