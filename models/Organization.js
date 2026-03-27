const { DataTypes } = require("sequelize");
const sequelize = require("../db");

const Organization = sequelize.define("Organization", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  plan: {
    type: DataTypes.STRING,
    defaultValue: "free",
  },
}, {
  timestamps: true,
});

module.exports = Organization;