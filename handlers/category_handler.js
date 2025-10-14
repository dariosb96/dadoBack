const {
  getCategories,
  getCategoriesByUser,
  createCategory,
  getCategoryById,
  deleteCategory,
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

/* 🔹 Obtener categorías del usuario autenticado */
const getCategoryByUser_handler = async (req, res) => {
  try {
    const userId = req.userId; // viene del token
    const categories = await getCategoriesByUser(userId);
    res.status(200).json(categories);
  } catch (error) {
    console.error("Error en getCategoryByUser_handler:", error);
    res.status(500).json({ error: error.message });
  }
};

/* 🔹 Crear nueva categoría */
const createCat_handler = async (req, res) => {
  try {
    const userId = req.userId; // viene del token
    const { name } = req.body;

    if (!name) return res.status(400).json({ error: "El nombre es obligatorio" });

    const newCategory = await createCategory({ name, userId });
    res.status(201).json(newCategory);
  } catch (error) {
    console.error("Error en createCat_handler:", error);
    res.status(500).json({ error: error.message });
  }
};

/* 🔹 Obtener categoría por ID */
const getCategoryById_handler = async (req, res) => {
  try {
    const category = await getCategoryById(req.params.id);
    if (!category) return res.status(404).json({ error: "Categoría no encontrada" });

    res.status(200).json(category);
  } catch (error) {
    console.error("Error en getCategoryById_handler:", error);
    res.status(500).json({ error: error.message });
  }
};

/* 🔹 Eliminar categoría */
const deleteCat_handler = async (req, res) => {
  try {
    const result = await deleteCategory(req.params.id);
    res.status(200).json(result);
  } catch (error) {
    console.error("Error en deleteCat_handler:", error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getAllCategories,
  getCategoryByUser_handler,
  createCat_handler,
  getCategoryById_handler,
  deleteCat_handler,
};
