import { Route, Routes } from "react-router";
import Homepage from "./feature/Homepage";
import ProfilePage from "./componentsdiy/ProfilePage";
import useAuthReq from "./hooks/useAuthReq";
import useUserSync from "./hooks/useUserSync";
import ProtectedRoute from "./protectedroute/ProtectedRoute";
import CobaCoba from "./bot/CobaCoba";
// import PushRank from "./componentsdiy/PushRank";
import ChallengeBotLux from "./bot/ChallengeBotLux";
import GachaPreview from "./componentsdiy/GachaPreview";
import GachaPuzzleTest from "./componentsdiy/GachaPuzzleTest";
import PuzzleLuxPointsTest from "./componentsdiy/PuzzleLuxPointsTest";
import LeaderboardLux from "./componentsdiy/LeaderboardLux";
import Leaderboard from "./componentsdiy/Leaderboard";
import PuzzleLux from "./componentsdiy/PuzzleLux";

function App() {
  const { isClerkLoaded } = useAuthReq();
  useUserSync();
  if (!isClerkLoaded) return null;
  return (
    <div className="min-h-screen bg-[#1D1718] text-white">
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route element={<ProtectedRoute />}>
          {/* <Route path="/pushrank" element={<PushRank />} /> */}
          <Route path="/puzzle" element={<PuzzleLuxPointsTest />} />
          <Route path="/challenge" element={<ChallengeBotLux />} />
          <Route path="/leaderboard" element={<LeaderboardLux />} />
          <Route path="/coba" element={<CobaCoba />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/gp" element={<GachaPuzzleTest />} />
          <Route path="/g" element={<GachaPreview />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
