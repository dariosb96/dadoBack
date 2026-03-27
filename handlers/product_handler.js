const {
  getAllProd,
  createProduct,
  getProductById,
  updateProduct,
  deleteProduct,
  filterProducts,
  getActiveProd,
} = require("../controllers/product_controller");

const getAllProductsHandler = async (req, res) => {
  try {
    res.json(await getAllProd(req.user.id));
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const getActiveHandler = async (req, res) => {
  try {
    res.json(await getActiveProd(req.user.id));
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const getProductByHandler = async (req, res) => {
  try {
    const product = await getProductById(req.params.id, req.user.id);
    if (!product) return res.status(404).json({ error: "Producto no encontrado" });
    res.json(product);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const createProductHandler = async (req, res) => {
  try {
    let parsedVariants = [];
    if (req.body.variants) {
      parsedVariants =
        typeof req.body.variants === "string"
          ? JSON.parse(req.body.variants)
          : req.body.variants;
    }

    const product = await createProduct(
      { ...req.body, variants: parsedVariants, userId: req.user.id },
      req.filesByField
    );

    res.status(201).json(product);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const updateProductHandler = async (req, res) => {
  try {
    req.userId = req.user.id;
    res.json(await updateProduct(req));
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const deleteProductHandler = async (req, res) => {
  try {
    res.json(await deleteProduct(req.params.id, req.user.id));
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const getProductFilter_handler = async (req, res) => {
  try {
    res.json(await filterProducts(req.query, req.user.id));
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

module.exports = {
  getAllProductsHandler,
  getProductByHandler,
  createProductHandler,
  updateProductHandler,
  deleteProductHandler,
  getProductFilter_handler,
  getActiveHandler,
};
