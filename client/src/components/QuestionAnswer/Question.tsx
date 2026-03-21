
type QuestionProps = {
  question: string;
};
export default function Question({ question }: QuestionProps) {
  return (
    <div className="w-full flex justify-end my-2">
    { question && <div className="max-w-[70%] bg-blue-500 text-white px-4 py-2 rounded-2xl rounded-br-none shadow">
        {question}
      </div>}
    </div>
  );
}