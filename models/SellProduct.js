const { DataTypes } = require("sequelize");
const sequelize = require('../db.js')

const SellProduct = sequelize.define("SellProduct", {
  SellId: {
    type: DataTypes.UUID,
    allowNull: false,
    primaryKey: true,
  },
  ProductId: {
    type: DataTypes.UUID,
    allowNull: false,
    primaryKey: true,
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  price: {
    type: DataTypes.FLOAT,
    allowNull: true,
  }
}, {
  timestamps: true,
  tableName: "SellProducts",
  freezeTableName: true,
});

            
module.exports = SellProduct; 