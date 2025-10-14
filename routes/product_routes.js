const {Router} = require('express');
const {uploadMultiple} = require("../middlewares/upload");
const { getProductByHandler, getAllProductsHandler, createProductHandler, updateProductHandler, deleteProductHandler, getProductFilter_handler, getActiveHandler, getCatalogByuserHandler,  getAllPublicCatalogHandler } = require('../handlers/product_handler');
const verifytoken = require('../middlewares/auth');

const ProductRouter = Router();

ProductRouter.get('/', verifytoken, getAllProductsHandler);
ProductRouter.get('/stock', getActiveHandler);
ProductRouter.get('/filter', getProductFilter_handler);
ProductRouter.get('/catalogs', getAllPublicCatalogHandler); 
ProductRouter.get('/catalogs/:userId', getCatalogByuserHandler);
ProductRouter.get('/:id', getProductByHandler);
ProductRouter.post('/', verifytoken, uploadMultiple, createProductHandler);
ProductRouter.put('/:id', verifytoken,uploadMultiple, updateProductHandler);
ProductRouter.delete('/:id', verifytoken, deleteProductHandler);



module.exports.productRouter = ProductRouter;
