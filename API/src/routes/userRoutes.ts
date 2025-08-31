import { Router } from "express";
import {
    getCurrentUser,
    updateUser,
    deleteUser
} from "../controllers/userController";
import { authenticate } from "../middleware/authMiddleware";

const router = Router();

router.get("/me", authenticate, getCurrentUser);
router.put("/:id", authenticate, updateUser);
router.delete("/:id", authenticate, deleteUser);

export default router;