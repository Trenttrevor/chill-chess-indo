import { Route, Routes } from "react-router";
import Homepage from "./feature/Homepage";
import ProfilePage from "./componentsdiy/ProfilePage";
import useAuthReq from "./hooks/useAuthReq";
import useUserSync from "./hooks/useUserSync";
import ProtectedRoute from "./protectedroute/ProtectedRoute";
// import PushRank from "./componentsdiy/PushRank";
import ChallengeBotLux from "./bot/ChallengeBotLux";
import PuzzleLuxPointsTest from "./componentsdiy/PuzzleLuxPointsTest";
import LeaderboardLux from "./componentsdiy/LeaderboardLux";

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
          <Route path="/profile" element={<ProfilePage />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
