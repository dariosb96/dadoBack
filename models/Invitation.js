const { DataTypes } = require("sequelize");
const sequelize = require("../db");


const Invitation = sequelize.define("Invitation", {
email: DataTypes.STRING,
role: DataTypes.ENUM("admin", "staff"),
status: {
type: DataTypes.ENUM("pending", "accepted", "expired"),
defaultValue: "pending"
},
token: DataTypes.STRING,
});

module.exports = Invitation;