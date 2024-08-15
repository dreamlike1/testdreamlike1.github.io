// js/businessDayUtils/businessDayUtils.js

// Function to get the selected country
function getSelectedCountry() {
    const countrySelect = document.getElementById('countrySelect'); // Correct ID
    if (countrySelect) {
        const selectedValue = countrySelect.value;
        console.log(`Selected Country Value: ${selectedValue}`); // Log the selected value
        return selectedValue || 'Unknown';
    } else {
        console.warn('Dropdown with ID "countrySelect" not found.');
        return 'Unknown';
    }
}

// Function to check if a date is a non-business day based on the selected country
export function isNonBusinessDay(date, holidays) {
    const country = getSelectedCountry(); // Get the selected country
    console.log(`Selected Country: ${country}`); // Log the selected country to the console

    const dayOfWeek = date.getDay();
    let isWeekend;

    // For India, only Sunday is considered a non-business day
    if (country === 'India') {
        isWeekend = dayOfWeek === 0; // Sunday
    } else {
        // For other countries, Saturday (6) and Sunday (0) are weekends
        isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    }

    // Ensure holidays is an array before calling .some
    const isHoliday = Array.isArray(holidays) && holidays.some(holiday => {
        const holidayDate = new Date(holiday.date);
        return date.toDateString() === holidayDate.toDateString(); // Compare only dates, ignoring time
    });

    // Log non-business day determination
    if (isWeekend) {
        console.log(`Date ${date.toDateString()} is a weekend.`);
    }
    if (isHoliday) {
        console.log(`Date ${date.toDateString()} is a holiday.`);
    }

    return isWeekend || isHoliday;
}

// Function to calculate business days considering the selected country
export function calculateBusinessDays(startDate, numDays, holidays) {
    if (!startDate || !(startDate instanceof Date) || isNaN(startDate.getTime())) {
        throw new Error('Invalid start date');
    }

    let currentDate = new Date(startDate);
    let daysAdded = 0;
    const past5pmCheckbox = document.getElementById('cbx-42')?.checked;

    // Log the initial state
    console.log(`Starting calculation from: ${currentDate.toDateString()}`);
    console.log(`Number of business days to add: ${numDays}`);
    console.log(`Past 5 PM checkbox checked: ${past5pmCheckbox}`);

    // If past 5 pm is checked, move to the next day
    if (past5pmCheckbox) {
        currentDate.setDate(currentDate.getDate() + 1);
        console.log(`Moved start date to the next day due to past 5 PM checkbox: ${currentDate.toDateString()}`);
    }

    // Ensure the start date is a valid business day
    while (isNonBusinessDay(currentDate, holidays)) {
        console.log(`Start date ${currentDate.toDateString()} is a non-business day, moving to the next day.`);
        currentDate.setDate(currentDate.getDate() + 1);
    }

    // Start counting business days from the currentDate
    while (daysAdded < numDays) {
        currentDate.setDate(currentDate.getDate() + 1);

        // Check if the current date is a non-business day
        if (!isNonBusinessDay(currentDate, holidays)) {
            daysAdded++;
            console.log(`Added ${daysAdded} business days. Current date: ${currentDate.toDateString()}`);
        } else {
            console.log(`Skipped non-business day: ${currentDate.toDateString()}`);
        }
    }

    // Log the final result
    console.log(`End date calculated: ${currentDate.toDateString()}`);
    return currentDate;
}
