import { Router } from "express";
import {
  addUserPoints,
  getLeaderboard,
  syncUser,
} from "../controllers/userController";
import { requireAuth } from "@clerk/express";

const router = Router();

router.post("/sync", requireAuth(), syncUser);
router.post("/points", requireAuth(), addUserPoints);
router.get("/leaderboard", getLeaderboard);

export default router;
