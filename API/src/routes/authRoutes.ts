import { Router } from "express";
import {
    userSignup,
    userLogin
} from "../controllers/authController";

const router = Router();

router.post("/signup", userSignup);
router.post("/login", userLogin);

export default router;