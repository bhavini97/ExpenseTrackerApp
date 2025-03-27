const { User,Expense,db } = require("../models/centralized");

module.exports = {
  postExpense: async (req, res) => {
    console.log(req.body);
    const { amount, category, description } = req.body;

    const userId = req.user.userId; // Extract userId from JWT

    if (!req.user || !req.user.userId) {
      return res.status(401).json({ message: "Unauthorized: User ID missing" });
  }
    if (!amount || !category || !description ) {
      return res.status(400).json({ message: "All fields are required" });
    }

    try {
      const result = await Expense.create({
        amount: amount,
        category: category,
        description: description,
        userId: userId, 
      });

      return res
        .status(200)
        .json({ message: "expense added successfully", result });
    } catch (err) {
      console.error("something went wrong when adding expense", err);
      return res
        .status(400)
        .json({ message: "error while adding expense", err });
    }
  },

  getExpense: async (req, res) => {
    try {
      console.log(req.user)
      const userId = req.user.userId;  // Extracted from JWT that is send from jwt.js
       
      if (!req.user || !req.user.userId) {
        return res.status(401).json({ message: "Unauthorized: User ID missing" });
    }
  
      const expenses = await Expense.findAll({ where: { userId: userId }});
      return res.status(200).json(expenses);
    } catch (err) {
      console.error("Error fetching expenses:", err);
      return res.status(500).json({ message: "Error fetching expenses", err });
    }
  },

  deleteExp: async (req, res) => {
    const id = req.params.id;

    try {
      const deletedRows = await Expense.destroy({ where: { id: id } });
      if (deletedRows > 0) {
        res.status(200).json({ message: "Expense deleted successfully" });
      } else {
        res.status(404).json({ message: "Expense not found" });
      }
    } catch (error) {
      res.status(500).json({ message: "Error deleting expense", error });
    }
  },
  getLeaderboard : async (req, res) => {
    try {
        const user = await User.findByPk(req.user.userId); // Get logged-in user

        if (!user || !user.isPremium) { // Ensure only premium users can access
            return res.status(403).json({ message: "Access denied. Premium users only." });
        }

        // Get total expense per user
        const leaderboard = await db.query(
          `SELECT users.id, users.username, 
          COALESCE(SUM(expense.amount), 0) AS total_expense 
   FROM users 
   LEFT JOIN expense ON users.id = expense.userId 
   
   GROUP BY users.id 
   ORDER BY total_expense DESC;`
        )
        // COALESCE(SUM(expense.amount), 0)  to ensure the userid with no expense appears as 0
        console.log(leaderboard)

        res.status(200).json({ leaderboard });
    } catch (err) {
        console.error("Error fetching leaderboard:", err);
        res.status(500).json({ message: "Error fetching leaderboard" });
    }
  }
};
