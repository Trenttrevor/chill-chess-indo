import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { UserButton, useUser } from "@clerk/react";

type NavName = "Puzzle" | "Challenge BOT" | "Leaderboard";

const nav_links: { navName: NavName; navURL: string }[] = [
  { navName: "Puzzle", navURL: "/puzzle" },
  { navName: "Challenge BOT", navURL: "/challenge" },
  { navName: "Leaderboard", navURL: "/leaderboard" },
];

const NavbarLux = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const { user, isSignedIn } = useUser();

  const getNavFromPath = (pathname: string): NavName => {
    if (pathname.includes("puzzle")) return "Puzzle";
    if (pathname.includes("challenge")) return "Challenge BOT";
    if (pathname.includes("leaderboard")) return "Leaderboard";

    return "Puzzle";
  };

  const [selectedNav, setSelectedNav] = useState<NavName>(
    getNavFromPath(location.pathname),
  );

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;600;700&family=DM+Sans:wght@300;400;500&display=swap');

        :root {
          --gold:       #C9A84C;
          --gold-light: #E8C97A;
          --gold-dim:   #8a6e2f;
          --bg:         #0a0a0c;
          --border:     rgba(201,168,76,0.16);
          --text:       #f0ece0;
          --muted:      #6e6860;
        }

        .plx-topbar {
          position: relative; z-index: 2;
          display: flex; align-items: center; justify-content: space-between;
          padding: 0 1.75rem;
          height: 52px;
          border-bottom: 1px solid var(--border);
          background: rgba(10,10,12,0.75);
          backdrop-filter: blur(12px);
          flex-shrink: 0;
        }

        .plx-brand {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.1rem; font-weight: 700; color: var(--gold-light);
          display: flex; align-items: center; gap: 0.4rem;
        }
        .plx-brand-sub {
          font-size: 0.62rem; font-weight: 300;
          font-family: 'DM Sans', sans-serif;
          letter-spacing: 0.18em; text-transform: uppercase;
          color: var(--muted);
        }

        .plx-nav {
          display: flex; align-items: center;
          gap: 0.45rem; list-style: none;
          padding: 0; margin: 0;
        }

        .plx-nav-btn {
          background: none; border: none; padding: 0; cursor: pointer;
        }

        .plx-nav-link {
          position: relative;
          display: inline-flex; align-items: center; justify-content: center;
          padding: 0.42rem 0.9rem;
          text-decoration: none;
          color: var(--muted);
          font-family: 'DM Sans', sans-serif;
          font-size: 0.76rem; letter-spacing: 0.08em;
          text-transform: uppercase; font-weight: 500;
          border: 1px solid transparent; border-radius: 3px;
          transition: color 0.2s ease, border-color 0.2s ease, background 0.2s ease;
        }
        .plx-nav-link:hover {
          color: var(--gold-light);
          border-color: var(--border);
          background: rgba(201,168,76,0.05);
        }
        .plx-nav-link.active {
          color: var(--gold-light);
          border-color: var(--gold-dim);
          background: rgba(201,168,76,0.08);
        }
        .plx-nav-link::after {
          content: "";
          position: absolute; left: 12%; bottom: 4px;
          width: 76%; height: 1px;
          background: linear-gradient(90deg, transparent, var(--gold), transparent);
          opacity: 0; transition: opacity 0.2s ease;
        }
        .plx-nav-link:hover::after,
        .plx-nav-link.active::after { opacity: 1; }

        /* ── USER SLOT ───────────────────────────── */
        .plx-user-slot {
          display: flex; align-items: center; gap: 0.65rem;
          min-width: 140px; justify-content: flex-end;
        }
        .plx-user-avatar {
          width: 30px; height: 30px; border-radius: 50%;
          border: 1px solid var(--gold-dim);
          background: rgba(201,168,76,0.12);
          display: flex; align-items: center; justify-content: center;
          font-family: 'Cormorant Garamond', serif;
          font-size: 0.95rem; color: var(--gold-light);
          overflow: hidden; flex-shrink: 0;
        }
        .plx-user-avatar img { width: 100%; height: 100%; object-fit: cover; }
        .plx-user-name {
          font-size: 0.76rem; color: var(--gold-light);
          font-family: 'DM Sans', sans-serif; font-weight: 500;
          letter-spacing: 0.03em;
          white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
          max-width: 100px;
        }
        .plx-user-guest {
          font-size: 0.72rem; color: var(--muted);
          font-family: 'DM Sans', sans-serif;
          letter-spacing: 0.06em;
          display: flex; align-items: center; gap: 0.3rem;
        }
        .plx-user-guest-dot {
          width: 5px; height: 5px; border-radius: 50%;
          background: var(--muted); opacity: 0.5;
        }
      `}</style>

      <header className="plx-topbar">
        {/* Brand */}
        <div className="plx-brand">
          <button onClick={() => navigate("/")} className="cursor-pointer">
            ♛ Chill Chess Indo
          </button>
          <span className="plx-brand-sub">· Training Ground</span>
        </div>

        {/* Nav links */}
        <nav>
          <ul className="plx-nav">
            {nav_links.map((l) => (
              <li key={l.navName}>
                <button
                  className={`plx-nav-link ${l.navName === selectedNav ? "active" : ""}`}
                  onClick={() => {
                    setSelectedNav(l.navName);
                    navigate(l.navURL);
                  }}
                >
                  {l.navName}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        {/* User slot — swap the Guest block for your auth user when ready */}
        <div className="plx-user-slot">
          <span className="plx-user-guest">
            <span className="plx-user-guest-dot" />
            {user?.firstName}{" "}
            <span>
              <UserButton />
            </span>
          </span>
        </div>
      </header>
    </>
  );
};

export default NavbarLux;
