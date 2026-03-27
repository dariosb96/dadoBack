const {Router} = require('express');
const verifytoken = require('../middlewares/auth');
const allowOrgRoles = require('../middlewares/allowedRoles')
const {uploadMultiple} = require("../middlewares/upload");
const handlers = require('../handlers/product_handler');

const ProductRouter = Router();

ProductRouter.get('/', verifytoken, allowOrgRoles("owner","admin","staff"), handlers.getAllProductsHandler);
ProductRouter.get('/stock', verifytoken, allowOrgRoles("owner","admin","staff"), handlers.getActiveHandler);
ProductRouter.get('/filter', verifytoken, allowOrgRoles("owner","admin","staff"), handlers.getProductFilter_handler);

ProductRouter.post('/', verifytoken, allowOrgRoles("owner","admin"), uploadMultiple, handlers.createProductHandler);
ProductRouter.put('/:id', verifytoken, allowOrgRoles("owner","admin"), uploadMultiple, handlers.updateProductHandler);
ProductRouter.delete('/:id', verifytoken, allowOrgRoles("owner","admin"), handlers.deleteProductHandler);

module.exports.productRouter = ProductRouter;