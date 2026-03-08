import { Message } from "@/types/message";
import { useEffect, useRef, useState } from "react";
import { User } from "./ChatPage";

type Props = {
  selectedUser: User;
  messages: Message[];
  sendMessage: (text: string) => void;
};

export default function MessageArea({ selectedUser, messages, sendMessage }: Props) {
  const [text, setText] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto scroll to bottom on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    if (!text.trim()) return;
    sendMessage(text);
    setText("");
  };

  return (
    <div className="flex-1 flex flex-col h-full">

      {/* Header */}
      <div className="h-16 bg-white border-b flex items-center px-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center">
            {selectedUser.name.charAt(0)}
          </div>
          <div>
            <p className="font-semibold">{selectedUser.name}</p>
            <p className="text-xs text-green-500">
              {selectedUser.online ? "Online" : "Offline"}
            </p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-[#f5f7fb]">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.senderId === 0 ? "justify-end" : "justify-start"}`}
          >
            <div className={`px-4 py-2 rounded-xl max-w-xs text-sm ${
              msg.senderId === 0 ? "bg-blue-600 text-white" : "bg-white border"
            }`}>
              {msg.text}
              <div className="text-xs opacity-70 text-right mt-1">
                {new Date(msg.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: true })}
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="h-20 bg-white border-t flex items-center px-6 gap-3">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder="Type a message..."
          className="flex-1 bg-slate-100 rounded-full px-5 py-3 text-sm focus:outline-none"
        />
        <button
          onClick={handleSend}
          className="bg-blue-600 text-white px-6 py-2.5 rounded-full hover:bg-blue-700 transition font-medium"
        >
          Send
        </button>
      </div>

    </div>
  );
}