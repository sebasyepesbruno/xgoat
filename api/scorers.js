export const config = { runtime: "edge" };

export default async function handler(req) {
  const r = await fetch(
    "https://api.football-data.org/v4/competitions/WC/scorers?season=2026&limit=20",
    { headers: { "X-Auth-Token": "ee664521fa4c4600aa814ecb602ddf88" } }
  );
  const data = await r.json();
  return new Response(JSON.stringify(data), {
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
    },
  });
}
