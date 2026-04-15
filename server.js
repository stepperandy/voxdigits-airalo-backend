const express = require("express");
const axios = require("axios");

const app = express();
const PORT = process.env.PORT || 10000;

app.use(express.json());

const AIRALO_BASE_URL = "https://partners-api.airalo.com";

// 🔐 Get Airalo token
async function getAiraloToken() {
  const response = await axios.post(
    ${AIRALO_BASE_URL}/v2/token,
    {
      client_id: process.env.AIRALO_CLIENT_ID,
      client_secret: process.env.AIRALO_CLIENT_SECRET
    },
    {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
      }
    }
  );

  return response.data.data.access_token;
}

// 🌐 Test route
app.get("/", (req, res) => {
  res.json({ ok: true, message: "Airalo backend live" });
});

// 📦 Get packages
app.get("/packages", async (req, res) => {
  try {
    const token = await getAiraloToken();

    const response = await axios.get(
      ${AIRALO_BASE_URL}/v2/packages,
      {
        headers: {
          Authorization: Bearer ${token},
          Accept: "application/json"
        }
      }
    );

    res.json({
      ok: true,
      data: response.data
    });

  } catch (err) {
    console.error(err.response?.data || err.message);

    res.status(500).json({
      ok: false,
      error: "Failed to fetch packages"
    });
  }
});

// 🚀 Start server
app.listen(PORT, () => {
  console.log(Server running on port ${PORT});
});
