import { Router } from "express";
import { signin, signup } from "../controllers/auth";
import { createRoom, getRoom } from "../controllers/room";
import { getChats } from "../controllers/chats";
import { authMiddleware } from "../middleware/authMiddleware";
const router: Router = Router();

router.post("/api/signup", signup);
router.post("/api/signin", signin);
router.post("/api/room", authMiddleware, createRoom);
router.get("/chats/:roomId", getChats);
router.post("/room/:slug", getRoom);

export default router;