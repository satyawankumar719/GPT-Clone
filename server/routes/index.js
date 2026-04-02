import { Router } from "express";
import { signup, login, logout, getCurrentUser } from "../controller/authController.js";
import {
    getUserChats,
    createChat,
    getChatMessages,
    addMessageToChat,
    AnswerFromAPI,
    updateChatTitle,
} from "../controller/chatController.js";
import { authenticateUser } from "../middleware/auth.js";
const router = Router();

router.post("/auth/signup", signup);
router.post("/auth/login", login);
router.post("/auth/logout", logout);
router.get("/auth/me", authenticateUser, getCurrentUser);

router.get("/chats", authenticateUser, getUserChats);
router.post("/chats", authenticateUser, createChat);
router.get("/chats/:chatId", authenticateUser, getChatMessages);
router.post("/chats/:chatId/messages", authenticateUser, addMessageToChat);
router.patch("/chats/:chatId/title", authenticateUser, updateChatTitle);
router.post("/answer", authenticateUser, AnswerFromAPI);


export default router;