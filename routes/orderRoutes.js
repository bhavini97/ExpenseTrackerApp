const express = require("express");
const router = express.Router();
const orderCtrl = require('../controller/orderCtrl');
const path = require("path");
const authMiddleware = require('../middleware/jwt')

router.get('/makePayment',(req,res)=>{
     res.sendFile(path.join(__dirname, "..", "public", "Cashfree","payment.html"));
})
router.post('/pay',authMiddleware,orderCtrl.postPaymentOrder);
router.get('/payment-status/:orderId',authMiddleware,orderCtrl.getPaymentStatus);

module.exports = router
