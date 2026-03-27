const {
  getCategories,
  getCategoriesByOrganization,
  createCategory,
  getCategoryById,
  deleteCategory,
  updateCategory
} = require("../controllers/category_controller");

/* 🔹 Obtener TODAS las categorías (futuro: solo superadmin) */
const getAllCategories = async (req, res) => {
  try {
    const categories = await getCategories();
    res.status(200).json(categories);
  } catch (error) {
    console.error("Error en getAllCategories:", error);
    res.status(500).json({ error: error.message });
  }
};

/* 🔹 Obtener categorías de la organización del usuario */
const getCategoriesByOrg_handler = async (req, res) => {
  try {
    const organizationId = req.user.organizationId;

    const categories = await getCategoriesByOrganization(organizationId);
    res.status(200).json(categories);
  } catch (error) {
    console.error("Error en getCategoriesByOrg_handler:", error);
    res.status(500).json({ error: error.message });
  }
};

/* 🔹 Crear nueva categoría para la organización */
const createCat_handler = async (req, res) => {
  try {
    const { name } = req.body;

    const newCategory = await createCategory(name, req.user);

    res.status(201).json(newCategory);
  } catch (error) {
    console.error("Error en createCat_handler:", error);
    res.status(500).json({ error: error.message });
  }
};
/* 🔹 Obtener categoría por ID (validando que pertenezca a la org) */
const getCategoryById_handler = async (req, res) => {
  try {
    const organizationId = req.user.organizationId;
    const category = await getCategoryById(req.params.id, organizationId);

    if (!category) {
      return res.status(404).json({ error: "Categoría no encontrada" });
    }

    res.status(200).json(category);
  } catch (error) {
    console.error("Error en getCategoryById_handler:", error);
    res.status(500).json({ error: error.message });
  }
};

/* 🔹 Eliminar categoría (solo si pertenece a la org) */
const deleteCat_handler = async (req, res) => {
  try {
    const organizationId = req.user.organizationId;

    const result = await deleteCategory(req.params.id, organizationId);
    res.status(200).json(result);
  } catch (error) {
    console.error("Error en deleteCat_handler:", error);
    res.status(500).json({ error: error.message });
  }
};

const updateCat_handler = async (req, res) => {
  try {
    const { name } = req.body;
    const { id } = req.params;
    const organizationId = req.user.organizationId;

    const updatedCategory = await updateCategory(id, organizationId, name);

    res.status(200).json(updatedCategory);
  } catch (error) {
    console.error("Error en updateCat_handler:", error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getAllCategories,
  getCategoriesByOrg_handler,
  createCat_handler,
  getCategoryById_handler,
  deleteCat_handler,
  updateCat_handler
};