const Category = require("../models/Category");

/* 🔹 Obtener TODAS las categorías (solo superadmin en futuro) */
const getCategories = async () => {
  const categories = await Category.findAll({
    order: [["createdAt", "ASC"]],
  });
  return categories;
};

/* 🔹 Obtener categorías por usuario autenticado */
const getCategoriesByUser = async (userId) => {
  if (!userId) throw new Error("Usuario no autenticado");

  const categories = await Category.findAll({
    where: { userId },
    order: [["createdAt", "ASC"]],
  });
  return categories;
};

/* 🔹 Crear categoría */
const createCategory = async ({ name, userId }) => {
  if (!name) throw new Error("El nombre es obligatorio");

  const newCategory = await Category.create({
    name,
    userId,
  });

  return newCategory;
};

/* 🔹 Obtener categoría por ID */
const getCategoryById = async (id) => {
  const category = await Category.findByPk(id);
  return category;
};

/* 🔹 Eliminar categoría */
const deleteCategory = async (id) => {
  const category = await Category.findByPk(id);
  if (!category) throw new Error("Categoría no encontrada");

  await category.destroy();
  return { message: "Categoría eliminada con éxito" };
};

module.exports = {
  getCategories,
  getCategoriesByUser,
  createCategory,
  getCategoryById,
  deleteCategory,
};
