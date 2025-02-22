console.log("Checking script load...");


let watchlist = [];

window.addStock = async function addStock() {
    console.log("addStock() function is loaded and ready to use.");
    const symbolInput = document.getElementById("stockSymbol");
    const symbol = symbolInput.value.toUpperCase().trim();

    if (!symbol) {
        alert("Please enter a stock symbol.");
        return;
    }

    try {
        // Fetch stock details from backend or external API
        const response = await fetch(`http://localhost:8080/api/watchlist/${symbol}`);

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        console.log("Stock Data:", data);

        if (data && data["Global Quote"]) {
            // Mapping API response to your POJO fields
            const stock = {
                symbol: symbol,
                open: data["Global Quote"]["02. open"] || "N/A",
                high: data["Global Quote"]["03. high"] || "N/A",
                low: data["Global Quote"]["04. low"] || "N/A",
                price: data["Global Quote"]["05. price"] || "N/A",
                volume: data["Global Quote"]["06. volume"] || "N/A",
                latestTradingDay: data["Global Quote"]["07. latest trading day"] || "N/A",
                previousClose: data["Global Quote"]["08. previous close"] || "N/A",
                change: data["Global Quote"]["09. change"] || "N/A",
                changePercent: data["Global Quote"]["10. change percent"] || "N/A"
            };

            // Save stock to database
            const saveResponse = await fetch("http://localhost:8080/api/watchlist/addstock", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(stock)
            });

            if (!saveResponse.ok) {
                throw new Error("Failed to save stock to watchlist.");
            }

            alert(`${symbol} added to watchlist!`);
            symbolInput.value = ""; // Clear input field
            loadWatchlist(); // Refresh watchlist after adding stock
        } else {
            alert("Stock not found.");
        }
    } catch (error) {
        alert("Error fetching stock data. Please try again.");
    }
}



async function fetchStockDetails(symbol) {
    try {
        console.log("Fetching stock:", symbol);
        const response = await fetch(`http://localhost:8080/api/watchlist/${symbol}`);

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        console.log("Stock data:", data);

        if (data && data["Global Quote"]) {
            return {
                symbol: symbol,
                price: data["Global Quote"]["05. price"] || "N/A",
                details: "Real-time stock data",
            };
        }

        throw new Error("Invalid stock symbol or no data available.");
    } catch (error) {
        console.error("Error:", error);
        alert(error.message);
        return null;
    }
}

function updateWatchlistCards() {
    const cardsContainer = document.getElementById("watchlistCards");
    cardsContainer.innerHTML = ""; // Clear previous content

    watchlist.forEach(stock => {
        const card = document.createElement("div");
        card.className = "card";

        card.innerHTML = `
            <h3>${stock.symbol}</h3>
            <p>Price: $${stock.price}</p>
            <button onclick="deleteStock('${stock.symbol}')">Delete</button>
        `;

        cardsContainer.appendChild(card);
    });
}


async function deleteStock(symbol) {
    try {
        const response = await fetch(`http://localhost:8080/api/watchlist/delete/${symbol}`, {
            method: "DELETE"
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        alert(`${symbol} removed from watchlist!`);
        loadWatchlist(); // Refresh watchlist after deletion
    } catch (error) {
        alert("Error deleting stock. Please try again.");
    }
}

async function loadWatchlist() {
    try {
        const response = await fetch("http://localhost:8080/api/watchlist/all"); // Endpoint to get all stocks
        if (!response.ok) {
            throw new Error("Failed to load watchlist.");
        }

        const watchlist = await response.json();
        const watchlistContainer = document.getElementById("watchlistCards");
        watchlistContainer.innerHTML = ""; // Clear previous content

        watchlist.forEach(stock => {
            const stockCard = document.createElement("div");
            stockCard.classList.add("card");
            stockCard.innerHTML = `
                <h3>${stock.symbol}</h3>
                <p>Price: ${stock.price}</p>
                <p>Open: ${stock.open}</p>
                <p>High: ${stock.high}</p>
                <p>Low: ${stock.low}</p>
                <p>Change: ${stock.change} (${stock.changePercent})</p>
                <button onclick="removeStock('${stock.symbol}')">Remove</button>
            `;
            watchlistContainer.appendChild(stockCard);
        });

    } catch (error) {
        console.error("Error loading watchlist:", error);
    }
}

// Load watchlist when page loads
document.addEventListener("DOMContentLoaded", loadWatchlist);
