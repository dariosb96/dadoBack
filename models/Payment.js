const { DataTypes } = require("sequelize");
const sequelize = require("../db");

const Payment = sequelize.define("Payment", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },

  subscriptionId: {
    type: DataTypes.UUID,
    allowNull: false,
  },

  amount: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },

  method: {
    type: DataTypes.ENUM("cash", "transfer"),
    allowNull: false,
  },

  reference: DataTypes.STRING, // Folio o nota

  paidAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },

  registeredBy: DataTypes.UUID, // Usuario admin que registró el pago
});

module.exports = Payment;