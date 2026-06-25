import { useState, useEffect } from "react";

const ODDS_API_KEY     = "2b8e66079f23dff56c1fcf7be2820a49";


/*const _GRUPOS: Record<string, string> = {
  "Mexico":"A","South Africa":"A","South Korea":"A","Czechia":"A",
  "Canada":"B","Bosnia-Herzegovina":"B","Qatar":"B","Switzerland":"B",
  "United States":"C","Paraguay":"C","Australia":"C","Turkey":"C",
  "Brazil":"D","Morocco":"D","Scotland":"D","Haiti":"D",
  "Germany":"E","Curaçao":"E","Ivory Coast":"E","Ecuador":"E",
  "Netherlands":"F","Japan":"F","Sweden":"F","Tunisia":"F",
  "Spain":"G","Cape Verde":"G","Saudi Arabia":"G","Uruguay":"G",
  "Belgium":"H","Egypt":"H","Iran":"H","New Zealand":"H",
  "France":"I","Senegal":"I","Iraq":"I","Norway":"I",
  "Argentina":"J","Algeria":"J","Austria":"J","Jordan":"J",
  "Portugal":"K","DR Congo":"K","Uzbekistan":"K","Colombia":"K",
  "Ghana":"L","Panama":"L","England":"L","Croatia":"L",
};*/

const NOMBRES_ES: Record<string, string> = {
  "Mexico":"México","South Africa":"Sudáfrica","South Korea":"Corea del Sur",
  "Czechia":"República Checa","Canada":"Canadá",
  "Bosnia-Herzegovina":"Bosnia-Herzegovina","Qatar":"Catar",
  "Switzerland":"Suiza","United States":"Estados Unidos","Paraguay":"Paraguay",
  "Australia":"Australia","Turkey":"Turquía","Brazil":"Brasil",
  "Morocco":"Marruecos","Scotland":"Escocia","Haiti":"Haití",
  "Germany":"Alemania","Curaçao":"Curazao","Ivory Coast":"Costa de Marfil",
  "Ecuador":"Ecuador","Netherlands":"Países Bajos","Japan":"Japón",
  "Sweden":"Suecia","Tunisia":"Túnez","Spain":"España",
  "Cape Verde":"Cabo Verde","Saudi Arabia":"Arabia Saudita","Uruguay":"Uruguay",
  "Belgium":"Bélgica","Egypt":"Egipto","Iran":"Irán",
  "New Zealand":"Nueva Zelanda","France":"Francia","Senegal":"Senegal",
  "Iraq":"Irak","Norway":"Noruega","Argentina":"Argentina",
  "Algeria":"Argelia","Austria":"Austria","Jordan":"Jordania",
  "Portugal":"Portugal","DR Congo":"RD Congo","Uzbekistan":"Uzbekistán",
  "Colombia":"Colombia","Ghana":"Ghana","Panama":"Panamá",
  "England":"Inglaterra","Croatia":"Croacia",
};

function horaCol(utcDate: string) {
  const dt = new Date(utcDate);
  dt.setHours(dt.getHours() - 5);
  return {
    fecha: dt.toISOString().slice(0, 10),
    hora:  dt.toISOString().slice(11, 16),
  };
}

function formatearFecha(fecha: string) {
  const d = new Date(fecha + "T12:00:00");
  return d.toLocaleDateString("es-CO", { weekday: "short", day: "numeric", month: "short" });
}

function GanadorBadge({ ganador, local, visitante }: any) {
  if (!ganador || ganador === "null") return null;
  const texto = ganador === "HOME_TEAM" ? local : ganador === "AWAY_TEAM" ? visitante : "Empate";
  const color = ganador === "DRAW" ? "#ffe600" : "#00ff87";
  return (
    <span style={{ fontSize: 10, fontWeight: 700, color, background: color + "15", border: "1px solid " + color + "40", padding: "2px 7px", borderRadius: 3 }}>
      {ganador === "DRAW" ? "EMPATE" : "GANÓ " + texto.toUpperCase()}
    </span>
  );
}

export default function App() {
  const [partidos, setPartidos]             = useState<any[]>([]);
  const [loading, setLoading]               = useState(true);
  const [tab, setTab]                       = useState("hoy");
  const [busqueda, setBusqueda]             = useState("");
  const [fechasAbiertas, setFechasAbiertas] = useState<Record<string, boolean>>({});
  const [favoritos, setFavoritos]           = useState<string[]>(() => {
    try { return JSON.parse(localStorage.getItem("xgoat_favs") || "[]"); }
    catch { return []; }
  });

  const hoy = new Date().toLocaleDateString("en-CA", { timeZone: "America/Bogota" });

  useEffect(() => {
    Promise.all([
      // API 1 — Resultados reales
      fetch("/api/matches").then(r => r.json()),

      // API 2 — Cuotas próximos partidos
      fetch("https://api.the-odds-api.com/v4/sports/soccer_fifa_world_cup/odds?apiKey="
        + ODDS_API_KEY + "&regions=eu&markets=h2h&oddsFormat=decimal")
        .then(r => r.json()),
    ])
    .then(([fdData, oddsData]) => {

      // Mapa de cuotas por equipos
      const cuotasMap: Record<string, any> = {};
      if (Array.isArray(oddsData)) {
        oddsData.forEach((p: any) => {
          let oL = 0, oE = 0, oV = 0;
          if (p.bookmakers?.length) {
            p.bookmakers[0].markets[0].outcomes.forEach((o: any) => {
              if (o.name === p.home_team) oL = o.price;
              else if (o.name === p.away_team) oV = o.price;
              else oE = o.price;
            });
          }
          const key = p.home_team + "|" + p.away_team;
          cuotasMap[key] = { oL, oE, oV };
        });
      }

      // Procesar partidos de football-data
      const procesados = fdData.matches.map((m: any) => {
        const col     = horaCol(m.utcDate);
        const localEN = m.homeTeam.name;
        const visitEN = m.awayTeam.name;
        const cuotas  = cuotasMap[localEN + "|" + visitEN] || { oL: 0, oE: 0, oV: 0 };
        const { oL, oE, oV } = cuotas;
        const total   = oL && oE && oV ? (1/oL + 1/oE + 1/oV) : 1;
        const grupo   = (m.group || "").replace("GROUP_", "") || m.stage;

        return {
          id:        m.id,
          fecha:     col.fecha,
          hora:      col.hora,
          local:     NOMBRES_ES[localEN] || localEN,
          visitante: NOMBRES_ES[visitEN] || visitEN,
          grupo,
          estado:    m.status,
          goles_l:   m.score?.fullTime?.home ?? null,
          goles_v:   m.score?.fullTime?.away ?? null,
          ganador:   m.score?.winner || null,
          oL, oE, oV,
          pL: oL ? Math.round(1/oL/total*100) : 0,
          pE: oE ? Math.round(1/oE/total*100) : 0,
          pV: oV ? Math.round(1/oV/total*100) : 0,
        };
      });

      procesados.sort((a: any, b: any) => a.fecha.localeCompare(b.fecha) || a.hora.localeCompare(b.hora));
      setPartidos(procesados);
      setLoading(false);
    })
    .catch(() => setLoading(false));
  }, []);

  const toggleFav    = (equipo: string) => {
    const nuevos = favoritos.includes(equipo)
      ? favoritos.filter(f => f !== equipo)
      : [...favoritos, equipo];
    setFavoritos(nuevos);
    localStorage.setItem("xgoat_favs", JSON.stringify(nuevos));
  };

  const toggleFecha  = (fecha: string) =>
    setFechasAbiertas(prev => ({ ...prev, [fecha]: !prev[fecha] }));

  const filtrar = (lista: any[]) => {
    if (busqueda.length < 2) return lista;
    const q = busqueda.toLowerCase();
    return lista.filter(p =>
      p.local.toLowerCase().includes(q) ||
      p.visitante.toLowerCase().includes(q)
    );
  };

  const jugados  = filtrar(partidos.filter(p => p.estado === "FINISHED"));
  const deHoy    = filtrar(partidos.filter(p => p.fecha === hoy && p.estado !== "FINISHED"));
  const proximos = filtrar(partidos.filter(p => p.fecha > hoy && p.estado !== "FINISHED"));
  const favList  = filtrar(partidos.filter(p => favoritos.includes(p.local) || favoritos.includes(p.visitante)));

  const porFecha: Record<string, any[]> = {};
  proximos.forEach(p => {
    if (!porFecha[p.fecha]) porFecha[p.fecha] = [];
    porFecha[p.fecha].push(p);
  });

  const renderPartido = (p: any, enDesplegable = false) => {
    const esFav     = favoritos.includes(p.local) || favoritos.includes(p.visitante);
    const jugado    = p.estado === "FINISHED";

    return (
      <div key={p.id} style={{
        background:   enDesplegable ? "#080c14" : "#0d1320",
        border:       enDesplegable ? "none" : "1px solid " + (esFav ? "rgba(255,230,0,0.4)" : "#1e2d45"),
        borderBottom: enDesplegable ? "1px solid #1e2d45" : undefined,
        borderRadius: enDesplegable ? 0 : 8,
        padding:      "14px 16px",
        marginBottom: enDesplegable ? 0 : 10,
      }}>

        {/* META */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
          <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" as const }}>
            <span style={{ background: "rgba(0,229,255,0.1)", border: "1px solid rgba(0,229,255,0.2)", color: "#00e5ff", padding: "2px 8px", borderRadius: 4, fontSize: 11, fontWeight: 700 }}>
              {p.grupo.length === 1 ? "GRUPO " + p.grupo : p.grupo.replace("_", " ")}
            </span>
            <span style={{ fontSize: 11, color: "#5a6a80" }}>{p.hora} COL</span>
            {jugado && <GanadorBadge ganador={p.ganador} local={p.local} visitante={p.visitante} />}
          </div>
          <button onClick={() => toggleFav(p.local)} style={{
            background: "none",
            border: "1px solid " + (favoritos.includes(p.local) ? "#ffe600" : "#1e2d45"),
            borderRadius: 4, padding: "2px 8px", cursor: "pointer",
            color: favoritos.includes(p.local) ? "#ffe600" : "#5a6a80",
            fontSize: 11, fontWeight: 700
          }}>
            {favoritos.includes(p.local) ? "GUARDADO" : "FAV"}
          </button>
        </div>

        {/* MARCADOR O VS */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr auto 1fr", alignItems: "center", gap: 10, marginBottom: jugado ? 6 : 10 }}>
          <div style={{ fontFamily: "Barlow Condensed", fontSize: 17, fontWeight: 700 }}>{p.local}</div>
          {jugado ? (
            <div style={{ display: "flex", alignItems: "center", gap: 8, fontFamily: "Barlow Condensed", fontSize: 28, fontWeight: 800 }}>
              <span style={{ color: p.ganador === "HOME_TEAM" ? "#00ff87" : "#e8edf5" }}>{p.goles_l}</span>
              <span style={{ color: "#1e2d45", fontSize: 20 }}>-</span>
              <span style={{ color: p.ganador === "AWAY_TEAM" ? "#00ff87" : "#e8edf5" }}>{p.goles_v}</span>
            </div>
          ) : (
            <span style={{ color: "#1e2d45", fontFamily: "Barlow Condensed", fontSize: 18, fontWeight: 800 }}>VS</span>
          )}
          <div style={{ textAlign: "right" as const, fontFamily: "Barlow Condensed", fontSize: 17, fontWeight: 700 }}>{p.visitante}</div>
        </div>

        {/* CUOTAS — solo partidos no jugados */}
        {!jugado && p.oL > 0 && (
          <>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, color: "#5a6a80", marginBottom: 3 }}>
              <span>{p.local}</span><span>Empate</span><span>{p.visitante}</span>
            </div>
            <div style={{ display: "flex", height: 24, borderRadius: 4, overflow: "hidden", gap: 1, marginBottom: 4 }}>
              <div style={{ width: String(p.pL) + "%", background: "rgba(0,229,255,0.25)", color: "#00e5ff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700 }}>{p.pL}%</div>
              <div style={{ width: String(p.pE) + "%", background: "rgba(255,230,0,0.15)", color: "#ffe600", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700 }}>{p.pE}%</div>
              <div style={{ width: String(p.pV) + "%", background: "rgba(255,77,109,0.25)", color: "#ff4d6d", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700 }}>{p.pV}%</div>
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
  };

  //@ts-nocheck
  const s: any = {
    app:    { minHeight: "100vh", background: "#080c14", color: "#e8edf5", fontFamily: "Barlow, sans-serif" },
    header: { display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 20px", borderBottom: "1px solid #1e2d45", background: "#080c14", position: "sticky" as const, top: 0, zIndex: 100 },
    logo:   { width: 34, height: 34, background: "#00e5ff", borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 18, color: "#000" },
    search: { padding: "12px 20px", background: "#0d1320", borderBottom: "1px solid #1e2d45" },
    input:  { width: "100%", background: "#111928", border: "1px solid #1e2d45", borderRadius: 8, padding: "10px 12px 10px 36px", color: "#e8edf5", fontSize: 14, outline: "none" },
    stats:  { display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 1, background: "#1e2d45", borderBottom: "1px solid #1e2d45" },
    stat:   { background: "#0d1320", padding: "10px 14px" },
    tabs:   { display: "flex", borderBottom: "1px solid #1e2d45", background: "#0d1320", overflowX: "auto" as const },
    content:{ padding: 16, maxWidth: 800, margin: "0 auto" },
  };

  const TABS = [
    { id: "hoy",        label: "Hoy (" + deHoy.length + ")" },
    { id: "proximos",   label: "Proximos" },
    { id: "resultados", label: "Resultados (" + jugados.length + ")" },
    { id: "favoritos",  label: "Favoritos (" + favoritos.length + ")" },
  ];

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
        <div style={{ display: "flex", alignItems: "center", gap: 6, background: "rgba(255,61,61,0.15)", border: "1px solid rgba(255,61,61,0.4)", padding: "4px 10px", borderRadius: 4, fontSize: 11, fontWeight: 700, color: "#ff3d3d" }}>
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#ff3d3d", display: "inline-block" }} />
          LIVE
        </div>
      </div>

      {/* BUSCADOR */}
      <div style={s.search}>
        <div style={{ position: "relative" }}>
          <span style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: "#5a6a80" }}>🔍</span>
          <input
            style={s.input}
            placeholder="Buscar... ej: Colombia, Brasil, Argentina"
            value={busqueda}
            onChange={e => setBusqueda(e.target.value)}
          />
        </div>
        {busqueda.length > 1 && (
          <div style={{ marginTop: 8, fontSize: 12, color: "#5a6a80" }}>
            {filtrar(partidos).length} resultado(s) para "{busqueda}"
            <button onClick={() => setBusqueda("")} style={{ marginLeft: 10, background: "none", border: "none", color: "#00e5ff", cursor: "pointer", fontSize: 12 }}>Limpiar</button>
          </div>
        )}
      </div>

      {/* STATS */}
      <div style={s.stats}>
        {[
          { label: "Total",     value: String(partidos.length), color: "#00e5ff" },
          { label: "Jugados",   value: String(jugados.length),  color: "#00ff87" },
          { label: "Proximos",  value: String(proximos.length), color: "#ffe600" },
          { label: "Favoritos", value: String(favoritos.length),color: "#ff4d6d" },
        ].map(st => (
          <div key={st.label} style={s.stat}>
            <div style={{ fontSize: 9, letterSpacing: 1.5, color: "#5a6a80", textTransform: "uppercase" as const, marginBottom: 3 }}>{st.label}</div>
            <div style={{ fontFamily: "Barlow Condensed", fontSize: 24, fontWeight: 800, color: st.color }}>{loading ? "..." : st.value}</div>
          </div>
        ))}
      </div>

      {/* TABS */}
      <div style={s.tabs}>
        {TABS.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{
            padding: "12px 16px", background: "none", border: "none",
            borderBottom: tab === t.id ? "2px solid #00e5ff" : "2px solid transparent",
            color: tab === t.id ? "#00e5ff" : "#5a6a80",
            fontFamily: "Barlow Condensed", fontSize: 13, fontWeight: 700,
            letterSpacing: 1, textTransform: "uppercase" as const,
            cursor: "pointer", whiteSpace: "nowrap" as const,
          }}>
            {t.label}
          </button>
        ))}
      </div>

      {/* CONTENT */}
      <div style={s.content}>
        {loading ? (
          <div style={{ textAlign: "center" as const, padding: 60, color: "#5a6a80", fontSize: 18 }}>
            Cargando XGOAT...
          </div>
        ) : (
          <>
            {/* HOY */}
            {busqueda.length < 2 && tab === "hoy" && (
              deHoy.length > 0 ? deHoy.map(p => renderPartido(p))
              : <div style={{ textAlign: "center" as const, padding: 40, color: "#5a6a80" }}>
                  <div style={{ fontSize: 32, marginBottom: 8 }}>📅</div>
                  <div>No hay partidos hoy</div>
                  <div style={{ fontSize: 12, marginTop: 4 }}>{formatearFecha(hoy)}</div>
                </div>
            )}

            {/* PROXIMOS */}
            {busqueda.length < 2 && tab === "proximos" && Object.keys(porFecha).sort().map(fecha => (
              <div key={fecha} style={{ marginBottom: 8 }}>
                <button onClick={() => toggleFecha(fecha)} style={{
                  width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between",
                  background: "#0d1320", border: "1px solid #1e2d45",
                  borderRadius: fechasAbiertas[fecha] ? "8px 8px 0 0" : "8px",
                  padding: "10px 14px", cursor: "pointer", color: "#e8edf5"
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <span style={{ fontFamily: "Barlow Condensed", fontSize: 15, fontWeight: 800, textTransform: "uppercase" as const }}>
                      {formatearFecha(fecha)}
                    </span>
                    <span style={{ fontSize: 11, color: "#5a6a80" }}>{porFecha[fecha].length} partido(s)</span>
                  </div>
                  <span style={{ color: "#00e5ff", fontSize: 14, fontWeight: 700 }}>
                    {fechasAbiertas[fecha] ? "▲" : "▼"}
                  </span>
                </button>
                {fechasAbiertas[fecha] && (
                  <div style={{ border: "1px solid #1e2d45", borderTop: "none", borderRadius: "0 0 8px 8px", overflow: "hidden" }}>
                    {porFecha[fecha].map(p => renderPartido(p, true))}
                  </div>
                )}
              </div>
            ))}

            {/* RESULTADOS */}
            {busqueda.length < 2 && tab === "resultados" && (
              [...jugados].reverse().map(p => renderPartido(p))
            )}

            {/* FAVORITOS */}
            {busqueda.length < 2 && tab === "favoritos" && (
              favList.length > 0 ? favList.map(p => renderPartido(p))
              : <div style={{ textAlign: "center" as const, padding: 40, color: "#5a6a80" }}>
                  <div style={{ fontSize: 32, marginBottom: 8 }}>★</div>
                  <div>No tienes favoritos aun</div>
                  <div style={{ fontSize: 12, marginTop: 4 }}>Toca FAV en cualquier partido</div>
                </div>
            )}

            {/* BUSQUEDA */}
            {busqueda.length > 1 && (
              <div style={{ marginTop: 10 }}>
                <h3>Resultados: {filtrar(partidos).length}</h3>

                {filtrar(partidos).map((p, i) => (
                  <div key={i} style={{
                    padding: 10,
                    marginBottom: 10,
                    border: "1px solid #1e2d45"
                  }}>
                    {p.local} vs {p.visitante}
                  </div>
                ))}
              </div>
            )}              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}