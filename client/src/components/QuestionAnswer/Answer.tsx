

type AnswerProps = {
  answer: string;
};

export default function Answer({ answer }: AnswerProps) {
  const isError = answer?.startsWith('Error:');
  
  return (
    <div className="w-full flex justify-start my-3">
      <div className="flex items-start gap-2 max-w-[80%]">
        
        {/* Avatar */}
        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold ${
          isError ? 'bg-red-500' : 'bg-green-500'
        }`}>
          {isError ? '⚠️' : 'AI'}
        </div>

        {/* Message Bubble */}
        <div className={`px-4 py-2 rounded-2xl rounded-bl-none shadow whitespace-pre-wrap text-sm leading-relaxed ${
          isError 
            ? 'bg-red-50 text-red-700 border border-red-200' 
            : 'bg-gray-200 text-gray-900'
        }`}>
          {answer}
        </div>

      </div>
    </div>
  );
}