
function postForm(event){
    event.preventDefault();
    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
     axios.post(`http://localhost:3000/auth/user/signup`,{
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
    axios.post(`http://localhost:3000/auth/user/login`,{

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