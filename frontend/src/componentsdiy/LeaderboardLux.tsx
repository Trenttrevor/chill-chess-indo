import { useState, useEffect } from "react";
import NavbarLux from "./NavbarLux";
import axios from "axios";

// const mockData = [
//   {
//     id: 1,
//     name: "Magnus Carlsen",
//     points: 3842,
//     wins: 142,
//     losses: 18,
//     rank: "Grandmaster",
//     country: "🇳🇴",
//     avatar: "MB",
//     streak: 12,
//   },
//   {
//     id: 2,
//     name: "Chill Chess Indo",
//     points: 3711,
//     wins: 128,
//     losses: 24,
//     rank: "Grandmaster",
//     country: "🇩🇪",
//     avatar: "IV",
//     streak: 7,
//   },
//   {
//     id: 3,
//     name: "Karim El-Rashid",
//     points: 3650,
//     wins: 119,
//     losses: 29,
//     rank: "International Master",
//     country: "🇪🇬",
//     avatar: "KR",
//     streak: 4,
//   },
//   {
//     id: 4,
//     name: "Yuki Tanegawa",
//     points: 3512,
//     wins: 108,
//     losses: 34,
//     rank: "International Master",
//     country: "🇯🇵",
//     avatar: "YT",
//     streak: 9,
//   },
//   {
//     id: 5,
//     name: "Aleksei Morozov",
//     points: 3480,
//     wins: 103,
//     losses: 38,
//     rank: "FIDE Master",
//     country: "🇷🇺",
//     avatar: "AM",
//     streak: 2,
//   },
//   {
//     id: 6,
//     name: "Valentina Cruz",
//     points: 3390,
//     wins: 97,
//     losses: 41,
//     rank: "FIDE Master",
//     country: "🇧🇷",
//     avatar: "VC",
//     streak: 6,
//   },
//   {
//     id: 7,
//     name: "Theo Blackmore",
//     points: 3271,
//     wins: 89,
//     losses: 47,
//     rank: "Candidate Master",
//     country: "🇬🇧",
//     avatar: "TB",
//     streak: 0,
//   },
//   {
//     id: 8,
//     name: "Priya Nair",
//     points: 3150,
//     wins: 82,
//     losses: 52,
//     rank: "Candidate Master",
//     country: "🇮🇳",
//     avatar: "PN",
//     streak: 3,
//   },
// ];

const MEDAL_COLORS = ["#C9A84C", "#A8A9AD", "#C47722"];
// const RANK_COLORS: Record<string, string> = {
//   Grandmaster: "#C9A84C",
//   "International Master": "#A8A9AD",
//   "FIDE Master": "#B87333",
//   "Candidate Master": "#6B8E9F",
// };

interface LeaderboardUser {
  id: string;
  email: string;
  name: string | null;
  imageUrl: string | null;
  points: number;
  createdAt: string;
  updatedAt: string;
}

export default function LeaderboardLux() {
  const [visible, setVisible] = useState(false);
  const [hovered, setHovered] = useState<number | null>(null);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(t);
  }, []);

  const [leaderboard, setLeaderboard] = useState<LeaderboardUser[]>([]);
  // const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const { data } = await axios.get<LeaderboardUser[]>(
          "http://localhost:3000/api/users/leaderboard",
        );

        setLeaderboard(data);
      } catch (error) {
        console.error(error);
      }
    };

    void fetchLeaderboard();
  }, []);

  const topThree = leaderboard.slice(0, 3);

  const getInitials = (name: string | null) => {
    if (!name) return "?";

    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  };

  return (
    <div className="flex flex-col min-h-screen">
      <NavbarLux />
      {/* Chessboard pattern background */}
      <div style={styles.bgPattern} />
      <div style={styles.bgOverlay} />

      <div
        style={{
          ...styles.container,
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(24px)",
          transition: "opacity 0.8s ease, transform 0.8s ease",
        }}
      >
        {/* Header */}
        <div style={styles.header}>
          <div style={styles.crownRow}>
            <span style={styles.crownIcon}>♛</span>
          </div>
          <h1 style={styles.title}>GRAND PRIX</h1>
          <p style={styles.subtitle}>ChillChessIndo LEADERBOARD · SEASON I</p>
          <div style={styles.dividerLine} />
        </div>

        {/* Top 3 Podium */}
        <div style={styles.podium}>
          {[topThree[1], topThree[0], topThree[2]]
            .filter(Boolean)
            .map((user, i) => {
              const actualRank = i === 0 ? 2 : i === 1 ? 1 : 3;
              const height =
                actualRank === 1 ? 140 : actualRank === 2 ? 110 : 90;

              return (
                <div
                  key={user.id}
                  style={{
                    ...styles.podiumCard,
                    animationDelay: `${i * 0.15}s`,
                  }}
                >
                  <div style={styles.podiumAvatar}>
                    <div
                      style={{
                        ...styles.avatarCircle,
                        borderColor: MEDAL_COLORS[actualRank - 1],
                        boxShadow: `0 0 20px ${MEDAL_COLORS[actualRank - 1]}55`,
                        overflow: "hidden",
                      }}
                    >
                      {user.imageUrl ? (
                        <img
                          src={user.imageUrl}
                          alt={user.name ?? ""}
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                            display: "block",
                          }}
                        />
                      ) : (
                        <span style={styles.smallAvatarText}>
                          {getInitials(user.name)}
                        </span>
                      )}
                    </div>

                    <div
                      style={{
                        ...styles.medalBadge,
                        background: MEDAL_COLORS[actualRank - 1],
                      }}
                    >
                      {actualRank === 1 ? "♛" : actualRank === 2 ? "♜" : "♝"}
                    </div>
                  </div>

                  <div style={styles.podiumName}>
                    {user.name?.split(" ")[0] ?? "Anonymous"}
                  </div>

                  <div style={styles.podiumSurname}>
                    {user.name?.split(" ").slice(1).join(" ") ?? ""}
                  </div>

                  <div
                    style={{
                      ...styles.podiumPoints,
                      color: MEDAL_COLORS[actualRank - 1],
                    }}
                  >
                    {user.points.toLocaleString()}{" "}
                    <span className="text-sm">pts</span>
                  </div>

                  <div
                    style={{
                      ...styles.podiumBase,
                      height,
                      background: `linear-gradient(
              180deg,
              ${MEDAL_COLORS[actualRank - 1]}22 0%,
              ${MEDAL_COLORS[actualRank - 1]}08 100%
            )`,
                      borderColor: MEDAL_COLORS[actualRank - 1],
                    }}
                  >
                    <span
                      style={{
                        ...styles.podiumRankNum,
                        color: MEDAL_COLORS[actualRank - 1],
                      }}
                    >
                      #{actualRank}
                    </span>
                  </div>
                </div>
              );
            })}
        </div>

        {/* Table */}
        <div style={styles.tableWrapper}>
          <div style={styles.tableHeader}>
            <span style={{ width: 60, textAlign: "center" }}>RANK</span>

            <span style={{ flex: 1 }}>PLAYER</span>

            <span style={{ width: 100, textAlign: "right" }}>POINTS</span>
          </div>

          {leaderboard.slice(3, 13).map((user, i) => {
            const rank = i + 4;
            const isHov = hovered === user.id;

            return (
              <div
                key={user.id}
                style={{
                  ...styles.tableRow,
                  opacity: visible ? 1 : 0,
                  transform: visible ? "translateX(0)" : "translateX(-20px)",
                  transition: `opacity 0.6s ease ${0.3 + i * 0.08}s, transform 0.6s ease ${0.3 + i * 0.08}s, background 0.2s ease`,
                  background: isHov ? "rgba(201,168,76,0.07)" : "transparent",
                }}
                onMouseEnter={() => setHovered(user.id)}
                onMouseLeave={() => setHovered(null)}
              >
                {/* Rank */}
                <span
                  style={{
                    ...styles.rankNum,
                    width: 60,
                    textAlign: "center",
                    color: "#5A5A6E",
                  }}
                >
                  #{rank}
                </span>

                {/* Player */}
                <div
                  style={{
                    flex: 1,
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                  }}
                >
                  <div
                    style={{
                      ...styles.smallAvatar,
                      overflow: "hidden",
                    }}
                  >
                    {user.imageUrl ? (
                      <img
                        src={user.imageUrl}
                        alt={user.name ?? ""}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                          display: "block",
                        }}
                      />
                    ) : (
                      <span style={styles.smallAvatarText}>
                        {getInitials(user.name)}
                      </span>
                    )}
                  </div>

                  <div style={styles.playerName}>
                    {user.name ?? "Anonymous"}
                  </div>
                </div>

                {/* Points */}
                <span
                  style={{
                    width: 100,
                    textAlign: "right",
                    ...styles.eloText,
                  }}
                >
                  {user.points.toLocaleString()}
                </span>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div style={styles.footer}>
          <span style={styles.footerPiece}>♟</span>
          <span style={styles.footerText}>
            Chill Chess Indo · SEASON I · 2026
          </span>
          <span style={styles.footerPiece}>♟</span>
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700&family=Crimson+Pro:ital,wght@0,300;0,400;1,300&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #0A090E; }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    width: "100%",
    flex: 1,
    background: "#0A090E",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "48px 16px",
    position: "relative",
    fontFamily: "'Crimson Pro', Georgia, serif",
    overflowX: "hidden",
  },
  bgPattern: {
    position: "fixed",
    inset: 0,
    backgroundImage: `repeating-conic-gradient(#141218 0% 25%, #0E0D12 0% 50%)`,
    backgroundSize: "60px 60px",
    opacity: 0.4,
  },
  bgOverlay: {
    position: "fixed",
    inset: 0,
    background:
      "radial-gradient(ellipse 80% 60% at 50% 0%, #1C1520 0%, #0A090E 100%)",
  },
  container: {
    width: "100%",
    maxWidth: 760,
    margin: "0 auto",
    position: "relative",
    zIndex: 1,
  },
  header: {
    textAlign: "center",
    marginBottom: 40,
  },
  crownRow: {
    fontSize: 32,
    color: "#C9A84C",
    marginBottom: 8,
    letterSpacing: 4,
  },
  crownIcon: {
    display: "inline-block",
    filter: "drop-shadow(0 0 12px #C9A84C88)",
    animation: "fadeUp 0.8s ease both",
  },
  title: {
    fontFamily: "'Cinzel', serif",
    fontSize: 48,
    fontWeight: 700,
    letterSpacing: "0.25em",
    color: "#E8DFC8",
    lineHeight: 1,
    marginBottom: 10,
    textShadow: "0 2px 30px rgba(201,168,76,0.2)",
  },
  subtitle: {
    fontFamily: "'Cinzel', serif",
    fontSize: 11,
    fontWeight: 400,
    letterSpacing: "0.4em",
    color: "#C9A84C",
    opacity: 0.85,
    marginBottom: 20,
  },
  dividerLine: {
    width: 160,
    height: 1,
    background: "linear-gradient(90deg, transparent, #C9A84C88, transparent)",
    margin: "0 auto",
  },
  podium: {
    display: "flex",
    alignItems: "flex-end",
    justifyContent: "center",
    gap: 16,
    marginBottom: 40,
  },
  podiumCard: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    animation: "fadeUp 0.7s ease both",
  },
  podiumAvatar: {
    position: "relative",
    marginBottom: 10,
  },
  avatarCircle: {
    width: 64,
    height: 64,
    borderRadius: "50%",
    border: "2px solid",
    background: "linear-gradient(135deg, #1E1B26, #14121C)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    fontFamily: "'Cinzel', serif",
    fontSize: 16,
    fontWeight: 600,
    color: "#E8DFC8",
    letterSpacing: 1,
  },
  medalBadge: {
    position: "absolute",
    bottom: -4,
    right: -4,
    width: 22,
    height: 22,
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 10,
    color: "#0A090E",
    fontWeight: 700,
    border: "1.5px solid #0A090E",
  },
  podiumName: {
    fontFamily: "'Cinzel', serif",
    fontSize: 13,
    fontWeight: 600,
    color: "#E8DFC8",
    letterSpacing: "0.05em",
  },
  podiumSurname: {
    fontFamily: "'Crimson Pro', serif",
    fontSize: 12,
    color: "#7A7A8E",
    marginBottom: 4,
  },
  podiumPoints: {
    fontFamily: "'Cinzel', serif",
    fontSize: 18,
    fontWeight: 700,
    letterSpacing: "0.05em",
    marginBottom: 10,
  },
  podiumBase: {
    width: 110,
    borderRadius: "4px 4px 0 0",
    border: "1px solid",
    borderBottom: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  podiumRankNum: {
    fontFamily: "'Cinzel', serif",
    fontSize: 22,
    fontWeight: 700,
    letterSpacing: "0.1em",
  },
  tableWrapper: {
    background:
      "linear-gradient(180deg, rgba(20,18,24,0.95) 0%, rgba(14,13,18,0.98) 100%)",
    border: "1px solid rgba(201,168,76,0.18)",
    borderRadius: 8,
    overflow: "hidden",
    backdropFilter: "blur(10px)",
  },
  tableHeader: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    padding: "14px 20px",
    borderBottom: "1px solid rgba(201,168,76,0.2)",
    background: "rgba(201,168,76,0.05)",
    fontFamily: "'Cinzel', serif",
    fontSize: 10,
    fontWeight: 600,
    letterSpacing: "0.2em",
    color: "#C9A84C",
  },
  tableRow: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    padding: "14px 20px",
    borderBottom: "1px solid rgba(255,255,255,0.04)",
    cursor: "default",
  },
  rankNum: {
    fontFamily: "'Cinzel', serif",
    fontSize: 13,
    fontWeight: 600,
  },
  smallAvatar: {
    width: 36,
    height: 36,
    borderRadius: "50%",
    border: "1.5px solid",
    background: "linear-gradient(135deg, #1E1B26, #14121C)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  smallAvatarText: {
    fontFamily: "'Cinzel', serif",
    fontSize: 11,
    fontWeight: 600,
    color: "#C8C0AE",
    letterSpacing: 0.5,
  },
  playerName: {
    fontFamily: "'Cinzel', serif",
    fontSize: 13,
    fontWeight: 400,
    color: "#D4CBB8",
    letterSpacing: "0.03em",
  },
  playerCountry: {
    fontSize: 12,
    marginTop: 1,
  },
  rankBadge: {
    display: "inline-block",
    padding: "2px 8px",
    borderRadius: 3,
    border: "1px solid",
    fontFamily: "'Cinzel', serif",
    fontSize: 9,
    fontWeight: 600,
    letterSpacing: "0.1em",
  },
  streakBadge: {
    fontSize: 12,
    color: "#E8924A",
  },
  eloText: {
    fontFamily: "'Cinzel', serif",
    fontSize: 15,
    fontWeight: 700,
    color: "#C9A84C",
    letterSpacing: "0.04em",
  },
  footer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 16,
    marginTop: 28,
    paddingBottom: 8,
  },
  footerPiece: {
    color: "#3A3A4E",
    fontSize: 16,
  },
  footerText: {
    fontFamily: "'Cinzel', serif",
    fontSize: 10,
    letterSpacing: "0.25em",
    color: "#3A3A4E",
  },
};
