const { DataTypes } = require("sequelize");
const sequelize = require("../db");

const Branch = sequelize.define("Branch", {
id: { 
    type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
name:{
    type: DataTypes.STRING,
    allowNull: false,
}, 

address: {
   type: DataTypes.STRING,
   allowNull: true
}

});

module.exports = Branch;