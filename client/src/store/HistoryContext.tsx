import React, { createContext, useState, useMemo, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { apiClient } from '../api/apiClient';

export type Chat = {
  question: string;
  answer: string;
};

export type HistoryItem = {
  _id: string;
  title: string;
  messages: Chat[];
};

type HistoryContextType = {
  histories: HistoryItem[];
  setHistories: (histories: HistoryItem[]) => void;
  selectedHistory: HistoryItem | null;
  setSelectedHistory: (history: HistoryItem | null) => void;
  updateHistoryItem: (id: string, updatedItem: HistoryItem) => void;
  addHistory: (history: HistoryItem) => void;
  loadingHistories: boolean;
};

export const HistoryContext = createContext<HistoryContextType | undefined>(undefined);

export const HistoryProvider = ({ children }: { children: React.ReactNode }) => {
  const { user, token } = useAuth();
  const [histories, setHistories] = useState<HistoryItem[]>([]);
  const [selectedHistory, setSelectedHistory] = useState<HistoryItem | null>(null);
  const [loadingHistories, setLoadingHistories] = useState(false);

  // Fetch user's chats from server
  useEffect(() => {
    console.log('HistoryContext effect - user:', !!user, 'token:', !!token);
    if (user && token) {
      console.log('User and token available, fetching histories');
      fetchHistories();
    } else {
      console.log('User or token not available, clearing histories');
      setHistories([]);
      setSelectedHistory(null);
    }
  }, [user, token]);

  const fetchHistories = async () => {
    try {
      setLoadingHistories(true);
      console.log('Fetching chat histories...');
      const response = await apiClient.get('/api/chats');
      console.log('Histories fetched:', response.data.chats);
      if (response.data.chats) {
        setHistories(response.data.chats);
      }
    } catch (error) {
      console.error('Failed to fetch histories:', error);
      setHistories([]);
    } finally {
      setLoadingHistories(false);
    }
  };

  const updateHistoryItem = (id: string, updatedItem: HistoryItem) => {
    setHistories((prev) =>
      prev.map((item) => (item._id === id ? updatedItem : item))
    );
    setSelectedHistory(updatedItem);
  };

  const addHistory = (history: HistoryItem) => {
    setHistories((prev) => [history, ...prev]);
    setSelectedHistory(history);
  };

  const value = useMemo(
    () => ({ 
      histories, 
      setHistories, 
      selectedHistory, 
      setSelectedHistory, 
      updateHistoryItem,
      addHistory,
      loadingHistories
    }),
    [histories, selectedHistory, loadingHistories]
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
