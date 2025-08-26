const {DataTypes} = require('sequelize');
const sequelize = require('../db.js');

const Category = sequelize.define('Category', {
    id: {
        type: DataTypes.UUID,
        primaryKey : true,
        defaultValue: DataTypes.UUIDV1,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
});

module.exports = Category;