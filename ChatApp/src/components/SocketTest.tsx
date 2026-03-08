import { useEffect } from "react";
import { io } from "socket.io-client";

export default function SocketTest() {
  useEffect(() => {
    const socket = io("https://socket-io-chat.now.sh"); // public test server

    socket.on("connect", () => {
      console.log("✅ Connected! Socket ID:", socket.id);
    });

    socket.on("message", (msg: any) => {
      console.log("📨 Received:", msg);
    });

    // send a test message after connecting
    socket.emit("message", { text: "Hello from frontend test!" });

    // cleanup on unmount
    return () => {
      socket.disconnect();
      console.log("Disconnected socket");
    };
  }, []);

  return (
    <div className="p-6 text-center">
      <h2 className="text-lg font-semibold">Socket.IO Test Component</h2>
      <p>Open console to see messages</p>
    </div>
  );
}