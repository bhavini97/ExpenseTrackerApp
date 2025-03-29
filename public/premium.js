const reportType = document.getElementById('reportType');
reportType.addEventListener('change',()=>{
    const selectValue = reportType.value;
    if(selectValue =='Yearly'){
        const YearlyTable = document.getElementById('Yearly');
        YearlyTable.style.display = 'block';
        document.getElementById('yearlyHeading').textContent = 'Yearly Report';

    }else if(selectValue =='Monthly'){
        const MonthlyTable = document.getElementById('monthly');
        MonthlyTable.style.display = 'block';
        document.getElementById('monthlyExpense').textContent = 'Monthly Report';
    }else{
        const weeklyTable = document.getElementById('weekly');
        weeklyTable.style.display = 'block';
        document.getElementById('weeklyExpenses').textContent = 'Weekly Report';
    }
})