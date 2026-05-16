import { useEffect, useState } from "react";
import MessageArea from "./MessageArea";
import Sidebar from "./SideBar";

import type { User } from "../../types/users.type";
import type { Message } from "../../types/message";

import SocketService from "../../services/sockets";
import { getConversations, getMessages } from "../../services/messageService";
import { markMessagesAsRead } from "../../services/messageService";
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
//online users
const [onlineUsers, setOnlineUsers] = useState<number[]>([])
  const [messagesByUser, setMessagesByUser] = useState<
    Record<number, Message[]>
  >({});

  //typig state 
  const [typingUsers, setTypingUsers] = useState<Record<number, boolean>>({});

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

  

  // ✅ Fetch messages
  const {
    data: messagesData,
    refetch,
  } = useQuery({
    queryKey: ["messages", selectedUser?.id],
    queryFn: () =>
      getMessages( selectedUser!.id),
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
 

  //fetch all msgs 
  const {data:conversationsData=[], refetch:refetchConversations} = useQuery({
    queryKey:["conversations"],
    queryFn:getConversations,
    enabled:!!currentUserId
  })

    //merge users
  const conversations = conversationsData ?? [];

// users with NO conversation
const usersWithoutConversation = filteredUsers.filter(
  (user: User) =>
    !conversations.some((c) => c.userId === user.id)
);

// merge both
const mergedList = [
  ...conversations,
  ...usersWithoutConversation.map((user: User) => ({
    userId: user.id,
    name: user.name,
    lastMessage: "",
    lastMessageTime: "",
    unreadCount: 0,
  })),
];
//sort
mergedList.sort((a, b) => {
  if (!a.lastMessageTime) return 1;
  if (!b.lastMessageTime) return -1;
  return (
    new Date(b.lastMessageTime).getTime() -
    new Date(a.lastMessageTime).getTime()
  );
});
// ✅ Auto select first user
  useEffect(() => {
  if (mergedList.length > 0 && !selectedUser) {
    setSelectedUser({
      id: mergedList[0].userId,
      name: mergedList[0].name,
      email: "",
    });
  }
}, [mergedList, selectedUser]);

  useEffect(() => {
  if (conversationsData.length > 0 && !selectedUser) {
    setSelectedUser({
      id: conversationsData[0].userId,
      name: conversationsData[0].name,
      email: "",
    });
  }
}, [conversationsData, selectedUser]);
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
      // Refetch conversations to update last message & unread count
      refetchConversations();
    });
    SocketService.onOnlineUsers((users)=>{
      setOnlineUsers(users)
    })
// When a user starts typing, we can set their typing status to true
SocketService.onTyping(({ senderId }) => {
  setTypingUsers((prev) => ({
    ...prev,
    [senderId]: true,
  }));
});
// When a user stops typing, we can set their typing status to false
SocketService.onStopTyping(({ senderId }) => {
  setTypingUsers((prev) => ({
    ...prev,
    [senderId]: false,
  }));
});
 const handleTyping = (e: any) => {
  SocketService.sendTyping(
    currentUserId!,
    e.detail.receiverId
  );
};

const handleStopTyping = (e: any) => {
  SocketService.sendStopTyping(
    currentUserId!,
    e.detail.receiverId
  );
};

window.addEventListener("typing", handleTyping);
window.addEventListener("stop_typing", handleStopTyping);
    return () => {
      window.removeEventListener("typing", handleTyping);
  window.removeEventListener("stop_typing", handleStopTyping);
      SocketService.disconnect();
    };
  }, [currentUserId]); // ✅ FIXED

useEffect(() => {
  if (!selectedUser) return;

  // ✅ mark messages as read in backend
  markMessagesAsRead(selectedUser.id);

  // ✅ refresh sidebar (removes red badge)
  refetchConversations();
}, [selectedUser]);

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
  return <div className="p-6">Select a conversation</div>;
}

//   if (conversationsData.length === 0) {
//   return <div className="p-6">No conversations yet</div>;
// }

  return (
    <div className="h-[calc(100vh-4rem)] w-full flex bg-[#0B141A] text-slate-800 overflow-hidden">
      <Sidebar
  conversations={mergedList}
  selectedUser={selectedUser}
  onSelectUser={setSelectedUser}
  onlineUsers={onlineUsers}
  typingUsers={typingUsers}
/>

      <MessageArea
        selectedUser={selectedUser}
        messages={messagesByUser[selectedUser.id] || []}
        sendMessage={sendMessage}
        currentUserId={currentUserId!}
         isOnline={onlineUsers.includes(selectedUser.id)}
         isTyping={typingUsers[selectedUser.id]}
      />
    </div>
  );
}