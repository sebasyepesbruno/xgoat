export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET");

  try {
    const response = await fetch(
      "https://api.football-data.org/v4/competitions/WC/matches?season=2026",
      {
        headers: {
          "X-Auth-Token": process.env.FOOTBALL_API_KEY,
        },
      }
    );

    const data = await response.json();

    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({
      error: "Error consultando Football Data",
      detalle: error.message,
    });
  }
}