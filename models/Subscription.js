const { DataTypes } = require("sequelize");
const sequelize = require("../db");

const Subscription = sequelize.define("Subscription", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },

  plan: {
    type: DataTypes.ENUM("basic", "pro", "business"),
    allowNull: false,
    defaultValue: "basic",
  },

  status: {
    type: DataTypes.ENUM("active", "past_due", "canceled", "trial"),
    defaultValue: "trial",
  },

  currentPeriodEnd: {
    type: DataTypes.DATE,
    allowNull: true
  },

  trialEndsAt: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  paymentProvider:{
    type: DataTypes.STRING,
    allowNull: false
  },  
externalCustomerId: {
   type: DataTypes.STRING,
   allowNull: true
  },
externalSubscriptionId:{
  type: DataTypes.STRING,
  allowNull: true
}
});

module.exports = Subscription;