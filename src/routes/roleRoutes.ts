import express from "express";
import { 
  getRoles, 
  createRole, 
  updateRole, 
  deleteRole, 
  getRecentChanges 
} from "../controllers/roleController.ts";
import { authMiddleware } from "../middleware/auth.ts";

const router = express.Router();

router.use(authMiddleware);

router.get("/", getRoles);
router.post("/", createRole);
router.get("/recent-changes", getRecentChanges);
router.put("/:id", updateRole);
router.delete("/:id", deleteRole);

export default router;
