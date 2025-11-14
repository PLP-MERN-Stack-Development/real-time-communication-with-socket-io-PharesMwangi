import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import ChatWindow from "./ChatWindow";
import API from "../api";

const ChatLayout = ({ currentUserId }) => {
  const userId = currentUserId; // Clerk user ID passed from Dashboard

  const [selectedConversation, setSelectedConversation] = useState(null);
  const [conversations, setConversations] = useState([]);

  // Load conversations
  const fetchConversations = async () => {
    if (!userId) return;

    try {
      const res = await API.get(`/conversations/user/${userId}`);
      setConversations(res.data);
    } catch (err) {
      console.error("Failed to fetch conversations:", err);
    }
  };

  useEffect(() => {
    fetchConversations();
  }, [userId]);

  return (
    <div className="flex h-screen bg-white">
      
      {/* SIDEBAR */}
      <div className="w-1/3 border-r border-gray-200">
        <Sidebar
          conversations={conversations}
          selectedConversation={selectedConversation}
          setSelectedConversation={setSelectedConversation}
          userId={userId}
          refreshConversations={fetchConversations}
        />
      </div>

      {/* CHAT WINDOW */}
      <div className="w-2/3">
        <ChatWindow 
          conversation={selectedConversation} 
          userId={userId} 
        />
      </div>

    </div>
  );
};

export default ChatLayout;
