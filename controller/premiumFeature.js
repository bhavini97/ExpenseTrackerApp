
const {Expense} = require("../models/centralized");
const sequelize = require('../models/db')

module.exports = {

    // send expense table to premium user id
    getTable : async (req, res) => {
        try {
            const { page , limit } = req.query;
            const userId = req.user.userId; // getting userId
        

            if(!userId){
                return res.status(401).json({ message: "User ID is required" });
            }
    
    
            const expenses = await Expense.findAndCountAll({
                where :{userId},
                offset: (page - 1) * limit,
                limit: parseInt(limit),
            });
            
            res.json({
                total: expenses.count,
                currentPage: parseInt(page),
                totalPages: Math.ceil(expenses.count / limit),
                expenses: expenses.rows, 
            });
        } catch (err) {
            console.error("Error fetching expenses:", err);
            res.status(500).json({ message: "Server error" });
        }
    },
}