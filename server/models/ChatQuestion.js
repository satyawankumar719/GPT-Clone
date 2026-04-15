import mongoose from 'mongoose';

const chatQuestionSchema = new mongoose.Schema({
    question: {
        type: String,
        required: true,
    },
    answer: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

export { chatQuestionSchema };
const ChatQuestion = mongoose.model('ChatQuestion', chatQuestionSchema);
export default ChatQuestion;