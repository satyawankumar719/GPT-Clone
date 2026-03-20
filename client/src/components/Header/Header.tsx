import React from "react";

const Header: React.FC = () => {
  return (
    <header className="bg-gray-900 text-white px-6 py-3 flex justify-between items-center shadow-md sticky top-0 z-50 ">
      
      {/* Logo / Title */}
      <div className="flex items-center gap-2">
        <span className="text-2xl">🤖</span>
        <h1 className="text-lg font-semibold">
           AI Chatbot
        </h1>
      </div>

      {/* Navigation */}
      <nav className="hidden md:flex gap-6 text-sm">
        <a href="/" className="hover:text-blue-400">Home</a>
        <a href="/chat" className="hover:text-blue-400">Chat</a>
        <a href="/history" className="hover:text-blue-400">History</a>
      </nav>

      {/* Right Side */}
      <div className="flex items-center gap-4">
        
        {/* New Chat Button */}
        <button className="bg-blue-600 px-4 py-1 rounded hover:bg-blue-700 text-sm">
          New Chat
        </button>

        {/* User Avatar */}
        <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center text-sm">
          U
        </div>
      </div>
    </header>
  );
};

export default Header;