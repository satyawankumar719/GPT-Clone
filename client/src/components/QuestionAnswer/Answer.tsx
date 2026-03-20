import React from "react";
type AnswerProps = {
  answer: string;
};
export default function Answer({answer}: AnswerProps) {
  return (
    <div className="w-full flex justify-start my-3">
      <div className="flex items-end gap-2 max-w-[80%]">
        
        {/* Avatar */}
        <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-white text-sm">
          AI
        </div>

        {/* Message Bubble */}
        <div className="bg-gray-200 text-gray-900 px-4 py-2 rounded-2xl rounded-bl-none shadow">
          {answer}
        </div>

      </div>
    </div>
  );
}