const Product = require("../models/Product");
const Category = require("../models/Category");
const User = require("../models/User");
const Sell = require("../models/Sell");
const SellProduct = require("../models/SellProduct");
const ProductImage = require("../models/ProductImage");
const ProductVariant = require("../models/ProductVariant");
const VariantImage = require("../models/VariantImage");
const Organization = require("../models/Organization");
const Subscription = require("../models/Subscription");
const Branch = require("../models/Branch");
const Invitation = require("../models/Invitation");
const Payment = require("../models/Payment")
// Categorías ↔ Productos
Category.hasMany(Product, { foreignKey: "categoryId" });
Product.belongsTo(Category, { foreignKey: "categoryId" });

//  Usuario ↔ Productos
User.hasMany(Product, { foreignKey: "userId", onDelete: "CASCADE" });
Product.belongsTo(User, { foreignKey: "userId" });

// Producto ↔ Imágenes
Product.hasMany(ProductImage, {
  foreignKey: "productId",
  as: "images",
  onDelete: "CASCADE",
});
ProductImage.belongsTo(Product, { foreignKey: "productId" });

//  Producto ↔ Variantes
Product.hasMany(ProductVariant, {
  as: "variants",
  foreignKey: "productId",
  onDelete: "CASCADE",
});
ProductVariant.belongsTo(Product, { foreignKey: "productId" });
//  Variante ↔ Imágenes
ProductVariant.hasMany(VariantImage, {
  as: "images",
  foreignKey: "variantId",
  onDelete: "CASCADE",
});
VariantImage.belongsTo(ProductVariant, { foreignKey: "variantId" });

// Usuario ↔ Ventas  (FALTABA ESTA)
User.hasMany(Sell, { foreignKey: "userId", as: "sales", onDelete: "CASCADE" });
Sell.belongsTo(User, { foreignKey: "userId", as: "user" });

// Venta ↔ Productos vendidos (intermedia)
Sell.hasMany(SellProduct, {
  foreignKey: "SellId",
  as: "items",
  onDelete: "CASCADE",
});
SellProduct.belongsTo(Sell, { foreignKey: "SellId", as: "sell" });

//  Producto ↔ Productos vendidos (intermedia)
Product.hasMany(SellProduct, {
  foreignKey: "productId",
  onDelete: "SET NULL" // 🔥 CLAVE
});

SellProduct.belongsTo(Product, {
  foreignKey: "productId",
  onDelete: "SET NULL"
});

//  Variante ↔ Productos vendidos
ProductVariant.hasMany(SellProduct, {
  foreignKey: "variantId",
  as: "variantItems",
});
SellProduct.belongsTo(ProductVariant, { foreignKey: "variantId", as: "variant" });

//  Many-to-Many real: Venta ↔ Producto
Product.belongsToMany(Sell, {
  through: SellProduct,
  foreignKey: "productId",
  otherKey: "SellId",
  as: "sells",
});
Sell.belongsToMany(Product, {
  through: SellProduct,
  foreignKey: "SellId",
  otherKey: "productId",
  as: "products",
});



// Organización ↔ Productos
Organization.hasMany(Product, { foreignKey: "organizationId" });
Product.belongsTo(Organization, { foreignKey: "organizationId" });


// Organización ↔ Categorías
Organization.hasMany(Category, { foreignKey: "organizationId" });
Category.belongsTo(Organization, { foreignKey: "organizationId" });


// Organización ↔ Ventas
Organization.hasMany(Sell, { foreignKey: "organizationId" });
Sell.belongsTo(Organization, { foreignKey: "organizationId" });
Organization.hasMany(User, { foreignKey: "organizationId", onDelete: "CASCADE" });
User.belongsTo(Organization, { foreignKey: "organizationId" });

Organization.hasMany(Product, { foreignKey: "organizationId", onDelete: "CASCADE" });
Product.belongsTo(Organization, { foreignKey: "organizationId" });

Organization.hasMany(Category, { foreignKey: "organizationId", onDelete: "CASCADE" });
Category.belongsTo(Organization, { foreignKey: "organizationId" });

Organization.hasMany(Sell, { foreignKey: "organizationId", onDelete: "CASCADE" });
Sell.belongsTo(Organization, { foreignKey: "organizationId" });

// Organization ↔ Subscription
Organization.hasOne(Subscription, { foreignKey: "organizationId" });
Subscription.belongsTo(Organization, { foreignKey: "organizationId" });

Organization.hasMany(Branch);
Branch.belongsTo(Organization);

Organization.hasMany(Invitation);
Invitation.belongsTo(Organization);


Subscription.hasMany(Payment);
Payment.belongsTo(Subscription);
module.exports = {
  Product,
  Category,
  User,
  Sell,
  SellProduct,
  ProductImage,
  ProductVariant,
  VariantImage,
  Organization,
  Subscription,
  Branch,
  Invitation,
  Payment
};
