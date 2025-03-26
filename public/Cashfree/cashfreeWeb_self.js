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

       //initaiate checkout options
       let checkoutOptions = {
        paymentSessionId : paymentSessionId,

        //new page payment option
        redirectTarget : _self //default
       }

       //start the checkout process
       await cashfree.checkout(checkoutOptions);
    }catch(err){
        console.error('error while starting check out the payment', err.message)
    }
});