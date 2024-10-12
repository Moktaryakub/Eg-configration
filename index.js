function calculateTotalTarget(startDate, endDate, totalAnnualTarget) {
    // Helper function to get the number of working days excluding Fridays in a month
    function getWorkingDaysExcludingFridays(year, month) {
        const date = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0).getDate();
        let workingDays = 0;

        for (let day = 1; day <= lastDay; day++) {
            const currentDate = new Date(year, month, day);
            // Check if it's a working day (not Friday)
            if (currentDate.getDay() !== 5) { // 5 is Friday
                workingDays++;
            }
        }
        return workingDays;
    }

    // Helper function to get the number of working days excluding Fridays within a date range
    function getDaysWorkedExcludingFridays(start, end) {
        let count = 0;
        const currentDate = new Date(start);

        while (currentDate <= end) {
            if (currentDate.getDay() !== 5) { // Exclude Fridays
                count++;
            }
            currentDate.setDate(currentDate.getDate() + 1);
        }
        return count;
    }

    const start = new Date(startDate);
    const end = new Date(endDate);
    const startYear = start.getFullYear();
    const endYear = end.getFullYear();
    const startMonth = start.getMonth();
    const endMonth = end.getMonth();

    let daysExcludingFridays = [];
    let daysWorkedExcludingFridays = [];
    let monthlyTargets = [];
    let totalWorkingDaysInRange = 0;

    for (let year = startYear; year <= endYear; year++) {
        const monthStart = (year === startYear) ? startMonth : 0;
        const monthEnd = (year === endYear) ? endMonth : 11;

        for (let month = monthStart; month <= monthEnd; month++) {
            const workingDaysInMonth = getWorkingDaysExcludingFridays(year, month);
            const daysWorkedInMonth = (year === startYear && month === startMonth) 
                ? getDaysWorkedExcludingFridays(start, new Date(year, month + 1, 0))
                : (year === endYear && month === endMonth)
                ? getDaysWorkedExcludingFridays(new Date(year, month, 1), end)
                : workingDaysInMonth;

            daysExcludingFridays.push(workingDaysInMonth);
            daysWorkedExcludingFridays.push(daysWorkedInMonth);

            // Update total working days in range
            totalWorkingDaysInRange += daysWorkedInMonth;

            // Calculate monthly target based on worked days
            monthlyTargets.push((daysWorkedInMonth / workingDaysInMonth) * (totalAnnualTarget / 12));
        }
    }

    // Calculate total target based on worked days in range
    const totalTarget = monthlyTargets.reduce((sum, target) => sum + target, 0);

    return {
        daysExcludingFridays,
        daysWorkedExcludingFridays,
        monthlyTargets,
        totalTarget
    };
}

// Example usage:
const result = calculateTotalTarget('2024-01-01', '2024-03-31', 120000);
console.log(result);