import { useState, useEffect } from "react";
import type { CSSProperties, ReactElement } from "react";
import { useNavigate } from "react-router-dom";

interface Feature {
  icon: string;
  title: string;
  desc: string;
}

interface Stat {
  value: string;
  label: string;
}

interface Floater {
  piece: string;
  style: CSSProperties;
}

interface FloatingPieceProps {
  piece: string;
  style: CSSProperties;
}

const FEATURES: Feature[] = [
  {
    icon: "♟",
    title: "Play Santai (soon)",
    desc: "Challenge players from across Indonesia, anytime. Pick your pace — blitz, rapid, or classical.",
  },
  {
    icon: "👑",
    title: "Challenge Bot for Crown",
    desc: "Human vs Robot, take back crown for human race!",
  },
  {
    icon: "🎓",
    title: "Learn & Master",
    desc: "Interactive lessons, puzzles, and grandmaster insights to sharpen every move you make.",
  },
  {
    icon: "⚔",
    title: "Tournaments (soon)",
    desc: "Join weekly online tournaments with real prizes. Glory awaits the bold.",
  },
];

const STATS: Stat[] = [
  { value: "8000+", label: "Active Players" },
  { value: "5000+", label: "Puzzles" },
  { value: "3000+", label: "ELO Rating BOT" },
  { value: "#2", label: "Chess Platform ID" },
];

function FloatingPiece({ piece, style }: FloatingPieceProps): ReactElement {
  return (
    <div className="floating-piece" style={style}>
      {piece}
    </div>
  );
}

export default function Homepage(): ReactElement {
  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  const [scrolled, setScrolled] = useState<boolean>(false);
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = (): void => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const floaters: Floater[] = [
    {
      piece: "♛",
      style: {
        top: "12%",
        left: "6%",
        fontSize: "3.5rem",
        animationDelay: "0s",
        opacity: 0.07,
      },
    },
    {
      piece: "♜",
      style: {
        top: "30%",
        right: "8%",
        fontSize: "2.8rem",
        animationDelay: "1.2s",
        opacity: 0.06,
      },
    },
    {
      piece: "♞",
      style: {
        bottom: "25%",
        left: "12%",
        fontSize: "4rem",
        animationDelay: "2.1s",
        opacity: 0.05,
      },
    },
    {
      piece: "♝",
      style: {
        top: "60%",
        right: "5%",
        fontSize: "3rem",
        animationDelay: "0.7s",
        opacity: 0.07,
      },
    },
    {
      piece: "♟",
      style: {
        top: "75%",
        left: "4%",
        fontSize: "2.4rem",
        animationDelay: "1.8s",
        opacity: 0.06,
      },
    },
    {
      piece: "♚",
      style: {
        top: "8%",
        right: "20%",
        fontSize: "2.6rem",
        animationDelay: "3s",
        opacity: 0.05,
      },
    },
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600;700&family=DM+Sans:wght@300;400;500&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        :root {
          --gold: #C9A84C;
          --gold-light: #E8C97A;
          --gold-dim: #8a6e2f;
          --bg: #0a0a0c;
          --bg2: #111115;
          --bg3: #18181e;
          --surface: #1e1e26;
          --border: rgba(201,168,76,0.18);
          --text: #f0ece0;
          --muted: #7a7465;
          --accent: #C9A84C;
        }

        body { background: var(--bg); color: var(--text); font-family: 'DM Sans', sans-serif; overflow-x: hidden; }

        /* NAVBAR */
        .navbar {
          position: fixed; top: 0; left: 0; right: 0; z-index: 100;
          display: flex; align-items: center; justify-content: space-between;
          padding: 0 2.5rem; height: 72px;
          transition: all 0.4s ease;
          border-bottom: 1px solid transparent;
        }
        .navbar.scrolled {
          background: rgba(10,10,12,0.92);
          backdrop-filter: blur(16px);
          border-bottom: 1px solid var(--border);
        }
        .logo {
          display: flex; align-items: center; gap: 0.6rem;
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.5rem; font-weight: 700;
          color: var(--gold-light); letter-spacing: 0.02em;
          text-decoration: none;
        }
        .logo-icon { font-size: 1.8rem; }
        .logo-sub { color: var(--muted); font-size: 0.7rem; font-family: 'DM Sans', sans-serif; font-weight: 300; letter-spacing: 0.15em; text-transform: uppercase; display: block; margin-top: -4px; }

        .nav-actions { display: flex; gap: 0.75rem; align-items: center; }

        .btn-gold {
          padding: 0.5rem 1.4rem;
          background: linear-gradient(135deg, var(--gold) 0%, #a8782a 100%);
          color: #0a0a0c; font-family: 'DM Sans', sans-serif;
          font-size: 0.84rem; font-weight: 600; letter-spacing: 0.06em;
          cursor: pointer; border: none; border-radius: 4px; transition: all 0.25s;
        }
        .btn-gold:hover { background: linear-gradient(135deg, var(--gold-light) 0%, var(--gold) 100%); transform: translateY(-1px); box-shadow: 0 4px 20px rgba(201,168,76,0.25); }

        /* HAMBURGER */
        .hamburger { display: none; flex-direction: column; gap: 5px; cursor: pointer; background: none; border: none; padding: 4px; }
        .hamburger span { display: block; width: 24px; height: 2px; background: var(--gold-light); transition: all 0.3s; }

        /* HERO */
        .hero {
          min-height: 100vh;
          display: flex; align-items: center; justify-content: center;
          position: relative; overflow: hidden; padding: 0 2rem;
        }
        .hero-bg {
          position: absolute; inset: 0;
          background:
            radial-gradient(ellipse 80% 60% at 50% 40%, rgba(201,168,76,0.06) 0%, transparent 70%),
            radial-gradient(ellipse 40% 40% at 80% 70%, rgba(201,168,76,0.04) 0%, transparent 60%),
            var(--bg);
        }
        .chess-grid {
          position: absolute; inset: 0;
          background-image:
            linear-gradient(rgba(201,168,76,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(201,168,76,0.03) 1px, transparent 1px);
          background-size: 60px 60px;
          mask-image: radial-gradient(ellipse 70% 70% at 50% 50%, black 30%, transparent 100%);
        }
        .floating-piece {
          position: absolute; color: var(--gold);
          animation: floatDrift 8s ease-in-out infinite;
          user-select: none; pointer-events: none;
        }
        @keyframes floatDrift {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          33% { transform: translateY(-18px) rotate(4deg); }
          66% { transform: translateY(8px) rotate(-3deg); }
        }
        .hero-content { position: relative; z-index: 2; text-align: center; max-width: 860px; }
        .hero-badge {
          display: inline-flex; align-items: center; gap: 0.5rem;
          border: 1px solid var(--border); background: rgba(201,168,76,0.06);
          color: var(--gold); font-size: 0.75rem; letter-spacing: 0.14em;
          text-transform: uppercase; padding: 0.35rem 1rem; border-radius: 100px;
          margin-bottom: 2rem; animation: fadeUp 0.8s ease both;
        }
        .badge-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--gold); animation: pulse 2s infinite; }
        @keyframes pulse { 0%,100% { opacity:1; } 50% { opacity:0.3; } }
        .hero-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(3rem, 8vw, 7rem); font-weight: 700;
          line-height: 1.0; letter-spacing: -0.01em; color: var(--text);
          animation: fadeUp 0.8s 0.1s ease both;
        }
        .hero-title .gold { color: var(--gold-light); }
        .hero-title .line2 { display: block; }
        .hero-divider {
          width: 60px; height: 2px;
          background: linear-gradient(90deg, transparent, var(--gold), transparent);
          margin: 1.8rem auto; animation: fadeUp 0.8s 0.2s ease both;
        }
        .hero-sub {
          font-size: 1.05rem; color: var(--muted); line-height: 1.7;
          max-width: 520px; margin: 0 auto 2.5rem; font-weight: 300;
          animation: fadeUp 0.8s 0.3s ease both;
        }
        .hero-cta {
          display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap;
          animation: fadeUp 0.8s 0.4s ease both;
        }
        .btn-hero {
          padding: 0.85rem 2.2rem; font-family: 'DM Sans', sans-serif;
          font-size: 0.9rem; letter-spacing: 0.08em; cursor: pointer;
          border-radius: 4px; transition: all 0.3s;
        }
        .btn-hero-gold {
          background: linear-gradient(135deg, var(--gold) 0%, #8a6020 100%);
          color: #0a0a0c; border: none; font-weight: 700;
        }
        .btn-hero-gold:hover { transform: translateY(-2px); box-shadow: 0 8px 32px rgba(201,168,76,0.3); background: linear-gradient(135deg, var(--gold-light), var(--gold)); }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(28px); }
          to { opacity: 1; transform: translateY(0); }
        }

        /* STATS */
        .stats-bar { background: var(--bg2); border-top: 1px solid var(--border); border-bottom: 1px solid var(--border); padding: 2.2rem 2rem; }
        .stats-inner { max-width: 1000px; margin: 0 auto; display: grid; grid-template-columns: repeat(4, 1fr); gap: 1rem; text-align: center; }
        .stat-val { font-family: 'Cormorant Garamond', serif; font-size: 2.2rem; font-weight: 700; color: var(--gold-light); }
        .stat-label { font-size: 0.78rem; color: var(--muted); letter-spacing: 0.1em; text-transform: uppercase; margin-top: 0.2rem; }

        /* FEATURES */
        .features { padding: 7rem 2rem; background: var(--bg); }
        .section-label { text-align: center; font-size: 0.72rem; letter-spacing: 0.2em; text-transform: uppercase; color: var(--gold); margin-bottom: 0.75rem; }
        .section-title { font-family: 'Cormorant Garamond', serif; font-size: clamp(2rem, 4vw, 3rem); font-weight: 600; text-align: center; color: var(--text); margin-bottom: 4rem; }
        .features-grid { max-width: 1000px; margin: 0 auto; display: grid; grid-template-columns: repeat(2, 1fr); gap: 1.5px; border: 1.5px solid var(--border); }
        .feature-card { background: var(--bg2); padding: 2.5rem; transition: background 0.3s; cursor: default; }
        .feature-card:hover { background: var(--surface); }
        .feature-icon { font-size: 2.2rem; margin-bottom: 1rem; }
        .feature-title { font-family: 'Cormorant Garamond', serif; font-size: 1.4rem; font-weight: 600; color: var(--gold-light); margin-bottom: 0.6rem; }
        .feature-desc { color: var(--muted); font-size: 0.9rem; line-height: 1.7; font-weight: 300; }

        /* BOARD SECTION */
        .board-section {
          padding: 6rem 2rem; background: var(--bg2);
          display: flex; align-items: center; justify-content: center;
          gap: 5rem; flex-wrap: wrap;
          border-top: 1px solid var(--border); border-bottom: 1px solid var(--border);
        }
        .mini-board { display: grid; grid-template-columns: repeat(8, 1fr); width: 280px; height: 280px; border: 2px solid var(--gold-dim); box-shadow: 0 0 60px rgba(201,168,76,0.1); flex-shrink: 0; }
        .cell { aspect-ratio: 1; display: flex; align-items: center; justify-content: center; font-size: 1.1rem; }
        .cell.light { background: #2a2520; }
        .cell.dark2 { background: #1a1714; }
        .cell.gold-cell { background: rgba(201,168,76,0.18); }
        .board-copy { max-width: 380px; }
        .board-copy h2 { font-family: 'Cormorant Garamond', serif; font-size: 2.5rem; font-weight: 700; color: var(--text); line-height: 1.15; margin-bottom: 1.2rem; }
        .board-copy h2 em { color: var(--gold-light); font-style: normal; }
        .board-copy p { color: var(--muted); font-size: 0.92rem; line-height: 1.8; font-weight: 300; margin-bottom: 2rem; }

        /* CTA */
        .cta-section { padding: 8rem 2rem; text-align: center; position: relative; overflow: hidden; background: var(--bg); }
        .cta-glow { position: absolute; width: 600px; height: 300px; background: radial-gradient(ellipse, rgba(201,168,76,0.08) 0%, transparent 70%); top: 50%; left: 50%; transform: translate(-50%, -50%); pointer-events: none; }
        .cta-inner { position: relative; z-index: 1; }
        .cta-section h2 { font-family: 'Cormorant Garamond', serif; font-size: clamp(2.2rem, 5vw, 4rem); font-weight: 700; color: var(--text); margin-bottom: 1rem; }
        .cta-section p { color: var(--muted); font-size: 1rem; margin-bottom: 2.5rem; font-weight: 300; }

        /* FOOTER */
        footer { background: var(--bg2); border-top: 1px solid var(--border); padding: 2.5rem 2.5rem; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 1rem; }
        .footer-logo { font-family: 'Cormorant Garamond', serif; font-size: 1.15rem; font-weight: 700; color: var(--gold); }
        .footer-links { display: flex; gap: 1.5rem; }
        .footer-links a { color: var(--muted); font-size: 0.8rem; text-decoration: none; transition: color 0.2s; }
        .footer-links a:hover { color: var(--gold-light); }
        .footer-copy { color: var(--muted); font-size: 0.75rem; }

        /* MOBILE */
        @media (max-width: 768px) {
          .nav-actions { display: none; }
          .hamburger { display: flex; }
          .mobile-menu {
            position: fixed; inset: 0; z-index: 99;
            background: rgba(10,10,12,0.97);
            display: flex; flex-direction: column; align-items: center; justify-content: center;
            gap: 2rem;
          }
          .mobile-menu-actions { display: flex; flex-direction: column; gap: 1rem; width: 220px; align-items: center; }
          .mobile-menu-actions button { width: 100%; padding: 0.9rem; font-size: 0.9rem; }
          .stats-inner { grid-template-columns: repeat(2, 1fr); }
          .features-grid { grid-template-columns: 1fr; }
          .board-section { flex-direction: column; gap: 3rem; }
          footer { flex-direction: column; text-align: center; }
          .footer-links { flex-wrap: wrap; justify-content: center; }
        }
      `}</style>

      {/* MOBILE MENU */}
      {menuOpen && (
        <div className="mobile-menu">
          <button
            onClick={() => setMenuOpen(false)}
            style={{
              position: "absolute",
              top: 24,
              right: 24,
              background: "none",
              border: "none",
              color: "var(--gold-light)",
              fontSize: "1.8rem",
              cursor: "pointer",
            }}
          >
            ✕
          </button>
          <div className="mobile-menu-actions">
            <button
              className="btn-gold btn-hero"
              onClick={() => {
                setMenuOpen(false);
                navigate("/puzzle");
              }}
            >
              ▶ Play Now
            </button>
          </div>
        </div>
      )}

      {/* NAVBAR */}
      <nav className={`navbar${scrolled ? " scrolled" : ""}`}>
        <a href="#" className="logo">
          <span className="logo-icon">♛</span>
          <span>
            Chill Chess Indo
            <span className="logo-sub">Play · Learn · Rise</span>
          </span>
        </a>
        <div className="nav-actions">
          <button className="btn-gold" onClick={() => navigate("/puzzle")}>
            ▶ Play Now
          </button>
        </div>
        <button className="hamburger" onClick={() => setMenuOpen(true)}>
          <span />
          <span />
          <span />
        </button>
      </nav>

      {/* HERO */}
      <section className="hero">
        <div className="hero-bg" />
        <div className="chess-grid" />
        {floaters.map((f: Floater, i: number) => (
          <FloatingPiece key={i} piece={f.piece} style={f.style} />
        ))}
        <div className="hero-content">
          <div className="hero-badge">
            <span className="badge-dot" />
            Platform Catur #2 Indonesia
          </div>
          <h1 className="hero-title">
            Bermain Catur
            <span className="line2">
              dengan <span className="gold">Efektif dan Chill</span>
            </span>
          </h1>
          <div className="hero-divider" />
          <p className="hero-sub">
            Bergabunglah dengan 8000+ pemain Indonesia dan Internasional. Magnus
            pernah main disini.
          </p>
          <div className="hero-cta">
            <button
              className="btn-hero btn-hero-gold"
              onClick={() => navigate("/puzzle")}
            >
              Mulai Bermain Sekarang
            </button>
          </div>
        </div>
      </section>

      {/* STATS */}
      <div className="stats-bar">
        <div className="stats-inner">
          {STATS.map((s: Stat, i: number) => (
            <div key={i}>
              <div className="stat-val">{s.value}</div>
              <div className="stat-label">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* FEATURES */}
      <section className="features">
        <p className="section-label">Kenapa Chill Chess Indo?</p>
        <h2 className="section-title">Satu Platform, Segalanya Ada</h2>
        <div className="features-grid">
          {FEATURES.map((f: Feature, i: number) => (
            <div key={i} className="feature-card">
              <div className="feature-icon">{f.icon}</div>
              <div className="feature-title">{f.title}</div>
              <p className="feature-desc">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* BOARD VISUAL */}
      <section className="board-section">
        <MiniBoard />
        <div className="board-copy">
          <h2>
            Setiap Langkah
            <br />
            adalah <em>Seni</em>
          </h2>
          <p>
            Dari pembukaan klasik hingga endgame yang intens — Chill Chess Indo
            hadir dengan komunitas yang hangat untuk tumbuh bersama.
          </p>
          <button
            className="btn-hero btn-hero-gold"
            style={{ padding: "0.8rem 2rem" }}
            onClick={() => navigate("/puzzle")}
          >
            ▶ Mulai Bermain
          </button>
        </div>
      </section>

      {/* CTA */}
      <section className="cta-section">
        <div className="cta-glow" />
        <div className="cta-inner">
          <h2>
            Siap Menjadi
            <br />
            Raja Papan Catur?
          </h2>
          <p>Gratis selamanya. Langsung main tanpa daftar.</p>
          <div className="hero-cta">
            <button
              className="btn-hero btn-hero-gold"
              onClick={() => navigate("/puzzle")}
            >
              Mulai Bermain Sekarang
            </button>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer>
        <div className="footer-logo">♛ Chill Chess Indo</div>
        <div className="footer-links">
          {[
            "Tentang Kami",
            "Kebijakan Privasi",
            "Syarat & Ketentuan",
            "Kontak",
            "Blog",
          ].map((l: string) => (
            <a key={l} href="#">
              {l}
            </a>
          ))}
        </div>
        <div className="footer-copy">
          © 2026 Chill Chess Indo. All rights reserved.
        </div>
      </footer>
    </>
  );
}

// Mini decorative chessboard
function MiniBoard(): ReactElement {
  const highlight = new Set<number>([18, 19, 26, 27]);
  const pieces: Record<number, string> = {
    0: "♜",
    4: "♚",
    7: "♜",
    8: "♟",
    9: "♟",
    14: "♟",
    27: "♘",
    48: "♙",
    50: "♙",
    56: "♖",
    60: "♔",
    63: "♖",
  };

  return (
    <div className="mini-board">
      {Array.from({ length: 64 }, (_: unknown, i: number) => {
        const row: number = Math.floor(i / 8);
        const col: number = i % 8;
        const isLight: boolean = (row + col) % 2 === 0;
        const isHighlight: boolean = highlight.has(i);
        return (
          <div
            key={i}
            className={`cell ${isHighlight ? "gold-cell" : isLight ? "light" : "dark2"}`}
          >
            {pieces[i] ?? ""}
          </div>
        );
      })}
    </div>
  );
}
