const uploadToS3 = require("../Service/S3service")
const AWS = require('aws-sdk')
const { addExpense, getExpenses, deleteExpense } = require("../Service/expenseService");
const FileDownload = require('../models/fileDownload');

module.exports = {

  //insert expense data to expense table
  postExpense: async (req, res) => {
    try {
      const { amount, category, description } = req.body;
      if (!amount || !category || !description) return res.status(400).json({ message: "All fields are required" });
      // calling add expense from service
      const result = await addExpense(req.user.userId, amount, category, description);
      return res.status(200).json({ message: "Expense added successfully", result });
    } catch (err) {
      return res.status(400).json({ message: err.message });
    }
  },

  // getting expense from expense table
  getExpense: async (req, res) => {
    try {
      const expenses = await getExpenses(req.user.userId);
      return res.status(200).json(expenses);
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  },

  deleteExp: async (req, res) => {
    try {
      const success = await deleteExpense(req.params.id);
      if (!success) return res.status(404).json({ message: "Expense not found" });
      return res.status(200).json({ message: "Expense deleted successfully" });
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  },

  // download expense file
  downloadExp: async(req,res)=>{
    try {
      const expenses = await getExpenses(req.user.userId);
      // constructing filename with userid and date to make it unique
      const fileName = `Expenses${req.user.userId}/${new Date().toISOString()}.txt`;
      const fileUrl = await uploadToS3(JSON.stringify(expenses), fileName);

      try{
        await FileDownload.create({
          userId: req.user.userId,
          fileUrl: fileUrl,
          downloadedAt: new Date(),
        });
      }catch(err){
          throw new Error('file url cannot inserted')
      }
      return res.status(200).json({ fileUrl, SUCCESS: true });
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  },
};
