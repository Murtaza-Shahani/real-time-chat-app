import { useEffect, useState } from "react";
import MessageArea from "./MessageArea";
import Sidebar from "./SideBar";

import type { User } from "../../types/users.type";
import type { Message } from "../../types/message";

import SocketService from "../../services/sockets";
import { getMessages } from "../../services/messageService";

import { useQuery } from "@tanstack/react-query";
import { getUsers } from "../../services/userServices";

export default function ChatPage() {
  // ✅ Get logged-in user
  const storedUser = localStorage.getItem("user");
  const currentUser: User | null = storedUser
    ? JSON.parse(storedUser)
    : null;

  const currentUserId = currentUser?.id;

  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const [messagesByUser, setMessagesByUser] = useState<
    Record<number, Message[]>
  >({});

  // ✅ Fetch users
  const {
    data: usersData,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["users"],
    queryFn: getUsers,
  });

  const users = usersData || [];

  // ✅ Remove current user
  const filteredUsers = users.filter(
    (u: User) => u.id !== currentUserId
  );

  // ✅ Auto select first user
  useEffect(() => {
    if (filteredUsers.length > 0 && !selectedUser) {
      setSelectedUser(filteredUsers[0]);
    }
  }, [filteredUsers, selectedUser]); // ✅ FIXED

  // ✅ Fetch messages
  const {
    data: messagesData,
    refetch,
  } = useQuery({
    queryKey: ["messages", selectedUser?.id],
    queryFn: () =>
      getMessages(currentUserId!, selectedUser!.id),
    enabled: !!selectedUser && !!currentUserId,
  });

  const messages = messagesData || [];

  // ✅ Sync API messages → state
  useEffect(() => {
    if (selectedUser) {
      setMessagesByUser((prev) => ({
        ...prev,
        [selectedUser.id]: messages, // ✅ always set (even empty)
      }));
    }
  }, [messages, selectedUser]);

  // ✅ Refetch when switching user
  useEffect(() => {
    if (selectedUser) {
      refetch();
    }
  }, [selectedUser]);

  // ✅ Send message
  const sendMessage = (text: string) => {
    if (!selectedUser || !currentUserId) return;

    const newMessage: Message = {
      id: Date.now(),
      senderId: currentUserId,
      receiverId: selectedUser.id,
      text,
      createdAt: new Date().toISOString(),
    };

    SocketService.sendMessage(newMessage);
  };

  // ✅ Socket connection
  useEffect(() => {
    if (!currentUserId) return;

    SocketService.connect(currentUserId);

    SocketService.onMessage((msg) => {
      const otherUser =
        msg.senderId === currentUserId
          ? msg.receiverId
          : msg.senderId;

      setMessagesByUser((prev) => ({
        ...prev,
        [otherUser]: [...(prev[otherUser] || []), msg],
      }));
    });

    return () => {
      SocketService.disconnect();
    };
  }, [currentUserId]); // ✅ FIXED

  // ✅ UI states
  if (isLoading) {
    return <div className="p-6">Loading users...</div>;
  }

  if (isError) {
    return (
      <div className="p-6 text-red-500">
        Failed to load users
      </div>
    );
  }

  if (!selectedUser) {
    return <div className="p-6">No users available</div>;
  }

  return (
    <div className="h-screen w-full flex bg-[#f5f7fb] text-slate-800 overflow-hidden">
      <Sidebar
        users={filteredUsers}
        selectedUser={selectedUser}
        onSelectUser={setSelectedUser}
      />

      <MessageArea
        selectedUser={selectedUser}
        messages={messagesByUser[selectedUser.id] || []}
        sendMessage={sendMessage}
        currentUserId={currentUserId!}
      />
    </div>
  );
}