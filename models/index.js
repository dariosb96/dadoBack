const Product = require("../models/Product");
const Category = require("../models/Category");
const User = require("../models/User")
const Sell = require("../models/Sell")
const SellProduct = require("../models/SellProduct");

Category.hasMany(Product, { foreignKey: "categoryId" });
Product.belongsTo(Category, { foreignKey: "categoryId" });

User.hasMany(Product, { foreignKey: "userId" });
Product.belongsTo(User, { foreignKey: "userId" });

User.hasMany(Sell, { foreignKey: "userId", onDelete: "CASCADE" });
Sell.belongsTo(User, { foreignKey: "userId" });

Sell.belongsToMany(Product, { through: SellProduct });
Product.belongsToMany(Sell, { through: SellProduct });

module.exports = {
    Product,
    Category,
    User,
    Sell,
    SellProduct
}