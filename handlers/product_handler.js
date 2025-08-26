const { BADQUERY } = require("dns");
const { getAllProd, createProduct, getProductById, updateProduct, deleteProduct, filterProducts, getActiveProd, getPublicCatalogByUser, getAllCatalogs, getPublicCatalogs } = require("../controllers/product_controller");

 const getAllProductsHandler = async(req, res) => {
    const userId = req.userId;
    try {
      
        const products = await getAllProd(userId);
        res.json(products);
    }catch (error){
        res.status(500).json({error: error.message})
    }
 }
 
 const getActiveHandler = async (req,res) => {
    try{
        const productsAv = await getActiveProd();
        res.status(200).json(productsAv);
    }catch (error){
        res.status(500).json({error: error.message})
    }
 }

 const getProductByHandler = async (req,res) => {
    try{
        const product = await getProductById(req.params.id);
        if ( !product) return res.status(404).json({error: "producto no ecnontrado"})
        res.json(product);

    }catch(error) {
        res.status(500).json({error: error.message});
    }
 };

 const createProductHandler = async (req, res) => {
    try {
       const { name, description,buyPrice, price, stock, categoryId } = req.body;
    const image = req.file?.path;
    const public_id = req.file?.filename;
    const userId = req.userId;


    const newProduct = await createProduct({
      name,
      description,
      price,
      buyPrice,
      stock,
      categoryId,
      userId,
      image,
      public_id,
    });
        res.status(201).json(newProduct);
    }catch ( error) {
        res.status(500).json({error: error.message});
    }
 };

 const updateProductHandler = async (req, res) => {
    try{
        const updatedProduct = await updateProduct(req.params.id, req.body, req.file);
        res.status(200).json(updatedProduct);
    }catch(error){
        res.status(400).json({error: error.message})
    }
 }
 const deleteProductHandler = async (req, res) => {
    try{
 const result = await deleteProduct(req.params.id);
 res.json(result);
    }catch(error){
        res.status(400).json({error: error.message});
    }
 }
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
    try{
        const products = await getPublicCatalogByUser(userId);
        res.status(200).json(products);
    }catch(error){
        res.status(500).json({error: error.message});
    }
};

const getAllPublicCatalogHandler = async (req,res) => {
    try{
        const catalogs = await getPublicCatalogs();
        res.status(200).json(catalogs); 
    }catch(error){
        res.status(500).json({error: error.message})
    }
} 

 module.exports = {
    getAllProductsHandler,
    getProductByHandler,
    createProductHandler,
    updateProductHandler,
    deleteProductHandler,
    getProductFilter_handler,
    getActiveHandler,
    getCatalogByuserHandler,
    getAllPublicCatalogHandler
 }