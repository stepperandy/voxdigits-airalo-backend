const express = require("express");
const axios = require("axios");

const app = express();
const PORT = process.env.PORT || 10000;

app.get("/", (req, res) => {
  res.json({
    ok: true,
    message: "VoxDigits Airalo backend live"
  });
});

// TEST ROUTE (we will upgrade later)
app.get("/packages", async (req, res) => {
  try {
    const response = await axios.get(
      "https://partners-api.airalo.com/v2/packages",
      {
        headers: {
          Authorization: Bearer ${process.env.AIRALO_API_KEY}
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
      error: "Failed to fetch Airalo packages"
    });
  }
});

app.listen(PORT, "0.0.0.0", () => {
  console.log("Airalo backend running on port " + PORT);
});
