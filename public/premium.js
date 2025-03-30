document.addEventListener("DOMContentLoaded", () => {
    const reportType = document.getElementById("reportType");
    const weeklyTable = document.getElementById("weekly");
    const monthlyTable = document.getElementById("monthly");
    const yearlyTable = document.getElementById("Yearly");
    const paginationControls = document.createElement("div");

    let currentPage = 1;
    let totalPages = 1;
    const limit = 5; // Records per page
    let selectedFilter = reportType.value;

    // Creating pagination buttons
    paginationControls.innerHTML = `
        <button id="prevPage" class="btn btn-secondary m-2" disabled>Previous</button>
        <span id="pageInfo" class="m-2"></span>
        <button id="nextPage" class="btn btn-secondary m-2">Next</button>
    `;
    document.body.appendChild(paginationControls);

    const prevPageBtn = document.getElementById("prevPage");
    const nextPageBtn = document.getElementById("nextPage");
    const pageInfo = document.getElementById("pageInfo");

    reportType.addEventListener("change", () => {
        selectedFilter = reportType.value;
        currentPage = 1;
        fetchExpenses();
    });

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

    async function fetchExpenses() {
        try {
            const response = await fetch(`http://localhost:3000/expenses?filter=${selectedFilter}&page=${currentPage}&limit=${limit}`);
            const data = await response.json();

            totalPages = data.totalPages;
            displayExpenses(data.expenses, selectedFilter);

            // Update pagination buttons
            pageInfo.textContent = `Page ${currentPage} of ${totalPages}`;
            prevPageBtn.disabled = currentPage === 1;
            nextPageBtn.disabled = currentPage === totalPages;
        } catch (error) {
            console.error("Error fetching expenses:", error);
        }
    }

    function displayExpenses(expenses, filter) {
        weeklyTable.style.display = "none";
        monthlyTable.style.display = "none";
        yearlyTable.style.display = "none";

        let table;
        let tbody;

        if (filter === "Weekly") {
            table = weeklyTable;
            tbody = table.querySelector("tbody");
        } else if (filter === "Monthly") {
            table = monthlyTable;
            tbody = table.querySelector("tbody");
        } else if (filter === "Yearly") {
            table = yearlyTable;
            tbody = table.querySelector("tbody");
        }

        if (!table || !tbody) return;

        tbody.innerHTML = "";
        expenses.forEach(expense => {
            const row = document.createElement("tr");

            if (filter === "Yearly") {
                row.innerHTML = `
                    <td>${expense.month}</td>
                    <td>${expense.totalIncome}</td>
                    <td>${expense.totalExpense}</td>
                    <td>${expense.savings}</td>
                `;
            } else {
                row.innerHTML = `
                    <td>${new Date(expense.date).toLocaleDateString()}</td>
                    <td>${expense.description}</td>
                    <td>${expense.category}</td>
                    <td>${expense.income || '-'}</td>
                    <td>${expense.expense || '-'}</td>
                `;
            }

            tbody.appendChild(row);
        });

        table.style.display = "table";
    }

    fetchExpenses(); // Initial call
});
