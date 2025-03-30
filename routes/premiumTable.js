const express = require("express");
const { Op } = require("sequelize");
const {Expense} = require("../models/centralized");
const router = express.Router();

const getDateRange = (filter) => {
    const now = new Date();
    let startDate, endDate;

    if (filter === "Weekly") {
        startDate = new Date(now.setDate(now.getDate() - 7));
        endDate = new Date();
    } else if (filter === "Monthly") {
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        endDate = new Date();
    } else if (filter === "Yearly") {
        startDate = new Date(now.getFullYear(), 0, 1);
        endDate = new Date();
    }

    return { startDate, endDate };
};

router.get("/", async (req, res) => {
    try {
        const { filter = "Weekly", page = 1, limit = 5 } = req.query;

        if (filter === "Yearly") {
            // Yearly aggregation
            const expenses = await Expense.findAll({
                attributes: [
                    [sequelize.fn("MONTH", sequelize.col("date")), "month"],
                    [sequelize.fn("SUM", sequelize.col("income")), "totalIncome"],
                    [sequelize.fn("SUM", sequelize.col("expense")), "totalExpense"],
                    [sequelize.literal("SUM(income) - SUM(expense)"), "savings"]
                ],
                group: ["month"],
                order: [["month", "ASC"]],
            });

            return res.json({ expenses, totalPages: 1 });
        }

        const { startDate, endDate } = getDateRange(filter);

        const expenses = await Expense.findAndCountAll({
            where: { createdAt: { [Op.between]: [startDate, endDate] } },  //  Use createdAt
            offset: (page - 1) * limit,
            limit: parseInt(limit),
            order: [["createdAt", "DESC"]],  // Sort by createdAt
        });
        
        const totalExpenses = expenses.count; 
        res.json({
            total: totalExpenses,
            currentPage: parseInt(page),
            totalPages: Math.ceil(totalExpenses / limit),
            expenses,
        });
    } catch (err) {
        console.error("Error fetching expenses:", err);
        res.status(500).json({ message: "Server error" });
    }
});

module.exports = router;
