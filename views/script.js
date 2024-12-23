const ws = new WebSocket('wss://stream.binance.com:9443/ws/!ticker@arr');
const previousPrices = {};
const defaultPair = 'BTCUSDT';

document.addEventListener('DOMContentLoaded', async () => {
    try {
        const response = await fetch(`https://api.binance.com/api/v3/ticker/24hr?symbol=${defaultPair}`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        updateInfoSection(data);
    } catch (error) {
        console.error('Error fetching data:', error);
    }
});

ws.onmessage = (event) => {
    const data = JSON.parse(event.data);
    data.forEach(crypto => {
        const element = document.getElementById(crypto.s);
        const infoElement = document.getElementById('pair-name');
        if (element) {
            const priceElement = element.querySelector('.price');
            const newPrice = parseFloat(crypto.c);
            const previousPrice = previousPrices[crypto.s];

            if (previousPrice !== undefined) {
                if (newPrice > previousPrice) {
                    priceElement.classList.remove('price-down');
                    priceElement.classList.add('price-up');
                } else if (newPrice < previousPrice) {
                    priceElement.classList.remove('price-up');
                    priceElement.classList.add('price-down');
                }
            }

            previousPrices[crypto.s] = newPrice;
            priceElement.innerText = newPrice;

            if (infoElement && infoElement.innerText === crypto.s) {
                updateLivePrice(crypto);
            }
        }
    });
};

function updateLivePrice(crypto) {
    const priceElement = document.getElementById('pair-price');
    const percentElement = document.getElementById('pair-percent');
    const newPrice = parseFloat(crypto.c);
    const percentChange = parseFloat(crypto.P);
    const previousPrice = parseFloat(priceElement.innerText);

    if (previousPrice !== undefined) {
        if (newPrice > previousPrice) {
            priceElement.classList.add('price-up');
            priceElement.classList.remove('price-down');
        } else if (newPrice < previousPrice) {
            priceElement.classList.add('price-down');
            priceElement.classList.remove('price-up');
        }
    }

    priceElement.innerText = newPrice;
    percentElement.innerText = percentChange + '%';

    if (percentChange > 0) {
        percentElement.classList.add('percent-up');
        percentElement.classList.remove('percent-down', 'percent-neutral');
    } else if (percentChange < 0) {
        percentElement.classList.add('percent-down');
        percentElement.classList.remove('percent-up', 'percent-neutral');
    } else {
        percentElement.classList.add('percent-neutral');
        percentElement.classList.remove('percent-up', 'percent-down');
    }
}

document.getElementById('search').addEventListener('input', async function () {
    const searchValue = this.value.toUpperCase() + 'USDT';
    try {
        const response = await fetch(`https://api.binance.com/api/v3/ticker/24hr?symbol=${searchValue}`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        updateInfoSection(data);
    } catch (error) {
        console.error('Error fetching data:', error);
    }
});

function updateInfoSection(data) {
    document.getElementById('pair-name').innerText = data.symbol;
    document.getElementById('pair-price').innerText = data.lastPrice;
    document.getElementById('pair-Volume').innerText = data.volume;

    const percentElement = document.getElementById('pair-percent');
    const percentChange = parseFloat(data.priceChangePercent);
    percentElement.innerText = percentChange + '%';

    if (percentChange > 0) {
        percentElement.classList.add('percent-up');
        percentElement.classList.remove('percent-down', 'percent-neutral');
    } else if (percentChange < 0) {
        percentElement.classList.add('percent-down');
        percentElement.classList.remove('percent-up', 'percent-neutral');
    } else {
        percentElement.classList.add('percent-neutral');
        percentElement.classList.remove('percent-up', 'percent-down');
    }
}