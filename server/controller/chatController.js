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
        console.log('Creating chat for userId:', userId);
        const { title } = req.body;

        if (!userId) {
            return res.status(400).json({ message: "User ID is required" });
        }

        const newChat = new Chat({
            userId,
            title: title || "New Chat",
            messages: [],
        });

        await newChat.save();
        console.log('Chat created successfully with title:', title, 'ID:', newChat._id);
        res.status(201).json({ message: "Chat created", chat: newChat });
    } catch (error) {
        console.error('Error creating chat:', error.message, error.stack);
        res.status(500).json({ message: error.message });
    }
};

export const updateChatTitle = async (req, res) => {
    try {
        const { chatId } = req.params;
        const userId = req.userId;
        const { title } = req.body;

        if (!title) {
            return res.status(400).json({ message: "Title is required" });
        }

        const chat = await Chat.findOne({ _id: chatId, userId });
        if (!chat) {
            return res.status(404).json({ message: "Chat not found" });
        }

        chat.title = title;
        await chat.save();
        console.log('Chat title updated:', chatId, 'New title:', title);
        res.status(200).json({ message: "Chat title updated", chat });
    } catch (error) {
        console.error('Error updating chat title:', error.message);
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
        const { question, chatId, chats = [] } = req.body;
        const userId = req.userId;
        console.log("Received question:", req.body, "API_KEY available:", !!APP_CONFIG.API_KEY);

        if (!question) {
            return res.status(400).json({ message: "Question is required" });
        }

        if (!APP_CONFIG.API_KEY) {
            console.error('API_KEY is missing from environment');
            return res.status(500).json({ message: "API configuration error" });
        }

        // Verify chat belongs to user if chatId is provided
        let chat = null;
        if (chatId) {
            chat = await Chat.findOne({ _id: chatId, userId });
            if (!chat) {
                return res.status(404).json({ message: "Chat not found" });
            }
        }

        const normalizedChats = Array.isArray(chats)
            ? chats.map((item) => ({
                  question: item.question || item.Question || "",
                  answer: item.answer || item.Answer || "",
              }))
            : [];

        const historyText = normalizedChats
            .map(
                (item, index) =>
                    `#${index + 1} User: ${item.question}\nAssistant: ${item.answer}`
            )
            .join("\n\n");

        const prompt = `You are a helpful assistant. Use the conversation history below to provide a relevant answer.\n\nConversation history:\n${historyText}\n\nCurrent question:\n${question}\n\nAnswer:`;

        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${APP_CONFIG.API_KEY}`;
        console.log('Calling Gemini API...');
        
        let answer = "No answer found";
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 30000); // 30 second timeout
        
        try {
            const response = await fetch(apiUrl, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    
                },
                body: JSON.stringify({
                    contents: [
                        {
                            parts: [{ text: prompt }],
                        },
                    ],
                }),
                signal: controller.signal,
            });

            clearTimeout(timeout);
            console.log('Gemini API response status:', response.status);
            
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                console.error('Gemini API error response:', errorData);
                
                // Handle specific error codes
                if (response.status === 429) {
                    throw new Error('API quota exceeded. Please check your Gemini API plan and billing details at: https://ai.google.dev/pricing');
                } else if (response.status === 401) {
                    throw new Error('Invalid API key. Please check your Gemini API credentials.');
                } else if (response.status === 400) {
                    const message = errorData?.error?.message || 'Invalid request to Gemini API';
                    throw new Error(`Bad request: ${message}`);
                } else {
                    throw new Error(`Gemini API error ${response.status}: ${errorData?.error?.message || 'Unknown error'}`);
                }
            }
               
            const data = await response.json();
            console.log("Gemini API Response received successfully");
            answer = data.candidates?.[0]?.content?.parts?.[0]?.text || "No answer found";
        } catch (fetchError) {
            clearTimeout(timeout);
            if (fetchError.name === 'AbortError') {
                throw new Error('Gemini API request timeout after 30 seconds');
            }
            throw fetchError;
        }

        // Save message to chat if chatId provided
        if (chat) {
            chat.messages.push({
                question,
                answer,
                createdAt: new Date(),
            });
            chat.updatedAt = new Date();
            await chat.save();
            console.log('Chat saved with new message, total messages:', chat.messages.length);
        }

        res.status(200).json({ answer, chat });
    } catch (error) {
        console.error('Error in AnswerFromAPI:', error.message);
        console.error('Full error:', error);
        
        let errorMessage = error.message;
        const errorCode = error.message?.includes('quota') ? 'QUOTA_EXCEEDED' :
                         error.message?.includes('timeout') ? 'TIMEOUT' :
                         error.message?.includes('Network') ? 'NETWORK_ERROR' :
                         'UNKNOWN_ERROR';
        
        // Provide user-friendly error messages
        if (error.message?.includes('quota')) {
            errorMessage = '❌ API Quota Exceeded: You have reached your Gemini API usage limit. Please upgrade your plan or wait for the quota to reset.';
        } else if (error.message?.includes('timeout')) {
            errorMessage = '⏱️ Request Timeout: The API took too long to respond. Please try again.';
        } else if (error.message?.includes('fetch') || error.message?.includes('Network')) {
            errorMessage = '🌐 Network Error: Unable to connect to Gemini API. Please check your internet connection.';
        } else if (error.message?.includes('Invalid API key')) {
            errorMessage = '🔑 Invalid API Key: Please check your Gemini API credentials in the environment variables.';
        }
        
        console.error('Error code:', errorCode, 'Message:', errorMessage);
        res.status(500).json({ message: errorMessage, errorCode });
    }
}