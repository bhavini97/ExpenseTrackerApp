const { DataTypes } = require("sequelize");
const sequelize = require("./db");
const User = require("./users");
const { v4: uuidv4 } = require("uuid");

const ForgotPasswordRequest = sequelize.define("ForgetPassword", {
    id: {  type: DataTypes.UUID,
        defaultValue: uuidv4, // Automatically generate UUID
        allowNull: false,
        primaryKey: true, },
    user_id: { type: DataTypes.INTEGER, allowNull: false },
    isActive: { 
        type: DataTypes.BOOLEAN,
        defaultValue: true, // Initially active
        allowNull: false,
    }
  }, {
    timestamps: true,
  });
  
  ForgotPasswordRequest.belongsTo(User, { foreignKey: "user_id" });
  User.hasMany(ForgotPasswordRequest, { foreignKey: "user_id" });

  module.exports = ForgotPasswordRequest
  