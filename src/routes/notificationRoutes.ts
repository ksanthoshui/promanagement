import express from "express";
import { getNotifications, markAsRead, markAllAsRead } from "../controllers/notificationController.ts";
import { authMiddleware } from "../middleware/auth.ts";

const router = express.Router();

router.use(authMiddleware);

router.get("/", getNotifications);
router.put("/read-all", markAllAsRead);
router.put("/:id/read", markAsRead);

export default router;
