import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

const conversationsMock = [
  {
    id: "1",
    name: "John Doe",
    lastMessage: "Hey, how are you?",
    unread: 2,
    avatar: "https://i.pravatar.cc/150?u=john",
  },
  {
    id: "2",
    name: "Jane Smith",
    lastMessage: "Let's meet tomorrow",
    unread: 0,
    avatar: "https://i.pravatar.cc/150?u=jane",
  },
];

const Sidebar = ({ selectedConversation, setSelectedConversation }) => {
  const [search, setSearch] = useState("");

  const filteredConversations = conversationsMock.filter((conv) =>
    conv.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-4 flex flex-col h-full">
      <div className="mb-4">
        <Input
          placeholder="Search chats"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Button className="mt-2 w-full">New Chat</Button>
      </div>

      <div className="flex-1 overflow-y-auto space-y-2">
        {filteredConversations.map((conv) => (
          <Card
            key={conv.id}
            className={`p-2 cursor-pointer ${
              selectedConversation?.id === conv.id ? "bg-gray-100" : ""
            }`}
            onClick={() => setSelectedConversation(conv)}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Avatar>
                  <img src={conv.avatar} alt={conv.name} />
                </Avatar>
                <div>
                  <p className="font-medium">{conv.name}</p>
                  <p className="text-sm text-gray-500">{conv.lastMessage}</p>
                </div>
              </div>
              {conv.unread > 0 && <Badge>{conv.unread}</Badge>}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
