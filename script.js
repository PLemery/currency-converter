const API_URL = `https://v6.exchangerate-api.com/v6/993b261a77527221918ea5a9/latest/USD`;

// Fetch and display exchange rates on page load
window.addEventListener('load', async () => {
    try {
        const response = await fetch(API_URL);
        const data = await response.json();

        if (data.result === "success") {
            displayExchangeRates(data.conversion_rates);
        } else {
            document.getElementById('rates-list').innerHTML = '<li>Failed to load exchange rates.</li>';
        }
    } catch (error) {
        console.error('Error fetching exchange rates:', error);
        document.getElementById('rates-list').innerHTML = '<li>Error fetching exchange rates.</li>';
    }
});

// Display exchange rates in the list
function displayExchangeRates(rates) {
    const ratesList = document.getElementById('rates-list');
    ratesList.innerHTML = ''; // Clear any previous data

    const currencies = ['USD', 'EUR', 'JPY', 'GBP', 'AUD'];

    currencies.forEach(currency => {
        if (currency !== 'USD') {  // Skip USD to USD conversion
            const rate = rates[currency];
            const listItem = document.createElement('li');
            listItem.textContent = `1 USD = ${rate} ${currency}`;
            ratesList.appendChild(listItem);
        }
    });
}

// Handle form submission to perform currency conversion
document.getElementById('converter-form').addEventListener('submit', async function (event) {
    event.preventDefault();

    const fromCurrency = document.getElementById('from-currency').value;
    const toCurrency = document.getElementById('to-currency').value;
    const amount = parseFloat(document.getElementById('amount').value);

    if (!fromCurrency || !toCurrency) {
        document.getElementById('result').textContent = 'Please select currencies from the dropdowns.';
        return;
    }

    if (fromCurrency === toCurrency) {
        document.getElementById('result').textContent = 'Please select different currencies.';
        return;
    }

    try {
        const response = await fetch(`https://v6.exchangerate-api.com/v6/993b261a77527221918ea5a9/latest/${fromCurrency}`);
        const data = await response.json();

        if (data.result === "success") {
            const rate = data.conversion_rates[toCurrency];
            const convertedAmount = (amount * rate).toFixed(2);

            document.getElementById('result').textContent =
                `${amount} ${fromCurrency} = ${convertedAmount} ${toCurrency}`;
        } else {
            document.getElementById('result').textContent = 'Failed to retrieve exchange rates.';
        }
    } catch (error) {
        console.error('Error fetching exchange rates:', error);
        document.getElementById('result').textContent = 'Error fetching exchange rates.';
    }
});