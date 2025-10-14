const Product = require("../models/Product");
const Category = require("../models/Category");
const User = require("../models/User")
const Sell = require("../models/Sell")
const SellProduct = require("../models/SellProduct");
const ProductImage = require("../models/ProductImage");

Category.hasMany(Product, { foreignKey: "categoryId" });
Product.belongsTo(Category, { foreignKey: "categoryId" });

User.hasMany(Product, { foreignKey: "userId" });
Product.belongsTo(User, { foreignKey: "userId" });

Product.hasMany(ProductImage, { foreignKey: "productId", as: "images" });
ProductImage.belongsTo(Product, { foreignKey: "productId" });

User.hasMany(Sell, { foreignKey: "userId", onDelete: "CASCADE" });
Sell.belongsTo(User, { foreignKey: "userId" });

Sell.belongsToMany(Product, { through: SellProduct, foreignKey: "SellId", otherKey: "ProductId" });
Product.belongsToMany(Sell, { through: SellProduct, foreignKey: "ProductId", otherKey: "SellId" });

/*/ Relaciones top products /*/
SellProduct.belongsTo(Product, { foreignKey: "ProductId" });
Product.hasMany(SellProduct, { foreignKey: "ProductId" });

SellProduct.belongsTo(Sell, { foreignKey: "SellId" });
Sell.hasMany(SellProduct, { foreignKey: "SellId" });

User.hasMany(Category, { foreignKey: 'userId', onDelete: 'CASCADE' });
Category.belongsTo(User, { foreignKey: 'userId' });


module.exports = {
    Product,
    Category,
    User,
    Sell,
    SellProduct,
    ProductImage
}