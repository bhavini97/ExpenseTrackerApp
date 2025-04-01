const cashfree = Cashfree({
    mode: "sandbox",
});
document.getElementById("renderBtn").addEventListener("click", async() => {

    const amount = document.getElementById("amount").value;
    const phone = document.getElementById("phone").value;
    const token = localStorage.getItem("token");  // Get JWT token
    
    if (!token) {
        alert("User not logged in");
        return;
    }
    
    // fetch session id from backend
    try{
       const response = await fetch('http://3.110.219.92/payment/pay',{
        method:"POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // Send token
        },
        body: JSON.stringify({ amount, phone }), // Send amount & phone
    });

    console.log('in cashfreeWeb_self')
       const data = await response.json()
       const paymentSessionId = data.paymentSessionId;
       const orderId = data.orderId

       //initaiate checkout options
       let checkoutOptions = {
        paymentSessionId : paymentSessionId,

        //new page payment option
        redirectTarget : "_self"//default
       }

       //start the checkout process
       setTimeout(async () => {
       
          await cashfree.checkout(checkoutOptions);
        
    }, 500);

       const res = await fetch(`http://3.110.219.92/payment/payment-status/${orderId}`,{
        method :"GET",
        headers: {
            "Authorization": `Bearer ${localStorage.getItem("token")}`, // Include token
            "Content-Type": "application/json"
        }
    })

    const result = await res.json()
    console.log(result)
    alert("Your payment is: " + result.orderStatus);
    }catch(err){
        console.error('error while starting check out the payment', err.message)
    }
});