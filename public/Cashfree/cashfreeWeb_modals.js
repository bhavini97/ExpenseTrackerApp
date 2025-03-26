const cashfree = Cashfree({
    mode: "sandbox",
});
document.getElementById("renderBtn").addEventListener("click", async() => {

    // fetch session id from backend
    try{
       const response = await fetch('http://localhost:3000/pay',{
        method:"POST",
       })
       const data = await response.json()
       const paymentSessionId = data.paymentSessionId;
       const orderId = data.orderId

       //initaiate checkout options
       let checkoutOptions = {
        paymentSessionId : paymentSessionId,

        //new page payment option
        redirectTarget : _modal //default
       }

       //start the checkout process
       const result = await cashfree.checkout(checkoutOptions);

       if(result.error){
        console.error(result.error)
       }

       if(result.paymentDetails){
        console.log(result.paymentDetails.paymentMessage)
        const response = await fetch(`http://localhost:3000/payment-status/${orderId}`,{
            method :"GET"
        })

        const data = await response.json()
        alert("your payment is ",data.orderStatus)
       }
    }catch(err){

    }
});