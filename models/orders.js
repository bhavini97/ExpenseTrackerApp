// models/order.js
const { DataTypes } = require("sequelize");
const sequelize = require("./db");
const User = require("./users");

const Order = sequelize.define("Order", {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  order_id: { type: DataTypes.STRING, allowNull: false, unique: true },
  user_id: { type: DataTypes.INTEGER, allowNull: false },
  amount: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
  status: { 
    type: DataTypes.ENUM("pending", "successful", "failed"), 
    defaultValue: "pending" 
  }
}, {
  timestamps: true,
});

Order.belongsTo(User, { foreignKey: "user_id" });
User.hasMany(Order, { foreignKey: "user_id" });

module.exports = Order;
