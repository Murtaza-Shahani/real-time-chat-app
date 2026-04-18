import { useEffect, useState } from "react";
import MessageArea from "./MessageArea";
import Sidebar from "./SideBar";

import type { User } from "../../types/users.type";
import type { Message } from "../../types/message";

import SocketService from "../../services/sockets";

// ✅ React Query
import { useQuery } from "@tanstack/react-query";
//import { getUsers} from "../../services/user.service";
import { getUsers} from "../../services/userServices";
export default function ChatPage() {
  //const currentUserId = 1; // ⚠️ TEMP (must match DB user)
  const storedUser = localStorage.getItem('user');
  const currentUser:User| null= storedUser? JSON.parse(storedUser): null;
  const currentUserId = currentUser ? currentUser.id : null;
  console.log("Current User ID:", currentUserId); // ✅ Debug log
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  // ✅ Dynamic messages (no hardcoding)
  const [messagesByUser, setMessagesByUser] = useState<
    Record<number, Message[]>
  >({});

  // ✅ Fetch users from backend
  const { data: users = [], isLoading, isError } = useQuery({
    queryKey: ["users"],
    queryFn: getUsers,
  });
  //remove current user from users list
  const filteredUsers = users.filter((u:User)=> u.id!== currentUserId);

  // ✅ Auto select first user
  useEffect(() => {
    if (filteredUsers.length > 0 && !selectedUser) {
      setSelectedUser(filteredUsers[0]);
    }
  },  [users, selectedUser]);

  const sendMessage = (text: string) => {
    if (!selectedUser) return; // ✅ prevent crash

    const newMessage: Message = {
      id: Date.now(),
      senderId: currentUserId,
      receiverId: selectedUser.id,
      text,
      createdAt: new Date().toISOString(),
    };

    // ✅ Update local state
    // setMessagesByUser((prev) => ({
    //   ...prev,
    //   [selectedUser.id]: [...(prev[selectedUser.id] || []), newMessage],
    // }));

    // ✅ Send via socket
    SocketService.sendMessage(newMessage);
  };

  // ✅ Socket connection
  useEffect(() => {
    if(!currentUserId)
      return;
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

  // ✅ Loading state
  if (isLoading) {
    return <div className="p-6">Loading users...</div>;
  }
  if (isError) {
  return <div className="p-6 text-red-500">Failed to load users</div>;
}
 if (!selectedUser && !isLoading) {
  return <div className="p-6">No users available</div>;
}
  return (
    <div className="h-screen w-full flex bg-[#f5f7fb] text-slate-800 overflow-hidden">
 
      <Sidebar
        users={filteredUsers} // ✅ FIXED (important)
        selectedUser={selectedUser}
        onSelectUser={setSelectedUser}
      />

      {selectedUser && (
        <MessageArea
          selectedUser={selectedUser}
          messages={messagesByUser[selectedUser.id] || []}
          sendMessage={sendMessage}
          currentUserId={currentUserId!}
        />
      )}
    </div>
  );
}