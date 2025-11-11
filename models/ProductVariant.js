// models/ProductVariant.js
const { DataTypes } = require('sequelize');
const sequelize = require('../db.js');

const ProductVariant = sequelize.define('ProductVariant', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  color: {
    type: DataTypes.STRING,
    allowNull: true, 
  },
  size: {
    type: DataTypes.STRING,
    allowNull: true, 
  },
  stock: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
  price: {
    type: DataTypes.DECIMAL,
    allowNull: true, 
  },
  buyPrice:{
    type:DataTypes.DECIMAL,
    allowNull: true
  },
  productId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'Products',
      key: 'id',
    },
    onDelete: 'CASCADE',
  },
}, {
  tableName: 'ProductVariants',
  timestamps: true,
});

module.exports = ProductVariant;
