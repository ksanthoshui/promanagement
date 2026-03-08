import express from "express";
import { getUserSettings, updateUserSettings, deleteAccount } from "../controllers/userController.ts";
import { authMiddleware } from "../middleware/auth.ts";

const router = express.Router();

router.use(authMiddleware);

router.get("/settings", getUserSettings);
router.put("/settings", updateUserSettings);
router.delete("/account", deleteAccount);

export default router;
