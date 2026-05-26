import { useState, useEffect } from 'react';

const ODDS_API_KEY = '2b8e66079f23dff56c1fcf7be2820a49';

function PulseIndicator() {
  return (
    <span
      style={{
        position: 'relative',
        display: 'inline-flex',
        width: 8,
        height: 8,
      }}
    >
      <span
        style={{
          position: 'absolute',
          inset: -2,
          borderRadius: '50%',
          background: '#ff3d3d',
          opacity: 0.4,
          animation: 'pulseRing 1.5s ease-out infinite',
        }}
      />
      <span
        style={{
          position: 'absolute',
          inset: 0,
          borderRadius: '50%',
          background: '#ff3d3d',
        }}
      />
    </span>
  );
}

function OddsBar({ local, empate, visitante, localName, visitanteName }: any) {
  const total = 1 / local + 1 / empate + 1 / visitante;
  const pL = ((1 / local / total) * 100).toFixed(0);
  const pE = ((1 / empate / total) * 100).toFixed(0);
  const pV = ((1 / visitante / total) * 100).toFixed(0);
  return (
    <div style={{ marginTop: 10 }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          fontSize: 10,
          color: '#5a6a80',
          marginBottom: 3,
        }}
      >
        <span>{localName}</span>
        <span>X</span>
        <span>{visitanteName}</span>
      </div>
      <div
        style={{
          display: 'flex',
          height: 22,
          borderRadius: 4,
          overflow: 'hidden',
          gap: 1,
        }}
      >
        <div
          style={{
            width: `${pL}%`,
            background: 'rgba(0,229,255,0.3)',
            color: '#00e5ff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 10,
            fontWeight: 700,
          }}
        >
          {pL}%
        </div>
        <div
          style={{
            width: `${pE}%`,
            background: 'rgba(255,230,0,0.2)',
            color: '#ffe600',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 10,
            fontWeight: 700,
          }}
        >
          {pE}%
        </div>
        <div
          style={{
            width: `${pV}%`,
            background: 'rgba(255,77,109,0.3)',
            color: '#ff4d6d',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 10,
            fontWeight: 700,
          }}
        >
          {pV}%
        </div>
      </div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          fontSize: 10,
          color: '#5a6a80',
          marginTop: 3,
        }}
      >
        <span>{local}</span>
        <span>{empate}</span>
        <span>{visitante}</span>
      </div>
    </div>
  );
}

export default function App() {
  const [partidos, setPartidos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('partidos');

  useEffect(() => {
    fetch(
      `https://api.the-odds-api.com/v4/sports/soccer_fifa_world_cup/odds?apiKey=${ODDS_API_KEY}&regions=eu&markets=h2h&oddsFormat=decimal`
    )
      .then((r) => r.json())
      .then((data) => {
        const procesados = data.map((p: any) => {
          let oL = null,
            oE = null,
            oV = null;
          if (p.bookmakers?.length) {
            const outcomes = p.bookmakers[0].markets[0].outcomes;
            outcomes.forEach((o: any) => {
              if (o.name === p.home_team) oL = o.price;
              else if (o.name === p.away_team) oV = o.price;
              else oE = o.price;
            });
          }
          return {
            id: p.id,
            local: p.home_team,
            visitante: p.away_team,
            fecha: p.commence_time.slice(0, 10),
            hora: p.commence_time.slice(11, 16),
            odd_local: oL,
            odd_empate: oE,
            odd_visit: oV,
            prob_local: oL ? ((1 / oL) * 100).toFixed(1) : null,
            prob_visit: oV ? ((1 / oV) * 100).toFixed(1) : null,
          };
        });
        procesados.sort((a: any, b: any) => a.fecha.localeCompare(b.fecha));
        setPartidos(procesados);
        setLoading(false);
      });
  }, []);

  const tabs = ['partidos', 'favoritos'];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@700;800&family=Barlow:wght@400;600&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #080c14; }
        @keyframes pulseRing { 0%{transform:scale(1);opacity:.5} 100%{transform:scale(2.5);opacity:0} }
        @keyframes fadeIn { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
      `}</style>

      <div
        style={{
          minHeight: '100vh',
          background: '#080c14',
          color: '#e8edf5',
          fontFamily: "'Barlow', sans-serif",
        }}
      >
        {/* HEADER */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '16px 24px',
            borderBottom: '1px solid #1e2d45',
            background: 'rgba(8,12,20,0.95)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div
              style={{
                width: 36,
                height: 36,
                background: '#00e5ff',
                borderRadius: 6,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontFamily: "'Barlow Condensed'",
                fontWeight: 800,
                fontSize: 18,
                color: '#000',
              }}
            >
              X
            </div>
            <span
              style={{
                fontFamily: "'Barlow Condensed'",
                fontSize: 22,
                fontWeight: 800,
                letterSpacing: 2,
              }}
            >
              XGOAT <span style={{ color: '#00e5ff' }}>2026</span>
            </span>
          </div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              background: 'rgba(255,61,61,0.15)',
              border: '1px solid rgba(255,61,61,0.4)',
              padding: '4px 10px',
              borderRadius: 4,
              fontSize: 11,
              fontWeight: 700,
              color: '#ff3d3d',
              letterSpacing: 1.5,
            }}
          >
            <PulseIndicator /> LIVE DATA
          </div>
        </div>

        {/* STATS */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3,1fr)',
            gap: 1,
            background: '#1e2d45',
            borderBottom: '1px solid #1e2d45',
          }}
        >
          {[
            { label: 'Partidos', value: partidos.length, color: '#00e5ff' },
            { label: 'Inicio', value: 'Jun 11', color: '#ff4d6d' },
            { label: 'Final', value: 'Jul 19', color: '#ffe600' },
          ].map((s) => (
            <div
              key={s.label}
              style={{ background: '#0d1320', padding: '14px 20px' }}
            >
              <div
                style={{
                  fontSize: 10,
                  letterSpacing: 2,
                  color: '#5a6a80',
                  textTransform: 'uppercase',
                  marginBottom: 4,
                }}
              >
                {s.label}
              </div>
              <div
                style={{
                  fontFamily: "'Barlow Condensed'",
                  fontSize: 32,
                  fontWeight: 800,
                  color: s.color,
                }}
              >
                {s.value}
              </div>
            </div>
          ))}
        </div>

        {/* TABS */}
        <div
          style={{
            display: 'flex',
            borderBottom: '1px solid #1e2d45',
            background: '#0d1320',
            padding: '0 24px',
          }}
        >
          {tabs.map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              style={{
                padding: '14px 20px',
                background: 'none',
                border: 'none',
                borderBottom:
                  tab === t ? '2px solid #00e5ff' : '2px solid transparent',
                color: tab === t ? '#00e5ff' : '#5a6a80',
                fontFamily: "'Barlow Condensed'",
                fontSize: 14,
                fontWeight: 700,
                letterSpacing: 1.5,
                textTransform: 'uppercase',
                cursor: 'pointer',
              }}
            >
              {t === 'partidos' ? '⚽ Partidos' : '🏆 Favoritos'}
            </button>
          ))}
        </div>

        {/* CONTENT */}
        <div
          style={{
            padding: 20,
            maxWidth: 800,
            margin: '0 auto',
            animation: 'fadeIn 0.4s ease',
          }}
        >
          {loading ? (
            <div
              style={{
                textAlign: 'center',
                padding: 60,
                color: '#5a6a80',
                fontSize: 18,
              }}
            >
              🐐 Cargando datos del Mundial...
            </div>
          ) : tab === 'partidos' ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {partidos.map((p: any) => (
                <div
                  key={p.id}
                  style={{
                    background: '#0d1320',
                    border: '1px solid #1e2d45',
                    borderRadius: 8,
                    padding: '14px 18px',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      marginBottom: 10,
                      fontSize: 11,
                      color: '#5a6a80',
                    }}
                  >
                    <span>
                      📅 {p.fecha} · {p.hora} UTC
                    </span>
                    <span style={{ color: '#00e5ff', fontWeight: 700 }}>
                      Grupo stage
                    </span>
                  </div>
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '1fr auto 1fr',
                      alignItems: 'center',
                      gap: 12,
                      marginBottom: 6,
                    }}
                  >
                    <span
                      style={{
                        fontFamily: "'Barlow Condensed'",
                        fontSize: 17,
                        fontWeight: 700,
                      }}
                    >
                      {p.local}
                    </span>
                    <span
                      style={{
                        color: '#5a6a80',
                        fontFamily: "'Barlow Condensed'",
                        fontSize: 20,
                      }}
                    >
                      vs
                    </span>
                    <span
                      style={{
                        fontFamily: "'Barlow Condensed'",
                        fontSize: 17,
                        fontWeight: 700,
                        textAlign: 'right',
                      }}
                    >
                      {p.visitante}
                    </span>
                  </div>
                  {p.odd_local && (
                    <OddsBar
                      local={p.odd_local}
                      empate={p.odd_empate}
                      visitante={p.odd_visit}
                      localName={p.local}
                      visitanteName={p.visitante}
                    />
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <div
                style={{
                  fontSize: 12,
                  color: '#5a6a80',
                  marginBottom: 8,
                  letterSpacing: 2,
                  textTransform: 'uppercase',
                }}
              >
                Top equipos más favoritos según las casas
              </div>
              {[...partidos]
                .sort((a, b) => Number(b.prob_local) - Number(a.prob_local))
                .slice(0, 10)
                .map((p: any, i) => (
                  <div
                    key={p.id}
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '32px 1fr auto auto',
                      alignItems: 'center',
                      gap: 12,
                      background: '#0d1320',
                      border: '1px solid #1e2d45',
                      borderRadius: 6,
                      padding: '10px 14px',
                    }}
                  >
                    <span
                      style={{
                        fontFamily: "'Barlow Condensed'",
                        fontSize: 20,
                        fontWeight: 800,
                        color:
                          i === 0
                            ? '#ffe600'
                            : i === 1
                            ? '#c0c0c0'
                            : i === 2
                            ? '#cd7f32'
                            : '#5a6a80',
                      }}
                    >
                      #{i + 1}
                    </span>
                    <div>
                      <div
                        style={{
                          fontFamily: "'Barlow Condensed'",
                          fontSize: 15,
                          fontWeight: 700,
                        }}
                      >
                        {p.local}
                      </div>
                      <div style={{ fontSize: 11, color: '#5a6a80' }}>
                        vs {p.visitante} · {p.fecha}
                      </div>
                    </div>
                    <span
                      style={{
                        fontFamily: "'Barlow Condensed'",
                        fontSize: 20,
                        fontWeight: 800,
                        color: '#ffe600',
                      }}
                    >
                      {p.odd_local}
                    </span>
                    <span
                      style={{
                        fontFamily: "'Barlow Condensed'",
                        fontSize: 16,
                        fontWeight: 700,
                        color: '#00e5ff',
                      }}
                    >
                      {p.prob_local}%
                    </span>
                  </div>
                ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
