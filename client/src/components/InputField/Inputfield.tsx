import React, { useState, useRef, type KeyboardEvent } from "react";
import { Send } from "lucide-react";

type Inputfield = {
  onSend: (message: string) => void;
};

const ChatInput: React.FC<Inputfield> = ({ onSend }) => {
  const [message, setMessage] = useState<string>("");

  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const focusInput = () => {
    textareaRef.current?.focus();
  };

  const handleSend = () => {
    if (!message.trim()) return;
    onSend(message);
    setMessage("");
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="w-full fixed bottom-0 left-0 bg-white border-t">
      <div className="max-w-3xl mx-auto p-3">
        <div
          className="flex items-end gap-2 bg-gray-100 rounded-2xl px-3 py-2"
          onClick={focusInput} // ✅ click anywhere → focus
        >
          <textarea
            ref={textareaRef} // ✅ attach ref
            rows={1}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Message ChatGPT..."
            className="flex-1 bg-transparent resize-none outline-none text-sm max-h-40"
          />

          <button
            onClick={handleSend}
            className="p-2 rounded-full bg-black text-white hover:opacity-80 transition"
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatInput;