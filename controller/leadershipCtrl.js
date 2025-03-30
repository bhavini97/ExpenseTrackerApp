const { User, Expense, db } = require("../models/centralized");

module.exports = {
  getLeaderboard: async (req, res) => {
    try {
      const user = await User.findByPk(req.user.userId); // Get logged-in user

      if (!user || !user.isPremium) {
        // Ensure only premium users can access
        return res
          .status(403)
          .json({ message: "Access denied. Premium users only." });
      }

      // Get total expense per user
      //         const leaderboard = await db.query(
      //           `SELECT users.id, users.username,
      //           COALESCE(SUM(expense.amount), 0) AS total_expense
      //    FROM users
      //    LEFT JOIN expense ON users.id = expense.userId

      //    GROUP BY users.id
      //    ORDER BY total_expense DESC;`
      //         )
      // COALESCE(SUM(expense.amount), 0)  to ensure the userid with no expense appears as 0
      const leaderboard = await User.findAll({
        attributes: ["id", "username", "totalExpense"],
        order: [["totalExpense", "DESC"]],
      });
     

      res.status(200).json({ leaderboard });
    } catch (err) {
      console.error("Error fetching leaderboard:", err);
      res.status(500).json({ message: "Error fetching leaderboard" });
    }
  },

  // getting user details to know about its premium status
  getUserDetails: async (req, res) => {
    if (!req.user.userId) {
      return res
        .status(400)
        .json({ message: "User id not found in req header(in getUserDetail)" });
    }

    try {
      const result = await User.findByPk(req.user.userId);

      console.log("User Details Fetched:", result);
      return res
        .status(200)
        .json({ message: "User dtails", isPremium: result.isPremium });
    } catch (err) {
      return res
        .status(500)
        .json({ message: "Error getting detail of user", err });
    }
  },
};
