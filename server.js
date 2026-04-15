const express = require("express");
const axios = require("axios");

const app = express();
const PORT = process.env.PORT || 10000;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const AIRALO_BASE_URL = "https://partners-api.airalo.com";

// Get Airalo access token
async function getAiraloAccessToken() {
  const clientId = process.env.AIRALO_CLIENT_ID;
  const clientSecret = process.env.AIRALO_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error("Missing AIRALO_CLIENT_ID or AIRALO_CLIENT_SECRET");
  }

  const response = await axios.post(
    ${AIRALO_BASE_URL}/v2/token,
    {
      client_id: clientId,
      client_secret: clientSecret
    },
    {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      }
    }
  );

  const token =
    response.data?.data?.access_token ||
    response.data?.access_token ||
    response.data?.token;

  if (!token) {
    throw new Error("Airalo token not returned");
  }

  return token;
}

app.get("/", (req, res) => {
  res.json({
    ok: true,
    message: "VoxDigits Airalo backend live"
  });
});

app.get("/health", (req, res) => {
  res.status(200).send("ok");
});

// Fetch packages
app.get("/packages", async (req, res) => {
  try {
    const token = await getAiraloAccessToken();

    const response = await axios.get(${AIRALO_BASE_URL}/v2/packages, {
      headers: {
        Accept: "application/json",
        Authorization: Bearer ${token},
        url: AIRALO_BASE_URL
      }
    });

    res.json({
      ok: true,
      data: response.data
    });
  } catch (err) {
    console.error("Airalo packages error:", err.response?.data || err.message);

    res.status(500).json({
      ok: false,
      error: "Failed to fetch Airalo packages",
      details: err.response?.data || err.message
    });
  }
});

app.listen(PORT, "0.0.0.0", () => {
  console.log("VoxDigits Airalo backend live on port " + PORT);
});
