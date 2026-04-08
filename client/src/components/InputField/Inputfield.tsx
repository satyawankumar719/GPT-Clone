import React, { useState, useRef, type KeyboardEvent } from "react";
import { Send } from "lucide-react";

type Inputfield = {
  onSend: (message: string) => void;
  disabled?: boolean;
};

const ChatInput: React.FC<Inputfield> = ({ onSend, disabled = false }) => {
  const [message, setMessage] = useState<string>("");

  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const focusInput = () => {
    textareaRef.current?.focus();
  };

  const handleSend = () => {
    if (!message.trim() || disabled) return;
    console.log('Handle send triggered with message:', message);
    onSend(message);
    setMessage("");
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey && !disabled) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="w-full border border-none rounded-2xl bg-white dark:bg-neutral-900/50 backdrop-blur-md shadow-lg shadow-neutral-900/10">
      <div className="max-w-3xl mx-auto p-3">
        <div
          className={`flex items-end gap-2 bg-gray-100 dark:bg-neutral-800 rounded-2xl px-3 py-2 ${
            disabled ? "opacity-50 cursor-not-allowed" : ""
          }`}
          onClick={focusInput}
        >
          <textarea
            ref={textareaRef}
            rows={1}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={disabled}
            placeholder="Message NovaBot..."
            className="flex-1 bg-transparent dark:text-white resize-none outline-none text-sm max-h-40 disabled:opacity-50"
          />

          <button
            onClick={handleSend}
            disabled={disabled}
            className="p-2 rounded-full bg-black dark:bg-white text-white dark:text-black hover:opacity-80 transition disabled:opacity-50 cursor-auto"
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatInput;