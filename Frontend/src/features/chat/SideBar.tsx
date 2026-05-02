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
    <div className="w-80 bg-white border-r border-slate-200 flex flex-col h-full">

      <div className="px-6 py-5 border-b border-slate-200">
        <h1 className="text-xl font-semibold">Messages</h1>
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
          ? "bg-blue-50 border-r-4 border-blue-500"
          : "hover:bg-slate-100"
      }`}
    >
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center">
          {convo.name.charAt(0)}
        </div>

        <div>
          <p className={`font-medium ${convo.unreadCount > 0 ? "font-bold" : ""}`}>
            {convo.name}
          </p>

          <p className="text-xs text-slate-500 truncate max-w-[150px]">
            {convo.lastMessage}
          </p>
        </div>
      </div>

      {convo.unreadCount > 0 && (
        <div className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
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