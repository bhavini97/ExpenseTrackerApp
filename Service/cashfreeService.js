require('dotenv').config();
const {Cashfree} = require('cashfree-pg');
Cashfree.XClientId = process.env.CASHFREE_APP_ID;
Cashfree.XClientSecret = process.env.CASHFREE_SECRET_KEY;
Cashfree.XEnvironment = Cashfree.Environment.SANDBOX;

// this function is used many times. every time the button is clicked it will call this api and this api creates session id

exports.createOrder = async(
    orderId,
    orderAmount,
    order_currency = "INR",
    customerId,
    customerPhone
)=>{
    try{
        const userId = String(customerId);
        console.log('inside service')
        const expiryDate = new Date(Date.now() + 60*60*1000) //1 hr from now
        const formattedExpiryDate =expiryDate.toISOString();
        console.log('creating request')
        const request = {
            "order_amount": Number(orderAmount),
            "order_currency": order_currency,
            "order_id": orderId,
            "customer_details": {
                "customer_id": userId,
                "customer_phone": customerPhone
            },
            "order_meta": {
        "return_url": `http://localhost:3000/payment/payment-status/${orderId}`,
        "payment_methods": "cc,dc,upi"
        },
            "order_expiry_time": formattedExpiryDate
        };
        

        const response = await Cashfree.PGCreateOrder("2025-01-01", request);
    
    return response.data.payment_session_id // this session id is important we will have to send it in frontend
    
   
}catch(err){
    console.error('Error creating order:', err.response ? err.response.data : err.message);
}
};

exports.getPaymentStatus = async(orderId)=>{

try{
    console.log(orderId)
    const response = await Cashfree.PGOrderFetchPayments("2025-01-01",orderId);

    let getOrderResponse = response.data;
    let order_status;

    if(getOrderResponse.filter(transaction =>
        transaction.payment_status ==='SUCCESS'
    ).length>0){
        order_status ='SUCCESS'
    }else if(getOrderResponse.filter(transaction =>
        transaction.payment_status ==='PENDING'
    ).length>0){
         order_status ='PENDING'
    }else{
        order_status = 'FAILURE'
    }
    return order_status

}catch(err){
    console.error('error fetching order status',err.message)
}
}