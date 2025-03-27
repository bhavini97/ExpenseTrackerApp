const express = require("express");
const router = express.Router();
const expCtrl = require('../controller/expenseCtrl');
const path = require("path");
const authMiddleware = require('../middleware/jwt')

router.get('/add-expense',(req,res)=>{
    res.sendFile(path.join(__dirname, "..", "public", "expense.html"));
});

router.post('/add-expense',authMiddleware,expCtrl.postExpense);
router.get('/get-expense',authMiddleware,expCtrl.getExpense)
router.delete('/delete/:id',authMiddleware,expCtrl.deleteExp);


module.exports = router;