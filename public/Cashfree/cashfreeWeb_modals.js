let cashfree;
window.onload = function () {
     cashfree= Cashfree({
        mode: "sandbox",
    });
};
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
       const response = await fetch('http://localhost:3000/payment/pay',{
        method:"POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // Send token
        },
        body: JSON.stringify({ amount, phone }), // Send amount & phone
       })
       const data = await response.json()
       const paymentSessionId = data.paymentSessionId;
       const orderId = data.orderId

       //initaiate checkout options
       let checkoutOptions = {
        paymentSessionId : paymentSessionId,

        //new page payment option
        redirectTarget : "_modal" //default
       }

       //start the checkout process
       const result = await cashfree.checkout(checkoutOptions);

       if(result.error){
        console.error(result.error)
       }

       if(result.paymentDetails){
        console.log(result.paymentDetails.paymentMessage)
        const response = await fetch(`http://localhost:3000/payment/payment-status/${orderId}`,{
            method :"GET",
            headers: {
                "Authorization": `Bearer ${localStorage.getItem("token")}`, // Include token
                "Content-Type": "application/json"
            }
        })

        const data = await response.json()
        console.log(data)
        alert("your payment is "+data.orderStatus)
       }
    }catch(err){
      console.log('error ',err.message)
    }
});