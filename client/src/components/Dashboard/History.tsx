import React from 'react'
type HistoryType = {
    histories: {
        Question: string;
        Answer: string;
    }[];
}
function HistoryList({histories}:HistoryType) {
  return (<>
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
        ))}</>
  )
}

export default HistoryList