const ul = document.querySelector("#expList");
const token = localStorage.getItem("token");
document.addEventListener("DOMContentLoaded", async () => {
  try {
    // checking if the user is premium or not
    if (token) {
      const response = await fetch(
        "http://3.110.219.92//premium/auth/user-details",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const data = await response.json();
      console.log(data);
      if (data.isPremium) {
        document.getElementById("leaderboardBtn").style.display = "block";
        document.getElementById('premiumFeature').style.display = "block";
      }

      fetchDetails();
    }
  } catch (err) {
    console.error("error getting user details for premium status");
  }
});
function fetchDetails() {
  axios
    .get(`http://3.110.219.92/expense/get-expense`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then((res) => {
      ul.innerHTML = ``;
      const data = res.data;
      data.forEach((element) => {
        const li = document.createElement("li");
        li.className = "list-group-item";

        const str = `${element.amount} - ${element.category} - ${element.description} `;
        li.append(str);

        //delete button in list
        const delBtn = document.createElement("button");
        delBtn.textContent = "Delete";
        delBtn.className = "btn btn-danger btn-sm ms-2";
        delBtn.addEventListener("click", () => {
          deleteElement(element.id, token);
        });
        li.append(delBtn);
        ul.append(li);
      });
    })
    .catch((err) => {
      if (err.response) {
        if (err.response.status === 500) {
          console.log(err.response.data.message);
        }
      } else {
        console.log("Something went wrong");
      }
    });
}
function postExpense(event) {
  event.preventDefault();

  //getting all input value
  const expenseData = {
    amount: event.target.amt.value,
    category: event.target.type.value,
    description: event.target.desc.value,
  };

  axios
    .post(`http://3.110.219.92/expense/add-expense`, expenseData, {
      headers: {
        Authorization: `Bearer ${token}`, // sending token to backend from localstorage
      },
    })
    .then((res) => {
      document.querySelector("#expense").reset(); // reset form
      fetchDetails();
    })
    .catch((err) => {
      console.error("something went wrong");
    });
}

function deleteElement(id, token) {
  axios
    .delete(`http://3.110.219.92/expense/delete/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then((res) => {
      fetchDetails();
    })
    .catch((err) => {
      console.error(err);
      alert(`failed to delete`);
    });
}

// to show leaderboard data for premium users only 
document.getElementById("leaderboardBtn").addEventListener("click", async () => {
    try {
      const response = await fetch(
        "http://3.110.219.92/premium/leaderboard",
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );

      const data = await response.json();
      console.log(data);
      const leaderboardList = document.getElementById("leaderboardList");
      leaderboardList.style.display = "block";
      leaderboardList.innerHTML = ""; // Clear previous results

      data.leaderboard.forEach((user) => {
        const li = document.createElement("li");
        li.textContent = `${user.username}: ₹${user.totalExpense}`;
        leaderboardList.appendChild(li);
      });
    } catch (err) {
      console.error("error getting leadership data");
    }
  });

  