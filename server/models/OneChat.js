import mongoose from "mongoose";
import ChatQuestion from "./ChatQuestion.js";
const oneChatSchema = new mongoose.Schema({
  
  oneChat: {
    type: [ChatQuestion.schema],
    required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});
const OneChat = mongoose.model("OneChat", oneChatSchema);
export default OneChat;
    