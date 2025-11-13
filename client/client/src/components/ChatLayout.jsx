import React, { useState } from "react";
import Sidebar from "./Sidebar";
import ChatWindow from "./ChatWindow";

const ChatLayout = () => {
  const [selectedConversation, setSelectedConversation] = useState(null);

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="w-1/3 border-r border-gray-200">
        <Sidebar
          selectedConversation={selectedConversation}
          setSelectedConversation={setSelectedConversation}
        />
      </div>

      {/* Chat Window */}
      <div className="w-2/3">
        <ChatWindow conversation={selectedConversation} />
      </div>
    </div>
  );
};

export default ChatLayout;
