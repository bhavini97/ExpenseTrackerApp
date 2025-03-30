const { User, Expense, db } = require("../models/centralized");
module.exports = {

  //insert expense data to expense table
  postExpense: async (req, res) => {
    console.log(req.body);
    const { amount, category, description } = req.body;
    
    const userId = req.user.userId; // Extract userId from JWT
    const t = await db.transaction();

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
      },{
        transaction :t
      });

      if (!result) {
        return res.status(400).json({ message: "error while adding expense", err });
      }
// increment expense in userId
      const addExpenseToUser = await User.increment(
        { totalExpense: amount }, 
        {
          where: { id: userId },
          transaction: t, 
        }
      );
        console.log('in post expense',addExpenseToUser)
       // Commit transaction (only if both operations succeed)
          await t.commit();

        // find the updates user and sending data to frontend
        const updatedUser = await User.findOne({
          where: { id: userId },
          attributes: ["id", "totalExpense"],
        });
        console.log('updates expense',updatedUser.totalExpense)

      return res.status(200).json({  message: "expense added successfully",result,totalExpense: updatedUser.totalExpense});
    } catch (err) {
      await t.rollback()
      console.error("something went wrong when adding expense", err);
      return res
        .status(400)
        .json({ message: "error while adding expense", err });
    }
  },

  // getting expense from expense table
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
    
    const t = await db.transaction();
    try {
      
      const expense = await Expense.findByPk(id,{transaction :t});
        if (!expense) {
          await t.rollback()
            return res.status(404).json({ message: "Expense not found" });
        }

       // console.log(expense);
      const deletedRows = await Expense.destroy({ where: { id: id } },{transaction : t});

      // if there ate any deleted rows then delete expense from total expense from user table
      if (deletedRows > 0) {
        await User.update(
          { totalExpense: db.literal(`totalExpense - ${expense.amount}`) },
          { where: { id: expense.userId } },
          {transaction : t}
        );
        
        //only commit when both transaction are successful
       await t.commit();
        return res.status(200).json({ message: "Expense deleted successfully" });

      } else {
        res.status(404).json({ message: "Expense not found" });
      }
    } catch (error) {
     await t.rollback();
      res.status(500).json({ message: "Error deleting expense", error });
    }
  },
};
