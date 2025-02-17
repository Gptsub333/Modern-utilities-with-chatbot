import React, { useState, useEffect } from "react";
import { io } from "socket.io-client";

const API_URL = import.meta.env.VITE_NGROK_URL || "http://localhost:5000"; 

export default function Chatbot() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    console.log("🌐 Connecting to WebSocket at:", API_URL);

    const newSocket = io(API_URL, {
      transports: ["websocket", "polling"], // Allow WebSocket fallback
      withCredentials: true,
      path: "/socket.io/",
    });

    newSocket.on("connect", () => console.log("✅ Connected to WebSocket"));
    newSocket.on("connect_error", (err) => console.error("❌ WebSocket Error:", err));
    newSocket.on("receiveMessage", (data) => setMessages((prev) => [...prev, data]));

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, []);

  const sendMessage = (message) => {
    if (message.trim() && socket) {
      const newMessage = { sender: "customer", message };
      setMessages((prev) => [...prev, newMessage]);

      socket.emit("sendMessage", { customerId: socket.id, message });

      setInput("");
    }
  };

  return (
    <div className="fixed bottom-4 right-4 bg-white shadow-lg rounded-lg w-96 p-4">
      <div className="h-72 overflow-y-auto border-b">
        {messages.map((msg, index) => (
          <div key={index} className={`p-2 ${msg.sender === "customer" ? "text-right" : "text-left"}`}>
            <span className={`px-3 py-1 rounded-lg ${msg.sender === "customer" ? "bg-blue-500 text-white" : "bg-gray-200"}`}>
              {msg.message}
            </span>
          </div>
        ))}
      </div>

      <div className="mt-3 grid grid-cols-2 gap-2">
        {["What are your business hours?", "Do you offer discounts?", "What services do you offer?"].map((question, index) => (
          <button key={index} onClick={() => sendMessage(question)} className="text-sm bg-gray-200 hover:bg-gray-300 rounded-lg px-3 py-2">
            {question}
          </button>
        ))}
      </div>

      <div className="mt-3 flex">
        <input type="text" value={input} onChange={(e) => setInput(e.target.value)} placeholder="Type a message..." className="flex-1 p-2 border rounded-l-lg" />
        <button onClick={() => sendMessage(input)} className="bg-blue-500 text-white px-4 py-2 rounded-r-lg">Send</button>
      </div>
    </div>
  );
}
