"use client";
import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Outlet } from "react-router";
import { useHistory, type HistoryItem } from "@/store/HistoryContext";
import Header from "@/components/Header/Header";
import apiClient from "@/api/apiClient";
import { API_CONFIG } from "@/api/apiConfig";

export default function DashBoard() {
  const { histories, setSelectedHistory, selectedHistory, addHistory, loadingHistories } = useHistory();
  const [open, setOpen] = useState<boolean>(false);
  const [creatingChat, setCreatingChat] = useState(false);

  const handleNewChat = async () => {
    try {
      setCreatingChat(true);
      const response = await apiClient.post(API_CONFIG.ENDPOINTS.CONVERSATION.CREATE, { title: 'New Chat' });
      if (response.data.chat) {
        addHistory(response.data.chat);
        setSelectedHistory(response.data.chat); // Auto-select new chat
      }
    } catch (error) {
      console.error('Failed to create chat:', error);
    } finally {
      setCreatingChat(false);
    }
  };

  const sidebarContent = (
    <>
     
 <Logo />
      {/* Action Button Container */}
      <div className="p-4">
        <button
          onClick={handleNewChat}
          disabled={creatingChat}
          className="group relative w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl 
                             bg-neutral-900 dark:bg-white text-white dark:text-black font-medium 
                             hover:opacity-90 transition-all active:scale-[0.98] disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed shadow-md shadow-neutral-900/20"
        >
          <span className="text-lg">{creatingChat ? '...' : '+'}</span>
          <span>New Chat</span>
        </button>
      </div>

      {/* Scrollable History List */}
      <div className="flex-1 overflow-y-auto px-3 pb-4 custom-scrollbar">
        <div className="space-y-1">
          <p className="px-2 pb-2 text-[11px] font-bold uppercase tracking-wider text-neutral-400">Recent Chats</p>
          {loadingHistories ? (
            <div className="flex flex-col gap-2 p-2">
              {[1, 2, 3].map(i => <div key={i} className="h-10 w-full bg-neutral-200 dark:bg-neutral-800 animate-pulse rounded-lg" />)}
            </div>
          ) : (
            <HistoryList
              histories={histories}
              selectedId={selectedHistory?._id}
              onSelectHistory={(h: HistoryItem | null) => {
                setSelectedHistory(h);
                setOpen(false);
              }}
            />
          )}
        </div>
      </div>
    </>
  );

  return (
    <div className="flex flex-col w-full h-screen overflow-hidden bg-white dark:bg-[#0b0b0b]">
      
      {/* HEADER - Sticky and Blurred */}
      <div className="shrink-0 z-50 backdrop-blur-md bg-white/80 dark:bg-neutral-900/80 border-b dark:border-neutral-800">
        <Header onMenuClick={() => setOpen(!open)} open={open} />
      </div>

      <div className="flex flex-1 overflow-hidden relative">
        {/* DESKTOP SIDEBAR */}
        <aside className="hidden md:block mt-2 fixed top-0 left-0 bottom-0 w-72 z-40">
          <div className="h-full flex flex-col border-r border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-[#0d0d0d] overflow-hidden">
            {sidebarContent}
          </div>
        </aside>

        {/* MOBILE SIDEBAR OVERLAY */}
        <AnimatePresence>
          {open && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[90] md:hidden"
                onClick={() => setOpen(false)}
              />
              <motion.aside
                initial={{ x: "-100%", opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: "-100%", opacity: 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="fixed left-0 top-0 bottom-0 w-[min(90vw,320px)] z-[100] bg-white dark:bg-neutral-900 shadow-2xl p-6 overflow-y-auto md:hidden"
              >
                <div className="flex justify-end mb-6">
                  <button
                    className="p-2 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 transition"
                    onClick={() => setOpen(false)}
                    aria-label="Close menu"
                  >
                    <span className="text-xl font-bold text-neutral-900 dark:text-neutral-100">×</span>
                  </button>
                </div>
                {sidebarContent}
              </motion.aside>
            </>
          )}
        </AnimatePresence>

        {/* MAIN CONTENT AREA */}
        <main className="flex-1 overflow-hidden relative md:ml-72">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

const HistoryList = ({ histories, onSelectHistory, selectedId }: any) => {
  return (
    <>
      {histories.map((h: HistoryItem) => {
      const isActive: boolean = selectedId === h._id;
      return (
        <div
        key={h._id}
        onClick={() => onSelectHistory(h || null)}
        className={`group flex flex-col px-3 py-2.5 rounded-lg cursor-pointer transition-all duration-200
               ${isActive 
               ? "bg-white dark:bg-neutral-800 shadow-sm ring-1 ring-neutral-200 dark:ring-neutral-700" 
               : "hover:bg-neutral-200/50 dark:hover:bg-neutral-800/50"}`}
        >
        <div className="flex items-center gap-2">
          <span className={`text-sm ${isActive ? "text-emerald-500" : "text-neutral-400"}`}>●</span>
          <p className={`text-sm truncate flex-1 ${isActive ? "font-semibold text-black dark:text-white" : "text-neutral-600 dark:text-neutral-400"}`}>
          {h.title}
          </p>
        </div>
        <p className="text-[11px] text-neutral-500 ml-5">
          {h.messages.length} messages
        </p>
        </div>
      );
      })}
    </>
  );
};

export const Logo = () => (
  <div className="flex items-center gap-3 py-3 px-0">
    <div className="h-8 w-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white font-bold shadow-lg shadow-emerald-500/20">
      G
    </div>
    <span className="font-bold text-lg tracking-tight text-neutral-800 dark:text-white">
      NovaBot <span className="text-emerald-500 text-xs px-1.5 py-0.5 rounded-full bg-emerald-500/10 ml-1">Pro</span>
    </span>
  </div>
);