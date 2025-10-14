const {Router} = require('express');
const { getAllCategories, getCategoryById_handler, createCat_handler, deleteCat_handler, getCategoryByUser_handler } = require('../handlers/category_handler');
const { getCatalogByuserHandler } = require('../handlers/product_handler');
const verifytoken = require('../middlewares/auth');

const CategoryRouter = Router();

CategoryRouter.get("/", getAllCategories);

/* 🔹 Categorías del usuario autenticado */
CategoryRouter.get("/all", verifytoken, getCategoryByUser_handler);

/* 🔹 Crear categoría (requiere token) */
CategoryRouter.post("/", verifytoken, createCat_handler);

/* 🔹 Obtener categoría por ID */
CategoryRouter.get("/:id", getCategoryById_handler);

/* 🔹 Eliminar categoría */
CategoryRouter.delete("/:id", deleteCat_handler);

module.exports.categoryRouter = CategoryRouter;