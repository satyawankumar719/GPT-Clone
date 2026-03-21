import Inputfield from '@/components/InputField/Inputfield'
import Answer from '@/components/QuestionAnswer/Answer'
import Question from '@/components/QuestionAnswer/Question'
import { useState, useEffect } from 'react'
import apiClient from '@/api/apiClient'
import { API_CONFIG } from '@/api/apiConfig'
import { useHistory } from '@/store/HistoryContext'

function ChatContainer() {

  const [chats, setChats] = useState<
    { question: string; answer: string }[]
  >([]);

  const { selectedHistory, updateHistoryItem } = useHistory();

  useEffect(() => {
    if (selectedHistory) {
      setChats(selectedHistory.chats.map(chat => ({
        question: chat.Question,
        answer: chat.Answer
      })));
    } else {
      setChats([]);
    }
  }, [selectedHistory]);

  const fetchAnswer = async (message: string) => {
    setChats((prev) => [
      ...prev,
      { question: message, answer: "Typing..." }
    ]);

    try {
      const response = await apiClient.post(
        API_CONFIG.ENDPOINTS.CONVERSATION.GET_ANSWER,
        { question: message }
      );

      let finalAnswer = "";

      if (response.data.answer) {
        finalAnswer = response.data.answer;
      } else {
        finalAnswer =
          response.data?.candidates?.[0]?.content?.parts?.[0]?.text ||
          "No response";
      }

      setChats((prev) => {
        const updated = [...prev];
        updated[updated.length - 1] = {
          question: message,
          answer: finalAnswer,
        };
        return updated;
      });

      if (selectedHistory) {
        const updatedHistory = {
          ...selectedHistory,
          chats: [
            ...selectedHistory.chats,
            { Question: message, Answer: finalAnswer }
          ]
        };
        updateHistoryItem(selectedHistory.id, updatedHistory);
      }

    } catch (error) {
      setChats((prev) => {
        const updated = [...prev];
        updated[updated.length - 1] = {
          question: message,
          answer: "Error fetching answer",
        };
        return updated;
      });
    }
  };

  function onSend(message: string) {
    fetchAnswer(message);
  }

  return (
    <div className="flex flex-col h-full">

      <div className="flex-1 overflow-y-auto p-4 pb-24">
        {chats.map((chat, index) => (
          <div key={index}>
            <Question question={chat.question} />
            <Answer answer={chat.answer} />
          </div>
        ))}
      </div>

      <div className="sticky bottom-0 bg-white">
        <Inputfield onSend={onSend} />
      </div>

    </div>
  );
}
export default ChatContainer;