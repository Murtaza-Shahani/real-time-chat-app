import { useEffect, useRef, useState } from "react";
import type { User } from "../../types/users.type";
import type { Message } from "../../types/message";
type Props = {
  selectedUser: User;
  messages: Message[];
  sendMessage: (text: string) => void;
  currentUserId: number;
 isOnline: boolean;
 isTyping: boolean;
};

export default function MessageArea({ selectedUser, messages, sendMessage, currentUserId, isOnline, isTyping }: Props) {
  const [text, setText] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
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
    <div className="flex-1 flex flex-col h-full overflow-hidden">

      {/* Header */}
      <div className="h-16 bg-[#202C33] border-b border-[#222E35] flex items-center px-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center">
            {selectedUser.name.charAt(0)}
          </div>
          <div>
            <p className="font-semibold">{selectedUser.name}</p>
  <p
  className={`text-xs mb-5 ${
    isTyping
      ? "text-green-400"
      : isOnline
      ? "text-green-500"
      : "text-gray-400"
  }`}
>
  {isTyping
    ? "Typing..."
    : isOnline
    ? "Online"
    : "Offline"}
</p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-[#0B141A]">
        
        {messages.length > 0 ? (
        messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.senderId === currentUserId ? "justify-end" : "justify-start"}`}
          >
            <div className={`px-4 py-2 rounded-xl max-w-xs text-sm ${
              msg.senderId === currentUserId ? "bg-[#005C4B] text-white" : "bg-[#202C33] text-[#E9EDEF]"
            }`}>
              {msg.text}
              <div className="text-xs opacity-70 text-right mt-1 flex items-center justify-end gap-1">
                <span>
                  
                
                {new Date(msg.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: true })}
              </span>
              {
                msg.senderId=== currentUserId &&(
                  <span className={
                    `text-xs ${
                      msg.isRead? 'text-sky-400':"text-gray-300"
                    }`
                  }>
                    
                     {msg.isRead ? "✓✓" : "✓"}
                    
                  </span>
                )
              }
              </div>
            </div>
          </div>
        ))
      ) : (
          <div className="flex items-center justify-center h-full text-gray-500">
            No messages yet. Start the conversation!
          </div>


        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="h-20 bg-[#202C33] border-t border-[#222E35] flex items-center px-6 gap-3">
        <input
          value={text}
          onChange={(e) => {
  setText(e.target.value);

  window.dispatchEvent(
    new CustomEvent("typing", {
      detail: {
        receiverId: selectedUser.id,
      },
    })
  );

  if (typingTimeoutRef.current) {
    clearTimeout(typingTimeoutRef.current);
  }

  typingTimeoutRef.current = setTimeout(() => {
    window.dispatchEvent(
      new CustomEvent("stop_typing", {
        detail: {
          receiverId: selectedUser.id,
        },
      })
    );
  }, 1000);
}}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder="Type a message..."
          className="flex-1 bg-[#2A3942] text-white rounded-full px-5 py-3 text-sm focus:outline-none"
        />
        <button
          onClick={handleSend}
          className="bg-[#00A884] hover:bg-[#019874] text-white px-6 py-2.5 rounded-full transition font-medium"
        >
          Send
        </button>
      </div>

    </div>
  );
}