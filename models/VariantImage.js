const { DataTypes } = require("sequelize");
const sequelize = require("../db");

const VariantImage = sequelize.define("VariantImage", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  url: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  variantId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
});

module.exports = VariantImage;
