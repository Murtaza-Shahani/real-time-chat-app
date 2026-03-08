import { Message } from "@/types/message";
import { useEffect, useState } from "react";
import MessageArea from "./MessageArea";
import Sidebar from "./SideBar";
//import SocketService from "@/services/socket";
import SocketService from '@/services/sockets';

export type User = {
  id: number;
  name: string;
  online: boolean;
};

export default function ChatPage() {
  const currentUserId = 0; // You
  const users: User[] = [
    { id: 1, name: "Alice Johnson", online: true },
    { id: 2, name: "Bob Smith", online: false },
    { id: 3, name: "Charlie Brown", online: true },
    { id: 4, name: "David Lee", online: true },
  ];

  const [selectedUser, setSelectedUser] = useState<User>(users[0]);
  const [messagesByUser, setMessagesByUser] = useState<Record<number, Message[]>>({
    1: [],
    2: [],
    3: [],
    4: [],
  });

  const sendMessage = (text: string) => {
    const newMessage: Message = {
      id: Date.now(),
      senderId: currentUserId,
      receiverId: selectedUser.id,
      text,
      createdAt: new Date().toISOString(),
    };

    // Update local state
    setMessagesByUser((prev) => ({
      ...prev,
      [selectedUser.id]: [...(prev[selectedUser.id] || []), newMessage],
    }));

    // Send via socket
    SocketService.sendMessage(newMessage);
  };

  // Connect socket
  useEffect(() => {
  SocketService.connect(currentUserId);

  SocketService.onMessage((msg) => {
    const otherUser =
      msg.senderId === currentUserId ? msg.receiverId : msg.senderId;

    setMessagesByUser((prev) => ({
      ...prev,
      [otherUser]: [...(prev[otherUser] || []), msg],
    }));
  });

  return () => {
    SocketService.disconnect();
  };
}, []);

  return (
    <div className="h-screen w-full flex bg-[#f5f7fb] text-slate-800 overflow-hidden">
      <Sidebar users={users} selectedUser={selectedUser} onSelectUser={setSelectedUser} />
      <MessageArea
        selectedUser={selectedUser}
        messages={messagesByUser[selectedUser.id] || []}
        sendMessage={sendMessage}
      />
    </div>
  );
}