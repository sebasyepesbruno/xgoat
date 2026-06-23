export default async function handler(req, res) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET");
  
    const r = await fetch(
      "https://api.football-data.org/v4/competitions/WC/matches?season=2026",
      { headers: { "X-Auth-Token": "ee664521fa4c4600aa814ecb602ddf88" } }
    );
  
    const data = await r.json();
    res.status(200).json(data);
  }