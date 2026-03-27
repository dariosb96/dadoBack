const { DataTypes } = require("sequelize");
const sequelize = require("../db.js");

const SellProduct = sequelize.define("SellProduct", {
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4,
  },

  SellId: {
    type: DataTypes.UUID,
    allowNull: false,
  },

  // 🔗 Referencias (opcionales a futuro)
  productId: {
    type: DataTypes.UUID,
    allowNull: true, 
  },

  variantId: {
    type: DataTypes.UUID,
    allowNull: true,
  },

  // 📦 SNAPSHOT DEL PRODUCTO AL MOMENTO DE VENTA
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  color: DataTypes.STRING,
  size: DataTypes.STRING,

  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },

  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },

  buyPrice: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },

}, {
  tableName: "SellProducts",
  timestamps: true,
});


module.exports = SellProduct;
