const Category = require ("../models/Category");

const getCategories = async () => {
    const categories = await Category.findAll();
    return categories;
};

const createCategory = async (Data) => {
    const newCategory = await Category.create(Data);
        return newCategory;
};

 const  getCategoryById = async (id) => {
    const category = await Category.findByPk(id);
    return category;
 }

 const deleteCategory = async(id) => {
    const category = await Category.findByPk(id);

    if(!category) throw new Error("producto no encontrado");

     await category.destroy();
     return {message: 'categoria eliminado con  exito'}
 };

 module.exports = {
    getCategories,
    createCategory,
    getCategoryById,
    deleteCategory
 }