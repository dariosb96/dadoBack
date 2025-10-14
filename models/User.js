const {DataTypes} = require('sequelize');
const sequelize = require('../db.js');

const User = sequelize.define('User', {
    id: {
        type: DataTypes.UUID,
        primaryKey : true,
        defaultValue: DataTypes.UUIDV4,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    businessName:{
        type: DataTypes.STRING,
        allowNull:false,
    },
    email:{
        type: DataTypes.STRING,
        allowNull:false
    },
    password:{
        type:DataTypes.STRING,
        allowNull: false
    },
    role:{
        type: DataTypes.ENUM("user", "superadmin"),
        defaultValue: "user",
    },
     image: {
    type: DataTypes.STRING,
    allowNull: true, 
  },
});

module.exports = User;