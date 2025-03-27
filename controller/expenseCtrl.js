const { User, Expense, db } = require("../models/centralized");

module.exports = {
  postExpense: async (req, res) => {
    console.log(req.body);
    const { amount, category, description } = req.body;

    const userId = req.user.userId; // Extract userId from JWT

    if (!req.user || !req.user.userId) {
      return res.status(401).json({ message: "Unauthorized: User ID missing" });
    }
    if (!amount || !category || !description) {
      return res.status(400).json({ message: "All fields are required" });
    }

    try {
      const result = await Expense.create({
        amount: amount,
        category: category,
        description: description,
        userId: userId,
      });

      if (!result) {
        return res
          .status(400)
          .json({ message: "error while adding expense", err });
      }

      const addExpenseToUser = await User.increment("totalExpense", {
        by: amount,
        where: {
          id: userId,
        },
      });

      return res
        .status(200)
        .json({
          message: "expense added successfully",
          result,
          addExpenseToUser,
        });
    } catch (err) {
      console.error("something went wrong when adding expense", err);
      return res
        .status(400)
        .json({ message: "error while adding expense", err });
    }
  },

  getExpense: async (req, res) => {
    try {
      console.log(req.user);
      const userId = req.user.userId; // Extracted from JWT that is send from jwt.js

      if (!req.user || !req.user.userId) {
        return res
          .status(401)
          .json({ message: "Unauthorized: User ID missing" });
      }

      const expenses = await Expense.findAll({ where: { userId: userId } });
      return res.status(200).json(expenses);
    } catch (err) {
      console.error("Error fetching expenses:", err);
      return res.status(500).json({ message: "Error fetching expenses", err });
    }
  },

  deleteExp: async (req, res) => {
    const id = req.params.id;

    try {
      const expense = await Expense.findByPk(id);
        if (!expense) {
            return res.status(404).json({ message: "Expense not found" });
        }
      const deletedRows = await Expense.destroy({ where: { id: id } });
      if (deletedRows > 0) {
        res.status(200).json({ message: "Expense deleted successfully" });
        await User.update(
          { total_expense: Sequelize.literal(`totalExpense - ${expense.amount}`) },
          { where: { id: req.user.userId } }
      );

      } else {
        res.status(404).json({ message: "Expense not found" });
      }
    } catch (error) {
      res.status(500).json({ message: "Error deleting expense", error });
    }
  },
};
