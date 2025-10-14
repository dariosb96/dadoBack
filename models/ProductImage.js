const { DataTypes } = require("sequelize");
const sequelize = require("../db.js");

const ProductImage = sequelize.define(
  "ProductImage",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    url: {
      type: DataTypes.STRING,
      allowNull: false, // la URL o path de la imagen
    },
    public_id: {
      type: DataTypes.STRING,
      allowNull: true, // para Cloudinary
    },
    productId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "Products",
        key: "id",
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    },
  },
  {
    tableName: "ProductImages",
    timestamps: true,
  }
);

module.exports = ProductImage;
