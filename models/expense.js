const sequelize = require('../models/db');
const {DataTypes} = require('sequelize');
const User = require('./users');

const Expense = sequelize.define(
  'expense',
  {
    // Model attributes are defined here
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,  
        primaryKey: true,     
      },
    amount: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    category: {
      type: DataTypes.STRING
    },
    description:{
        type: DataTypes.STRING,
    }
  },
  {
    // Other model options go here
    freezeTableName: true,
  },
);

Expense.belongsTo(User);
User.hasMany(Expense);

module.exports =Expense;