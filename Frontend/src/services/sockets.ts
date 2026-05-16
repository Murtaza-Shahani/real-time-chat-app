//import { Message } from "@/types/message";
import { io, Socket } from "socket.io-client";
import { type Message} from  "../types/message";
const SOCKET_URL = import.meta.env.VITE_API_URL;
class SocketService {
  private socket: Socket | null = null;

  connect(userId: number) {
    this.socket = io(SOCKET_URL, {
      query: { userId },
    });

    this.socket.on("connect", () => {
      console.log("✅ Connected:", this.socket?.id);
    });

    this.socket.on("disconnect", () => {
      console.log("❌ Disconnected");
    });
  }

  disconnect() {
    this.socket?.disconnect();
    this.socket = null;
  }

  sendMessage(message: Message) {
    this.socket?.emit("send_message", message);
  }
   sendTyping(senderId: number, receiverId: number) {
  this.socket?.emit("typing", {
    senderId,
    receiverId,
  });
}

sendStopTyping(senderId: number, receiverId: number) {
  this.socket?.emit("stop_typing", {
    senderId,
    receiverId,
  });
}

  onMessage(callback: (msg: Message) => void) {
    this.socket?.on("receive_message", callback);
  }
  onTyping(callback: (data: any) => void) {
  this.socket?.on("user_typing", callback);
}

onStopTyping(callback: (data: any) => void) {
  this.socket?.on("user_stop_typing", callback);
}
  onOnlineUsers(callback: (userIds: number[]) => void) {
    this.socket?.on("online_users", callback);
  }

 
}

export default new SocketService();