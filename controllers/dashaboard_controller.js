const Product = require("../models/Product")
const Category = require("../models/Category");
const User = require("../models/User")
const {fn,col}= require('sequelize');

const getDashBoard = async () => {
    const totalProducts = await Product.count();
    const totalCategories = await Category.count();
    const totalStock = await Product.sum('stock');

    const products = await Product.findAll({
        attributes: ['price', 'buyPrice', 'stock']
    });

    let estimateProfit = 0;
    products.forEach(p => {
        estimateProfit += (p.price - p.buyPrice) * p.stock;
    });

    const topProducts = await Product.findAll({
        limit: 5,
        order: [['stock', 'DESC']],
        attributes: ['name', 'stock']
    });

    return {
        totalProducts,
        totalCategories,
        totalStock,
        estimateProfit,
        topProducts
    };
};

const getAllCatalogs = async () => {
    const catalogs = await User.findAll({
        include: [
            {
                model: Product,
                where: {isActive:true},
                include: [Category]
            }
        ]
    });
    return catalogs;
}

module.exports = {getDashBoard, getAllCatalogs};