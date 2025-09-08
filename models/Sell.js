const {DataTypes} = require('sequelize');
const sequelize = require('../db.js');

const Sell = sequelize.define('Sell', {
    id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV1,
    },
    creationDate: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        allowNull: false,
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
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0.0,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "Users",
        key: "id",
      },
    },
  },
  {
    timestamps: true,      // Sequelize añade createdAt/updatedAt
    createdAt: "createdAt", 
    updatedAt: false,      // no necesitamos updatedAt en este caso
  });

module.exports = Sell;
