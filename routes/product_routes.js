const {Router} = require('express');
const upload = require("../middlewares/upload");
const { getProductByHandler, getAllProductsHandler, createProductHandler, updateProductHandler, deleteProductHandler, getProductFilter_handler, getActiveHandler, getCatalogByuserHandler, getAllCatalogsHandler, getAllPublicCatalogHandler } = require('../handlers/product_handler');
const verifytoken = require('../middlewares/auth');

const ProductRouter = Router();

ProductRouter.get('/', verifytoken, getAllProductsHandler);
ProductRouter.get('/stock', getActiveHandler);
ProductRouter.get('/filter', getProductFilter_handler);
ProductRouter.get('/catalogs', getAllPublicCatalogHandler); // <-- antes de :userId y :id
ProductRouter.get('/catalog/:userId', getCatalogByuserHandler);
ProductRouter.get('/:id', getProductByHandler);
ProductRouter.post('/', verifytoken, upload.single("image"), createProductHandler);
ProductRouter.put('/:id', verifytoken, updateProductHandler);
ProductRouter.delete('/:id', verifytoken, deleteProductHandler);



module.exports.productRouter = ProductRouter;
