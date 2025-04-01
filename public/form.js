
function postForm(event){
    event.preventDefault();
    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
     axios.post(`http://3.110.219.92/auth/user/signup`,{
        username : name,
        email : email,
        password : password
     })
     .then(res=>{
        alert(res.data.message);
        document.querySelector("#signup").reset();
        console.log(`respond send successfully`)
     }).catch(err=>{
      if (err.response) {
         alert(err.response.data.message); 
     } else {
         console.error(`Error in sending signup data`, err);
         alert('Something went wrong. Please try again.');
     }
})

};

function getForm(event){
   event.preventDefault();
   const name = event.target.name.value;
   const email =  event.target.email.value;
   const password = event.target.password.value;
    axios.post(`http://3.110.219.92/auth/user/login`,{

         email: email,
         password: password
     })
    
    .then(response=>{
        if (response.data.token) {
        localStorage.setItem("token", response.data.token); // TOKEN IS STORED HERE
         } 
    alert("Login successful!");
    document.querySelector("#login").reset();
      window.location.href = "/expense/add-expense";
     
     }). catch (error=> {
      if (error.response) {
         if (error.response.status === 404) {
             alert( error.response.data.message); // User not found
         } else if (error.response.status === 401) {
             alert(error.response.data.message); // Invalid password
         } else {
             alert(error.response.data.message);
         }
     } else {
         alert("Network Error: Unable to connect to server.");
     }
     console.error("Error:", error);
 })
     
};
document.getElementById("forgotPasswordLink").addEventListener("click", function(event) {
    event.preventDefault();
    document.getElementById("forgotContainer").style.display = "block";
});
function submitForgotPassword(){
    const email = document.getElementById("email1").value;
    const messageBox = document.getElementById("responseMessage");

    if (!email) {
        messageBox.style.color = "red";
        messageBox.innerText = "Please enter your email!";
        return;
    }

    axios.post("http://3.110.219.92/password/forgotpassword", { email })
        .then(response => {
            messageBox.style.color = "green";
            messageBox.innerText = response.data.message || "Email sent! Check your inbox.";
        })
        .catch(error => {
            messageBox.style.color = "red";
            messageBox.style.fontWeight ="1000"
            messageBox.innerText = error.response?.data?.message || "Something went wrong!";
        });

}