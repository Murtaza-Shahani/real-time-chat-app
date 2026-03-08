import { Message } from "@/types/message";
import { io, Socket } from "socket.io-client";

class SocketService {
  private socket: Socket | null = null;

  connect(userId: number) {
    this.socket = io("http://localhost:3000", {
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

  onMessage(callback: (msg: Message) => void) {
    this.socket?.on("receive_message", callback);
  }
}

export default new SocketService();