'use client';

import React, { useEffect, useRef } from 'react';
import { useParams } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useChat } from '@/hooks/useChat';
import ChatMessage from '@/components/ChatMessage';
import ChatInput from '@/components/ChatInput';
import UserList from '@/components/UserList';

const ChatRoomPage: React.FC = () => {
  const { roomId } = useParams();
  const { user, loading } = useAuth();
  const { messages, sendMessage, users, error, isLoading } = useChat(roomId as string);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  if (!user) {
    return <div className="flex justify-center items-center h-screen">Please log in to access the chat room.</div>;
  }

  if (error) {
    return <div className="flex justify-center items-center h-screen">Error: {error}</div>;
  }

  const handleSendMessage = async (content: string) => {
    if (content.trim()) {
      try {
        await sendMessage(content);
      } catch (err) {
        console.error('Failed to send message:', err);
        // You might want to show an error notification to the user here
      }
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <div className="flex-grow flex flex-col max-w-4xl mx-auto bg-white shadow-xl">
        <header className="bg-blue-500 text-white p-4">
          <h1 className="text-2xl font-bold">Chat Room: {roomId}</h1>
        </header>
        <div className="flex-grow flex overflow-hidden">
          <div className="flex-grow flex flex-col overflow-hidden">
            <div className="flex-grow overflow-y-auto p-4">
              {messages.map((message) => (
                <ChatMessage key={message.id} message={message} isOwnMessage={message.userId === user.uid} />
              ))}
              <div ref={messagesEndRef} />
            </div>
            <ChatInput onSendMessage={handleSendMessage} />
          </div>
          <UserList users={users} />
        </div>
      </div>
    </div>
  );
};

export default ChatRoomPage;