import { useQuery } from "@tanstack/react-query";
import { getLeaderboard } from "@/lib/api";

function Leaderboard() {
  const { data, isLoading } = useQuery({
    queryKey: ["leaderboard"],
    queryFn: getLeaderboard,
  });

  if (isLoading) return <p>Loading...</p>;

  return (
    <div>
      <h1>Leaderboard</h1>

      {data.map((user: any, index: number) => (
        <div key={user.id}>
          <p>
            #{index + 1} {user.name} - {user.points}
          </p>
        </div>
      ))}
    </div>
  );
}

export default Leaderboard;
