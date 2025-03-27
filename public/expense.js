const ul = document.querySelector("#expList");
const token = localStorage.getItem("token");
document.addEventListener("DOMContentLoaded", async() => {

  if (token) {
      const response = await fetch("http://localhost:3000/auth/user-details", {
          headers: { "Authorization": `Bearer ${token}` },
      });

      const data = await response.json();
        console.log(data)
      if (data.isPremium) {
          document.getElementById("leaderboardBtn").style.display = "block";
      }
  }
  fetchDetails();
});
function fetchDetails() {
  
  axios
    .get(`http://localhost:3000/expense/get-expense`, {
      headers: { Authorization: `Bearer ${token}` }
  })
    .then((res) => {
      ul.innerHTML = ``;
      const data = res.data;
      data.forEach((element) => {
        const li = document.createElement("li");
        li.className = "list-group-item";

        const str = `${element.amount} - ${element.category} - ${element.description} `;
        li.append(str);

        //del
        const delBtn = document.createElement("button");
        delBtn.textContent = "Delete";
        delBtn.className = "btn btn-danger btn-sm ms-2";
        delBtn.addEventListener("click", () => {
            deleteElement(element.id,token);
        });
        li.append(delBtn);
        ul.append(li);
      });
    })
    .catch((err) => {
      if(err.response){
        if(err.response.status === 500){
          console.log(err.response.data.message)
        }
      }else{
        console.log('Something went wrong')
      }
    });
}
function postExpense(event) {
  event.preventDefault();

  //getting all input value
  const expenseData ={

     amount : event.target.amt.value,
     category : event.target.type.value,
    description : event.target.desc.value
  }
  
  axios
    .post(`http://localhost:3000/expense/add-expense`, expenseData,
      {
        headers: { 
                  Authorization: `Bearer ${token}`  // sending token to backend from localstorage
                }
        }
    )
    .then((res) => {
      document.querySelector("#expense").reset();
      fetchDetails();
    })
    .catch((err) => {
      console.error("something went wrong");
    });
}

function deleteElement(id,token){
  axios.delete(`http://localhost:3000/expense/delete/${id}`,{
    headers: { Authorization: `Bearer ${token}` }
  
  }).then(res=>{
     fetchDetails();
  }).catch(err=>{
    console.error(err);
   alert(`failed to delete`)
  })
}

document.getElementById("leaderboardBtn").addEventListener("click", async () => {
  const response = await fetch("http://localhost:3000/expense/leaderboard", {
      headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` },
  });

  const data = await response.json();
  console.log(data)
  const leaderboardList = document.getElementById("leaderboardList");
  leaderboardList.innerHTML = ""; // Clear previous results

  data.leaderboard[0].forEach(user => {
      const li = document.createElement("li");
      li.textContent = `${user.username}: ₹${user.total_expense}`;
      leaderboardList.appendChild(li);
  });
});

