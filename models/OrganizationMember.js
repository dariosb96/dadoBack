const { DataTypes } = require("sequelize");
const sequelize = require("../db");

const OrganizationMember = sequelize.define("OrganizationMember", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },

  role: {
    type: DataTypes.ENUM("owner", "admin", "staff"),
    defaultValue: "staff",
  },

  status: {
    type: DataTypes.ENUM("pending", "approved", "rejected"),
    defaultValue: "pending",
  }
});

module.exports = OrganizationMember;