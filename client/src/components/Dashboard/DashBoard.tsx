"use client";
import React, { useState } from "react";
import { Sidebar, SidebarBody, SidebarLink } from "@/components/ui/sidebar";
import { Outlet } from "react-router";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";

export default function DashBoard() {

  type HistoryItem = {
    Question: string;
    Answer: string;
  };

  const [histories, setHistories] = useState<HistoryItem[]>([
    { Question: "What is React?", Answer: "React is a JavaScript library" },
    { Question: "Explain Gemini API", Answer: "It is an AI model by Google" },
    { Question: "What is useEffect?", Answer: "It is a React Hook" },
    { Question: "Explain props", Answer: "Props pass data between components" },
    { Question: "What is state?", Answer: "State stores dynamic data" },
    { Question: "Explain hooks", Answer: "Hooks manage state and lifecycle" },
    { Question: "What is JSX?", Answer: "JSX is syntax extension for React" },
    { Question: "Explain API", Answer: "API connects frontend and backend" },
    { Question: "What is Node.js?", Answer: "Backend JavaScript runtime" },
    { Question: "Explain Express", Answer: "Framework for Node.js" },
  ]);

  return (
    <div className="flex w-full h-full overflow-hidden bg-gray-100 dark:bg-neutral-800">
      
      <Sidebar open={true}>
        <SidebarBody className="h-full flex flex-col border-r border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900">
          
          <div className="sticky top-0 z-10 bg-white dark:bg-neutral-900 shadow-sm">
            <Logo />
          </div>

          <div className="flex-1 overflow-y-auto px-2">
            <div className="mt-4 flex flex-col gap-3">
              <HistoryList histories={histories} />
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

      <div className="flex-1 h-full overflow-auto p-6">
        <Outlet />
      </div>
    </div>
  );
}


type HistoryType = {
  histories: {
    Question: string;
    Answer: string;
  }[];
};

const HistoryList = ({ histories }: HistoryType) => {
  return (
    <>
      {histories.map((h, idx) => (
        <div
          key={idx}
          className="p-3 rounded-xl border border-neutral-300 dark:border-neutral-700 
                     bg-gray-50 dark:bg-neutral-800 
                     hover:shadow-md hover:border-blue-400 
                     cursor-pointer transition-all duration-200"
        >
          <p className="text-sm font-semibold text-neutral-800 dark:text-neutral-200 truncate">
            💬 {h.Question}
          </p>

          <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-1 truncate">
            🤖 {h.Answer}
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