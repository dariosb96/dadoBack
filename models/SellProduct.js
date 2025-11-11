const { DataTypes } = require("sequelize");
const sequelize = require("../db.js");

const SellProduct = sequelize.define(
  "SellProduct",
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4, // clave primaria única
    },
    SellId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "Sells", // nombre de la tabla Sell
        key: "id",
      },
      onDelete: "CASCADE",
    },
    ProductId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "Products",
        key: "id",
      },
      onDelete: "CASCADE",
    },
    variantId: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: "ProductVariants",
        key: "id",
      },
      onDelete: "SET NULL",
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
  },
  {
    tableName: "SellProducts",
    timestamps: true,
    freezeTableName: true,
  }
);

module.exports = SellProduct;
