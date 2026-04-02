"use client";
import  { useState } from "react";
import { Sidebar, SidebarBody, SidebarLink } from "@/components/ui/sidebar";
import { Outlet } from "react-router";
import { motion } from "motion/react";
import { useHistory, type HistoryItem } from "@/store/HistoryContext";
import Header from "@/components/Header/Header";
import { apiClient } from "@/api/apiClient";
import { API_CONFIG } from "@/api/apiConfig";

export default function DashBoard() {
  const { histories, setSelectedHistory, addHistory, loadingHistories } = useHistory();
  const [open, setOpen] = useState<boolean>(false); 
  const [creatingChat, setCreatingChat] = useState(false);

  const handleNewChat = async () => {
    try {
      setCreatingChat(true);
      const response = await apiClient.post(API_CONFIG.ENDPOINTS.CONVERSATION.CREATE, { title: 'New Chat' });
      if (response.data.chat) {
        addHistory(response.data.chat);
      }
    } catch (error) {
      console.error('Failed to create chat:', error);
    } finally {
      setCreatingChat(false);
    }
  };

  return (
    <div className="flex flex-col w-full h-screen overflow-hidden bg-gray-100 dark:bg-neutral-800">
      
      {/* HEADER */}
      <div className="shrink-0 z-50">
        <Header onMenuClick={() => setOpen(!open)} open={open} />
      </div>

      {/* MAIN LAYOUT */}
      <div className="flex flex-1 overflow-hidden">
        {/* SIDEBAR */}
        <div
          className={`fixed md:static top-16 left-0 bottom-0 w-64 z-40 md:z-20
          ${open ? "translate-x-0" : "-translate-x-full"} 
          md:translate-x-0 transition-transform duration-300 overflow-hidden`}
        >
          <Sidebar open={true}>
            <SidebarBody className="h-full w-64 flex flex-col border-r border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 overflow-y-auto">
              
              <Logo />

              <div className=" mt-4">
                <button
                  onClick={handleNewChat}
                  disabled={creatingChat}
                  className="w-full p-2 px-10 rounded-lg bg-blue-600 text-white font-semibold 
                             hover:bg-blue-700 disabled:bg-gray-400 transition-colors duration-200"
                >
                  {creatingChat ? 'Creating...' : '+ New Chat'}
                </button>
              </div>

              <div className="flex-1 overflow-y-auto px-2">
                <div className="mt-4 flex flex-col gap-3">
                  {loadingHistories ? (
                    <div className="text-center text-sm text-neutral-500">Loading...</div>
                  ) : (
                    <HistoryList
                      histories={histories}
                      onSelectHistory={(h) => {
                        setSelectedHistory(h);
                        setOpen(false); // 👈 close on mobile click
                      }}
                    />
                  )}
                </div>
              </div>

              {/* <div className="p-2 border-t border-neutral-300 dark:border-neutral-700 shrink-0">
                <SidebarLink
                  link={{
                    label: "User",
                    href: "#",
                    icon: (
                      <img
                        src="https://assets.aceternity.com/manu.png"
                        className="h-7 w-7 rounded-full"
                        alt="Avatar"
                      />
                    ),
                  }}
                />
              </div> */}

            </SidebarBody>
          </Sidebar>
        </div>

        {/* OVERLAY (mobile only) */}
        {open && (
          <div
            className="fixed inset-0 bg-black/40 z-30 md:hidden top-16"
            onClick={() => setOpen(false)}
          />
        )}

        {/* MAIN CONTENT */}
        <div className="flex-1 overflow-hidden">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

type HistoryListType = {
  histories: HistoryItem[];
  onSelectHistory: (history: HistoryItem) => void;
};

const HistoryList = ({ histories, onSelectHistory }: HistoryListType) => {
  return (
    <>
      {histories.map((h) => (
        <div
          key={h._id}
          onClick={() => onSelectHistory(h)}
          className="p-3 rounded-xl border border-neutral-300 dark:border-neutral-700 
                     bg-gray-50 dark:bg-neutral-800 
                     hover:shadow-md hover:border-blue-400 
                     cursor-pointer transition-all duration-200"
        >
          <p className="text-sm font-semibold text-neutral-800 dark:text-neutral-200 truncate">
            💬 {h.title}
          </p>

          <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-1 truncate">
            🤖 {h.messages.length} messages
          </p>
        </div>
      ))}
    </>
  );
};

export const Logo = () => {
  return (
    <div className="flex items-center gap-2 py-3 px-3 border-b border-neutral-300 dark:border-neutral-700">
      <div className="h-5 w-6 rounded bg-black dark:bg-white" />
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="font-medium text-black dark:text-white"
      >
        History
      </motion.span>
    </div>
  );
};
