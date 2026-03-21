import React, { createContext, useState, useMemo } from 'react';

export type Chat = {
  Question: string;
  Answer: string;
};

export type HistoryItem = {
  id: string;
  title: string;
  chats: Chat[];
};

type HistoryContextType = {
  histories: HistoryItem[];
  setHistories: (histories: HistoryItem[]) => void;
  selectedHistory: HistoryItem | null;
  setSelectedHistory: (history: HistoryItem | null) => void;
  updateHistoryItem: (id: string, updatedItem: HistoryItem) => void;
};

export const HistoryContext = createContext<HistoryContextType | undefined>(undefined);

export const HistoryProvider = ({ children }: { children: React.ReactNode }) => {
  const [histories, setHistories] = useState<HistoryItem[]>([
    { 
      id: "1", 
      title: "React Basics", 
      chats: [
        { Question: "What is React?", Answer: "React is a JavaScript library" },
        { Question: "Explain JSX?", Answer: "JSX is syntax extension for React" },
      ] 
    },
    { 
      id: "2", 
      title: "Gemini API", 
      chats: [
        { Question: "Explain Gemini API", Answer: "It is an AI model by Google" },
        { Question: "How to use Gemini?", Answer: "Install SDK and authenticate" },
      ] 
    },
    { 
      id: "3", 
      title: "React Hooks", 
      chats: [
        { Question: "What is useEffect?", Answer: "It is a React Hook" },
        { Question: "Explain props", Answer: "Props pass data between components" },
        { Question: "What is state?", Answer: "State stores dynamic data" },
      ] 
    },
    { 
      id: "4", 
      title: "Node & Express", 
      chats: [
        { Question: "What is Node.js?", Answer: "Backend JavaScript runtime" },
        { Question: "Explain Express", Answer: "Framework for Node.js" },
      ] 
    },
  ]);
  const [selectedHistory, setSelectedHistory] = useState<HistoryItem | null>(null);

  const updateHistoryItem = (id: string, updatedItem: HistoryItem) => {
    setHistories((prev) =>
      prev.map((item) => (item.id === id ? updatedItem : item))
    );
    setSelectedHistory(updatedItem);
  };

  const value = useMemo(
    () => ({ histories, setHistories, selectedHistory, setSelectedHistory, updateHistoryItem }),
    [histories, selectedHistory]
  );

  return (
    <HistoryContext.Provider value={value}>
      {children}
    </HistoryContext.Provider>
  );
};

export const useHistory = () => {
  const context = React.useContext(HistoryContext);
  if (!context) {
    throw new Error('useHistory must be used within HistoryProvider');
  }
  return context;
};
