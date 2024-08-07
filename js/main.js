import { populateCountries } from './ui/countryUtils.js'; // Import country population and holiday fetching functions
import { setupEventListeners } from './eventHandlers/eventHandlers.js'; // Import the event handlers
import { setupSwitchButton } from './switch/switch.js'; // Import the switch button setup function
import { initializeTimezone } from './timezone/timezone.js'; // Import the timezone initialization function

document.addEventListener('DOMContentLoaded', () => {
    const serviceTypeDropdown = document.getElementById('serviceType');
    const defaultServiceType = 'expressPaid'; // Default service type

    // Initialize Semantic UI dropdowns
    $('.ui.dropdown').dropdown();

    // Populate countries dropdown and fetch holidays based on default serviceType
    populateCountries(defaultServiceType).then(() => {
        $('#countrySelect').dropdown('refresh'); // Ensure dropdown is refreshed
    });

    setupEventListeners(); // Setup event listeners for UI elements
    setupSwitchButton(); // Initialize the switch button functionality
    initializeTimezone(); // Initialize the timezone functionality
});
