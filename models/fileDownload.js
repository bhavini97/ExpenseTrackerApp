// models/fileDownload.js
const { DataTypes } = require("sequelize");
const sequelize = require("./db");
const User = require('./users');
const FileDownload = sequelize.define("FileDownload", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  fileUrl: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  downloadedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
});
FileDownload.belongsTo(User);
User.hasMany(FileDownload);
module.exports = FileDownload;
