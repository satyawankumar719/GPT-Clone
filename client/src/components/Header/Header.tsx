import React from "react";

type HeaderProps = {
  onMenuClick?: () => void;
};

const Header: React.FC<HeaderProps> = ({ onMenuClick }) => {
  return (
    <header className="bg-gray-900 text-white px-4 md:px-6 py-3 
                       flex justify-between items-center shadow-md 
                       sticky top-0 z-50">
      
      {/* LEFT */}
      <div className="flex items-center gap-3">
        
        {/* ☰ MOBILE MENU */}
        <button
          className="md:hidden text-2xl hover:text-blue-400 transition"
          onClick={onMenuClick}
        >
          ☰
        </button>

        <div className="flex items-center gap-2">
          <span className="text-2xl">🤖</span>
          <h1 className="text-lg font-semibold">
            AI Chatbot
          </h1>
        </div>
      </div>

      {/* NAV (DESKTOP) */}
      <nav className="hidden md:flex gap-6 text-sm">
        <a href="/" className="hover:text-blue-400 transition">Home</a>
        <a href="/chat" className="hover:text-blue-400 transition">Chat</a>
        <a href="/history" className="hover:text-blue-400 transition">History</a>
      </nav>

      {/* RIGHT */}
      <div className="flex items-center gap-3 md:gap-4">
        
        <button className="bg-blue-600 px-3 md:px-4 py-1 rounded 
                           hover:bg-blue-700 text-xs md:text-sm transition">
          New Chat
        </button>

        <div className="w-8 h-8 bg-gray-700 rounded-full 
                        flex items-center justify-center text-sm">
          U
        </div>
      </div>
    </header>
  );
};

export default Header;