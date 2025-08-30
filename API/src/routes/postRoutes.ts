import { Router } from "express";
import { getAllPosts } from "../controllers/postController";

const router = Router();

router.use("/", getAllPosts);

export default router;