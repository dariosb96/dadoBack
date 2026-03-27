const {DataTypes} = require('sequelize');
const sequelize = require('../db.js');
const User = sequelize.define('User', {
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email:{
    type: DataTypes.STRING,
    allowNull:false,
    unique: true,
    validate:{isEmail: true},
  },
  phone:{
    type: DataTypes.STRING,
    allowNull:true
  },
  password:{
    type:DataTypes.STRING,
    allowNull: false
  },

  // 🔥 Rol global (plataforma)
  role:{
    type: DataTypes.ENUM("superadmin", "admin", "staff"),
    defaultValue: "admin",
  },

  // 🔥 Rol dentro de la organización
organizationRole: {
  type: DataTypes.ENUM("owner", "admin", "staff"),
  defaultValue: "owner",
  allowNull: true
},
organizationId: {
  type: DataTypes.UUID,
  allowNull: true,
},
  image: {
    type: DataTypes.STRING,
    allowNull: true, 
  },

});

module.exports = User;