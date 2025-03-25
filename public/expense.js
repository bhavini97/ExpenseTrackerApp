
const ul = document.querySelector("#expList");
document.addEventListener("DOMContentLoaded", () => {
  fetchDetails();
});
function fetchDetails() {
  const token = localStorage.getItem("token");
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
  const token = localStorage.getItem("token");
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
