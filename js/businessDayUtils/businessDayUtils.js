// js/businessDayUtils/businessDayUtils.js

// Function to get the selected country
function getSelectedCountry() {
    const countrySelect = document.getElementById('countrySelect'); // Correct ID
    if (countrySelect) {
        const selectedValue = countrySelect.value;
        console.log(`1. Selected Country: ${selectedValue}`); // Log the selected value
        return selectedValue || 'Unknown';
    } else {
        console.warn('Dropdown with ID "countrySelect" not found.');
        return 'Unknown';
    }
}

// Function to check if a date is a non-business day based on the selected country
export function isNonBusinessDay(date, holidays) {
    const country = getSelectedCountry(); // Get the selected country

    const dayOfWeek = date.getDay();
    const isWeekend = (country === 'India' ? dayOfWeek === 0 : dayOfWeek === 0 || dayOfWeek === 6);
    const isHoliday = Array.isArray(holidays) && holidays.some(holiday => date.toDateString() === new Date(holiday.date).toDateString());

    if (isWeekend || isHoliday) {
        console.log(`Date ${date.toDateString()} is ${isWeekend ? 'a weekend' : ''}${isWeekend && isHoliday ? ' and ' : ''}${isHoliday ? 'a holiday' : ''}.`);
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

    console.log('2. Starting calculation');
    console.log(`   - Initial Start Date: ${currentDate.toDateString()}`);
    console.log(`   - Business Days to Add: ${numDays}`);
    console.log(`   - Past 5 PM Checkbox Checked: ${past5pmCheckbox}`);

    // If past 5 pm is checked, move to the next day
    if (past5pmCheckbox) {
        currentDate.setDate(currentDate.getDate() + 1);
        console.log(`   - Adjusted Start Date for Past 5 PM: ${currentDate.toDateString()}`);
    }

    // Ensure the start date is a valid business day
    while (isNonBusinessDay(currentDate, holidays)) {
        currentDate.setDate(currentDate.getDate() + 1);
        console.log(`   - Skipping Non-Business Day: ${currentDate.toDateString()}`);
    }

    // Start counting business days from the currentDate
    while (daysAdded < numDays) {
        currentDate.setDate(currentDate.getDate() + 1);

        if (!isNonBusinessDay(currentDate, holidays)) {
            daysAdded++;
            console.log(`   - Added Day ${daysAdded}: ${currentDate.toDateString()}`);
        } else {
            console.log(`   - Skipped Non-Business Day: ${currentDate.toDateString()}`);
        }
    }

    console.log(`3. Final Result: ${currentDate.toDateString()}`);
    return currentDate;
}
