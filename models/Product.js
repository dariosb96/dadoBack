const {DataTypes} = require('sequelize');
const sequelize = require('../db.js');

const Product = sequelize.define('Product',{
  id: {
    type:DataTypes.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description:{
    type: DataTypes.TEXT,
    allowNull: true,
  }, 
  color:{
    type: DataTypes.STRING,
    allowNull: true,
  },

  buyPrice: {
    type: DataTypes.DECIMAL(10,2),
    allowNull:false
  },
 
  price: {
    type: DataTypes.DECIMAL(10,2),
    allowNull: false,
  },

  stock: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  },

  reserved: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    allowNull: false,
  },

  isActive: {
    type:DataTypes.BOOLEAN,
    defaultValue: true
  },

  public_id: {
    type:DataTypes.STRING,
    allowNull: true
  },

  categoryId: {
    type: DataTypes.UUID,
    allowNull: false,
  },

  organizationId: {
    type: DataTypes.UUID,
    allowNull: false, // 🔥 obligatorio en SaaS
  },

}, {
  tableName: 'Products',
  timestamps: true,
  defaultScope: {
    include: [
      { association: 'images' },
      { association: 'variants', include: [{ association: 'images' }] }
    ]
  }
});

module.exports = Product;