//import { useUsers } from "../../hooks/useUsers";
import type { User } from "../../types/users.type";

type SidebarProps = {
  users: User[];
  selectedUser: User;
  onSelectUser: (user: User) => void;
};

export default function Sidebar({
  users,
  selectedUser,
  onSelectUser,
}: SidebarProps) {
    // const { data: users, isLoading, isError } = useUsers();


  // if (isLoading) return <div className="p-4">Loading users...</div>;
  // if (isError) return <div className="p-4 text-red-500">Error loading users</div>;


  return (
    <div className="w-80 bg-white border-r border-slate-200 flex flex-col">

      <div className="px-6 py-5 border-b border-slate-200">
        <h1 className="text-xl font-semibold">Messages</h1>
      </div>

      <div className="flex-1 overflow-y-auto">

        {users.map((user) => (
          <div
            key={user.id}
            onClick={() => onSelectUser(user)}
            className={`flex items-center gap-3 px-6 py-4 cursor-pointer
            ${
              selectedUser.id === user.id
                ? "bg-blue-50 border-r-4 border-blue-500"
                : "hover:bg-slate-100"
            }`}
          >
            <div className="w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center">
              {user.name.charAt(0)}
            </div>

            <div>
              <p className="font-medium">{user.name}</p>
              <p className="text-xs text-slate-500">
                {user.online ? "Online" : "Offline"}
              </p>
            </div>

          </div>
        ))}

      </div>
    </div>
  );
}