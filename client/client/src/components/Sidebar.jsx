import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import API from "../api";

const Sidebar = ({
  conversations,
  selectedConversation,
  setSelectedConversation,
  userId,
  refreshConversations
}) => {
  const [search, setSearch] = useState("");
  const [showDialog, setShowDialog] = useState(false);

  // users for new chat
  const [users, setUsers] = useState([]);
  const [userSearch, setUserSearch] = useState("");

  // filter conversation list
  const filteredConversations = conversations.filter((conv) =>
    conv.name?.toLowerCase().includes(search.toLowerCase())
  );

  // load all users for new chat modal
  useEffect(() => {
    if (showDialog) {
      fetchUsers();
    }
  }, [showDialog]);

  const fetchUsers = async () => {
    try {
      const res = await API.get("/users");
      setUsers(res.data);
    } catch (err) {
      console.error("Failed to load users:", err);
    }
  };

  const handleStartChat = async (otherUserId) => {
    try {
      await API.post("/conversations/create", {
        userId,
        otherUserId,
      });

      setShowDialog(false);
      refreshConversations(); // reload convo list
    } catch (err) {
      console.error("Failed to create conversation:", err);
    }
  };

  // filter user search
  const filteredUsers = users.filter((u) =>
    u.displayName.toLowerCase().includes(userSearch.toLowerCase())
  );

  return (
    <div className="p-4 flex flex-col h-full">
      {/* Search Chats + New Chat Button */}
      <div className="mb-4">
        <Input
          placeholder="Search chats"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Button className="mt-2 w-full" onClick={() => setShowDialog(true)}>
          New Chat
        </Button>
      </div>

      {/* Conversation List */}
      <div className="flex-1 overflow-y-auto space-y-2">
        {filteredConversations.map((conv) => (
          <Card
            key={conv._id}
            className={`p-2 cursor-pointer ${
              selectedConversation?._id === conv._id ? "bg-gray-100" : ""
            }`}
            onClick={() => setSelectedConversation(conv)}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Avatar>
                  <img
                    src={
                      conv.lastMessage?.senderAvatar ||
                      "https://i.pravatar.cc/150"
                    }
                    alt={conv.name}
                  />
                </Avatar>
                <div>
                  <p className="font-medium">{conv.name || "No Name"}</p>
                  <p className="text-sm text-gray-500">
                    {conv.lastMessage?.text || ""}
                  </p>
                </div>
              </div>

              {/* Unread */}
              {conv.unreadCounts && conv.unreadCounts[userId] > 0 && (
                <Badge>{conv.unreadCounts[userId]}</Badge>
              )}
            </div>
          </Card>
        ))}
      </div>

      {/* New Chat Dialog */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Start New Chat</DialogTitle>
          </DialogHeader>

          <Input
            placeholder="Search users…"
            value={userSearch}
            onChange={(e) => setUserSearch(e.target.value)}
            className="mt-2"
          />

          <div className="mt-4 space-y-2 max-h-80 overflow-y-auto">
            {filteredUsers.map((u) => (
              <Card
                key={u._id}
                className="p-3 cursor-pointer hover:bg-gray-100"
                onClick={() => handleStartChat(u.clerkUserId)}
              >
                <div className="flex items-center space-x-3">
                  <Avatar>
                    <img
                      src={u.avatarUrl || "https://i.pravatar.cc/100"}
                      alt={u.displayName}
                    />
                  </Avatar>
                  <span className="font-medium">{u.displayName}</span>
                </div>
              </Card>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Sidebar;
