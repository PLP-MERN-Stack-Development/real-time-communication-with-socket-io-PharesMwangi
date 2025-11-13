import React, { useState, useEffect, useRef } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const ChatWindow = ({ conversation }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const scrollRef = useRef();

  useEffect(() => {
    // Scroll to bottom on new message
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [messages]);

  if (!conversation) {
    return (
      <div className="flex items-center justify-center h-full text-gray-400">
        Select a conversation
      </div>
    );
  }

  const handleSend = () => {
    if (!newMessage.trim()) return;
    setMessages((prev) => [
      ...prev,
      { id: Date.now(), text: newMessage, sender: "me" },
    ]);
    setNewMessage("");
  };

  return (
    <div className="flex flex-col h-full p-4">
      {/* Chat Header */}
      <div className="border-b border-gray-200 pb-2 mb-2">
        <h2 className="font-bold text-lg">{conversation.name}</h2>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 mb-2">
        <div ref={scrollRef} className="space-y-2">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`p-2 rounded-lg max-w-xs ${
                msg.sender === "me" ? "bg-blue-500 text-white self-end" : "bg-gray-200 self-start"
              }`}
            >
              {msg.text}
            </div>
          ))}
        </div>
      </ScrollArea>

      {/* Input */}
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
