import mongoose from "mongoose";
import { chatQuestionSchema } from "./ChatQuestion.js";

const chatSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    title: {
        type: String,
        default: "New Chat",
    },
    messages: {
        type: [chatQuestionSchema],
        default: [],
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
});

chatSchema.pre("save", function (next) {
    this.updatedAt = Date.now();
    next();
});

const Chat = mongoose.model("Chat", chatSchema);
export default Chat;
