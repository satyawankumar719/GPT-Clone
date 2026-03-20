import Inputfield from '@/components/InputField/Inputfield'
import Answer from '@/components/QuestionAnswer/Answer'
import Question from '@/components/QuestionAnswer/Question'
import React, { useState } from 'react'
import apiClient from '@/api/apiClient'
import { API_CONFIG } from '@/api/apiConfig'

function ChatContainer() {

  const [chats, setChats] = useState<
    { question: string; answer: string }[]
  >([]);

  const fetchAnswer = async (message: string) => {
    try {
      const response = await apiClient.post(
        API_CONFIG.ENDPOINTS.CONVERSATION.CREATE,
        { question: message }
      );
      console.log("API Response:", response.data); // Debugging line

      setChats((prev) => [
        ...prev,
        {
          question: message,
          answer: response.data.answer,
        },
      ]);
    } catch (error) {
      setChats((prev) => [
        ...prev,
        {
          question: message,
          answer: "Error fetching answer",
        },
      ]);
    }
  };

  function onSend(message: string) {
    fetchAnswer(message);
  }

  return (
    <>
      {chats.map((chat, index) => (
        <div key={index}>
          <Question question={chat.question} />
          <Answer answer={chat.answer} />
        </div>
      ))}

      <Inputfield onSend={onSend} />
    </>
  );
}

export default ChatContainer;