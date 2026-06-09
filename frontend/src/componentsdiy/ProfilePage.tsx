import Navbar from "./NavbarLux";

// ── mock data — swap with real auth/API later ──────────────────────────────
const user = {
  name: "Magnus K.",
  handle: "@magnusk",
  joinedMonth: "March 2024",
  avatarInitial: "M",
  rating: 1923,
  ratingDelta: +47,
  solved: 312,
  missed: 88,
  streak: 14,
  accuracy: 78,
};

const recentPuzzles = [
  { id: "pz8812", rating: 1904, result: "correct", theme: "mateIn2", moves: 4 },
  { id: "pz8811", rating: 1876, result: "wrong", theme: "mateIn1", moves: 2 },
  { id: "pz8809", rating: 1950, result: "correct", theme: "mateIn3", moves: 6 },
  { id: "pz8800", rating: 1888, result: "correct", theme: "mateIn2", moves: 4 },
  { id: "pz8799", rating: 1910, result: "wrong", theme: "mateIn4", moves: 8 },
  { id: "pz8791", rating: 1867, result: "correct", theme: "mateIn2", moves: 4 },
];

const weeklyData = [42, 65, 28, 81, 54, 70, 90]; // puzzles solved per day
const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const maxVal = Math.max(...weeklyData);

// ──────────────────────────────────────────────────────────────────────────
const ProfilePage = () => (
  <>
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400&family=DM+Sans:wght@300;400;500&display=swap');

      :root {
        --gold:       #C9A84C;
        --gold-light: #E8C97A;
        --gold-dim:   #8a6e2f;
        --bg:         #0a0a0c;
        --bg2:        #111115;
        --bg3:        #16161b;
        --border:     rgba(201,168,76,0.16);
        --border2:    rgba(201,168,76,0.07);
        --text:       #f0ece0;
        --muted:      #6e6860;
        --green:      #7ed97e;
        --red:        #e07070;
      }

      html, body { margin:0; padding:0; height:100%; overflow:hidden; }

      .prof-page {
        position: fixed; inset: 0;
        display: flex; flex-direction: column;
        background: var(--bg);
        font-family: 'DM Sans', sans-serif;
        color: var(--text);
        overflow: hidden;
      }

      /* grid texture */
      .prof-page::before {
        content:''; position:absolute; inset:0; pointer-events:none; z-index:0;
        background-image:
          linear-gradient(rgba(201,168,76,0.022) 1px, transparent 1px),
          linear-gradient(90deg, rgba(201,168,76,0.022) 1px, transparent 1px);
        background-size: 56px 56px;
      }

      /* ── SCROLL BODY ─────────────────────────────── */
      .prof-body {
        position: relative; z-index: 1;
        flex: 1; overflow-y: auto; overflow-x: hidden;
        padding: 2.5rem 2.25rem 3rem;
        display: flex; flex-direction: column; gap: 2rem;
        scrollbar-width: thin;
        scrollbar-color: var(--gold-dim) transparent;
      }
      .prof-body::-webkit-scrollbar { width: 4px; }
      .prof-body::-webkit-scrollbar-thumb { background: var(--gold-dim); border-radius: 4px; }

      /* ── HERO ────────────────────────────────────── */
      .prof-hero {
        display: grid;
        grid-template-columns: auto 1fr auto;
        align-items: center;
        gap: 1.75rem;
        padding: 1.75rem 2rem;
        background: var(--bg2);
        border: 1px solid var(--border);
        border-radius: 4px;
        position: relative; overflow: hidden;
      }
      /* decorative corner piece */
      .prof-hero::before {
        content: '♛';
        position: absolute; right: 1.5rem; bottom: -0.5rem;
        font-size: 7rem; color: rgba(201,168,76,0.04);
        pointer-events: none; user-select: none;
        font-family: serif;
      }

      .prof-avatar {
        width: 72px; height: 72px; border-radius: 50%;
        border: 1px solid var(--gold-dim);
        background: rgba(201,168,76,0.1);
        display: flex; align-items: center; justify-content: center;
        font-family: 'Cormorant Garamond', serif;
        font-size: 2rem; font-weight: 700; color: var(--gold-light);
        flex-shrink: 0;
        box-shadow: 0 0 0 4px rgba(201,168,76,0.06);
      }

      .prof-identity { display: flex; flex-direction: column; gap: 0.3rem; }
      .prof-name {
        font-family: 'Cormorant Garamond', serif;
        font-size: 1.75rem; font-weight: 700; color: var(--gold-light);
        line-height: 1;
      }
      .prof-handle { font-size: 0.73rem; color: var(--muted); letter-spacing: 0.06em; }
      .prof-joined { font-size: 0.68rem; color: var(--muted); margin-top: 0.2rem; }

      .prof-rating-block { text-align: right; flex-shrink: 0; }
      .prof-rating-val {
        font-family: 'Cormorant Garamond', serif;
        font-size: 2.8rem; font-weight: 700; color: var(--gold-light);
        line-height: 1;
      }
      .prof-rating-label { font-size: 0.6rem; letter-spacing: 0.2em; text-transform: uppercase; color: var(--muted); }
      .prof-rating-delta {
        font-size: 0.75rem; font-weight: 500; margin-top: 0.2rem;
        display: inline-flex; align-items: center; gap: 0.25rem;
      }
      .delta-up   { color: var(--green); }
      .delta-down { color: var(--red);   }

      /* ── SECTION LABEL ───────────────────────────── */
      .prof-section-label {
        font-size: 0.6rem; letter-spacing: 0.22em;
        text-transform: uppercase; color: var(--gold);
        padding-bottom: 0.5rem;
        border-bottom: 1px solid var(--border);
        margin-bottom: 0.85rem;
      }

      /* ── STATS GRID ──────────────────────────────── */
      .prof-stats-grid {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 0.75rem;
      }
      .prof-stat-card {
        background: var(--bg2); border: 1px solid var(--border);
        border-radius: 3px; padding: 1rem 1.1rem;
        display: flex; flex-direction: column; gap: 0.25rem;
        position: relative; overflow: hidden;
        transition: border-color 0.2s;
      }
      .prof-stat-card:hover { border-color: var(--gold-dim); }
      .prof-stat-card::after {
        content: attr(data-icon);
        position: absolute; right: 0.75rem; bottom: -0.4rem;
        font-size: 2.2rem; opacity: 0.07; pointer-events: none;
        font-family: serif;
      }
      .prof-stat-val {
        font-family: 'Cormorant Garamond', serif;
        font-size: 2rem; font-weight: 700; color: var(--gold-light);
        line-height: 1;
      }
      .prof-stat-lbl { font-size: 0.68rem; color: var(--muted); letter-spacing: 0.05em; }
      .prof-stat-sub { font-size: 0.65rem; margin-top: 0.1rem; }
      .sub-green { color: var(--green); }
      .sub-red   { color: var(--red);   }
      .sub-gold  { color: var(--gold);  }

      /* ── TWO-COL LAYOUT ──────────────────────────── */
      .prof-two-col {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 1.25rem;
        align-items: start;
      }

      /* ── ACTIVITY CHART ──────────────────────────── */
      .prof-chart-card {
        background: var(--bg2); border: 1px solid var(--border);
        border-radius: 3px; padding: 1.25rem 1.25rem 1rem;
      }
      .prof-bars {
        display: flex; align-items: flex-end; gap: 0.45rem;
        height: 90px; margin-top: 0.75rem;
      }
      .prof-bar-col {
        flex: 1; display: flex; flex-direction: column;
        align-items: center; gap: 0.35rem;
      }
      .prof-bar-track {
        width: 100%; flex: 1;
        display: flex; align-items: flex-end;
      }
      .prof-bar-fill {
        width: 100%; border-radius: 2px 2px 0 0;
        background: linear-gradient(180deg, var(--gold-light), var(--gold-dim));
        transition: height 0.4s ease;
        min-height: 2px;
      }
      .prof-bar-day { font-size: 0.58rem; color: var(--muted); letter-spacing: 0.06em; }
      .prof-bar-num { font-size: 0.6rem; color: var(--gold); font-family: 'Cormorant Garamond', serif; }

      /* ── RECENT PUZZLES ──────────────────────────── */
      .prof-recent-card {
        background: var(--bg2); border: 1px solid var(--border);
        border-radius: 3px; overflow: hidden;
      }
      .prof-recent-header {
        padding: 1rem 1.1rem 0;
      }
      .prof-puzzle-row {
        display: grid;
        grid-template-columns: 2.5rem 1fr 3rem 3.5rem 2rem;
        align-items: center; gap: 0.5rem;
        padding: 0.5rem 1.1rem;
        border-bottom: 1px solid var(--border2);
        font-size: 0.73rem;
        transition: background 0.15s;
      }
      .prof-puzzle-row:last-child { border-bottom: none; }
      .prof-puzzle-row:hover { background: rgba(201,168,76,0.03); }

      .puz-result {
        width: 22px; height: 22px; border-radius: 50%;
        display: flex; align-items: center; justify-content: center;
        font-size: 0.65rem; flex-shrink: 0;
      }
      .puz-correct { background: rgba(126,217,126,0.12); color: var(--green); border: 1px solid rgba(126,217,126,0.25); }
      .puz-wrong   { background: rgba(224,112,112,0.12); color: var(--red);   border: 1px solid rgba(224,112,112,0.25); }

      .puz-id { color: var(--muted); font-size: 0.67rem; font-family: monospace; }
      .puz-theme {
        display: inline-flex; padding: 0.15rem 0.5rem;
        background: rgba(201,168,76,0.07); border: 1px solid var(--border2);
        border-radius: 100px; font-size: 0.63rem; color: var(--gold);
        letter-spacing: 0.04em;
      }
      .puz-rating {
        font-family: 'Cormorant Garamond', serif;
        font-size: 0.88rem; color: var(--gold-light); text-align: right;
      }
      .puz-moves { font-size: 0.65rem; color: var(--muted); text-align: right; }

      /* ── ACCURACY RING ───────────────────────────── */
      .prof-acc-card {
        background: var(--bg2); border: 1px solid var(--border);
        border-radius: 3px; padding: 1.25rem;
        display: flex; flex-direction: column;
      }
      .prof-acc-body {
        display: flex; align-items: center; gap: 1.5rem;
        margin-top: 0.75rem;
      }
      .prof-ring-wrap { position: relative; flex-shrink: 0; }
      .prof-ring-wrap svg { display: block; }
      .prof-ring-label {
        position: absolute; inset: 0;
        display: flex; flex-direction: column;
        align-items: center; justify-content: center;
      }
      .prof-ring-pct {
        font-family: 'Cormorant Garamond', serif;
        font-size: 1.4rem; font-weight: 700; color: var(--gold-light);
        line-height: 1;
      }
      .prof-ring-sub { font-size: 0.55rem; color: var(--muted); letter-spacing: 0.1em; text-transform: uppercase; }

      .prof-acc-legend { display: flex; flex-direction: column; gap: 0.65rem; }
      .prof-acc-row { display: flex; align-items: center; gap: 0.55rem; font-size: 0.73rem; }
      .prof-acc-dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }
      .prof-acc-count { margin-left: auto; font-family: 'Cormorant Garamond', serif; font-size: 0.95rem; color: var(--gold-light); }

      /* ── STREAK ──────────────────────────────────── */
      .prof-streak-card {
        background: var(--bg2); border: 1px solid var(--border);
        border-radius: 3px; padding: 1.25rem;
        display: flex; align-items: center; gap: 1.25rem;
      }
      .prof-streak-num {
        font-family: 'Cormorant Garamond', serif;
        font-size: 3.5rem; font-weight: 700; color: var(--gold-light);
        line-height: 1; flex-shrink: 0;
      }
      .prof-streak-info { display: flex; flex-direction: column; gap: 0.2rem; }
      .prof-streak-title { font-size: 0.78rem; color: var(--text); }
      .prof-streak-sub   { font-size: 0.67rem; color: var(--muted); }
      .prof-streak-flame { font-size: 1.8rem; margin-left: auto; opacity: 0.8; }
    `}</style>

    <div className="prof-page">
      <Navbar />

      <div className="prof-body">
        {/* ── HERO ── */}
        <div className="prof-hero">
          <div className="prof-avatar">{user.avatarInitial}</div>

          <div className="prof-identity">
            <div className="prof-name">{user.name}</div>
            <div className="prof-handle">{user.handle}</div>
            <div className="prof-joined">Member since {user.joinedMonth}</div>
          </div>

          <div className="prof-rating-block">
            <div className="prof-rating-label">Rating</div>
            <div className="prof-rating-val">{user.rating}</div>
            <div
              className={`prof-rating-delta ${user.ratingDelta >= 0 ? "delta-up" : "delta-down"}`}
            >
              {user.ratingDelta >= 0 ? "▲" : "▼"} {Math.abs(user.ratingDelta)}{" "}
              this month
            </div>
          </div>
        </div>

        {/* ── STATS ── */}
        <div>
          <p className="prof-section-label">Session Overview</p>
          <div className="prof-stats-grid">
            <div className="prof-stat-card" data-icon="♟">
              <div className="prof-stat-val">{user.solved}</div>
              <div className="prof-stat-lbl">Puzzles Solved</div>
              <div className="prof-stat-sub sub-green">+12 today</div>
            </div>
            <div className="prof-stat-card" data-icon="✗">
              <div className="prof-stat-val">{user.missed}</div>
              <div className="prof-stat-lbl">Puzzles Missed</div>
              <div className="prof-stat-sub sub-red">−3 vs last week</div>
            </div>
            <div className="prof-stat-card" data-icon="◎">
              <div className="prof-stat-val">{user.accuracy}%</div>
              <div className="prof-stat-lbl">Accuracy</div>
              <div className="prof-stat-sub sub-gold">↑ improving</div>
            </div>
            <div className="prof-stat-card" data-icon="♔">
              <div className="prof-stat-val">{user.rating}</div>
              <div className="prof-stat-lbl">Current Rating</div>
              <div className="prof-stat-sub sub-green">Top 18%</div>
            </div>
          </div>
        </div>

        {/* ── STREAK + ACCURACY ── */}
        <div className="prof-two-col">
          <div
            style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
          >
            <div className="prof-streak-card">
              <div className="prof-streak-num">{user.streak}</div>
              <div className="prof-streak-info">
                <div className="prof-streak-title">Day Streak</div>
                <div className="prof-streak-sub">
                  Keep it going — don't break the chain
                </div>
              </div>
              <div className="prof-streak-flame">🔥</div>
            </div>

            {/* Activity chart */}
            <div className="prof-chart-card">
              <p className="prof-section-label" style={{ marginBottom: 0 }}>
                Weekly Activity
              </p>
              <div className="prof-bars">
                {weeklyData.map((val, i) => (
                  <div className="prof-bar-col" key={i}>
                    <div className="prof-bar-num">{val}</div>
                    <div className="prof-bar-track">
                      <div
                        className="prof-bar-fill"
                        style={{ height: `${(val / maxVal) * 100}%` }}
                      />
                    </div>
                    <div className="prof-bar-day">{weekDays[i]}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Accuracy donut */}
          <div className="prof-acc-card">
            <p className="prof-section-label" style={{ marginBottom: 0 }}>
              Accuracy Breakdown
            </p>
            <div className="prof-acc-body">
              <div className="prof-ring-wrap">
                <svg width="110" height="110" viewBox="0 0 110 110">
                  {/* track */}
                  <circle
                    cx="55"
                    cy="55"
                    r="42"
                    fill="none"
                    stroke="rgba(201,168,76,0.08)"
                    strokeWidth="10"
                  />
                  {/* correct arc */}
                  <circle
                    cx="55"
                    cy="55"
                    r="42"
                    fill="none"
                    stroke="#C9A84C"
                    strokeWidth="10"
                    strokeDasharray={`${2 * Math.PI * 42 * (user.accuracy / 100)} ${2 * Math.PI * 42}`}
                    strokeLinecap="round"
                    transform="rotate(-90 55 55)"
                  />
                  {/* wrong arc */}
                  <circle
                    cx="55"
                    cy="55"
                    r="42"
                    fill="none"
                    stroke="#e07070"
                    strokeWidth="10"
                    opacity="0.5"
                    strokeDasharray={`${2 * Math.PI * 42 * ((100 - user.accuracy) / 100)} ${2 * Math.PI * 42}`}
                    strokeDashoffset={`-${2 * Math.PI * 42 * (user.accuracy / 100)}`}
                    strokeLinecap="round"
                    transform="rotate(-90 55 55)"
                  />
                </svg>
                <div className="prof-ring-label">
                  <div className="prof-ring-pct">{user.accuracy}%</div>
                  <div className="prof-ring-sub">correct</div>
                </div>
              </div>

              <div className="prof-acc-legend">
                <div className="prof-acc-row">
                  <div
                    className="prof-acc-dot"
                    style={{ background: "var(--gold)" }}
                  />
                  <span style={{ color: "var(--muted)" }}>Solved</span>
                  <span className="prof-acc-count">{user.solved}</span>
                </div>
                <div className="prof-acc-row">
                  <div
                    className="prof-acc-dot"
                    style={{ background: "var(--red)", opacity: 0.7 }}
                  />
                  <span style={{ color: "var(--muted)" }}>Missed</span>
                  <span className="prof-acc-count">{user.missed}</span>
                </div>
                <div
                  className="prof-acc-row"
                  style={{
                    marginTop: "0.3rem",
                    paddingTop: "0.5rem",
                    borderTop: "1px solid var(--border2)",
                  }}
                >
                  <div
                    className="prof-acc-dot"
                    style={{ background: "var(--muted)" }}
                  />
                  <span style={{ color: "var(--muted)" }}>Total</span>
                  <span className="prof-acc-count">
                    {user.solved + user.missed}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── RECENT PUZZLES ── */}
        <div>
          <p className="prof-section-label">Recent Puzzles</p>
          <div className="prof-recent-card">
            {/* header row */}
            <div
              className="prof-puzzle-row"
              style={{
                color: "var(--muted)",
                fontSize: "0.6rem",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                paddingBottom: "0.4rem",
              }}
            >
              <span></span>
              <span>ID</span>
              <span>Theme</span>
              <span style={{ textAlign: "right" }}>Rating</span>
              <span style={{ textAlign: "right" }}>Moves</span>
            </div>
            {recentPuzzles.map((p) => (
              <div className="prof-puzzle-row" key={p.id}>
                <div
                  className={`puz-result ${p.result === "correct" ? "puz-correct" : "puz-wrong"}`}
                >
                  {p.result === "correct" ? "✓" : "✗"}
                </div>
                <span className="puz-id">{p.id}</span>
                <span className="puz-theme">{p.theme}</span>
                <span className="puz-rating">{p.rating}</span>
                <span className="puz-moves">{p.moves}mv</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  </>
);

export default ProfilePage;
