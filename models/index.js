const Product = require("../models/Product");
const Category = require("../models/Category");
const User = require("../models/User")

Category.hasMany(Product, { foreignKey: "categoryId" });
Product.belongsTo(Category, { foreignKey: "categoryId" });

User.hasMany(Product, { foreignKey: "userId" });
Product.belongsTo(User, { foreignKey: "userId" });

module.exports = {
    Product,
    Category,
    User
}