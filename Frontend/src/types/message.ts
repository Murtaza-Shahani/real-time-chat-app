export type Message = {
  id: number;
  senderId: number;      // 0 = you, user.id = other
  receiverId: number;    // for backend later
  text: string;
  createdAt: string;     // ISO string
};