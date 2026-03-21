import Chat from "../models/Chat.js";
import ChatQuestion from "../models/ChatQuestion.js";
import { APP_CONFIG } from "../config/env.js";

export const getUserChats = async (req, res) => {
    try {
        const userId = req.userId;
        const chats = await Chat.find({ userId }).sort({ updatedAt: -1 });
        res.status(200).json({ chats });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const createChat = async (req, res) => {
    try {
        const userId = req.userId;
        const { title } = req.body;

        const newChat = new Chat({
            userId,
            title: title || "New Chat",
            messages: [],
        });

        await newChat.save();
        res.status(201).json({ message: "Chat created", chat: newChat });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getChatMessages = async (req, res) => {
    try {
        const { chatId } = req.params;
        const userId = req.userId;

        const chat = await Chat.findOne({ _id: chatId, userId });
        if (!chat) {
            return res.status(404).json({ message: "Chat not found" });
        }

        res.status(200).json({ chat });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const addMessageToChat = async (req, res) => {
    try {
        const { chatId } = req.params;
        const userId = req.userId;
        const { question, answer } = req.body;

        const chat = await Chat.findOne({ _id: chatId, userId });
        if (!chat) {
            return res.status(404).json({ message: "Chat not found" });
        }

        const newMessage = {
            question,
            answer,
            createdAt: new Date(),
        };

        chat.messages.push(newMessage);
        await chat.save();

        res.status(201).json({ message: "Message added", chat });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const AnswerFromAPI = async (req, res) => {
    try {
        const { question} = req.body;
        // const userId = req.userId;
    console.log("Received question:", question); // Debugging line
        if (!question) {
            return res.status(400).json({ message: "Question is required" });
        }

        // Get or create chat if chatId not provided
        // let chat;
        // if (chatId) {
        //     chat = await Chat.findOne({ _id: chatId, userId });
        //     if (!chat) {
        //         return res.status(404).json({ message: "Chat not found" });
        //     }
        // } else {
        //     // Create new chat if not provided
        //     chat = new Chat({ userId, title: "New Chat", messages: [] });
        // }

        // Call Gemini API
        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                     "x-goog-api-key": APP_CONFIG.API_KEY,
                },
                body: JSON.stringify({
                    contents: [{
                        parts: [{ text: question }]
                    }]
                }),
            }
        );

        if (!response.ok) {
            throw new Error("Failed to fetch answer from AI");
        }
           
        const data = await response.json();
        console.log("Gemini API Response:", data); // Debugging line
        const answer = data.candidates?.[0]?.content?.parts?.[0]?.text || "No answer found";

        // Add message to chat
        // chat.messages.push({
        //     question,
        //     answer,
        //     createdAt: new Date(),
        // });
        // await chat.save();

        res.status(200).json({ answer});
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}