const {
  getAllProd,
  createProduct,
  getProductById,
  updateProduct,
  deleteProduct,
  filterProducts,
  getActiveProd,
  getPublicCatalogByUser,
  getPublicCatalogs
} = require("../controllers/product_controller");


const getAllProductsHandler = async (req, res) => {
  const userId = req.userId;
  try {
    const products = await getAllProd(userId);
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getActiveHandler = async (req, res) => {
  try {
    const productsAv = await getActiveProd();
    res.status(200).json(productsAv);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getProductByHandler = async (req, res) => {
  try {
    const product = await getProductById(req.params.id);
    if (!product) return res.status(404).json({ error: "Producto no encontrado" });
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createProductHandler = async (req, res) => {
  try {
    const { name, description, buyPrice, price, stock, categoryId, variants } = req.body;
    const userId = req.userId;

    const parsedVariants = variants ? JSON.parse(variants) : [];
       const files = req.filesByField || {};
    const newProduct = await createProduct(
      {
        name,
        description,
        buyPrice,
        price,
        stock,
        categoryId,
        userId,
        variants: parsedVariants,
      },
      files
    );
    return res.status(201).json(newProduct);
  } catch (err) {
    console.error("createProductHandler error:", err);
    return res.status(500).json({ error: err.message });
  }
};

const updateProductHandler = async (req, res) => {
  try {
    const updated = await updateProduct(req);
    res.status(200).json(updated);
  } catch (error) {
    console.error("Error en updateProductHandler:", error);
    if (error.message === "Producto no encontrado") {
      res.status(404).json({ error: error.message });
    } else {
      res.status(500).json({ error: error.message });
    }
  }
};

const deleteProductHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const message = await deleteProduct(id);
    res.status(200).json(message);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};

const getProductFilter_handler = async (req, res) => {
  try {
    const result = await filterProducts(req.query);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getCatalogByuserHandler = async (req, res) => {
  const userId = req.params.userId;
  const { category } = req.query;
  try {
    const products = await getPublicCatalogByUser(userId, category);
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getAllPublicCatalogHandler = async (req, res) => {
  try {
    const catalogs = await getPublicCatalogs();
    res.status(200).json(catalogs);
  } catch (error) {
    res.status(500).json({ error: error.message });
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
  getCatalogByuserHandler,
  getAllPublicCatalogHandler,
};
