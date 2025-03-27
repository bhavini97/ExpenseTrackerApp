// models/order.js
const { DataTypes } = require("sequelize");
const sequelize = require("./db");
const User = require("./users");

const Order = sequelize.define("Order", {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  order_id: { type: DataTypes.STRING, allowNull: false },
  user_id: { type: DataTypes.INTEGER, allowNull: false },
  amount: { type: DataTypes.INTEGER, allowNull: false },
  status: { 
    type: DataTypes.ENUM("PENDING", "SUCCESS", "FAILURE"), 
    defaultValue: "PENDING" 
  }
}, {
  timestamps: true,
});

Order.belongsTo(User, { foreignKey: "user_id" });
User.hasMany(Order, { foreignKey: "user_id" });

module.exports = Order;
