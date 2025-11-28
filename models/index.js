// // const Product = require("../models/Product");
// // const Category = require("../models/Category");
// // const User = require("../models/User");
// // const Sell = require("../models/Sell");
// // const SellProduct = require("../models/SellProduct");
// // const ProductImage = require("../models/ProductImage");
// // const ProductVariant = require("../models/ProductVariant");
// // const VariantImage = require("../models/VariantImage");


// // Category.hasMany(Product, { foreignKey: "categoryId" });
// // Product.belongsTo(Category, { foreignKey: "categoryId" });


// // User.hasMany(Product, { foreignKey: "userId", onDelete: "CASCADE" });
// // Product.belongsTo(User, { foreignKey: "userId" });

// // User.hasMany(Category, { foreignKey: "userId", onDelete: "CASCADE" });
// // Category.belongsTo(User, { foreignKey: "userId" });

// // Product.hasMany(ProductImage, {
// //   foreignKey: "productId",
// //   as: "images",
// //   onDelete: "CASCADE",
// // });
// // ProductImage.belongsTo(Product, { foreignKey: "productId" });

// // Product.hasMany(ProductVariant, {
// //   as: "variants",
// //   foreignKey: "productId",
// //   onDelete: "CASCADE",
// // });
// // ProductVariant.belongsTo(Product, { foreignKey: "productId" });

// // ProductVariant.hasMany(VariantImage, {
// //   as: "images",
// //   foreignKey: "variantId",
// //   onDelete: "CASCADE",
// // });
// // VariantImage.belongsTo(ProductVariant, { foreignKey: "variantId" });

// // // User.hasMany(Sell, { foreignKey: "userId", as: "sales", onDelete: "CASCADE" });
// // Sell.belongsTo(User, { foreignKey: "userId", as: "user" });

// // // 💰 Venta ↔️ Productos vendidos
// // Sell.hasMany(SellProduct, { foreignKey: "SellId", as: "items", onDelete: "CASCADE" });
// // SellProduct.belongsTo(Sell, { foreignKey: "SellId", as: "sell" });

// // // 🛍️ Producto ↔️ Productos vendidos
// // Product.hasMany(SellProduct, { foreignKey: "ProductId", as: "productItems" });
// // SellProduct.belongsTo(Product, { foreignKey: "ProductId", as: "product" });

// // // 🎨 Variante ↔️ Productos vendidos
// // ProductVariant.hasMany(SellProduct, { foreignKey: "variantId", as: "variantItems" });
// // SellProduct.belongsTo(ProductVariant, { foreignKey: "variantId", as: "variant" });


// // module.exports = {
// //   Product,
// //   Category,
// //   User,
// //   Sell,
// //   SellProduct,
// //   ProductImage,
// //   ProductVariant,
// //   VariantImage,
// // };



// const Product = require("../models/Product");
// const Category = require("../models/Category");
// const User = require("../models/User");
// const Sell = require("../models/Sell");
// const SellProduct = require("../models/SellProduct");
// const ProductImage = require("../models/ProductImage");
// const ProductVariant = require("../models/ProductVariant");
// const VariantImage = require("../models/VariantImage");

// // ==========================
// // 🔗 ASOCIACIONES
// // ==========================

// // 🏷️ Categorías ↔️ Productos
// Category.hasMany(Product, { foreignKey: "categoryId" });
// Product.belongsTo(Category, { foreignKey: "categoryId" });

// // 👤 Usuario ↔️ Productos
// User.hasMany(Product, { foreignKey: "userId", onDelete: "CASCADE" });
// Product.belongsTo(User, { foreignKey: "userId" });

// // 👤 Usuario ↔️ Categorías
// User.hasMany(Category, { foreignKey: "userId", onDelete: "CASCADE" });
// Category.belongsTo(User, { foreignKey: "userId" });

// // 🖼️ Producto ↔️ Imágenes
// Product.hasMany(ProductImage, {
//   foreignKey: "productId",
//   as: "images",
//   onDelete: "CASCADE",
// });
// ProductImage.belongsTo(Product, { foreignKey: "productId" });

// // 🎨 Producto ↔️ Variantes
// Product.hasMany(ProductVariant, {
//   as: "variants",
//   foreignKey: "productId",
//   onDelete: "CASCADE",
// });
// ProductVariant.belongsTo(Product, { foreignKey: "productId" });

// // 🖼️ Variante ↔️ Imágenes
// ProductVariant.hasMany(VariantImage, {
//   as: "images",
//   foreignKey: "variantId",
//   onDelete: "CASCADE",
// });
// VariantImage.belongsTo(ProductVariant, { foreignKey: "variantId" });

// // 💰 Venta ↔️ Usuario
// Sell.belongsTo(User, { foreignKey: "userId", as: "user" });

// // 💰 Venta ↔️ Productos vendidos (intermedia)
// Sell.hasMany(SellProduct, {
//   foreignKey: "SellId",
//   as: "items",
//   onDelete: "CASCADE",
// });
// SellProduct.belongsTo(Sell, { foreignKey: "SellId", as: "sell" });

// // 🛍️ Producto ↔️ Productos vendidos (intermedia)
// Product.hasMany(SellProduct, {
//   foreignKey: "ProductId",
//   as: "productItems",
// });
// SellProduct.belongsTo(Product, { foreignKey: "ProductId", as: "product" });

// // 🎨 Variante ↔️ Productos vendidos
// ProductVariant.hasMany(SellProduct, {
//   foreignKey: "variantId",
//   as: "variantItems",
// });
// SellProduct.belongsTo(ProductVariant, { foreignKey: "variantId", as: "variant" });

// // 🧾 Many-to-Many real: Venta ↔️ Producto
// Product.belongsToMany(Sell, {
//   through: SellProduct,
//   foreignKey: "ProductId",
//   otherKey: "SellId",
//   as: "sells",
// });
// Sell.belongsToMany(Product, {
//   through: SellProduct,
//   foreignKey: "SellId",
//   otherKey: "ProductId",
//   as: "products",
// });

// module.exports = {
//   Product,
//   Category,
//   User,
//   Sell,
//   SellProduct,
//   ProductImage,
//   ProductVariant,
//   VariantImage,
// };

const Product = require("../models/Product");
const Category = require("../models/Category");
const User = require("../models/User");
const Sell = require("../models/Sell");
const SellProduct = require("../models/SellProduct");
const ProductImage = require("../models/ProductImage");
const ProductVariant = require("../models/ProductVariant");
const VariantImage = require("../models/VariantImage");

// ==========================
// 🔗 ASOCIACIONES COMPLETAS
// ==========================

// 🏷️ Categorías ↔️ Productos
Category.hasMany(Product, { foreignKey: "categoryId" });
Product.belongsTo(Category, { foreignKey: "categoryId" });

// 👤 Usuario ↔️ Productos
User.hasMany(Product, { foreignKey: "userId", onDelete: "CASCADE" });
Product.belongsTo(User, { foreignKey: "userId" });

// 👤 Usuario ↔️ Categorías
User.hasMany(Category, { foreignKey: "userId", onDelete: "CASCADE" });
Category.belongsTo(User, { foreignKey: "userId" });

// 🖼️ Producto ↔️ Imágenes
Product.hasMany(ProductImage, {
  foreignKey: "productId",
  as: "images",
  onDelete: "CASCADE",
});
ProductImage.belongsTo(Product, { foreignKey: "productId" });

// 🎨 Producto ↔️ Variantes
Product.hasMany(ProductVariant, {
  as: "variants",
  foreignKey: "productId",
  onDelete: "CASCADE",
});
ProductVariant.belongsTo(Product, { foreignKey: "productId" });

// 🖼️ Variante ↔️ Imágenes
ProductVariant.hasMany(VariantImage, {
  as: "images",
  foreignKey: "variantId",
  onDelete: "CASCADE",
});
VariantImage.belongsTo(ProductVariant, { foreignKey: "variantId" });

// 💰 Usuario ↔️ Ventas  (FALTABA ESTA)
User.hasMany(Sell, { foreignKey: "userId", as: "sales", onDelete: "CASCADE" });
Sell.belongsTo(User, { foreignKey: "userId", as: "user" });

// 💰 Venta ↔️ Productos vendidos (intermedia)
Sell.hasMany(SellProduct, {
  foreignKey: "SellId",
  as: "items",
  onDelete: "CASCADE",
});
SellProduct.belongsTo(Sell, { foreignKey: "SellId", as: "sell" });

// 🛍️ Producto ↔️ Productos vendidos (intermedia)
Product.hasMany(SellProduct, {
  foreignKey: "ProductId",
  as: "productItems",
});
SellProduct.belongsTo(Product, { foreignKey: "ProductId", as: "product" });

// 🎨 Variante ↔️ Productos vendidos
ProductVariant.hasMany(SellProduct, {
  foreignKey: "variantId",
  as: "variantItems",
});
SellProduct.belongsTo(ProductVariant, { foreignKey: "variantId", as: "variant" });

// 🧾 Many-to-Many real: Venta ↔️ Producto
Product.belongsToMany(Sell, {
  through: SellProduct,
  foreignKey: "ProductId",
  otherKey: "SellId",
  as: "sells",
});
Sell.belongsToMany(Product, {
  through: SellProduct,
  foreignKey: "SellId",
  otherKey: "ProductId",
  as: "products",
});

module.exports = {
  Product,
  Category,
  User,
  Sell,
  SellProduct,
  ProductImage,
  ProductVariant,
  VariantImage,
};
