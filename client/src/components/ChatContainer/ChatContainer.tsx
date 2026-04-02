import Inputfield from '@/components/InputField/Inputfield'
import Answer from '@/components/QuestionAnswer/Answer'
import Question from '@/components/QuestionAnswer/Question'
import { useState, useEffect, useRef } from 'react'
import { apiClient } from '@/api/apiClient'
import { useHistory } from '@/store/HistoryContext'
import type { HistoryItem } from '@/store/HistoryContext'
import { API_CONFIG } from '@/api/apiConfig'

type Chat = {
  question: string
  answer: string
}

function ChatContainer() {
  const [chats, setChats] = useState<Chat[]>([])
  const [loading, setLoading] = useState(false)
  const syncWithHistoryRef = useRef(true)

  const { selectedHistory, updateHistoryItem, addHistory } = useHistory()

  const chatContainerRef = useRef<HTMLDivElement | null>(null)
  const chatEndRef = useRef<HTMLDivElement | null>(null)

  // Load chats from history - but only if we're not in the middle of sending a message
  useEffect(() => {
    if (syncWithHistoryRef.current) {
      if (selectedHistory) {
        setChats(selectedHistory.messages || [])
      } else {
        setChats([])
      }
    }
  }, [selectedHistory])

  // Scroll to bottom
  useEffect(() => {
    // Use a small timeout to ensure DOM is fully updated before scrolling
    const scrollTimeout = setTimeout(() => {
      if (chatContainerRef.current) {
        chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight
      }
    }, 0)
    
    return () => clearTimeout(scrollTimeout)
  }, [chats])

  const fetchAnswer = async (message: string) => {
    if (!message.trim()) return;
    
    console.log('Starting fetchAnswer with message:', message);
    setLoading(true);
    let current = selectedHistory;
    let newChatId: string | null = null;

    try {
      // Show question and typing message in UI immediately
      const updatedChatsForUI = [...chats, { question: message, answer: 'Typing...' }];
      console.log('Updated chats:', updatedChatsForUI);
      setChats(updatedChatsForUI);

      // Create new chat if none selected
      if (!current) {
        console.log('No selected history, creating new chat');
        console.log('POST to:', API_CONFIG.ENDPOINTS.CONVERSATION.CREATE);
        syncWithHistoryRef.current = false; // Prevent useEffect from overwriting
        
        // Generate title from first question (first 50 chars, or up to first sentence)
        const titleFromQuestion = message.length > 50 
          ? message.substring(0, 50) + '...'
          : message;
        
        const createResponse = await apiClient.post(API_CONFIG.ENDPOINTS.CONVERSATION.CREATE, {
          title: titleFromQuestion,
        });

        if (!createResponse.data?.chat) {
          console.error('Failed to create chat - no chat in response:', createResponse.data);
          syncWithHistoryRef.current = true;
          setLoading(false);
          return;
        }

        current = createResponse.data.chat as HistoryItem;
        newChatId = current._id;
        console.log('New chat created with title:', titleFromQuestion, 'ID:', current);
      }

      // Send context to backend (use previous messages, not the typing one)
      const contextChats = chats.map((chat) => ({
        question: chat.question,
        answer: chat.answer === 'Typing...' ? '' : chat.answer,
      }));

      if (!current) {
        console.error('Current chat is null');
        syncWithHistoryRef.current = true;
        setLoading(false);
        return;
      }

      console.log('Sending to API with chatId:', current._id);
      const answerResponse = await apiClient.post(API_CONFIG.ENDPOINTS.CONVERSATION.GET_ANSWER, {
        question: message,
        chatId: current._id,
        chats: contextChats,
      });

      console.log('API Response:', answerResponse.data);
      const finalAnswer = answerResponse.data?.answer || 'No response';

      // Update last message with final answer
      setChats((prev) => {
        const updated = [...prev];
        if (updated.length > 0) {
          updated[updated.length - 1] = {
            question: message,
            answer: finalAnswer,
          };
        }
        console.log('Final chats:', updated);
        return updated;
      });

      // Update or add to history
      if (answerResponse.data?.chat) {
        console.log('Updating history with:', answerResponse.data.chat);
        if (newChatId) {
          addHistory(answerResponse.data.chat);
        } else if (current) {
          updateHistoryItem(current._id, answerResponse.data.chat);
        }
      }
    } catch (error) {
      console.error('Error in fetchAnswer:', error);
      
      // Extract error message from axios error or generic error
      let errorMessage = 'An unknown error occurred';
      
      if (error && typeof error === 'object' && 'response' in error) {
        // Axios error
        const axiosError = error as any;
        errorMessage = axiosError.response?.data?.message || 
                       axiosError.message || 
                       `Server error: ${axiosError.response?.status}`;
        console.error('Server response:', axiosError.response?.data);
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }
      
      setChats((prev) => {
        const updated = [...prev];
        if (updated.length > 0) {
          updated[updated.length - 1].answer = `Error: ${errorMessage}`;
        }
        return updated;
      });
    } finally {
      syncWithHistoryRef.current = true;
      setLoading(false);
    }
  };

  const onSend = (message: string) => {
    if (!loading && message.trim()) {
      fetchAnswer(message)
    }
  }

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Chat messages */}
      <div 
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto p-4 md:p-6 space-y-2 scroll-smooth"
      >
        {chats.length === 0 && !selectedHistory && (
          <div className="flex items-center justify-center h-full text-neutral-400">
            <p>Select or create a chat to start</p>
          </div>
        )}

        {chats.map((chat, index) => (
          <div key={index}>
            <Question question={chat.question} />
            <Answer answer={chat.answer} />
          </div>
        ))}

        <div ref={chatEndRef} />
      </div>

      {/* Input - fixed height so keyboard doesn't push it away */}
      <div className="shrink-0 bg-white dark:bg-neutral-900 z-10 p-3 md:p-4 border-t dark:border-neutral-700">
        <Inputfield onSend={onSend} disabled={loading} />
      </div>
    </div>
  )
}

export default ChatContainer