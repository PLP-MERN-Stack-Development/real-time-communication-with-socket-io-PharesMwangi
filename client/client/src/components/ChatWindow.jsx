import React, { useState, useEffect, useRef } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import API from "../api";

const ChatWindow = ({ conversation, userId }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const scrollRef = useRef();

  // Fetch messages when conversation changes
  useEffect(() => {
    if (!conversation) return;
    const fetchMessages = async () => {
      try {
        const res = await API.get(`/messages/${conversation._id}`);
        setMessages(res.data);
      } catch (err) {
        console.error("Failed to fetch messages:", err);
      }
    };
    fetchMessages();
  }, [conversation]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [messages]);

  if (!conversation) {
    return (
      <div className="flex items-center justify-center h-full text-gray-400">
        Select a conversation
      </div>
    );
  }

  const handleSend = async () => {
    if (!newMessage.trim()) return;

    try {
      const res = await API.post("/messages", {
        conversationId: conversation._id,
        senderId: userId,
        senderName: "You",
        senderAvatar: "https://i.pravatar.cc/150?u=you",
        text: newMessage,
      });

      setMessages((prev) => [...prev, res.data]);
      setNewMessage("");
    } catch (err) {
      console.error("Failed to send message:", err);
    }
  };

  return (
    <div className="flex flex-col h-full p-4">
      <div className="border-b border-gray-200 pb-2 mb-2">
        <h2 className="font-bold text-lg">{conversation.name}</h2>
      </div>

      <ScrollArea className="flex-1 mb-2">
        <div ref={scrollRef} className="space-y-2">
          {messages.map((msg) => (
            <div
              key={msg._id}
              className={`p-2 rounded-lg max-w-xs ${
                msg.senderId === userId ? "bg-blue-500 text-white self-end" : "bg-gray-200 self-start"
              }`}
            >
              {msg.text}
            </div>
          ))}
        </div>
      </ScrollArea>

      <div className="flex space-x-2">
        <Input
          placeholder="Type a message"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
        />
        <Button onClick={handleSend}>Send</Button>
      </div>
    </div>
  );
};

export default ChatWindow;
