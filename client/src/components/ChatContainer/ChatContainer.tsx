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
        const axiosError = error as {
          response?: { data?: { message?: string }, status?: number },
          message?: string
        };
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
  <div className="flex flex-col h-full overflow-hidden bg-white dark:bg-[#0d0d0d]">
    {/* Chat messages */}
    <div 
      ref={chatContainerRef}
      className="flex-1 overflow-y-auto scroll-smooth"
    >
      <div className="max-w-3xl mx-auto w-full px-4 py-8 md:px-6 lg:px-0 space-y-8">
        {chats.length === 0 && !selectedHistory && (
          <div className="flex flex-col items-center justify-center min-h-[60vh] text-neutral-400 dark:text-neutral-500">
            <div className="w-16 h-16 bg-neutral-100 dark:bg-neutral-800 rounded-2xl flex items-center justify-center text-3xl mb-4">
              💬
            </div>
            <h2 className="text-xl font-semibold text-neutral-800 dark:text-neutral-200">How can I help you today?</h2>
            <p className="text-sm mt-1">Select a history or start a new thread.</p>
          </div>
        )}

        {chats.map((chat, index) => (
          <div key={index} className="group animate-in fade-in slide-in-from-bottom-2 duration-300">
            <Question question={chat.question} />
            <Answer answer={chat.answer} />
          </div>
        ))}

      
        <div ref={chatEndRef} className="h-4" />
      </div>
    </div>

    {/* Input Area */}
    <div className="shrink-0 bg-gradient-to-t from-white via-white to-transparent dark:from-[#0d0d0d] dark:via-[#0d0d0d] pt-6 pb-4">
      <div className="max-w-3xl mx-auto w-full px-4">
        <div className="relative mb-5 rounded-2xl bg-white dark:bg-neutral-800 shadow-sm focus-within:ring-1 focus-within:ring-emerald-500/50 transition-all">
           <Inputfield onSend={onSend} disabled={loading} />
        </div>
      
      </div>
    </div>
  </div>
)
}

export default ChatContainer