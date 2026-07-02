// @ts-nocheck
import { useState, useEffect } from "react";

const ODDS_API_KEY = "2b8e66079f23dff56c1fcf7be2820a49";

const NOMBRES_ES = {
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

const BANDERAS = {
  "México":"🇲🇽","Sudáfrica":"🇿🇦","Corea del Sur":"🇰🇷","República Checa":"🇨🇿",
  "Canadá":"🇨🇦","Bosnia-Herzegovina":"🇧🇦","Catar":"🇶🇦","Suiza":"🇨🇭",
  "Estados Unidos":"🇺🇸","Paraguay":"🇵🇾","Australia":"🇦🇺","Turquía":"🇹🇷",
  "Brasil":"🇧🇷","Marruecos":"🇲🇦","Escocia":"🏴󠁧󠁢󠁳󠁣󠁴󠁿","Haití":"🇭🇹",
  "Alemania":"🇩🇪","Curazao":"🇨🇼","Costa de Marfil":"🇨🇮","Ecuador":"🇪🇨",
  "Países Bajos":"🇳🇱","Japón":"🇯🇵","Suecia":"🇸🇪","Túnez":"🇹🇳",
  "España":"🇪🇸","Cabo Verde":"🇨🇻","Arabia Saudita":"🇸🇦","Uruguay":"🇺🇾",
  "Bélgica":"🇧🇪","Egipto":"🇪🇬","Irán":"🇮🇷","Nueva Zelanda":"🇳🇿",
  "Francia":"🇫🇷","Senegal":"🇸🇳","Irak":"🇮🇶","Noruega":"🇳🇴",
  "Argentina":"🇦🇷","Argelia":"🇩🇿","Austria":"🇦🇹","Jordania":"🇯🇴",
  "Portugal":"🇵🇹","RD Congo":"🇨🇩","Uzbekistán":"🇺🇿","Colombia":"🇨🇴",
  "Ghana":"🇬🇭","Panamá":"🇵🇦","Inglaterra":"🏴󠁧󠁢󠁥󠁮󠁧󠁿","Croacia":"🇭🇷",
};

const CODIGOS = {
  "Argentina":"AR","Brasil":"BR","Francia":"FR","Noruega":"NO",
  "Marruecos":"MA","Alemania":"DE","Suiza":"CH","Canadá":"CA",
  "Países Bajos":"NL","España":"ES","Portugal":"PT","Colombia":"CO",
  "Inglaterra":"EN","México":"MX","Estados Unidos":"US","Uruguay":"UY",
  "Japón":"JP","Croacia":"HR","Escocia":"SC","Turquía":"TR",
  "Túnez":"TN","Suecia":"SE","Ecuador":"EC","Costa de Marfil":"CI",
  "Senegal":"SN","Bélgica":"BE","Egipto":"EG","Irán":"IR",
  "Nueva Zelanda":"NZ","Irak":"IQ","Argelia":"DZ","Austria":"AT",
  "Jordania":"JO","RD Congo":"CD","Uzbekistán":"UZ","Ghana":"GH",
  "Panamá":"PA","Haití":"HT","Paraguay":"PY","Arabia Saudita":"SA",
  "Catar":"QA","Sudáfrica":"ZA","Corea del Sur":"KR","República Checa":"CZ",
  "Bosnia-Herzegovina":"BA","Australia":"AU","Cabo Verde":"CV","Curazao":"CW",
};

const GRUPOS_DATA = {
  A: [
    { bandera:"🇲🇽", nombre:"México",         pj:3,g:3,e:0,p:0,gf:7,gc:1,dg:"+6",pts:9 },
    { bandera:"🇿🇦", nombre:"Sudáfrica",       pj:3,g:1,e:1,p:1,gf:2,gc:3,dg:"-1",pts:4 },
    { bandera:"🇰🇷", nombre:"Corea del Sur",   pj:3,g:1,e:0,p:2,gf:3,gc:4,dg:"-1",pts:3 },
    { bandera:"🇨🇿", nombre:"Chequia",         pj:3,g:0,e:1,p:2,gf:1,gc:5,dg:"-4",pts:1 },
  ],
  B: [
    { bandera:"🇨🇭", nombre:"Suiza",           pj:3,g:2,e:1,p:0,gf:6,gc:2,dg:"+4",pts:7 },
    { bandera:"🇨🇦", nombre:"Canadá",          pj:3,g:1,e:1,p:1,gf:7,gc:2,dg:"+5",pts:4 },
    { bandera:"🇧🇦", nombre:"Bosnia-Herz.",    pj:3,g:1,e:1,p:1,gf:2,gc:3,dg:"-1",pts:4 },
    { bandera:"🇶🇦", nombre:"Catar",           pj:3,g:0,e:1,p:2,gf:1,gc:9,dg:"-8",pts:1 },
  ],
  C: [
    { bandera:"🇧🇷", nombre:"Brasil",          pj:3,g:2,e:1,p:0,gf:8,gc:2,dg:"+6",pts:7 },
    { bandera:"🇲🇦", nombre:"Marruecos",       pj:3,g:2,e:1,p:0,gf:5,gc:2,dg:"+3",pts:7 },
    { bandera:"🏴󠁧󠁢󠁳󠁣󠁴󠁿", nombre:"Escocia",        pj:3,g:1,e:0,p:2,gf:2,gc:5,dg:"-3",pts:3 },
    { bandera:"🇭🇹", nombre:"Haití",           pj:3,g:0,e:0,p:3,gf:1,gc:7,dg:"-6",pts:0 },
  ],
  D: [
    { bandera:"🇺🇸", nombre:"Estados Unidos", pj:3,g:2,e:0,p:1,gf:7,gc:3,dg:"+4",pts:6 },
    { bandera:"🇦🇺", nombre:"Australia",       pj:3,g:1,e:1,p:1,gf:4,gc:4,dg:"0", pts:4 },
    { bandera:"🇵🇾", nombre:"Paraguay",        pj:3,g:1,e:1,p:1,gf:3,gc:4,dg:"-1",pts:4 },
    { bandera:"🇹🇷", nombre:"Turquía",         pj:3,g:1,e:0,p:2,gf:2,gc:5,dg:"-3",pts:3 },
  ],
  E: [
    { bandera:"🇩🇪", nombre:"Alemania",        pj:3,g:3,e:0,p:0,gf:13,gc:3,dg:"+10",pts:9 },
    { bandera:"🇨🇮", nombre:"Costa de Marfil", pj:3,g:1,e:1,p:1,gf:4,gc:5,dg:"-1",pts:4 },
    { bandera:"🇪🇨", nombre:"Ecuador",         pj:3,g:1,e:0,p:2,gf:3,gc:5,dg:"-2",pts:3 },
    { bandera:"🇨🇼", nombre:"Curazao",         pj:3,g:0,e:1,p:2,gf:3,gc:10,dg:"-7",pts:1 },
  ],
  F: [
    { bandera:"🇳🇱", nombre:"Países Bajos",   pj:3,g:1,e:2,p:0,gf:6,gc:4,dg:"+2",pts:5 },
    { bandera:"🇯🇵", nombre:"Japón",           pj:3,g:1,e:2,p:0,gf:5,gc:4,dg:"+1",pts:5 },
    { bandera:"🇸🇪", nombre:"Suecia",          pj:3,g:1,e:0,p:2,gf:3,gc:4,dg:"-1",pts:3 },
    { bandera:"🇹🇳", nombre:"Túnez",           pj:3,g:0,e:2,p:1,gf:2,gc:4,dg:"-2",pts:2 },
  ],
  H: [
    { bandera:"🇪🇸", nombre:"España",          pj:3,g:3,e:0,p:0,gf:9,gc:1,dg:"+8",pts:9 },
    { bandera:"🇺🇾", nombre:"Uruguay",         pj:3,g:2,e:0,p:1,gf:5,gc:3,dg:"+2",pts:6 },
    { bandera:"🇸🇦", nombre:"Arabia Saudita",  pj:3,g:0,e:1,p:2,gf:2,gc:7,dg:"-5",pts:1 },
    { bandera:"🇨🇻", nombre:"Cabo Verde",      pj:3,g:0,e:1,p:2,gf:1,gc:6,dg:"-5",pts:1 },
  ],
  G: [
    { bandera:"🇧🇪", nombre:"Bélgica",         pj:3,g:2,e:1,p:0,gf:6,gc:2,dg:"+4",pts:7 },
    { bandera:"🇮🇷", nombre:"Irán",            pj:3,g:1,e:1,p:1,gf:3,gc:3,dg:"0", pts:4 },
    { bandera:"🇳🇿", nombre:"Nueva Zelanda",   pj:3,g:1,e:0,p:2,gf:2,gc:4,dg:"-2",pts:3 },
    { bandera:"🇪🇬", nombre:"Egipto",          pj:3,g:0,e:2,p:1,gf:2,gc:4,dg:"-2",pts:2 },
  ],
  I: [
    { bandera:"🇫🇷", nombre:"Francia",         pj:3,g:2,e:1,p:0,gf:7,gc:2,dg:"+5",pts:7 },
    { bandera:"🇸🇳", nombre:"Senegal",         pj:3,g:1,e:1,p:1,gf:3,gc:4,dg:"-1",pts:4 },
    { bandera:"🇳🇴", nombre:"Noruega",         pj:3,g:1,e:0,p:2,gf:5,gc:6,dg:"-1",pts:3 },
    { bandera:"🇮🇶", nombre:"Irak",            pj:3,g:0,e:2,p:1,gf:2,gc:5,dg:"-3",pts:2 },
  ],
  J: [
    { bandera:"🇦🇷", nombre:"Argentina",       pj:3,g:2,e:1,p:0,gf:6,gc:2,dg:"+4",pts:7 },
    { bandera:"🇩🇿", nombre:"Argelia",         pj:3,g:1,e:1,p:1,gf:3,gc:3,dg:"0", pts:4 },
    { bandera:"🇦🇹", nombre:"Austria",         pj:3,g:1,e:0,p:2,gf:3,gc:5,dg:"-2",pts:3 },
    { bandera:"🇯🇴", nombre:"Jordania",        pj:3,g:0,e:2,p:1,gf:1,gc:3,dg:"-2",pts:2 },
  ],
  K: [
    { bandera:"🇵🇹", nombre:"Portugal",        pj:3,g:2,e:1,p:0,gf:8,gc:2,dg:"+6",pts:7 },
    { bandera:"🇨🇴", nombre:"Colombia",        pj:3,g:2,e:0,p:1,gf:5,gc:3,dg:"+2",pts:6 },
    { bandera:"🇺🇿", nombre:"Uzbekistán",      pj:3,g:1,e:0,p:2,gf:3,gc:6,dg:"-3",pts:3 },
    { bandera:"🇨🇩", nombre:"RD Congo",        pj:3,g:0,e:1,p:2,gf:1,gc:6,dg:"-5",pts:1 },
  ],
  L: [
    { bandera:"🏴󠁧󠁢󠁥󠁮󠁧󠁿", nombre:"Inglaterra",     pj:3,g:2,e:1,p:0,gf:6,gc:2,dg:"+4",pts:7 },
    { bandera:"🇭🇷", nombre:"Croacia",          pj:3,g:1,e:1,p:1,gf:4,gc:4,dg:"0", pts:4 },
    { bandera:"🇬🇭", nombre:"Ghana",            pj:3,g:1,e:0,p:2,gf:3,gc:5,dg:"-2",pts:3 },
    { bandera:"🇵🇦", nombre:"Panamá",           pj:3,g:0,e:2,p:1,gf:2,gc:4,dg:"-2",pts:2 },
  ],
};

const BRACKET_16 = [
  { id:1,  fecha:"Jun 28",hora:"09:00",local:{b:"🇿🇦",n:"Sudáfrica"},     visit:{b:"🇨🇦",n:"Canadá"},         gl:1,gv:3,estado:"FINAL",  ganador:"visit" },
  { id:2,  fecha:"Jun 28",hora:"15:00",local:{b:"🇨🇭",n:"Suiza"},         visit:{b:"🇺🇸",n:"Est. Unidos"},     gl:2,gv:1,estado:"FINAL",  ganador:"local" },
  { id:3,  fecha:"Jun 29",hora:"09:00",local:{b:"🇩🇪",n:"Alemania"},      visit:{b:"🇵🇾",n:"Paraguay"},        gl:null,gv:null,estado:"PROXIMO",ganador:null },
  { id:4,  fecha:"Jun 29",hora:"15:00",local:{b:"🇳🇱",n:"P. Bajos"},      visit:{b:"🇲🇦",n:"Marruecos"},      gl:null,gv:null,estado:"PROXIMO",ganador:null },
  { id:5,  fecha:"Jun 30",hora:"09:00",local:{b:"🇧🇷",n:"Brasil"},        visit:{b:"🇮🇷",n:"Irán"},            gl:null,gv:null,estado:"PROXIMO",ganador:null },
  { id:6,  fecha:"Jun 30",hora:"15:00",local:{b:"🇫🇷",n:"Francia"},       visit:{b:"❓",n:"3C/D/F/G/H"},      gl:null,gv:null,estado:"PROXIMO",ganador:null },
  { id:7,  fecha:"Jul 1", hora:"09:00",local:{b:"🇲🇽",n:"México"},        visit:{b:"🇯🇵",n:"Japón"},           gl:null,gv:null,estado:"PROXIMO",ganador:null },
  { id:8,  fecha:"Jul 1", hora:"15:00",local:{b:"🇪🇸",n:"España"},        visit:{b:"🇩🇿",n:"Argelia"},         gl:null,gv:null,estado:"PROXIMO",ganador:null },
  { id:9,  fecha:"Jul 2", hora:"09:00",local:{b:"🇦🇷",n:"Argentina"},     visit:{b:"🇨🇮",n:"C. de Marfil"},    gl:null,gv:null,estado:"PROXIMO",ganador:null },
  { id:10, fecha:"Jul 2", hora:"15:00",local:{b:"🇵🇹",n:"Portugal"},      visit:{b:"🇦🇺",n:"Australia"},       gl:null,gv:null,estado:"PROXIMO",ganador:null },
  { id:11, fecha:"Jul 3", hora:"09:00",local:{b:"🇧🇪",n:"Bélgica"},       visit:{b:"🇺🇾",n:"Uruguay"},         gl:null,gv:null,estado:"PROXIMO",ganador:null },
  { id:12, fecha:"Jul 3", hora:"15:00",local:{b:"🏴󠁧󠁢󠁥󠁮󠁧󠁿",n:"Inglaterra"},  visit:{b:"🇸🇳",n:"Senegal"},         gl:null,gv:null,estado:"PROXIMO",ganador:null },
  { id:13, fecha:"Jul 4", hora:"09:00",local:{b:"❓",n:"1H"},             visit:{b:"❓",n:"2J"},               gl:null,gv:null,estado:"PROXIMO",ganador:null },
  { id:14, fecha:"Jul 4", hora:"15:00",local:{b:"❓",n:"2K"},             visit:{b:"❓",n:"2L"},               gl:null,gv:null,estado:"PROXIMO",ganador:null },
  { id:15, fecha:"Jul 5", hora:"09:00",local:{b:"🇨🇴",n:"Colombia"},      visit:{b:"🇭🇷",n:"Croacia"},         gl:null,gv:null,estado:"PROXIMO",ganador:null },
  { id:16, fecha:"Jul 5", hora:"15:00",local:{b:"❓",n:"1I"},             visit:{b:"❓",n:"1L"},               gl:null,gv:null,estado:"PROXIMO",ganador:null },
];

const FASES_FUTURAS = [
  { id:"8vos",    label:"8vos de Final",    fecha:"Jul 8-9",   n:8  },
  { id:"cuartos", label:"Cuartos de Final", fecha:"Jul 12-13", n:4  },
  { id:"semis",   label:"Semifinales",      fecha:"Jul 15-16", n:2  },
  { id:"final",   label:"Final",            fecha:"Jul 19",    n:1  },
];

function horaCol(utcDate) {
  const dt = new Date(utcDate);
  dt.setHours(dt.getHours() - 5);
  return { fecha: dt.toISOString().slice(0,10), hora: dt.toISOString().slice(11,16) };
}

function formatearFecha(fecha) {
  const d = new Date(fecha + "T12:00:00");
  return d.toLocaleDateString("es-CO", { weekday:"short", day:"numeric", month:"short" });
}

function GanadorBadge({ ganador, local, visitante }) {
  if (!ganador || ganador === "null") return null;
  const color = ganador === "DRAW" ? "#ffe600" : "#00ff87";
  const texto = ganador === "HOME_TEAM" ? local : ganador === "AWAY_TEAM" ? visitante : "Empate";
  return (
    <span style={{ fontSize:10, fontWeight:700, color, background:color+"15", border:"1px solid "+color+"40", padding:"2px 7px", borderRadius:3 }}>
      {ganador === "DRAW" ? "EMPATE" : "GANO " + texto.toUpperCase()}
    </span>
  );
}

export default function App() {
  const [partidos, setPartidos]             = useState([]);
  const [goleadores, setGoleadores]         = useState([]);
  const [loading, setLoading]               = useState(true);
  const [tab, setTab]                       = useState("grupos");
  const [subTab, setSubTab]                 = useState("tabla");
  const [busqueda, setBusqueda]             = useState("");
  const [fechasAbiertas, setFechasAbiertas] = useState({});
  const [favoritos, setFavoritos]           = useState(() => {
    try { return JSON.parse(localStorage.getItem("xgoat_favs") || "[]"); }
    catch { return []; }
  });

  const hoy = new Date().toLocaleDateString("en-CA", { timeZone:"America/Bogota" });

  useEffect(() => {
    Promise.all([
      fetch("/api/matches").then(r => r.json()),
      fetch("/api/scorers").then(r => r.json()),
      fetch("https://api.the-odds-api.com/v4/sports/soccer_fifa_world_cup/odds?apiKey="
        + ODDS_API_KEY + "&regions=eu&markets=h2h&oddsFormat=decimal").then(r => r.json()),
    ])
    .then(([fdData, scData, oddsData]) => {
      const cuotasMap = {};
      if (Array.isArray(oddsData)) {
        oddsData.forEach(p => {
          let oL=0,oE=0,oV=0;
          if (p.bookmakers?.length) {
            p.bookmakers[0].markets[0].outcomes.forEach(o => {
              if (o.name === p.home_team) oL = o.price;
              else if (o.name === p.away_team) oV = o.price;
              else oE = o.price;
            });
          }
          cuotasMap[p.home_team+"|"+p.away_team] = { oL,oE,oV };
        });
      }

      const procesados = fdData.matches.map(m => {
        const col     = horaCol(m.utcDate);
        const localEN = m.homeTeam.name;
        const visitEN = m.awayTeam.name;
        const cuotas  = cuotasMap[localEN+"|"+visitEN] || {oL:0,oE:0,oV:0};
        const {oL,oE,oV} = cuotas;
        const total   = oL&&oE&&oV ? (1/oL+1/oE+1/oV) : 1;
        const grupo   = (m.group||"").replace("GROUP_","") || m.stage;
        return {
          id:m.id, fecha:col.fecha, hora:col.hora,
          local:NOMBRES_ES[localEN]||localEN,
          visitante:NOMBRES_ES[visitEN]||visitEN,
          grupo, estado:m.status,
          goles_l:m.score?.fullTime?.home??null,
          goles_v:m.score?.fullTime?.away??null,
          ganador:m.score?.winner||null,
          oL,oE,oV,
          pL:oL?Math.round(1/oL/total*100):0,
          pE:oE?Math.round(1/oE/total*100):0,
          pV:oV?Math.round(1/oV/total*100):0,
        };
      });
      procesados.sort((a,b) => a.fecha.localeCompare(b.fecha)||a.hora.localeCompare(b.hora));
      setPartidos(procesados);

      if (scData.scorers) {
        setGoleadores(scData.scorers.map(g => ({
          nombre:g.player.name,
          equipo:NOMBRES_ES[g.team.name]||g.team.name,
          goles:g.goals||0,
          asistencias:g.assists||0,
          partidos:g.playedMatches||0,
        })));
      }
      setLoading(false);
    })
    .catch(() => setLoading(false));
  }, []);

  const toggleFav   = equipo => {
    const nuevos = favoritos.includes(equipo) ? favoritos.filter(f=>f!==equipo) : [...favoritos,equipo];
    setFavoritos(nuevos);
    localStorage.setItem("xgoat_favs", JSON.stringify(nuevos));
  };

  const toggleFecha = fecha => setFechasAbiertas(prev => ({...prev,[fecha]:!prev[fecha]}));

  const filtrar = lista => {
    if (busqueda.length < 2) return lista;
    const q = busqueda.toLowerCase();
    return lista.filter(p => p.local.toLowerCase().includes(q) || p.visitante.toLowerCase().includes(q));
  };

  const todosJugados  = partidos.filter(p => p.estado==="FINISHED");
  const todosDeHoy    = partidos.filter(p => p.fecha===hoy && p.estado!=="FINISHED");
  const todosProximos = partidos.filter(p => p.fecha>hoy && p.estado!=="FINISHED");
  const todosFav      = partidos.filter(p => favoritos.includes(p.local)||favoritos.includes(p.visitante));

  const jugados  = filtrar(todosJugados);
  const deHoy    = filtrar(todosDeHoy);
  const proximos = filtrar(todosProximos);
  const favList  = filtrar(todosFav);
  const resultadosBusqueda = filtrar(partidos);

  const porFecha = {};
  proximos.forEach(p => { if(!porFecha[p.fecha]) porFecha[p.fecha]=[]; porFecha[p.fecha].push(p); });

  const renderPartido = (p, enDesplegable=false) => {
    const esFav  = favoritos.includes(p.local)||favoritos.includes(p.visitante);
    const jugado = p.estado==="FINISHED";
    return (
      <div key={p.id} style={{
        background:   enDesplegable?"#080c14":"#0d1320",
        border:       enDesplegable?"none":"1px solid "+(esFav?"rgba(255,230,0,0.4)":"#1e2d45"),
        borderBottom: enDesplegable?"1px solid #1e2d45":undefined,
        borderRadius: enDesplegable?0:8,
        padding:"14px 16px", marginBottom:enDesplegable?0:10,
      }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:10 }}>
          <div style={{ display:"flex", gap:8, alignItems:"center", flexWrap:"wrap" }}>
            <span style={{ background:"rgba(0,229,255,0.1)", border:"1px solid rgba(0,229,255,0.2)", color:"#00e5ff", padding:"2px 8px", borderRadius:4, fontSize:11, fontWeight:700 }}>
              {p.grupo.length===1?"GRUPO "+p.grupo:p.grupo.replace(/_/g," ")}
            </span>
            <span style={{ fontSize:11, color:"#5a6a80" }}>{p.hora} COL</span>
            {jugado && <GanadorBadge ganador={p.ganador} local={p.local} visitante={p.visitante} />}
          </div>
          <button onClick={()=>toggleFav(p.local)} style={{ background:"none", border:"1px solid "+(favoritos.includes(p.local)?"#ffe600":"#1e2d45"), borderRadius:4, padding:"2px 8px", cursor:"pointer", color:favoritos.includes(p.local)?"#ffe600":"#5a6a80", fontSize:11, fontWeight:700 }}>
            {favoritos.includes(p.local)?"GUARDADO":"FAV"}
          </button>
        </div>

        <div style={{ display:"grid", gridTemplateColumns:"1fr auto 1fr", alignItems:"center", gap:10, marginBottom:jugado?6:10 }}>
          <div>
            <div style={{ fontFamily:"Barlow Condensed", fontSize:17, fontWeight:700 }}>{BANDERAS[p.local]||""} {p.local}</div>
            <div style={{ fontSize:10, color:"#5a6a80" }}>({CODIGOS[p.local]||""})</div>
          </div>
          {jugado ? (
            <div style={{ display:"flex", alignItems:"center", gap:8, fontFamily:"Barlow Condensed", fontSize:28, fontWeight:800 }}>
              <span style={{ color:p.ganador==="HOME_TEAM"?"#00ff87":"#e8edf5" }}>{p.goles_l}</span>
              <span style={{ color:"#1e2d45", fontSize:20 }}>-</span>
              <span style={{ color:p.ganador==="AWAY_TEAM"?"#00ff87":"#e8edf5" }}>{p.goles_v}</span>
            </div>
          ) : (
            <span style={{ color:"#1e2d45", fontFamily:"Barlow Condensed", fontSize:18, fontWeight:800 }}>VS</span>
          )}
          <div style={{ textAlign:"right" }}>
            <div style={{ fontFamily:"Barlow Condensed", fontSize:17, fontWeight:700 }}>{p.visitante} {BANDERAS[p.visitante]||""}</div>
            <div style={{ fontSize:10, color:"#5a6a80", textAlign:"right" }}>({CODIGOS[p.visitante]||""})</div>
          </div>
        </div>

        {!jugado && p.oL>0 && (
          <>
            <div style={{ display:"flex", justifyContent:"space-between", fontSize:10, color:"#5a6a80", marginBottom:3 }}>
              <span>{p.local}</span><span>Empate</span><span>{p.visitante}</span>
            </div>
            <div style={{ display:"flex", height:24, borderRadius:4, overflow:"hidden", gap:1, marginBottom:4 }}>
              <div style={{ width:String(p.pL)+"%", background:"rgba(0,229,255,0.25)", color:"#00e5ff", display:"flex", alignItems:"center", justifyContent:"center", fontSize:11, fontWeight:700 }}>{p.pL}%</div>
              <div style={{ width:String(p.pE)+"%", background:"rgba(255,230,0,0.15)", color:"#ffe600", display:"flex", alignItems:"center", justifyContent:"center", fontSize:11, fontWeight:700 }}>{p.pE}%</div>
              <div style={{ width:String(p.pV)+"%", background:"rgba(255,77,109,0.25)", color:"#ff4d6d", display:"flex", alignItems:"center", justifyContent:"center", fontSize:11, fontWeight:700 }}>{p.pV}%</div>
            </div>
            <div style={{ display:"flex", justifyContent:"space-between", fontSize:12, fontFamily:"Barlow Condensed", fontWeight:700 }}>
              <span style={{ color:"#00e5ff" }}>{p.oL}</span>
              <span style={{ color:"#ffe600" }}>{p.oE}</span>
              <span style={{ color:"#ff4d6d" }}>{p.oV}</span>
            </div>
          </>
        )}
      </div>
    );
  };

  const renderBracketPartido = p => (
    <div key={p.id} style={{ background:"#0d1320", border:"1px solid "+(p.estado==="FINAL"?"rgba(0,255,135,0.2)":"#1e2d45"), borderRadius:8, padding:"12px 16px", marginBottom:8, borderLeft:"3px solid "+(p.estado==="FINAL"?"#00ff87":"#00e5ff") }}>
      <div style={{ fontSize:10, color:"#5a6a80", marginBottom:10 }}>📅 {p.fecha} · {p.hora} COL</div>
      <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
        <div style={{ display:"flex", alignItems:"center", gap:8 }}>
          <span style={{ fontSize:18 }}>{p.local.b}</span>
          <span style={{ fontFamily:"Barlow Condensed", fontSize:15, fontWeight:p.ganador==="local"?800:600, color:p.ganador==="local"?"#e8edf5":"#5a6a80", flex:1 }}>{p.local.n}</span>
          {p.gl!==null && <span style={{ fontFamily:"Barlow Condensed", fontSize:22, fontWeight:800, color:p.ganador==="local"?"#00ff87":"#5a6a80" }}>{p.gl}</span>}
        </div>
        <div style={{ height:1, background:"#1e2d45" }} />
        <div style={{ display:"flex", alignItems:"center", gap:8 }}>
          <span style={{ fontSize:18 }}>{p.visit.b}</span>
          <span style={{ fontFamily:"Barlow Condensed", fontSize:15, fontWeight:p.ganador==="visit"?800:600, color:p.ganador==="visit"?"#e8edf5":"#5a6a80", flex:1 }}>{p.visit.n}</span>
          {p.gv!==null && <span style={{ fontFamily:"Barlow Condensed", fontSize:22, fontWeight:800, color:p.ganador==="visit"?"#00ff87":"#5a6a80" }}>{p.gv}</span>}
        </div>
      </div>
    </div>
  );

  const TABS = [
    { id:"grupos",     label:"Grupos" },
    { id:"hoy",        label:"Hoy ("+todosDeHoy.length+")" },
    { id:"proximos",   label:"Proximos" },
    { id:"resultados", label:"Resultados ("+todosJugados.length+")" },
    { id:"goleadores", label:"Goleadores" },
    { id:"favoritos",  label:"Favoritos ("+todosFav.length+")" },
  ];

  const SUB_TABS = [
    { id:"tabla",   label:"FG" },
    { id:"16avos",  label:"16vos" },
    { id:"8vos",    label:"8vos" },
    { id:"cuartos", label:"CF" },
    { id:"semis",   label:"SF" },
    { id:"final",   label:"F" },
  ];

  return (
    <div style={{ minHeight:"100vh", background:"#080c14", color:"#e8edf5", fontFamily:"Barlow, sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@700;800&family=Barlow:wght@400;600&display=swap');
        * { box-sizing:border-box; margin:0; padding:0; }
        body { background:#080c14; }
        input::placeholder { color:#3a4a5a; }
      `}</style>

      {/* HEADER */}
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"14px 20px", borderBottom:"1px solid #1e2d45", background:"#080c14", position:"sticky", top:0, zIndex:100 }}>
        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
          <div style={{ width:34, height:34, background:"#00e5ff", borderRadius:6, display:"flex", alignItems:"center", justifyContent:"center", fontWeight:800, fontSize:18, color:"#000" }}>X</div>
          <span style={{ fontFamily:"Barlow Condensed", fontSize:22, fontWeight:800, letterSpacing:2 }}>
            XGOAT <span style={{ color:"#00e5ff" }}>2026</span>
          </span>
        </div>
        <div style={{ display:"flex", alignItems:"center", gap:6, background:"rgba(255,61,61,0.15)", border:"1px solid rgba(255,61,61,0.4)", padding:"4px 10px", borderRadius:4, fontSize:11, fontWeight:700, color:"#ff3d3d" }}>
          <span style={{ width:6, height:6, borderRadius:"50%", background:"#ff3d3d", display:"inline-block" }} />
          LIVE
        </div>
      </div>

      {/* BUSCADOR */}
      <div style={{ padding:"12px 20px", background:"#0d1320", borderBottom:"1px solid #1e2d45" }}>
        <div style={{ position:"relative" }}>
          <span style={{ position:"absolute", left:10, top:"50%", transform:"translateY(-50%)", color:"#5a6a80" }}>🔍</span>
          <input
            style={{ width:"100%", background:"#111928", border:"1px solid #1e2d45", borderRadius:8, padding:"10px 12px 10px 36px", color:"#e8edf5", fontSize:14, outline:"none" }}
            placeholder="Buscar... ej: Colombia, Brasil, Argentina"
            value={busqueda}
            onChange={e => setBusqueda(e.target.value)}
          />
        </div>
        {busqueda.length>1 && (
          <div style={{ marginTop:8, fontSize:12, color:"#5a6a80" }}>
            {resultadosBusqueda.length} resultado(s) para "{busqueda}"
            <button onClick={()=>setBusqueda("")} style={{ marginLeft:10, background:"none", border:"none", color:"#00e5ff", cursor:"pointer", fontSize:12 }}>Limpiar</button>
          </div>
        )}
      </div>

      {/* STATS */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:1, background:"#1e2d45", borderBottom:"1px solid #1e2d45" }}>
        {[
          { label:"Total",    value:String(partidos.length),     color:"#00e5ff" },
          { label:"Jugados",  value:String(todosJugados.length), color:"#00ff87" },
          { label:"Proximos", value:String(todosProximos.length),color:"#ffe600" },
          { label:"Favs",     value:String(todosFav.length),     color:"#ff4d6d" },
        ].map(st => (
          <div key={st.label} style={{ background:"#0d1320", padding:"10px 14px" }}>
            <div style={{ fontSize:9, letterSpacing:1.5, color:"#5a6a80", textTransform:"uppercase", marginBottom:3 }}>{st.label}</div>
            <div style={{ fontFamily:"Barlow Condensed", fontSize:24, fontWeight:800, color:st.color }}>{loading?"...":st.value}</div>
          </div>
        ))}
      </div>

      {/* TABS */}
      <div style={{ display:"flex", borderBottom:"1px solid #1e2d45", background:"#0d1320", overflowX:"auto" }}>
        {TABS.map(t => (
          <button key={t.id} onClick={()=>setTab(t.id)} style={{
            padding:"12px 16px", background:"none", border:"none",
            borderBottom:tab===t.id?"2px solid #00e5ff":"2px solid transparent",
            color:tab===t.id?"#00e5ff":"#5a6a80",
            fontFamily:"Barlow Condensed", fontSize:13, fontWeight:700,
            letterSpacing:1, textTransform:"uppercase", cursor:"pointer", whiteSpace:"nowrap",
          }}>
            {t.label}
          </button>
        ))}
      </div>

      {/* CONTENT */}
      <div style={{ padding:16, maxWidth:800, margin:"0 auto" }}>
        {loading ? (
          <div style={{ textAlign:"center", padding:60, color:"#5a6a80", fontSize:18 }}>Cargando XGOAT...</div>

        ) : busqueda.length>1 ? (
          <div>
            {resultadosBusqueda.length===0
              ? <div style={{ textAlign:"center", padding:40, color:"#5a6a80" }}>
                  <div style={{ fontSize:32, marginBottom:8 }}>🔍</div>
                  <div>No se encontraron partidos para "{busqueda}"</div>
                </div>
              : resultadosBusqueda.map(p => renderPartido(p))
            }
          </div>

        ) : (
          <>
            {/* GRUPOS */}
            {tab==="grupos" && (
              <div>
                {/* Sub-tabs */}
                <div style={{ display:"flex", gap:0, marginBottom:16, background:"#0d1320", borderRadius:8, overflow:"hidden", border:"1px solid #1e2d45" }}>
                  {SUB_TABS.map((s,i) => (
                    <button key={s.id} onClick={()=>setSubTab(s.id)} style={{
                      flex:1, padding:"10px 4px",
                      background:subTab===s.id?"#00e5ff":"none",
                      border:"none", borderRight:i<SUB_TABS.length-1?"1px solid #1e2d45":"none",
                      color:subTab===s.id?"#000":s.id==="tabla"||s.id==="16avos"?"#e8edf5":"#5a6a80",
                      fontFamily:"Barlow Condensed", fontSize:11, fontWeight:800,
                      cursor:"pointer", letterSpacing:0.5, textTransform:"uppercase",
                    }}>
                      {s.label}
                    </button>
                  ))}
                </div>

                {/* Tabla de grupos */}
                {subTab==="tabla" && (
                  <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8 }}>
                    {Object.entries(GRUPOS_DATA).map(([letra,equipos]) => (
                      <div key={letra} style={{ background:"#0d1320", border:"1px solid #1e2d45", borderRadius:10, overflow:"hidden" }}>
                        <div style={{ background:"linear-gradient(135deg,rgba(0,229,255,0.12),transparent)", padding:"8px 12px", borderBottom:"1px solid #1e2d45" }}>
                          <span style={{ fontFamily:"Barlow Condensed", fontSize:14, fontWeight:800, color:"#00e5ff", letterSpacing:2 }}>GRUPO {letra}</span>
                        </div>
                        {equipos.map((eq,i) => (
                          <div key={eq.nombre} style={{ display:"flex", alignItems:"center", gap:8, padding:"8px 12px", borderBottom:i<3?"1px solid rgba(30,45,69,0.5)":"none", borderLeft:i<2?"2px solid #00e5ff":"2px solid transparent", background:i<2?"rgba(0,229,255,0.02)":"transparent" }}>
                            <span style={{ fontSize:16 }}>{eq.bandera}</span>
                            <span style={{ fontFamily:"Barlow Condensed", fontSize:13, fontWeight:i<2?700:500, color:i<2?"#e8edf5":"#5a6a80", flex:1 }}>{eq.nombre}</span>
                            <span style={{ fontFamily:"Barlow Condensed", fontSize:16, fontWeight:800, color:i===0?"#ffe600":i===1?"#e8edf5":"#3a4a5a" }}>{eq.pts}</span>
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                )}

                {/* 16avos */}
                {subTab==="16avos" && (
                  <div>
                    {BRACKET_16.filter(p=>p.estado==="FINAL").length>0 && (
                      <div style={{ marginBottom:16 }}>
                        <div style={{ fontSize:10, color:"#00ff87", letterSpacing:2, textTransform:"uppercase", marginBottom:8, fontWeight:700, display:"flex", alignItems:"center", gap:6 }}>
                          <span style={{ width:6, height:6, borderRadius:"50%", background:"#00ff87", display:"inline-block" }} /> Finalizados
                        </div>
                        {BRACKET_16.filter(p=>p.estado==="FINAL").map(p => renderBracketPartido(p))}
                      </div>
                    )}
                    <div>
                      <div style={{ fontSize:10, color:"#00e5ff", letterSpacing:2, textTransform:"uppercase", marginBottom:8, fontWeight:700, display:"flex", alignItems:"center", gap:6 }}>
                        <span style={{ width:6, height:6, borderRadius:"50%", background:"#00e5ff", display:"inline-block" }} />
                        Proximos — {BRACKET_16.filter(p=>p.estado==="PROXIMO").length} partidos
                      </div>
                      {BRACKET_16.filter(p=>p.estado==="PROXIMO").map(p => renderBracketPartido(p))}
                    </div>
                  </div>
                )}

                {/* Fases futuras */}
                {["8vos","cuartos","semis","final"].includes(subTab) && (() => {
                  const info = FASES_FUTURAS.find(f=>f.id===subTab);
                  return (
                    <div>
                      <div style={{ textAlign:"center", padding:"32px 0 24px" }}>
                        <div style={{ fontSize:48, marginBottom:12 }}>🏆</div>
                        <div style={{ fontFamily:"Barlow Condensed", fontSize:22, fontWeight:800, color:"#e8edf5", marginBottom:6 }}>{info.label}</div>
                        <div style={{ fontSize:12, color:"#5a6a80", marginBottom:4 }}>Se juega el</div>
                        <div style={{ fontFamily:"Barlow Condensed", fontSize:18, fontWeight:700, color:"#00e5ff" }}>{info.fecha}</div>
                      </div>
                      {Array.from({length:info.n}).map((_,i) => (
                        <div key={i} style={{ background:"#0d1320", border:"1px solid #1e2d45", borderRadius:8, padding:"14px 16px", marginBottom:8, opacity:0.4 }}>
                          <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
                            <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                              <div style={{ width:20, height:20, borderRadius:"50%", background:"#1e2d45" }} />
                              <span style={{ fontFamily:"Barlow Condensed", fontSize:15, color:"#3a4a5a" }}>Por determinar</span>
                            </div>
                            <div style={{ height:1, background:"#1e2d45" }} />
                            <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                              <div style={{ width:20, height:20, borderRadius:"50%", background:"#1e2d45" }} />
                              <span style={{ fontFamily:"Barlow Condensed", fontSize:15, color:"#3a4a5a" }}>Por determinar</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  );
                })()}
              </div>
            )}

            {/* HOY */}
            {tab==="hoy" && (
              deHoy.length>0 ? deHoy.map(p=>renderPartido(p))
              : <div style={{ textAlign:"center", padding:40, color:"#5a6a80" }}>
                  <div style={{ fontSize:32, marginBottom:8 }}>📅</div>
                  <div>No hay partidos hoy</div>
                  <div style={{ fontSize:12, marginTop:4 }}>{formatearFecha(hoy)}</div>
                </div>
            )}

            {/* PROXIMOS */}
            {tab==="proximos" && Object.keys(porFecha).sort().map(fecha => (
              <div key={fecha} style={{ marginBottom:8 }}>
                <button onClick={()=>toggleFecha(fecha)} style={{ width:"100%", display:"flex", alignItems:"center", justifyContent:"space-between", background:"#0d1320", border:"1px solid #1e2d45", borderRadius:fechasAbiertas[fecha]?"8px 8px 0 0":"8px", padding:"10px 14px", cursor:"pointer", color:"#e8edf5" }}>
                  <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                    <span style={{ fontFamily:"Barlow Condensed", fontSize:15, fontWeight:800, textTransform:"uppercase" }}>{formatearFecha(fecha)}</span>
                    <span style={{ fontSize:11, color:"#5a6a80" }}>{porFecha[fecha].length} partido(s)</span>
                  </div>
                  <span style={{ color:"#00e5ff", fontSize:14, fontWeight:700 }}>{fechasAbiertas[fecha]?"▲":"▼"}</span>
                </button>
                {fechasAbiertas[fecha] && (
                  <div style={{ border:"1px solid #1e2d45", borderTop:"none", borderRadius:"0 0 8px 8px", overflow:"hidden" }}>
                    {porFecha[fecha].map(p=>renderPartido(p,true))}
                  </div>
                )}
              </div>
            ))}

            {/* RESULTADOS */}
            {tab==="resultados" && [...jugados].reverse().map(p=>renderPartido(p))}

            {/* GOLEADORES */}
            {tab==="goleadores" && (
              <div>
                <div style={{ fontSize:11, color:"#5a6a80", letterSpacing:2, textTransform:"uppercase", marginBottom:12 }}>Top goleadores del Mundial 2026</div>
                {goleadores.map((g,i) => (
                  <div key={i} style={{ background:"#0d1320", border:"1px solid #1e2d45", borderRadius:8, padding:"14px 16px", marginBottom:8 }}>
                    <div style={{ display:"flex", alignItems:"center", gap:12 }}>
                      <span style={{ fontFamily:"Barlow Condensed", fontSize:22, fontWeight:800, color:i===0?"#ffe600":i===1?"#c0c0c0":i===2?"#cd7f32":"#5a6a80", minWidth:36, textAlign:"center" }}>#{i+1}</span>
                      <span style={{ fontSize:28 }}>{BANDERAS[g.equipo]||"🏳"}</span>
                      <span style={{ fontSize:11, color:"#5a6a80", fontWeight:700, fontFamily:"Barlow Condensed" }}>{CODIGOS[g.equipo]||""}</span>
                      <div style={{ flex:1 }}>
                        <div style={{ fontFamily:"Barlow Condensed", fontSize:17, fontWeight:700 }}>{g.nombre}</div>
                        <div style={{ fontSize:11, color:"#5a6a80", marginTop:2 }}>{g.equipo} · {g.partidos} partidos</div>
                      </div>
                      <div style={{ textAlign:"right" }}>
                        <div style={{ fontFamily:"Barlow Condensed", fontSize:26, fontWeight:800, color:"#ff4d6d" }}>{g.goles} ⚽</div>
                        {g.asistencias>0
                          ? <div style={{ fontSize:12, color:"#00e5ff", fontWeight:700, marginTop:2 }}>{g.asistencias} asistencias</div>
                          : <div style={{ fontSize:11, color:"#3a4a5a", marginTop:2 }}>0 asistencias</div>
                        }
                      </div>
                    </div>
                    <div style={{ marginTop:10 }}>
                      <div style={{ height:4, background:"#1e2d45", borderRadius:2 }}>
                        <div style={{ height:"100%", width:String(Math.round(g.goles/(goleadores[0]?.goles||1)*100))+"%", background:i===0?"#ffe600":i<3?"#ff4d6d":"#00e5ff", borderRadius:2 }} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* FAVORITOS */}
            {tab==="favoritos" && (
              favList.length>0 ? favList.map(p=>renderPartido(p))
              : <div style={{ textAlign:"center", padding:40, color:"#5a6a80" }}>
                  <div style={{ fontSize:32, marginBottom:8 }}>★</div>
                  <div>No tienes favoritos aun</div>
                  <div style={{ fontSize:12, marginTop:4 }}>Toca FAV en cualquier partido</div>
                </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}