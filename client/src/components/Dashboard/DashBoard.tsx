"use client";
import  { useState } from "react";
import { Sidebar, SidebarBody, SidebarLink } from "@/components/ui/sidebar";
import { Outlet } from "react-router";
import { motion } from "motion/react";
import { useHistory, type HistoryItem } from "@/store/HistoryContext";
import Header from "@/components/Header/Header";

export default function DashBoard() {
  const { histories, setSelectedHistory } = useHistory();
  const [open, setOpen] = useState(false); // 👈 mobile control

  return (
    <div className="flex w-full h-screen overflow-hidden bg-gray-100 dark:bg-neutral-800">
      
      {/* HEADER */}
      <div className="fixed top-0 left-0 w-full z-50 h-16">
        <Header onMenuClick={() => setOpen(!open)} />
      </div>

      {/* SIDEBAR */}
      <div
        className={`fixed md:static top-16 left-0 z-40 h-[calc(100%-4rem)] 
        ${open ? "translate-x-0" : "-translate-x-full"} 
        md:translate-x-0 transition-transform duration-300`}
      >
        <Sidebar open={true}>
          <SidebarBody className="h-full w-64 flex flex-col border-r border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900">
            
            <Logo />

            <div className="flex-1 overflow-y-auto px-2">
              <div className="mt-4 flex flex-col gap-3">
                <HistoryList
                  histories={histories}
                  onSelectHistory={(h) => {
                    setSelectedHistory(h);
                    setOpen(false); // 👈 close on mobile click
                  }}
                />
              </div>
            </div>

            <div className="p-2 border-t border-neutral-300 dark:border-neutral-700">
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
            </div>

          </SidebarBody>
        </Sidebar>
      </div>

      {/* OVERLAY (mobile only) */}
      {open && (
        <div
          className="fixed inset-0 bg-black/40 z-30 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* MAIN CONTENT */}
      <div className="flex-1 mt-16 overflow-auto p-4 md:p-6">
        <Outlet />
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
          key={h.id}
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
            🤖 {h.chats.length} chats
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
