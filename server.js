require("dotenv").config();
const express = require("express");
const axios = require("axios");
const morgan = require("morgan");
const helmet = require("helmet");

const app = express();

const STEAM_API_KEY = process.env.STEAM_API_KEY;
const STEAM_API_BASE_URL = "https://api.steampowered.com";
const PORT = process.env.PORT || 3001;

// Middlewares
app.use(helmet());
app.use(morgan("combined"));
app.use(express.json());

// Routes
app.get("/steam/:endpoint", async (req, res) => {
  const endpoint = req.params.endpoint;
  const params = req.query;

  try {
    const response = await axios.get(`${STEAM_API_BASE_URL}/${endpoint}`, {
      params: {
        ...params,
        key: STEAM_API_KEY,
      },
    });
    res.json(response.data);
  } catch (error) {
    console.error("Error fetching from Steam API:", error);
    if (error.response) {
      res.status(error.response.status).send(error.response.data);
    } else {
      res.status(500).send("Error fetching from Steam API");
    }
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Proxy server is running on port ${PORT}`);
});
