const { Expense, User, db } = require("../models/centralized");


// //insert expense data to expense table and Adds an expense for a user.

async function addExpense(userId, amount, category, description){
    const t = await db.transaction()
    try {
        const result = await Expense.create(
          { amount, category, description, userId },
          { transaction: t }
        );
    
        if (!result) throw new Error("Error while adding expense");
    
        // increment expense in userId
        await User.increment({ totalExpense: amount }, { where: { id: userId }, transaction: t });

        // Commit transaction (only if both operations succeed)
        await t.commit();
        return result;
      } catch (err) {
        await t.rollback();
        throw err;
      }
    }

// getting all expenses
async function getExpenses(userId) {
    return await Expense.findAll({ where: { userId } });
  }

  async function deleteExpense(id) {
    const t = await db.transaction();
    try {
      const expense = await Expense.findByPk(id, { transaction: t });
      if (!expense) throw new Error("Expense not found");
  
      await Expense.destroy({ where: { id }, transaction: t });

      // if there ate any deleted rows then delete expense from total expense from user table
      await User.update(
        { totalExpense: db.literal(`totalExpense - ${expense.amount}`) },
        { where: { id: expense.userId }, transaction: t }
      );
   
      //only commit when both transaction are successful
      await t.commit();
      return true;
    } catch (error) {
      await t.rollback();
      throw error;
    }
  }
  
  module.exports = { addExpense, getExpenses, deleteExpense };