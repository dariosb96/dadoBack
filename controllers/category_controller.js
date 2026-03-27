const Category = require("../models/Category");

/* 🔹 Obtener TODAS las categorías (solo superadmin en futuro) */
const getCategories = async () => {
  return await Category.findAll({
    order: [["createdAt", "ASC"]],
  });
};

/* 🔹 Obtener categorías por organización */
const getCategoriesByOrganization = async (organizationId) => {
  if (!organizationId) throw new Error("Organización no válida");

  return await Category.findAll({
    where: { organizationId },
    order: [["createdAt", "ASC"]],
  });
};

const createCategory = async (name, reqUser) => {
  const { organizationId } = reqUser;

  if (!organizationId) throw new Error("Organización no válida");
  if (!name) throw new Error("El nombre es obligatorio");


  const existingCategory = await Category.findOne({
    where: { name, organizationId },
  });

  if (existingCategory) {
    throw new Error("Ya existe una categoría con ese nombre");
  }

  return await Category.create({
    name,
    organizationId,
  });
};


/* 🔹 Obtener categoría por ID validando organización */
const getCategoryById = async (id, organizationId) => {
  return await Category.findOne({
    where: {
      id,
      organizationId,
    },
  });
};

/* 🔹 Eliminar categoría validando organización */
const deleteCategory = async (id, organizationId) => {
  const category = await Category.findOne({
    where: {
      id,
      organizationId,
    },
  });

  if (!category) throw new Error("Categoría no encontrada");

  await category.destroy();
  return { message: "Categoría eliminada con éxito" };
};

const updateCategory = async (id, organizationId, newName) => {
  if (!organizationId) throw new Error("Organización no válida");
  if (!newName) throw new Error("El nombre es obligatorio");

  // Buscar categoría actual
  const category = await Category.findOne({
    where: { id, organizationId },
  });

  if (!category) throw new Error("Categoría no encontrada");

  // 🔥 Validar duplicado (otra categoría con mismo nombre en la misma org)
  const existingCategory = await Category.findOne({
    where: {
      name: newName,
      organizationId,
    },
  });

  if (existingCategory && existingCategory.id !== id) {
    throw new Error("Ya existe una categoría con ese nombre en tu organización");
  }

  category.name = newName;
  await category.save();

  return category;
};

module.exports = {
  getCategories,
  getCategoriesByOrganization,
  createCategory,
  getCategoryById,
  deleteCategory,
  updateCategory
};