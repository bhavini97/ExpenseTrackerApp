const { Expense } = require("../models/centralized");
const { User, db } = require("../models/centralized");
const FileDownload = require("../models/fileDownload");
/**
 * Retrieve expenses for a premium user with pagination.
 */
async function getExpenses(userId, page, limit) {
  if (!userId) {
    throw new Error("User ID is required");
  }

  const expenses = await Expense.findAndCountAll({
    where: { userId },
    offset: (page - 1) * limit,
    limit: parseInt(limit),
  });

  return {
    total: expenses.count,
    currentPage: parseInt(page),
    totalPages: Math.ceil(expenses.count / limit),
    expenses: expenses.rows,
  };
}

/**
 * Fetches leaderboard sorted by total expense.
 */
async function getLeaderboard(userId) {
  const user = await User.findByPk(userId);
  if (!user || !user.isPremium) {
    throw new Error("Access denied. Premium users only.");
  }

  const leaderboard = await User.findAll({
    attributes: ["id", "username", "totalExpense"],
    order: [["totalExpense", "DESC"]],
  });

  return leaderboard;
}

/**
 * Fetches user details including premium status.
 */
async function getUserDetails(userId) {
  if (!userId) throw new Error("User ID is missing!");

  const user = await User.findByPk(userId);
  if (!user) throw new Error("User not found!");

  return { isPremium: user.isPremium };
}

/**
 * Fetches list of downloaded files by a user.
 */
async function getDownloadedFiles(userId) {
  if (!userId) {
    throw new Error("User ID is required");
  }

  return await FileDownload.findAll({
    where: { userId },
    order: [["downloadedAt", "DESC"]],
  });
}


module.exports = { getExpenses , getLeaderboard, getUserDetails,getDownloadedFiles};
