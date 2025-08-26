const {Router} = require('express');
const { getAllCategories, getCategoryById_handler, createCat_handler, deleteCat_handler } = require('../handlers/category_handler');

const CategoryRouter = Router();

CategoryRouter.get('/', getAllCategories);
CategoryRouter.get('/:id', getCategoryById_handler);
CategoryRouter.post('/', createCat_handler);
CategoryRouter.delete('/:id', deleteCat_handler);

module.exports.categoryRouter = CategoryRouter;