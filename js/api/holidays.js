// js/api/holidays.js

import { countryCodeMapping } from './countryData.js';

// Cache for storing holidays data
const holidayCache = new Map();

// Fetch holidays from Nager.Date API
async function fetchHolidaysFromNager(countryCode, year) {
    try {
        const response = await fetch(`https://date.nager.at/api/v3/publicholidays/${year}/${countryCode}`);
        if (!response.ok) throw new Error(`Nager API request failed: ${response.statusText}`);
        const text = await response.text();
        console.log(`Nager Date API response for ${countryCode}:`, text);  // Log the raw response
        if (!text) return [];
        const holidays = JSON.parse(text);
        console.log(`Parsed holidays from Nager Date API:`, holidays); // Log parsed holidays
        return holidays.filter(holiday => holiday.type === 'Public');
    } catch (error) {
        console.error(`Error fetching holidays from Nager for ${countryCode}:`, error);
        return [];
    }
}

// Fetch holidays from Calenderific API
async function fetchHolidaysFromCalenderific(countryCode, year) {
    const API_KEY = 'EMIgkIkPLekUkjdA3ZhxFxFg7fM7E1qi';
    try {
        const response = await fetch(`https://calendarific.com/api/v2/holidays?&api_key=${API_KEY}&country=${countryCode}&year=${year}`);
        if (!response.ok) throw new Error(`Calenderific API request failed: ${response.statusText}`);
        const text = await response.text();
        console.log(`Calenderific API response for ${countryCode}:`, text);  // Log the raw response
        if (!text) return [];
        const data = JSON.parse(text);
        console.log(`Parsed holidays from Calenderific API:`, data.response.holidays); // Log parsed holidays
        return data.response.holidays
            .filter(holiday => holiday.type === 'Public')
            .map(holiday => ({
                date: holiday.date.iso,
                localName: holiday.name,
                countryCode: countryCode
            }));
    } catch (error) {
        console.error(`Error fetching holidays from Calenderific for ${countryCode}:`, error);
        return [];
    }
}

// Get holidays for a country and year, using caching
async function getHolidays(countryCode, year) {
    const cacheKey = `${countryCode}-${year}`;
    if (holidayCache.has(cacheKey)) {
        console.log(`Cache hit for ${cacheKey}`);
        return holidayCache.get(cacheKey);
    }

    console.log(`Cache miss for ${cacheKey}`);
    let holidays = await fetchHolidaysFromNager(countryCode, year);
    if (holidays.length > 0) {
        console.log(`Holidays from Nager:`, holidays);
        holidayCache.set(cacheKey, holidays);
        return holidays;
    }

    holidays = await fetchHolidaysFromCalenderific(countryCode, year);
    console.log(`Holidays from Calenderific:`, holidays);
    holidayCache.set(cacheKey, holidays);
    return holidays;
}

// Export function to fetch holidays
export async function fetchHolidays(country, year) {
    const countryCode = countryCodeMapping[country];
    if (!countryCode) {
        console.error(`No country code found for ${country}`);
        return [];
    }
    return await getHolidays(countryCode, year);
}

// Export function to check if a date is a holiday
export async function isHoliday(date, country) {
    try {
        const countryCode = countryCodeMapping[country];
        if (!countryCode) {
            console.error(`Invalid country name: ${country}`);
            return false;
        }

        const year = new Date(date).getFullYear();
        const holidays = await getHolidays(countryCode, year);
        console.log(`Checking if ${date} is a holiday for ${countryCode}`, holidays);
        return holidays.some(holiday => holiday.date === date);
    } catch (error) {
        console.error(`Error in isHoliday function for ${country}:`, error);
        return false;
    }
}
