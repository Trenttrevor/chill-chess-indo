import { Route, Routes } from "react-router";

import ProfilePage from "./componentsdiy/ProfilePage";
import ChallengeBotLux from "./bot/ChallengeBotLux";
import PuzzleLuxPointsTest from "./componentsdiy/PuzzleLuxPointsTest";
import LeaderboardLux from "./componentsdiy/LeaderboardLux";
import Homepage from "./feature/Homepage";

function App() {
  return (
    <div className="min-h-screen bg-[#1D1718] text-white">
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/puzzle" element={<PuzzleLuxPointsTest />} />
        <Route path="/challenge" element={<ChallengeBotLux />} />
        <Route path="/leaderboard" element={<LeaderboardLux />} />
        <Route path="/profile" element={<ProfilePage />} />
      </Routes>
    </div>
  );
}

export default App;
