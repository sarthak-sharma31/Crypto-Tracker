import express from "express";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import axios from "axios";

const app = express();
const port = 3000;
const apiUrl = "https://api.binance.com/api/v3/ticker/price";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.set('view engine', 'ejs');
app.set('views', join(__dirname, 'views'));

app.use(express.static(join(__dirname, 'views')));

app.get('/', async (req, res) => {
  try {
    const response = await axios.get(apiUrl);
    const cryptos = response.data.slice(0, 30
    ).map((crypto) => ({
      name: crypto.symbol,
      price: crypto.price,
    }));
    res.render("index", { cryptos });
  } catch (error) {
    console.log("Error getting data:", error);
    res.send("Error getting data");
  }
});

app.listen(port, () => {
  console.log("Running...");
});
