import { useState, useEffect } from "react";

const ODDS_API_KEY = "2b8e66079f23dff56c1fcf7be2820a49";

const GRUPOS: Record<string, string> = {
  "Mexico":"A","South Africa":"A","South Korea":"A","Czech Republic":"A",
  "Canada":"B","Bosnia & Herzegovina":"B","Qatar":"B","Switzerland":"B",
  "USA":"C","Paraguay":"C","Australia":"C","Turkey":"C",
  "Brazil":"D","Morocco":"D","Scotland":"D","Haiti":"D",
  "Germany":"E","Curazao":"E","Ivory Coast":"E","Ecuador":"E",
  "Netherlands":"F","Japan":"F","Sweden":"F","Tunisia":"F",
  "Spain":"G","Cape Verde":"G","Saudi Arabia":"G","Uruguay":"G",
  "Belgium":"H","Egypt":"H","Iran":"H","New Zealand":"H",
  "France":"I","Senegal":"I","Iraq":"I","Norway":"I",
  "Argentina":"J","Algeria":"J","Austria":"J","Jordan":"J",
  "Portugal":"K","DR Congo":"K","England":"K","Croatia":"K",
  "Ghana":"L","Panama":"L","Uzbekistan":"L","Colombia":"L",
};

export default function App() {
  const [partidos, setPartidos]   = useState<any[]>([]);
  const [loading, setLoading]     = useState(true);
  const [tab, setTab]             = useState("partidos");
  const [busqueda, setBusqueda]   = useState("");
  const [favoritos, setFavoritos] = useState<string[]>(() => {
    try { return JSON.parse(localStorage.getItem("xgoat_favs") || "[]"); }
    catch { return []; }
  });

  useEffect(() => {
    const url = "https://api.the-odds-api.com/v4/sports/soccer_fifa_world_cup/odds?apiKey="
      + ODDS_API_KEY
      + "&regions=eu&markets=h2h&oddsFormat=decimal";

    fetch(url)
      .then(r => r.json())
      .then(data => {
        const procesados = data.map((p: any) => {
          let oL = 0, oE = 0, oV = 0;
          if (p.bookmakers && p.bookmakers.length > 0) {
            const outcomes = p.bookmakers[0].markets[0].outcomes;
            outcomes.forEach((o: any) => {
              if (o.name === p.home_team) oL = o.price;
              else if (o.name === p.away_team) oV = o.price;
              else oE = o.price;
            });
          }
          const total = oL && oE && oV ? (1/oL + 1/oE + 1/oV) : 1;
          return {
            id:        p.id,
            local:     p.home_team,
            visitante: p.away_team,
            fecha:     p.commence_time.slice(0, 10),
            hora:      p.commence_time.slice(11, 16),
            grupo:     GRUPOS[p.home_team] || "?",
            oL, oE, oV,
            pL: oL ? Math.round(1/oL/total*100) : 0,
            pE: oE ? Math.round(1/oE/total*100) : 0,
            pV: oV ? Math.round(1/oV/total*100) : 0,
          };
        });
        procesados.sort((a: any, b: any) => a.fecha.localeCompare(b.fecha));
        setPartidos(procesados);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const toggleFav = (equipo: string) => {
    const nuevos = favoritos.includes(equipo)
      ? favoritos.filter(f => f !== equipo)
      : [...favoritos, equipo];
    setFavoritos(nuevos);
    localStorage.setItem("xgoat_favs", JSON.stringify(nuevos));
  };

  const lista = (() => {
    if (busqueda.length > 1) {
      const q = busqueda.toLowerCase();
      return partidos.filter(p =>
        p.local.toLowerCase().includes(q) ||
        p.visitante.toLowerCase().includes(q)
      );
    }
    if (tab === "probabilidad") {
      return [...partidos].sort((a, b) => b.pL - a.pL).slice(0, 15);
    }
    if (tab === "favoritos") {
      return partidos.filter(p =>
        favoritos.includes(p.local) || favoritos.includes(p.visitante)
      );
    }
    return partidos;
  })();

  const s: any = {
    app:    { minHeight: "100vh", background: "#080c14", color: "#e8edf5", fontFamily: "Barlow, sans-serif" },
    header: { display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 20px", borderBottom: "1px solid #1e2d45", background: "#080c14", position: "sticky" as const, top: 0, zIndex: 100 },
    logo:   { width: 34, height: 34, background: "#00e5ff", borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 18, color: "#000" },
    live:   { display: "flex", alignItems: "center", gap: 6, background: "rgba(255,61,61,0.15)", border: "1px solid rgba(255,61,61,0.4)", padding: "4px 10px", borderRadius: 4, fontSize: 11, fontWeight: 700, color: "#ff3d3d" },
    dot:    { width: 6, height: 6, borderRadius: "50%", background: "#ff3d3d", display: "inline-block" },
    search: { padding: "12px 20px", background: "#0d1320", borderBottom: "1px solid #1e2d45" },
    input:  { width: "100%", background: "#111928", border: "1px solid #1e2d45", borderRadius: 8, padding: "10px 12px 10px 36px", color: "#e8edf5", fontSize: 14, outline: "none" },
    stats:  { display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 1, background: "#1e2d45", borderBottom: "1px solid #1e2d45" },
    stat:   { background: "#0d1320", padding: "12px 16px" },
    tabs:   { display: "flex", borderBottom: "1px solid #1e2d45", background: "#0d1320", overflowX: "auto" as const },
    content:{ padding: 16, maxWidth: 800, margin: "0 auto" },
    card:   { background: "#0d1320", borderRadius: 8, padding: "14px 16px", marginBottom: 10 },
  };

  return (
    <div style={s.app}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@700;800&family=Barlow:wght@400;600&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #080c14; }
        input::placeholder { color: #3a4a5a; }
      `}</style>

      {/* HEADER */}
      <div style={s.header}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={s.logo}>X</div>
          <span style={{ fontFamily: "Barlow Condensed", fontSize: 22, fontWeight: 800, letterSpacing: 2 }}>
            XGOAT <span style={{ color: "#00e5ff" }}>2026</span>
          </span>
        </div>
        <div style={s.live}>
          <span style={s.dot} />
          LIVE
        </div>
      </div>

      {/* BUSCADOR */}
      <div style={s.search}>
        <div style={{ position: "relative" }}>
          <span style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: "#5a6a80" }}>
            /
          </span>
          <input
            style={s.input}
            placeholder="Buscar seleccion... ej: Argentina, Mexico, Brazil"
            value={busqueda}
            onChange={e => { setBusqueda(e.target.value); setTab("partidos"); }}
          />
        </div>
        {busqueda.length > 1 && (
          <div style={{ marginTop: 8, fontSize: 12, color: "#5a6a80" }}>
            {lista.length} partido(s) para "{busqueda}"
            <button onClick={() => setBusqueda("")} style={{ marginLeft: 10, background: "none", border: "none", color: "#00e5ff", cursor: "pointer", fontSize: 12 }}>
              Limpiar
            </button>
          </div>
        )}
      </div>

      {/* STATS */}
      <div style={s.stats}>
        {[
          { label: "Partidos", value: loading ? "..." : String(partidos.length), color: "#00e5ff" },
          { label: "Inicio",   value: "Jun 11", color: "#ff4d6d" },
          { label: "Favoritos",value: String(favoritos.length), color: "#ffe600" },
        ].map(st => (
          <div key={st.label} style={s.stat}>
            <div style={{ fontSize: 10, letterSpacing: 2, color: "#5a6a80", textTransform: "uppercase" as const, marginBottom: 4 }}>
              {st.label}
            </div>
            <div style={{ fontFamily: "Barlow Condensed", fontSize: 28, fontWeight: 800, color: st.color }}>
              {st.value}
            </div>
          </div>
        ))}
      </div>

      {/* TABS */}
      {!busqueda && (
        <div style={s.tabs}>
          {[
            { id: "partidos",     label: "Partidos" },
            { id: "probabilidad", label: "Alta Prob." },
            { id: "favoritos",    label: "Favoritos (" + favoritos.length + ")" },
          ].map(t => (
            <button key={t.id} onClick={() => setTab(t.id)} style={{
              padding: "12px 18px", background: "none", border: "none",
              borderBottom: tab === t.id ? "2px solid #00e5ff" : "2px solid transparent",
              color: tab === t.id ? "#00e5ff" : "#5a6a80",
              fontFamily: "Barlow Condensed", fontSize: 13, fontWeight: 700,
              letterSpacing: 1, textTransform: "uppercase" as const,
              cursor: "pointer", whiteSpace: "nowrap" as const
            }}>
              {t.label}
            </button>
          ))}
        </div>
      )}

      {/* CONTENT */}
      <div style={s.content}>
        {loading ? (
          <div style={{ textAlign: "center" as const, padding: 60, color: "#5a6a80", fontSize: 18 }}>
            Cargando datos del Mundial 2026...
          </div>
        ) : tab === "favoritos" && favoritos.length === 0 && !busqueda ? (
          <div style={{ textAlign: "center" as const, padding: 60, color: "#5a6a80" }}>
            <div style={{ fontSize: 14, marginBottom: 8 }}>No tienes favoritos aun</div>
            <div style={{ fontSize: 12 }}>Toca el boton FAV en cualquier partido</div>
          </div>
        ) : lista.length === 0 ? (
          <div style={{ textAlign: "center" as const, padding: 60, color: "#5a6a80" }}>
            No se encontraron partidos
          </div>
        ) : (
          lista.map((p: any, i: number) => {
            const esFav = favoritos.includes(p.local) || favoritos.includes(p.visitante);
            return (
              <div key={p.id} style={{ ...s.card, border: "1px solid " + (esFav ? "rgba(255,230,0,0.4)" : "#1e2d45") }}>

                {/* META */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                  <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                    <span style={{ background: "rgba(0,229,255,0.1)", border: "1px solid rgba(0,229,255,0.2)", color: "#00e5ff", padding: "2px 8px", borderRadius: 4, fontSize: 11, fontWeight: 700 }}>
                      GRUPO {p.grupo}
                    </span>
                    <span style={{ fontSize: 11, color: "#5a6a80" }}>
                      {p.fecha} · {p.hora} UTC
                    </span>
                  </div>
                  <button
                    onClick={() => toggleFav(p.local)}
                    style={{ background: "none", border: "1px solid " + (favoritos.includes(p.local) ? "#ffe600" : "#1e2d45"), borderRadius: 4, padding: "2px 8px", cursor: "pointer", color: favoritos.includes(p.local) ? "#ffe600" : "#5a6a80", fontSize: 11, fontWeight: 700 }}>
                    {favoritos.includes(p.local) ? "GUARDADO" : "FAV"}
                  </button>
                </div>

                {/* EQUIPOS */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr auto 1fr", alignItems: "center", gap: 10, marginBottom: 10 }}>
                  <div>
                    <div style={{ fontFamily: "Barlow Condensed", fontSize: 17, fontWeight: 700 }}>{p.local}</div>
                    {tab === "probabilidad" && (
                      <div style={{ fontSize: 11, color: "#ffe600", fontWeight: 700 }}>#{i+1} favorito</div>
                    )}
                  </div>
                  <span style={{ color: "#1e2d45", fontFamily: "Barlow Condensed", fontSize: 18, fontWeight: 800 }}>VS</span>
                  <div style={{ textAlign: "right" as const }}>
                    <div style={{ fontFamily: "Barlow Condensed", fontSize: 17, fontWeight: 700 }}>{p.visitante}</div>
                  </div>
                </div>

                {/* BARRA PROBABILIDADES */}
                {p.oL > 0 && (
                  <>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, color: "#5a6a80", marginBottom: 3 }}>
                      <span>{p.local}</span>
                      <span>Empate</span>
                      <span>{p.visitante}</span>
                    </div>
                    <div style={{ display: "flex", height: 24, borderRadius: 4, overflow: "hidden", gap: 1, marginBottom: 4 }}>
                      <div style={{ width: String(p.pL) + "%", background: "rgba(0,229,255,0.25)", color: "#00e5ff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700 }}>
                        {p.pL}%
                      </div>
                      <div style={{ width: String(p.pE) + "%", background: "rgba(255,230,0,0.15)", color: "#ffe600", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700 }}>
                        {p.pE}%
                      </div>
                      <div style={{ width: String(p.pV) + "%", background: "rgba(255,77,109,0.25)", color: "#ff4d6d", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700 }}>
                        {p.pV}%
                      </div>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, fontFamily: "Barlow Condensed", fontWeight: 700 }}>
                      <span style={{ color: "#00e5ff" }}>{p.oL}</span>
                      <span style={{ color: "#ffe600" }}>{p.oE}</span>
                      <span style={{ color: "#ff4d6d" }}>{p.oV}</span>
                    </div>
                  </>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}