'use client';

import React, { useEffect } from "react";
import { io, Socket } from "socket.io-client";
import { useAuth } from "../../context/AuthContext";

interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  receiverId: string;
  message: string;
  timestamp: string;
  read: boolean;
}

interface RealTimeChatProps {
  purchaseId: string;
  propertyName: string;
}

const RealTimeChat: React.FC<RealTimeChatProps> = ({
  purchaseId,
  propertyName,
}) => {
  const { user } = useAuth();
  const [socket, setSocket] = React.useState<Socket | null>(null);
  const [messages, setMessages] = React.useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = React.useState("");
  const [isTyping, setIsTyping] = React.useState(false);
  const [typingUser, setTypingUser] = React.useState("");
  const messagesEndRef = React.useRef<HTMLDivElement>(null);

  // Initialize socket connection
  useEffect(() => {
    if (user) {
      // Connect to the socket server
      const socketInstance = io(
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000",
        {
          query: {
            userId: user.id,
            role: user.role,
            purchaseId,
          },
        },
      );

      setSocket(socketInstance);

      // Load previous messages
      socketInstance.emit(
        "join_chat",
        { purchaseId },
        (response: { messages: ChatMessage[] }) => {
          setMessages(response.messages || []);
          scrollToBottom();
        },
      );

      // Clean up on unmount
      return () => {
        socketInstance.disconnect();
      };
    }
  }, [user, purchaseId]);

  const scrollToBottom = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  // Listen for messages
  useEffect(() => {
    if (!socket) return;

    // Listen for new messages
    socket.on("new_message", (message: ChatMessage) => {
      setMessages((prev) => [...prev, message]);
      scrollToBottom();
    });

    // Listen for typing events
    socket.on("typing", ({ user: typingUserName }) => {
      setIsTyping(true);
      setTypingUser(typingUserName);

      // Clear typing indicator after 3 seconds
      setTimeout(() => {
        setIsTyping(false);
      }, 3000);
    });

    return () => {
      socket.off("new_message");
      socket.off("typing");
    };
  }, [socket]); // We don't need scrollToBottom as a dependency since it doesn't depend on props or state

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();

    if (!newMessage.trim() || !socket || !user) return;

    const messageData = {
      purchaseId,
      senderId: user.id,
      senderName: user.name,
      message: newMessage,
      timestamp: new Date().toISOString(),
    };

    socket.emit("send_message", messageData);
    setNewMessage("");
  };

  const handleTyping = () => {
    if (!socket || !user) return;

    socket.emit("typing", { purchaseId, user: user.name });
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div className="flex flex-col h-full bg-white shadow-lg rounded-lg">
      <div className="px-4 py-3 border-b border-gray-200">
        <h3 className="text-lg font-medium text-gray-900">
          Chat - {propertyName}
        </h3>
        <p className="text-sm text-gray-500">Purchase ID: {purchaseId}</p>
      </div>

      <div className="flex-1 p-4 overflow-y-auto">
        <div className="space-y-4">
          {messages.length > 0 ? (
            messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.senderId === user?.id ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                    msg.senderId === user?.id
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-900"
                  }`}
                >
                  {msg.senderId !== user?.id && (
                    <p className="text-xs font-medium mb-1">{msg.senderName}</p>
                  )}
                  <p>{msg.message}</p>
                  <p
                    className={`text-xs mt-1 ${msg.senderId === user?.id ? "text-blue-100" : "text-gray-500"}`}
                  >
                    {formatTimestamp(msg.timestamp)}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-6">
              <p className="text-gray-500">
                No messages yet. Start the conversation!
              </p>
            </div>
          )}

          {isTyping && (
            <div className="flex justify-start">
              <div className="max-w-xs lg:max-w-md px-4 py-2 rounded-lg bg-gray-100 text-gray-900">
                <p className="text-sm text-gray-500">
                  {typingUser} is typing...
                </p>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      <div className="px-4 py-3 border-t border-gray-200">
        <form onSubmit={handleSendMessage} className="flex">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={handleTyping}
            placeholder="Type a message..."
            className="flex-1 focus:ring-blue-500 focus:border-blue-500 block w-full rounded-md sm:text-sm border-gray-300"
          />
          <button
            type="submit"
            disabled={!newMessage.trim()}
            className="ml-3 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
};

export default RealTimeChat;
