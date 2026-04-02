import React, { useState } from "react";
import { useAuth } from "@/store/AuthContext";
import { useNavigate } from "react-router";

type HeaderProps = {
  onMenuClick?: () => void;
  open: string | boolean;
};

const Header: React.FC<HeaderProps> = ({ onMenuClick,open }) => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header className="bg-gray-900 text-white px-4 md:px-6 py-3 
                       flex justify-between items-center shadow-md 
                       sticky top-0 z-50 ">
      
      {/* LEFT */}
      <div className="flex items-center gap-3">
        
        {/* ☰ MOBILE MENU */}
        <button
          className="md:hidden text-2xl hover:text-blue-400 transition"
          onClick={onMenuClick}
        >
         {!open?<p>☰</p>:<p>X</p>}
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
      </nav>

      {/* RIGHT */}
      <div className="flex items-center gap-3 md:gap-4 relative">
        
        <div className="hidden md:block text-xs">
          {user?.username && <span>{user.username}</span>}
        </div>

        <button 
          onClick={() => setShowUserMenu(!showUserMenu)}
          className="w-8 h-8 bg-blue-600 rounded-full 
                        flex items-center justify-center text-sm font-semibold
                        hover:bg-blue-700 transition"
        >
          {user?.username?.charAt(0).toUpperCase() || "U"}
        </button>

        {/* USER DROPDOWN MENU */}
        {showUserMenu && (
          <div className="absolute top-12 right-0 bg-gray-800 rounded-lg shadow-lg py-2 w-40 z-50">
            <button
              onClick={handleLogout}
              className="w-full px-4 py-2 text-left text-sm hover:bg-gray-700 transition text-red-400"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;