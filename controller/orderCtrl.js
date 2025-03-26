const {Order} = require('../models/centralized');
const {User} = require('../models/centralized');
const cashfreeService = require('../Service/cashfreeService');

module.exports = {
    postPaymentOrder : async(req,res)=>{
        const userId = req.user.userId;
        const {amount,phone} = req.body;

        if (!amount || !phone) {
            return res.status(400).json({ message: "Amount and phone are required" });
        }

        if(!userId){
            return res.status(401).json({ message: "User ID is required" });
        }

        const orderId = `ORDER_${Date.now()}`; // Generate unique order ID

        try{
            const paymentSessionId = await cashfreeService.createOrder(orderId,amount,"INR",userId,phone);
            console.log(paymentSessionId)

            const result = await Order.create({
                order_id: orderId,
            user_id: userId,
            amount: amount,
            status: "pending",
            })
            res.status(200).json({ paymentSessionId, orderId });

        }catch(err){
            console.error("Error in /pay API:", err);
            res.status(500).json({ message: "Error creating payment session", error: err.message });
        }
    },

    // for getting payment status and changing order status as required
    getPaymentStatus : async(req,res)=>{
        const orderId = req.params.orderId;

        if(!orderId){
            return res.status(400).json({ message: "Order Id not received" });
        }

        try{
          
            const order_status = await cashfreeService.getPaymentStatus(orderId);
            console.log(order_status)
            if(!order_status){
                return res.status(401).json({ message: "Error while retrieving order status from cashFreeService" });
            }
            if(order_status !=='PENDING'){
                if (order_status === 'SUCCESS') {
                    const order = await Order.findOne({ where: { order_id: orderId } });

                if (!order) {
                    return res.status(404).json({ message: "Order not found" });
                }
                if (order_status === "SUCCESS") {
                    await User.update({ isPremium: true }, { where: { id: order.user_id } });
                    console.log(`User ${order.user_id} is now premium`);
                }
                const [result] = await Order.update({status:order_status},{where:{order_id:orderId}});

                if(result >0){
                    console.log('order status updated successfully')
                }else{
                     console.error('encountered error while changing order status in database')
                    return res.status(404).json({ message: "Paymentm Successful but encountered error while changing order status in database" ,orderStatus: order_status });
                }
            }else{
                return res.status(300).json({ message: "Payment status still pending" ,orderStatus: order_status });
            }

                return res.status(200).json({ message: "Payment Successful" ,orderStatus: order_status });
            

        }}catch(err){
            console.error("Error in payment-status/:orderId API:", err);
            res.status(500).json({ message: "Error getting payment status", error: err.message });
        }
    },
}