//import { useUsers } from "../../hooks/useUsers";
import type { Message } from "../../types/message";
import type { User } from "../../types/users.type";
type Conversation={
  userId:number;
  name:string;
  lastMessage:string;
  lastMessageTime:string;
  unreadCount:number;
}

// type SidebarProps = {
//   users: User[];
//   selectedUser: User;
//   onSelectUser: (user: User) => void;
//   messagesByUser: Record<number, Message[]>;
// };
type SidebarProps = {
  conversations: Conversation[];
  selectedUser: User;
  onSelectUser: (user: User) => void;
};

export default function Sidebar({
  conversations,
  selectedUser,
  onSelectUser,
  
}: SidebarProps) {
    // const { data: users, isLoading, isError } = useUsers();


  // if (isLoading) return <div className="p-4">Loading users...</div>;
  // if (isError) return <div className="p-4 text-red-500">Error loading users</div>;


  return (
    <div className="w-80 bg-[#111B21] border-r border-[#222E35] flex flex-col h-full">

      <div className="px-6 py-5 border-b border-[#222E35] bg-[#202C33]">
        <h1 className="text-xl text-white font-semibold">Messages</h1>
      </div>

      <div className="flex-1 overflow-y-auto">
{conversations.map((convo) => {
  const isActive = selectedUser.id === convo.userId;

  return (
    <div
      key={convo.userId}
      onClick={() =>
        onSelectUser({
          id: convo.userId,
          name: convo.name,
          email: "",
        })
      }
      className={`flex items-center justify-between px-6 py-4 cursor-pointer
      ${
        isActive
  ? "bg-[#2A3942]"
  : "hover:bg-[#202C33]"
      }`}
    >
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-[#005C4B] text-white flex items-center justify-center">
          {convo.name.charAt(0)}
        </div>

        <div>
          <p className={`font-medium text-white ${convo.unreadCount > 0 ? "font-bold" : ""}`}>
            {convo.name}
          </p>

          <p className="text-xs text-white truncate max-w-[150px]">
            {convo.lastMessage}
          </p>
        </div>
      </div>

      {convo.unreadCount > 0 && (
        <div className="bg-[#25D366] text-white text-xs px-2 py-1 rounded-full">
          {convo.unreadCount}
        </div>
      )}
    </div>
  );
})}

      </div>
    </div>
  );
}