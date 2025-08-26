const {DataTypes} = require('sequelize');
const sequelize = require('../db.js');

const Product = sequelize.define('Product',{
    id: {
        type:DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV1,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description:{
        type: DataTypes.STRING,
        allowNull: true,
    }, 
    buyPrice: {
        type: DataTypes.INTEGER,
        allowNull:false
    },
    price: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    image:  { 
        type:   DataTypes.STRING,
        allowNull: true
    },
         stock: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    isActive: {
        type:DataTypes.BOOLEAN,
        defaultValue: true
    },
    public_id: {
        type:DataTypes.STRING,
        allowNull: true
    },
     userId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id'
    },
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
  },
     categoryId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'Categories',
      key: 'id',
    },
        onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  }
}, {
  tableName: 'Products',
  timestamps: true
});

module.exports = Product;