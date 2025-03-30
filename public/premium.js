document.addEventListener("DOMContentLoaded", () => {
    const tableData = document.getElementById("tableData");
    const heading = document.getElementById("Expenses")
    const paginationControls = document.createElement("div");

    let currentPage = 1;
    let totalPages = 1;
    
    
    // Creating pagination buttons
    paginationControls.innerHTML = `
        <button id="prevPage" class="btn btn-secondary m-2" disabled>Previous</button>
        <select id="pageLimit">
        <option value ='5'>5</option>
         <option value ='10'>10</option>
        <option value ='15'>15</option>
        </select>
        <span id="pageInfo" class="m-2"></span>
        <button id="nextPage" class="btn btn-secondary m-2">Next</button>
    `;
    document.body.appendChild(paginationControls);

    
    // Setting dynamic limit
// Getting stored limit from localStorage, or setting a default value
let limit = localStorage.getItem('pageLimit') || document.getElementById('pageLimit').value;

// Setting the dropdown to the stored value
document.getElementById('pageLimit').value = limit;

document.getElementById('pageLimit').addEventListener('change', () => {
    limit = document.getElementById('pageLimit').value; // Update limit
    localStorage.setItem('pageLimit', String(limit)); // Storing updated limit
    fetchExpenses(); 
});

    const prevPageBtn = document.getElementById("prevPage");
    const nextPageBtn = document.getElementById("nextPage");
    const pageInfo = document.getElementById("pageInfo");

    // when the page btn is clicked it update the current page value
    prevPageBtn.addEventListener("click", () => {
        if (currentPage > 1) {
            currentPage--;
            fetchExpenses();
        }
    });

    nextPageBtn.addEventListener("click", () => {
        if (currentPage < totalPages) {
            currentPage++;
            fetchExpenses();
        }
    });

    // fetching expense of a paricular user and displaying it(only for premium)
    async function fetchExpenses() {
        try {
            const response = await fetch(`http://localhost:3000/table/expenses?page=${currentPage}&limit=${limit}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
              });
            const data = await response.json();

            totalPages = data.totalPages;
            displayExpenses(data.expenses);

            // Update pagination buttons
            pageInfo.textContent = `Page ${currentPage} of ${totalPages}`;
            prevPageBtn.disabled = currentPage === 1;
            nextPageBtn.disabled = currentPage === totalPages;
        } catch (error) {
            console.error("Error fetching expenses:", error);
        }
    }

    // displaying expense in table(for premium user)
    function displayExpenses(expenses) {
        tableData.style.display = "block";

        let table = tableData;
        let tbody = table.querySelector("tbody");

        if(heading.style.display == 'none'){
            heading.style.display = 'block'
        }

        heading.textContent = `Your Expense Table`;

        if (!table || !tbody) return;

        tbody.innerHTML = "";
        expenses.forEach(expense => {
            const row = document.createElement("tr");

           
        
                row.innerHTML = `
                    <td>${new Date(expense.createdAt).toLocaleDateString()}</td>
                    <td>${expense.description}</td>
                    <td>${expense.category}</td>
                    <td>${expense.amount || '-'}</td>
                `;
            

            tbody.appendChild(row);
        });

        table.style.display = "table";
    }

    fetchExpenses(); // Initial call
});
