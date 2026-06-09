import api from "./axios";

type UserData = {
  email: string;
  name: string;
  imageUrl: string;
};

export const syncUser = async (userData: UserData) => {
  const { data } = await api.post("/users/sync", userData);
  return data;
};

export const addPoints = async (points: number) => {
  const { data } = await api.post("/users/points", {
    points,
  });

  return data;
};

export const getLeaderboard = async () => {
  const { data } = await api.get("/users/leaderboard");
  return data;
};
