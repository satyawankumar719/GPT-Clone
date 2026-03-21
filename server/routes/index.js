import { Router } from "express";
import { signup, login, getCurrentUser } from "../controller/authController.js";
import {
    getUserChats,
    createChat,
    getChatMessages,
   
    AnswerFromAPI,
} from "../controller/chatController.js";
import { authenticateUser } from "../middleware/auth.js";
const router = Router();

router.post("/auth/signup", signup);
router.post("/auth/login", login);
router.get("/auth/me", authenticateUser, getCurrentUser);

router.get("/chats", authenticateUser, getUserChats);
router.post("/chats", authenticateUser, createChat);
router.get("/chats/:chatId", authenticateUser, getChatMessages);
router.post("/answer",  AnswerFromAPI);


export default router;