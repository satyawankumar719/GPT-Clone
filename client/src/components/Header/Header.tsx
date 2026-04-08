"use client";
import React, { useState, useRef, useEffect } from "react";
import { useAuth } from "@/store/AuthContext";
import { useNavigate } from "react-router";

type HeaderProps = {
  onMenuClick?: () => void;
  open: boolean;
};

const Header: React.FC<HeaderProps> = ({ onMenuClick, open }) => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header className="h-16 px-4 md:px-8 flex justify-between items-center 
                       bg-white/80 dark:bg-[#0b0b0b]/80 backdrop-blur-md 
                       border-b border-neutral-200 dark:border-neutral-800 
                       sticky top-0 z-[60]">
      
      {/* LEFT SECTION */}
      <div className="flex items-center gap-4">
        {/* MOBILE MENU TOGGLE */}
        <button
          className="md:hidden p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
          onClick={onMenuClick}
          aria-label="Toggle Menu"
        >
          {/* Animated Hamburger/X Icon */}
          <div className="w-5 h-5 flex flex-col justify-center items-center relative">
            <span className={`block w-5 h-0.5 bg-neutral-600 dark:bg-neutral-300 transition-all duration-300 ${open ? 'rotate-45 translate-y-0.5' : '-translate-y-1'}`} />
            <span className={`block w-5 h-0.5 bg-neutral-600 dark:bg-neutral-300 transition-all duration-300 ${open ? 'opacity-0' : 'opacity-100'}`} />
            <span className={`block w-5 h-0.5 bg-neutral-600 dark:bg-neutral-300 transition-all duration-300 ${open ? '-rotate-45 -translate-y-0.5' : 'translate-y-1'}`} />
          </div>
        </button>

        <div className="flex items-center gap-2 group cursor-pointer" onClick={() => navigate("/chat")}>
          <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center text-white shadow-lg shadow-emerald-500/20">
             <span className="text-lg">✨</span>
          </div>
          <h1 className="text-sm font-bold tracking-tight text-neutral-800 dark:text-neutral-100 hidden sm:block">
            NovaBot <span className="text-emerald-500">AI</span>
          </h1>
        </div>
      </div>

      {/* CENTER NAV (Hidden on mobile) */}
      <nav className="hidden md:flex items-center gap-1">
        {["Home", "Chat", "Pricing"].map((item) => (
          <button
            key={item}
            onClick={() => navigate(item === "Home" ? "/" : `/${item.toLowerCase()}`)}
            className="px-4 py-2 text-sm font-medium text-neutral-500 dark:text-neutral-400 
                       hover:text-black dark:hover:text-white hover:bg-neutral-100 
                       dark:hover:bg-neutral-800 rounded-lg transition-all"
          >
            {item}
          </button>
        ))}
      </nav>

      {/* RIGHT SECTION */}
      <div className="flex items-center gap-3 relative" ref={menuRef}>
        
        <div className="hidden lg:flex flex-col items-end mr-1">
          <span className="text-xs font-semibold text-neutral-800 dark:text-neutral-200">
            {user?.username || "Guest User"}
          </span>
          <span className="text-[10px] text-emerald-500 font-medium uppercase tracking-tighter">
            Premium Plan
          </span>
        </div>

        <button 
          onClick={() => setShowUserMenu(!showUserMenu)}
          className="relative w-9 h-9 rounded-full ring-2 ring-neutral-100 dark:ring-neutral-800 
                     hover:ring-emerald-500/50 transition-all overflow-hidden"
        >
          <div className="w-full h-full bg-gradient-to-tr from-emerald-500 to-teal-400 
                          flex items-center justify-center text-white text-sm font-bold">
            {user?.username?.charAt(0).toUpperCase() || "U"}
          </div>
        </button>

        {/* USER DROPDOWN */}
        {showUserMenu && (
          <div className="absolute top-12 right-0 w-48 bg-white dark:bg-neutral-900 
                          border border-neutral-200 dark:border-neutral-800 
                          rounded-xl shadow-xl py-2 animate-in fade-in zoom-in-95 duration-100">
            <div className="px-4 py-2 border-b border-neutral-100 dark:border-neutral-800 md:hidden">
                <p className="text-sm font-bold truncate">{user?.username}</p>
            </div>
            
            <button className="w-full px-4 py-2 text-left text-sm text-neutral-600 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition">
              Settings
            </button>
            <button
              onClick={handleLogout}
              className="w-full px-4 py-2 text-left text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition"
            >
              Sign out
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;