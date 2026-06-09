import type { Request, Response } from "express";
import * as queries from "../db/queries";

import { getAuth } from "@clerk/express";

export const syncUser = async (req: Request, res: Response) => {
  try {
    const { userId } = getAuth(req);

    if (!userId) return res.status(401).json({ error: "UNauthorized!" });
    const { email, name, imageUrl } = req.body;

    if (!email || !name || !imageUrl) {
      return res
        .status(400)
        .json({ error: "provide email, name, and imageUrl" });
    }
    const user = await queries.upsertUser({
      id: userId,
      email: email,
      name: name,
      imageUrl: imageUrl,
    });
    res.status(200).json(user);
  } catch (error) {
    console.error("error sync user", error);
    res.status(500).json({ error: "failed to sync user" });
  }
};

export const addUserPoints = async (req: Request, res: Response) => {
  try {
    const { userId } = getAuth(req);

    console.log("userId:", userId);
    console.log("body:", req.body);

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const { points } = req.body;

    if (!points || typeof points !== "number") {
      return res.status(400).json({
        error: "Points must be a number",
      });
    }

    const user = await queries.addPoints(userId, points);

    res.status(200).json(user);
  } catch (error) {
    console.error("error adding points", error);

    res.status(500).json({
      error: "failed to add points",
    });
  }
};

export const getLeaderboard = async (req: Request, res: Response) => {
  try {
    const leaderboard = await queries.getLeaderboard();

    res.status(200).json(leaderboard);
  } catch (error) {
    console.error("leaderboard error", error);

    res.status(500).json({
      error: "failed to fetch leaderboard",
    });
  }
};
