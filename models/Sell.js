const { DataTypes } = require('sequelize');
const sequelize = require('../db.js');

const Sell = sequelize.define('Sell', {
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4,
  },

  status: {
    type: DataTypes.ENUM("pendiente", "finalizado"),
    defaultValue: "pendiente",
    allowNull: false,
  },

  finishDate: {
    type: DataTypes.DATE,
    allowNull: true,
  },

  numberOfProducts: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },

  totalAmount: {
    type: DataTypes.DECIMAL(12, 2),
    allowNull: false,
    defaultValue: 0.0,
  },

  userId: {
    type: DataTypes.UUID,
    allowNull: false,
  },

  organizationId: {
    type: DataTypes.UUID,
    allowNull: false,
  },

}, {
  timestamps: true,
});

module.exports = Sell;
